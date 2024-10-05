import React, {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
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
import moment from "moment/moment";

// вывод строки для поиска книг
function ShowSearchField(){
    // текущая строка в поле для поиска по названию
    const [value, setValue] = useState('');

    // варианты для дополнения строки названию
    const [items, setItems] = useState([]);

    // используется для redirect в коде
    const navigate = useNavigate();

    // получаем название книг
    const [booksName, setBooksName] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let books = await GetArrayByUrl('http://localhost:5257/books/get');
                setBooksName(books.map(item => item.title));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // заполняем подсказки для пользователя (регистронезависимый и ищет все схождения в названии)
    const search = (event) => {
        setItems([...booksName.values()].filter(item => item.toString()
                                                            .toLowerCase()
                                                            .includes(event.query.toLowerCase()))
        );
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
                                                 "title", value, navigate, '/booksearch');
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


async function RequestData(requestUrl, dateStart, dateEnd) {
    try {
        const body = new FormData();
        body.append("dateStart", dateStart);
        body.append("dateEnd", dateEnd);

        const response = await fetch(`http://localhost:5257/reports/${requestUrl}`, {
            method: 'POST',
            body: body,
        });

        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
        }

        const text = await response.text();
        const data = JSON.parse(text);

        console.log('Пришло: ' + text);
        return data; // Возвращаем данные
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        return []; // Возвращаем пустой массив в случае ошибки
    }
}

// вывод бокового меню
function ShowMenu() {
    // используется для redirect
    const navigate = useNavigate();

    const moment = require("moment");

    // выбираемый жанр
    const [selectedGener, setSelectedGener] = useState(null);

    const [genersOption, setGenersOption] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const date = moment().subtract(1, "year");
                const data = await RequestData('SelectAmountSalesGeners', moment().format("YYYY-MM-DD"), date.format("YYYY-MM-DD"));

                // Устанавливаем genersOption на основе полученных данных
                const options = data.map((genre) => {
                    return {
                        label: genre.genreName,
                        command: () => { setSelectedGener(genre) }
                    };
                });
                setGenersOption(options);

                console.log('Пришло: ', data);
                console.log('Options: ', options);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if(selectedGener !== null) {
            setVisibleSlidebar(false);
            console.log(selectedGener.genreName);
            navigate('/');
            PostBooksWithHeaders("http://localhost:5257/books/search", "genre", selectedGener.genreName,
                navigate, '/booksearch');
        }
    }, [selectedGener]);

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
                    items: [...genersOption]
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
                    label: 'Администрирование',
                    icon: 'pi pi-pencil',
                    items: [
                        {
                            label: 'Книги',
                            url: '/adminbooks'
                        }
                    ]
                },
                {
                    label: 'Отчёты и статистика',
                    icon: 'pi pi-chart-bar',
                    url: '/reports'
                },
                {
                    label: 'Список пользователей',
                    icon: 'pi pi-users',
                    url: '/users'
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
    const [geners, setGeners] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setGeners(await GetArrayByUrl('http://localhost:5257/genres/get'));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // используется для redirect
    const navigate = useNavigate();

    const [cookies, removeCookie] = useCookies(['currentUser', 'currentUserRole']);

    // при изменении выбора жанра инициализируем поиск по этому жанру
    useEffect(() => {
        if(selectedGener !== null) {
            PostBooksWithHeaders("http://localhost:5257/books/search", "genre", selectedGener.genreName,
                navigate, '/booksearch');
        }
    }, [selectedGener]);

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
                              onChange={(e) => {setSelectedGener(e.value); }}
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
