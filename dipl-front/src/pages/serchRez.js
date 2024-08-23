import React, {useEffect, useState} from 'react';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import {GetArrayByUrl} from "../utils";
import { Paginator } from 'primereact/paginator';
import {Tag} from "primereact/tag";
import {Rating} from "primereact/rating";
import App from "../App";
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';

/*
function ShowBooks(books: []){
    return (books.map((book) => {
            return(
                <div className="book-card" OnClick={() => {
                }}>
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
                </div>)
        })
    )
};

// вывод магазинов
function Shhh() {
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [books, setBooks] = useState([]);

    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    useEffect(() => {
        setBooks(GetArrayByUrl('http://localhost:5257/books/get').slice(first, first+rows))
    }, []);


    return (
        <>
            <React.StrictMode>
                <App/>
            </React.StrictMode>
            <div className="book-cards">
                <ShowBooks books={books}/>
                <Paginator first={first} rows={rows} totalRecords={120} rowsPerPageOptions={[10, 20, 30]} onPageChange={onPageChange} />
            </div>
        </>
    )

}
*/

function ShowResults(){
    let books = GetArrayByUrl('http://localhost:5257/books/get');

    const itemTemplate = (book) => {
        return (
            <div className="col-12 p-2">
                <div className="book-card " onClick={() => {
                }}>
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

            <div className="card" style={{ margin: '50px 10px'}}>
                <DataView value={books} listTemplate={listTemplate} layout="grid" paginator rows={5}/>
            </div>
        </>
    )
}


export default ShowResults;