import './styles/index.css';
import 'primeicons/primeicons.css';
import React, {useEffect, useRef, useState} from 'react';
import {Sidebar} from 'primereact/sidebar';
import { AutoComplete } from "primereact/autocomplete";
import {isUndefined} from "swr/_internal";
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import {GetArrayByUrl, GetArrayByUrlWithHeaders} from "./utils";
import {ScrollTop} from "primereact/scrolltop";
import { Dropdown } from 'primereact/dropdown';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { Avatar } from 'primereact/avatar';
import { PanelMenu } from 'primereact/panelmenu';
import { Toast } from 'primereact/toast';
import {Link, useNavigate} from 'react-router-dom';
import {redirect} from "react-router-dom";
import ShowResults from "./userPages/serchRez";


function GetBookHeaders(value){
    const navigate = useNavigate();
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
            /*window.location.replace('http://localhost:3000/booksearch');*/
            navigate('/booksearch',{state:{books:books}});
        } // if
    } // callBack

    // собственно отправка запроса
    request.send(body);

}

// вывод строки для поиска книг
function ShowSearchField(){
    const [value, setValue] = useState('');
    const [items, setItems] = useState([]);


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
                          onChange={(e) => isUndefined(e) ? console.log(e) : setValue(e.value)}
                          style={{fontSize: '11pt', height: '40px'}}
                          onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                  // ищем книги по названию
                                  GetBookHeaders(value);
                              }
                          }}
                          />
            <label htmlFor="ac"
                   style={{fontSize: '11pt', marginTop: '-7px'}}>
                Введите название книги
            </label>
        </span>
    )
}

// вывод бокового меню
function ShowMenu() {
    const [visible, setVisibleSlidebar] = useState(false);
    const toast = useRef(null);


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

    return (
        <>
            <Sidebar visible={visible}
                     position="right"
                     onHide={() => setVisibleSlidebar(false)}>
                <div>
                    <PanelMenu model={items}
                               className="w-full md:w-20rem"/>
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

function App() {
    const [selectedGener, setSelectedGener] = useState(null);
    const geners = GetArrayByUrl('http://localhost:5257/genres/get');

    return (
        <div className="App">
            <div className="header">
                <div className="browse">
                    <Splitter style={{ height: '40px' }}>
                        <SplitterPanel className="flex align-items-center justify-content-center"
                                       style={{ marginRight: '10px'}}>
                            <Dropdown value={selectedGener}
                                      onChange={(e) => setSelectedGener(e.value)}
                                      options={geners}
                                      optionLabel="genreName"
                                      placeholder="Выбирите жанр для поиска"
                                      className="w-full md:w-14rem" />
                        </SplitterPanel>
                        <SplitterPanel className="flex align-items-center justify-content-center">
                            <ShowSearchField/>
                        </SplitterPanel>
                    </Splitter>
                </div>
                <div className="header-title">Прочитай<span>ка</span></div>
                <div className="profile">
                    <Avatar icon="pi pi-user"
                            size="large"
                            className="user-profile"
                            shape="circle" />
                    <ShowMenu/>
                </div>
            </div>

            <ScrollTop />
        </div>
    );
}

export default App;
