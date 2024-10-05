import React, {useEffect, useState} from 'react';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import {GetArrayByUrl} from "../utils";
import { DataView} from 'primereact/dataview';

// отображение карты
// Компонент для отображения карты
// Компонент для отображения карты
// Компонент для отображения карты
const YandexMap = ({ address }) => {
    useEffect(() => {
        if (!window.ymaps) return; // Если ymaps не загружен, ничего не делаем

        window.ymaps.ready(() => {
            const map = new window.ymaps.Map('map', {
                center: [55.751574, 37.573856], // Координаты центра карты
                zoom: 10,
            });

            // Поиск по адресу
            if (address) {
                const geocoder = window.ymaps.geocode(address);
                geocoder.then((res) => {
                    const firstGeoObject = res.geoObjects.get(0);
                    if (firstGeoObject) {
                        const coordinates = firstGeoObject.geometry.coordinates;
                        if (Array.isArray(coordinates) && coordinates.length >= 2) {
                            map.setCenter(coordinates);
                            map.geoObjects.add(firstGeoObject);
                        } else {
                            console.error('Координаты не найдены или некорректны');
                        }
                    } else {
                        console.error('Адрес не найден');
                    }
                }).catch((error) => {
                    console.error('Ошибка при геокодировании:', error);
                });
            }
        });
    }, [address]);

    return <div id="map" style={{ width: '100%', height: '400px' }} />;
};

// вывод магазинов
function ShowStores() {
    const [stores, setStores] = useState([]);
    const [mapLoaded, setMapLoaded] = useState(false); // Состояние для отслеживания загрузки карты

    useEffect(() => {
        const loadYandexMap = () => {
            if (window.ymaps) {
                setMapLoaded(true); // Если ymaps уже загружен, устанавливаем состояние
                return;
            }

            const script = document.createElement('script');
            script.src = `https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=d25f25c3-5889-453e-86ea-58c2c7d1f829`;
            script.async = true;
            script.onload = () => {
                setMapLoaded(true); // Устанавливаем состояние после загрузки
            };
            script.onerror = () => {
                console.error('Ошибка при загрузке скрипта Яндекс.Карт');
            };
            document.body.appendChild(script);
        };

        loadYandexMap();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setStores(await GetArrayByUrl('http://localhost:5257/stores/get'));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const itemTemplate = (store) => {
        let address = `г. ${store.idCityNavigation.cityName}, ул. ${store.idStreetNavigation.streetName}, д. ${store.houseNum}`;

        return (
            <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={store.id}>
                <div className="p-4 border-1 surface-border surface-card border-round">
                    <div className="flex flex-column align-items-center gap-3 py-5">
                        <div className="text-2xl font-bold">{store.name}</div>
                        <div
                            className="text-xl">{address}</div>
                    </div>
                </div>
            </div>
        );
    };


    // вывод итогового списка
    const listTemplate = (items) => {
        if (!items || items.length === 0) return null;


        let list = items.map((product) => {
            return itemTemplate(product);
        });

        return <div className="grid grid-nogutter">{list}</div>;
    };

    return (
        <div className="card" style={{margin: '10px 20px'}}>
            <div className="card">
                <DataView value={stores}
                          listTemplate={listTemplate}
                          layout='grid'
                          paginator rows={9}
                          alwaysShowPaginator={false}
                />
            </div>
        </div>
    )

}

export default ShowStores;