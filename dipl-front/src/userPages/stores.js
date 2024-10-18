import React, { useEffect, useState } from 'react';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import { GetArrayByUrl } from "../utils";
import { DataView } from 'primereact/dataview';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';

const YandexMap = ({ address, coordinates }) => {
    const mapState = {
        center: coordinates || [55.751574, 37.573856], // Координаты центра карты (Москва)
        zoom: 10,
    };

    return (
        <YMaps query={{ apikey: 'd25f25c3-5889-453e-86ea-58c2c7d1f829' }}>
            <Map state={mapState} style={{ width: '100%', height: '400px' }}>
                <Placemark
                    geometry={coordinates || mapState.center} // Укажите координаты для маркера
                    properties={{
                        balloonContent: address, // Текст в баллоне
                    }}
                />
            </Map>
        </YMaps>
    );
};

function ShowStores() {
    const [stores, setStores] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await GetArrayByUrl('http://localhost:5257/stores/get');
                setStores(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const itemTemplate = (store) => {
        let address = `г. ${store.idCityNavigation.cityName}, ул. ${store.idStreetNavigation.streetName}, д. ${store.houseNum}`;
        // Пример координат, замените на реальные координаты для каждого магазина
        const coordinates = [55.751574, 37.573856]; // Замените на реальные координаты магазина

        return (
            <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={store.id}>
                <div className="p-4 border-1 border-blue-600 surface-card border-round">
                    <div className="flex flex-column align-items-center gap-3 py-5">
                        <div className="text-2xl font-bold">{store.name}</div>
                        <div className="text-xl">{address}</div>
                    </div>
                </div>
            </div>
        );
    };

    const listTemplate = (items) => {
        if (!items || items.length === 0) return null;

        return (
            <div className="grid grid-nogutter">
                {items.map(item => itemTemplate(item))}
            </div>
        );
    };

    return (
        <div className="card" style={{ margin: '10px 20px' }}>
            <DataView value={stores}
                      listTemplate={listTemplate}
                      layout='grid'
                      paginator rows={9}
                      alwaysShowPaginator={false}
            />
        </div>
    );
}

export default ShowStores;