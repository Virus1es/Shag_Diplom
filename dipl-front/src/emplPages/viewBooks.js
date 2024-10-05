import {GetArrayByUrl, PrintBookCard} from "../utils";
import {useLocation, useNavigate} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import {DataView} from "primereact/dataview";
import {Toast} from "primereact/toast";
import {useCookies} from "react-cookie";
import { ContextMenu } from 'primereact/contextmenu';
import {Button} from "primereact/button";

// вывод книг для редактирования
export default function ShowBooksAdmin() {
    // подключение к cookie
    const [cookies, setCookie, removeCookie] = useCookies(['currentUserRole', 'BookEdit']);

    // Получить текущее местоположение
    const location = useLocation();

    // Контекстное меню
    const cm = useRef(null);

    // выбранная книга
    const [selectedBook, setSelectedBook] = useState(null);

    // используется для redirect в коде
    const navigate = useNavigate();

    // Всплывающие уведомления
    const toast = useRef(null);

    // публикации книг(нужны для корректного удаления книги)
    const [pubs, setPubs] = useState([]);

    // получение всех публикаций с сервера
    useEffect(() => {
        const fetchData = async () => {
            try {
                setPubs(await GetArrayByUrl('http://localhost:5257/pubbooks/get'));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    // удаление книги
    const deleteCom = async () => {
        // удалить все публикации книги
        let pubIds = pubs.filter((p) => p.idBook === selectedBook.id);
        const deletePromises = pubIds.map((pId) => {
            return fetch('http://localhost:5257/pubbooks/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pId)
            }).then(response => {
                if (!response.ok)
                    throw new Error('Network response was not ok ' + response.statusText);
                return response.text();
            });
        });

        try {
            // Ждем завершения всех операций удаления публикаций
            await Promise.all(deletePromises);

            // удалить саму книгу
            const response = await fetch('http://localhost:5257/books/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: selectedBook.id })
            });

            if (!response.ok)
                throw new Error('Network response was not ok ' + response.statusText);

            // После успешного удаления обновляем список книг
            const updatedRezBooks = await GetArrayByUrl('http://localhost:5257/books/get');
            setRezBooks(updatedRezBooks);

        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }

    // элементы контекстного меню
    const items = [
        {
            label: 'Редактировать',
            icon: 'pi pi-pen-to-square',
            command: () => {
                setCookie('BookEdit', selectedBook);
                navigate('/addbooks');
            }
        },
        {
            label: 'Удалить',
            icon: 'pi pi-trash',
            command: deleteCom
        }
    ];

    // шаблоны вывода каждого элемента(книги)
    const itemTemplate = (book) => {
        return (
            <div className="sm:col-12 lg:col-6 xl:col-6 p-3"
                 onContextMenu={(event) => onRightClick(event, book)}
            >
                {PrintBookCard(book, navigate)}
            </div>);
    };

    // обработка нажатия правой кнопки
    const onRightClick = (event, book) => {
        if (cm.current) {
            setSelectedBook(book);
            cm.current.show(event);
        }
    };

    // вывод итогового списка
    const listTemplate = (items) => {
        if (!items || items.length === 0) return null;

        let list = items.map((product) => {
            return itemTemplate(product);
        });

        return <div className="grid grid-nogutter">{list}</div>;
    };

    // все книги
    const [rezBooks, setRezBooks] = useState([]);

    // заполнение книг при переходе на страницу
    useEffect(() => {
        const fetchData = async () => {
            try {
                setRezBooks(await GetArrayByUrl('http://localhost:5257/books/get'));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [location]);

    // вывод сообщения в случае пустого результата
    useEffect(() => {
        // убираем предыдущее сообщение
        toast.current.clear();

        // если результат - пустой массив, выводим сообщение об этом
        if(rezBooks.length === 0){
            toast.current.show(
                {
                    severity: 'error',
                    summary: 'Упс :(',
                    detail: 'Таких книг не найдено'
                }
            );
        }
    }, [rezBooks]);

    // запрет доступа для не админа
    if (cookies.currentUserRole !== 'admin') navigate('/');

    return (
        <>
            <div className="flex justify-content-center">
                <Button label="Добавить" icon="pi pi-plus" onClick={() => {
                    removeCookie('BookEdit');
                    navigate('/addbooks');
                }}/>
            </div>
            <div className="card" style={{ margin: '50px 10px'}}>
                <DataView value={rezBooks}
                          listTemplate={listTemplate}
                          layout="grid"
                          paginator rows={6}
                          alwaysShowPaginator={false}/>
                <Toast ref={toast} />
                <ContextMenu model={items} ref={cm} breakpoint="767px" />
            </div>
        </>
    )
}