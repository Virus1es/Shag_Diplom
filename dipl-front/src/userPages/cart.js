import React, {useEffect, useRef} from 'react';
import { DataView } from 'primereact/dataview';
import { Toast } from "primereact/toast";
import {useNavigate} from "react-router-dom";
import {Tag} from "primereact/tag";
import {Rating} from "primereact/rating";
import {Button} from "primereact/button";

function ShowCart(){
    // используется для redirect в коде
    const navigate = useNavigate();

    const toast = useRef(null);

    const cartBooks = JSON.parse(localStorage.getItem('cart')) || [];

    console.log(cartBooks);

    // функция покупки книг
    const buyFunc = () => {
        toast.current
            .show({ severity: 'info', summary: 'Упс :(', detail: 'Функция в разработке', life: 3000 });
    }

    // шаблоны вывода каждого элемента(книги)
    const itemTemplate = (book) => {
        return (
            <div className="sm:col-12 lg:col-6 xl:col-6 p-3">
                <div className="book-card" style={{cursor: 'default'}}>
                    <div className="content-wrapper">
                        <img src={require('../img/books/' + book.bookImage)}
                             alt={book.title}
                             className="book-card-img"/>
                        <div className="card-content">
                            <div className="book-name">{book.title}</div>
                            <div className="book-by">
                                {book.firstName} {book.patronymic} {book.surname}
                            </div>
                            <div className="genre-tag">
                                <Tag severity="info" value={book.genreName} rounded></Tag>
                            </div>
                            <div className="rate">
                                <div className="stars">
                                    <Rating value={book.rating}
                                            readOnly
                                            cancel={false}
                                            tooltip={"Текущая оценка: " + book.rating.toFixed(2)}
                                            tooltipOptions={{mouseTrack: true, style: {fontSize: 14}}}/>
                                </div>
                            </div>
                            <div className="my-2 text-base">
                                Издательство: {book.name}
                            </div>
                        </div>
                    </div>
                    <div className="likes">
                        <div className="like-name">
                        <span>Цена: </span> {book.fullPrice.toLocaleString('ru-RU', {
                            style: 'currency',
                            currency: 'RUB'
                        })}
                        </div>
                    </div>
                </div>
            </div>);
    };

    // вывод итогового списка
    const listTemplate = (items) => {
        if (!items || items.length === 0) return null;

        let list = items.map((product) => {
            return itemTemplate(product);
        });

        return <div className="grid grid-nogutter">{list}</div>;
    };

    // вывод сообщения в случае пустого результата
    useEffect(() => {
        // убираем предыдущее сообщение
        toast.current.clear();

        // если результат - пустой массив, выводим сообщение об этом
        if (cartBooks.length === 0) {
            toast.current.show(
                {
                    severity: 'error',
                    summary: 'Упс :(',
                    detail: 'Таких книг не найдено'
                }
            );
        }
    }, [cartBooks]);

    return (
        <>
            <Toast ref={toast}/>
            <div className="card" style={{margin: '50px 10px'}}>
                <DataView value={cartBooks}
                          listTemplate={listTemplate}
                          layout="grid"
                          paginator rows={6}
                          alwaysShowPaginator={false}/>
            </div>
                <div className="m-2 text-right">
                    <p className="text-4xl">
                        <span className="surface-200 p-2">
                            Итоговая цена:
                            <b>{cartBooks.reduce((acc, book) => {return acc + book.fullPrice}, 0)
                                      .toLocaleString('ru-RU', {
                                        style: 'currency',
                                        currency: 'RUB'})
                            }</b>
                        </span>
                    </p>
                    <div className="text-center">
                        <Button label="Оплатить"
                                icon="pi pi-check"
                                rounded
                                size="large"
                                onClick={buyFunc}
                        />
                    </div>
                </div>
        </>
    )
}

export default ShowCart;