import React, {useRef} from 'react';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import {Tag} from "primereact/tag";
import {Rating} from "primereact/rating";
import App from "../App";
import { DataView } from 'primereact/dataview';
import {useLocation} from 'react-router-dom';
import {isUndefined} from "swr/_internal";
import {Toast} from "primereact/toast";

function ShowResults(){
    const toast = useRef(null);
    const location = useLocation();

    console.log('Новое: '+location.state.books);

    if(isUndefined(location.state.books) || location.state.books === []) {
        toast.current
            .show({ severity: 'error',
                summary: 'Упс :(',
                detail: 'Книг с таким названием не найдено',
                life: 3000 });
    }

    const itemTemplate = (book) => {
        return (
            <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={book.id}>
                <div className="book-card">
                    <div className="content-wrapper">
                        <img src={require('../img/books/' + book.bookImage)}
                             alt={book.title}
                             className="book-card-img"/>
                        <div className="card-content">
                            <div className="book-name">{book.title}</div>
                            <div className="book-by">
                                {book.idAuthorNavigation.firstName} {book.idAuthorNavigation.patronymic} {book.idAuthorNavigation.surname}
                            </div>
                            <div className="genre-tag">
                                <Tag severity="info" value={book.idGenreNavigation.genreName} rounded></Tag>
                            </div>
                            <div className="rate">
                                <div className="stars">
                                    <Rating value={book.rating}
                                            readOnly
                                            cancel={false}
                                            tooltip={"Текущая оценка: " + book.rating.toFixed(2)}
                                            tooltipOptions={{mouseTrack: true, style: {fontSize: 14}}}/>
                                </div>
                                <span className="book-voters">Оценок: {book.amountRatings} </span>
                            </div>
                            <div className="book-sum card-sum">
                                {book.bookDescription}
                            </div>
                        </div>
                    </div>
                    <div className="likes">
                        <div className="like-name">
                            <span>Цена: </span> {book.price.toLocaleString('ru-RU', {
                            style: 'currency',
                            currency: 'RUB'
                        })}
                        </div>
                    </div>
                </div>
            </div>);
    };

    const listTemplate = (items) => {
        if (!items || items.length === 0) return null;

        let list = items.map((product) => {
            return itemTemplate(product);
        });

        return <div className="grid grid-nogutter">{list}</div>;
    };

    return (
        <>
            <React.StrictMode>
                <App/>
            </React.StrictMode>
            <Toast ref={toast} />

            <div className="card" style={{ margin: '50px 10px'}}>
                <DataView value={location.state.books}
                          listTemplate={listTemplate}
                          layout="grid"
                          paginator rows={5}/>
            </div>
        </>
    )
}


export default ShowResults;