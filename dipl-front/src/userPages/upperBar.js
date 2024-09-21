import React, {useContext, useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {BooksContext} from "../Context";
import {GetArrayByUrl, PostBooksWithHeaders} from "../utils";
import {AutoComplete} from "primereact/autocomplete";
import {isUndefined} from "swr/_internal";
import {Sidebar} from "primereact/sidebar";
import {PanelMenu} from "primereact/panelmenu";
import {Toast} from "primereact/toast";
import {Dropdown} from "primereact/dropdown";
import {Avatar} from "primereact/avatar";
import {ScrollTop} from "primereact/scrolltop";
import {Divider} from "primereact/divider";
import { ConfirmDialog } from 'primereact/confirmdialog';
import { confirmDialog } from 'primereact/confirmdialog';
import {useCookies} from "react-cookie";

// вывод строки для поиска книг
function ShowSearchField(){
    // текущая строка в поле для поиска по названию
    const [value, setValue] = useState('');

    // варианты для дополнения строки названию
    const [items, setItems] = useState([]);

    // используется для redirect в коде
    const navigate = useNavigate();

    // получаем функцию присвоения книг в контекст
    const { searchBooks } = useContext(BooksContext);

    // получаем название книг
    let booksName = GetArrayByUrl('http://localhost:5257/books/get').map(item => item.title);

    // заполняем подсказки для пользователя (регистронезависимый и ищет все схождения в названии)
    const search = (event) => {
        setItems([...booksName.values()].filter(item => item.toString()
            .toLowerCase()
            .includes(event.query.toLowerCase())));
    };

    // передаём для отрисовки разметку
    return (
        <span className="p-float-label search">

            <AutoComplete inputId="ac"
                          value={value}
                          suggestions={items}
                          completeMethod={search}
                          onChange={(e) =>
                              isUndefined(e) ? console.log(e) : setValue(e.value)}
                          style={{fontSize: '11pt', height: '40px'}}
                          onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                  // ищем книги по названию
                                  PostBooksWithHeaders("http://localhost:5257/books/search",
                                                 "title",
                                                            value,
                                                            searchBooks);
                                  navigate('/booksearch');
                              }
                          }}
            />
            <label htmlFor="ac"
                   style={{fontSize: '12pt', marginTop: '-9px'}}>
                Введите название книги
            </label>
        </span>
    )
}

// вывод бокового меню
function ShowMenu() {
    // видимость бокового меню
    const [visible, setVisibleSlidebar] = useState(false);

    const [cookies] = useCookies(['currentUser', 'currentUserRole']);

    // вывод уведомлений
    const toast = useRef(null);

    // выводимые значения бокового меню (названия, переходы и т.д.)
    const items = [
        {
            label: 'Главная',
            icon: 'pi pi-home',
            url: '/'
        },
        {
            label: 'Книги',
            icon: 'pi pi-book',
            items: [
                {
                    label: 'Популярные жанры',
                    items: [
                        {
                            label: 'Ужасы',
                            url: '#'
                        },
                        {
                            label: 'Роман',
                            command: () => {toast.current
                                .show({ severity: 'success', summary: 'Успешно', detail: 'Выбор: роман', life: 3000 });
                            }
                        }
                    ]
                },
                {
                    label: 'Подборки',
                    items: [
                        {
                            label: 'Бестселлеры жанра',
                        },
                        {
                            label: 'Подборка редакции',
                        }
                    ]
                }
            ]
        },
        {
            label: 'Корзина',
            icon: 'pi pi-shopping-cart',
            command: () => {toast.current
                .show({ severity: 'info', summary: 'Упс :(', detail: 'Страница в разработке', life: 3000 });
            }
        },
        {
            label: 'Закладки',
            icon: 'pi pi-bookmark',
            command: () => {toast.current
                .show({ severity: 'info', summary: 'Упс :(', detail: 'Страница в разработке', life: 3000 });
            }
        },
        {
            label: 'Информация',
            icon: 'pi pi-info-circle',

            items: [
                {
                    label: 'Наши контакты',
                    icon: 'pi pi-phone'
                },
                {
                    label: 'Доставка',
                    icon: 'pi pi-truck'
                },
                {
                    label: 'Магазины',
                    icon: 'pi pi-shop',
                    url: '/stores'
                }
            ]
        }
    ];

    if(cookies.currentUserRole === 'admin'){
        items.push({
            label: 'Для администратора',
            icon: 'pi pi-star',
            items: [
                {
                    label: 'Добавление',
                    icon: 'pi pi-plus-circle',
                    items: [
                        {
                            label: 'Добавление книги',
                            url: '/addbooks'
                        }
                    ]
                },
                {
                    label: 'Отчёты и статистика',
                    icon: 'pi pi-chart-bar',
                    url: '/reports'
                }
                ]
        })
    }

    return (
        <>
            <Sidebar visible={visible}
                     position="right"
                     onHide={() => setVisibleSlidebar(false)}>
                <div>
                    <PanelMenu model={items}
                               className="w-full md:w-17rem"/>
                </div>
            </Sidebar>
            <Toast ref={toast} />
            <div className="profile-menu" onClick={() => setVisibleSlidebar(true)}>
                <svg xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 24 24"
                     fill="none"
                     stroke="currentColor"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     className="feather feather-menu">
                    <path d="M3 12h18M3 6h18M3 18h18"/>
                </svg>
                Меню
            </div>

        </>
    )
}

