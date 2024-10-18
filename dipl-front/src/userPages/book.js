import React, {useEffect, useState} from 'react';
import {Tag} from "primereact/tag";
import {Rating} from "primereact/rating";
import { Image } from 'primereact/image';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Badge } from 'primereact/badge';
import { Tooltip } from 'primereact/tooltip';
import { Skeleton } from 'primereact/skeleton';
function GetPubsByBook(searchType, value, setFunc) {
    // XNLHttpRequest это и есть реализация AJAX в JavaScript
    let request = new XMLHttpRequest();

    // настройка и отправка AJAX-запроса на сервер
    request.open("POST", "http://localhost:5257/pubbooks/searchpubsbyid");

    // передача на сервер в параметрах формы
    let body = new FormData();
    body.append(searchType, value);

    // callBack, работающий по окончании запроса
    request.onload = function () {
        // если запрос завершен и завершен корректно вывести полученные от сервера данные
        if (request.status >= 200 && request.status <= 399) {
            let books = JSON.parse(request.responseText);
            setFunc(books);
        } // if
    } // callBack

    // собственно отправка запроса
    request.send(body);
}

export default function ShowBook(){
    // cookie нужные для выделения текущих публикаций книги
    const [pubs, setPubs] = useState([]);

    const book = JSON.parse(localStorage.getItem('book'))[0];

    // переменная - выбранная публикация
    const [selectPub, setSelectPub] = useState(null);
    // переменная - наценка за издательство
    const [addPrice, setAddPrice] = useState(0);
    const [disStat, setDisStat] = useState(true);

    // действия пометки обработки запроса
    const [loadingCart, setLoadingCart] = useState(false);
    const [loadingSave, setLoadingSave] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log();
                // получение всех публикаций книги
                await GetPubsByBook("id", book.id, setPubs);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const loadCart = async () => {
        const searchPromises = async () => {
            const data = {
                Id: selectPub.id
            };

            const response = await fetch('http://localhost:5257/pubbooks/SearchByPubId', {
                method: 'POST', // Метод запроса
                headers: {
                    'Content-Type': 'application/json' // Указываем, что отправляем JSON
                },
                body: JSON.stringify(data) // Преобразуем объект в JSON-строку
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            return response.json(); // Возвращаем ответ
        };

        try{
            setLoadingCart(true);

            // Получаем массив из localStorage или создаем новый, если его нет
            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            const results = await Promise.all([searchPromises()]);

            results.forEach(data => {
                console.log('rez: '+data)
                cart.push(data); // Обрабатываем успешный ответ
            });

            // Сохраняем обновленный массив обратно в localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
        }
        catch (error){
            console.error('Error:', error); // Обрабатываем ошибки
        }
        finally {
            setLoadingCart(false);
        }
    };

    const loadSave = () => {
        setLoadingSave(true);

        setTimeout(() => {
            setLoadingSave(false);
        }, 2000);
    };

    // меняем наценку в зависимости от издательства
    useEffect(() => {
        if(selectPub !== null) {
            setDisStat(false);
            setAddPrice((book.price * selectPub.idHouseNavigation.addPercent / 100));
        }
        console.log(selectPub);
    }, [selectPub]);

    return (
        <div className="grid grid-nogutter">
            <div className="col-4 p-3 mx-auto mt-2">
                {book ? (
                    <Image src={require('../img/books/' + book.bookImage)}
                           alt={book.title}
                           width="350"
                           preview
                    />
                ) : (
                    <Skeleton width="20rem" height="30rem" borderRadius="16px"></Skeleton>
                )}
            </div>

            <div className="col-8 p-3">
                {book ? (
                    <>
                        <div className="text-4xl my-2">{book.title}</div>
                        <div className="text-base my-2">
                            {book.idAuthorNavigation.firstName} {book.idAuthorNavigation.patronymic} {book.idAuthorNavigation.surname}
                        </div>
                        <Tag severity="info"
                             value={book.idGenreNavigation.genreName}
                             rounded
                             className="my-2 text-xs"
                        >
                        </Tag>
                        <Tag severity="info"
                             value={book.idAgeNavigation.ageRange}
                             rounded
                             className="my-2 mx-2 text-xs"
                        >
                        </Tag>

                        <div className="my-2 text-base">
                            Год написания книги: <b>{book.creationYear} г.</b>
                        </div>

                        <div className="rate mb-3 mt-1">
                            <div className="stars">
                                <Rating value={book.rating}
                                        readOnly
                                        cancel={false}
                                        tooltip={"Текущая оценка: " + book.rating.toFixed(2)}
                                        tooltipOptions={{mouseTrack: true, style: {fontSize: 14}}}/>
                            </div>
                            <span className="text-sm m-2" style={{color: "black"}}>Оценок: {book.amountRatings} </span>
                        </div>


                        <div className="my-2 text-base">
                            {book.bookDescription}
                        </div>

                        <div>
                            <Dropdown value={selectPub}
                                      onChange={(e) => setSelectPub(e.value)}
                                      options={pubs}
                                      optionLabel="idHouseNavigation.name"
                                      placeholder="Выбирите издателя"
                                      className="w-full md:w-15rem my-2"
                                      emptyMessage="У этой книги нет доступных издателей"
                                      checkmark={true}
                                      highlightOnSelect={false}/>
                        </div>

                        <div className="flex flex-wrap justify-content-end">
                            <div className="my-2 mx-4 text-2xl">
                                Цена:
                                <b className="p-overlay-badge pt-2">
                                    {book.price.toLocaleString('ru-RU', {style: 'currency', currency: 'RUB'})}
                                    <Tooltip target=".pub-add-price" position="left"/>
                                    <Badge
                                        className="pub-add-price"
                                        value={addPrice.toLocaleString('ru-RU', {style: 'currency', currency: 'RUB'})}
                                        severity="info"
                                        data-pr-tooltip="Наценка издателя"
                                    ></Badge>
                                </b>
                            </div>
                        </div>

                        <div className="flex justify-content-end m-2">
                            <div className="grid">
                                <Button label="В корзину"
                                        icon="pi pi-shopping-cart"
                                        loading={loadingCart}
                                        onClick={loadCart}
                                        className="col-auto m-1 text-2xl"
                                        disabled={disStat}
                                        tooltip="Выбирите издательство"
                                        tooltipOptions={{
                                            position: 'left',
                                            showOnDisabled: true,
                                            disabled: !disStat
                                        }}
                                />
                                <Button icon="pi pi-bookmark"
                                        loading={loadingSave}
                                        onClick={loadSave}
                                        className="col-fixed m-1"
                                        style={{width: '50px'}}
                                        disabled={disStat}
                                        tooltip="Выбирите издательство"
                                        tooltipOptions={{
                                            position: 'left',
                                            showOnDisabled: true,
                                            disabled: !disStat
                                        }}
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <Skeleton width="40rem" height="30rem" borderRadius="16px"></Skeleton>
                )}
            </div>

        </div>
    )
}
