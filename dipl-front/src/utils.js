import {useEffect, useState} from 'react';

// получить данные по url
export function getArrayByUrl(url) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [values, setBooks] = useState([]);

    // получение данных с сервера о книгах
    // eslint-disable-next-line react-hooks/rules-of-hooks
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

// функция проверяющая есть ли у автора отчество
// и в зависимости от этого возвращающая первую букву его отчества с точкой (если отчество есть)
// иначе возвращает пустую строку
export function checkPatronymic(patronymic) {
    return (patronymic !== "") ? patronymic[0] + "." : '';
}