export function LogoutUser(removeCookie){
    // XNLHttpRequest это и есть реализация AJAX в JavaScript
    let request = new XMLHttpRequest();

    // настройка и отправка AJAX-запроса на сервер
    // request.open("POST", `http://localhost:4242/people/post/${id}/${fullName}/${age}`);
    // "http://localhost:5257/books/search"
    request.open("POST", "http://localhost:5257/users/logout");

    // передача на сервер в параметрах формы
    // let body = new FormData();
    // body.append("username", 'username');

    // callBack, работающий по окончании запроса
    request.onload = function () {
        // если запрос завершен и завершен корректно вывести полученные от сервера данные
        if (request.status >= 200 && request.status <= 399) {
            removeCookie('currentUser');
            removeCookie('currentUserRole');
            console.log(request.responseText);
        } // if
    } // callBack

    // собственно отправка запроса
    request.send();
}

// собственно сборка верхней панели
export default function ShowUpperBar(){
    // выбираемый жанр из списка
    const [selectedGener, setSelectedGener] = useState(null);

    // все жанры, что есть в базе
    const geners = GetArrayByUrl('http://localhost:5257/genres/get');

    // используется для redirect
    const navigate = useNavigate();

    const [cookies, removeCookie] = useCookies(['currentUser', 'currentUserRole']);

    const { searchBooks } = useContext(BooksContext);

    // при изменении выбора жанра инициализируем поиск по этому жанру
    useEffect(() => {
        if(selectedGener !== null) {
            PostBooksWithHeaders("http://localhost:5257/books/search", "genre", selectedGener.genreName, searchBooks);
            navigate('/booksearch');
        }
    }, [selectedGener]);

    console.log(cookies.currentUser);

    const accept = () => LogoutUser(removeCookie);

    const reject = () => {}

    const userAcc = () => {
        if(isUndefined(cookies.currentUser))
            navigate('/login')
        else
            confirmDialog({
                message: 'Вы уже вошли в аккаунт. Хотите выйти?',
                header: 'Подтверждение',
                icon: 'pi pi-exclamation-triangle',
                defaultFocus: 'accept',
                rejectLabel: 'Нет',
                acceptIcon: 'pi pi-sign-out',
                acceptLabel: 'Да',
                accept,
                reject
            });
    };

    return (
        <div className="App">
            <div className="header">
                <div className="browse">
                    <Dropdown value={selectedGener}
                              onChange={(e) => setSelectedGener(e.value)}
                              options={geners}
                              optionLabel="genreName"
                              placeholder="Выбирите жанр для поиска"
                    />
                    <Divider layout="vertical" />
                    <ShowSearchField/>
                </div>
                <div className="header-title">Прочитай<span>ка</span></div>
                <div className="profile">
                    <Avatar icon="pi pi-user"
                            size="large"
                            className="user-profile"
                            shape="circle"
                            onClick={userAcc}/>
                    <ConfirmDialog />
                    <ShowMenu/>
                </div>
            </div>

            <ScrollTop />
        </div>
    );
}
