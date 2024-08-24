import {useEffect, useState} from 'react';

// получить данные по url
export function GetArrayByUrl(url) {
    const [values, setBooks] = useState([]);

    // получение данных с сервера о книгах
    useEffect(() => {
        fetch(url)
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setBooks(data);
            });
    }, []);

    return values;
}

// получить данные по url
export function GetArrayByUrlWithHeaders(url, value) {
    // XNLHttpRequest это и есть реализация AJAX в JavaScript
    let request = new XMLHttpRequest();

    // настройка и отправка AJAX-запроса на сервер
    // request.open("POST", `http://localhost:4242/people/post/${id}/${fullName}/${age}`);
    request.open("POST", "http://localhost:5257/books/searchbytitle");

    // передача на сервер в параметрах формы
    let body = new FormData();
    body.append("title", value);

    // callBack, работающий по окончании запроса
    request.onload = function () {
        // если запрос завершен и завершен корректно вывести полученные от сервера данные
        if (request.status >= 200 && request.status <= 399) {
            let books = JSON.parse(request.responseText);
            return books;
        } // if
    } // callBack

    // собственно отправка запроса
    request.send(body);
}

// функция проверяющая есть ли у автора отчество
// и в зависимости от этого возвращающая первую букву его отчества с точкой (если отчество есть)
// иначе возвращает пустую строку
export function checkPatronymic(patronymic) {
    return (patronymic !== "") ? patronymic[0] + "." : '';
}