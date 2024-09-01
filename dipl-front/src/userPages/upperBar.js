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

// собственно сборка верхней панели
export default function ShowUpperBar(){
    // выбираемый жанр из списка
    const [selectedGener, setSelectedGener] = useState(null);

    // все жанры, что есть в базе
    const geners = GetArrayByUrl('http://localhost:5257/genres/get');

    // используется для redirect
    const navigate = useNavigate();

    const { searchBooks } = useContext(BooksContext);

    // при изменении выбора жанра инициализируем поиск по этому жанру
    useEffect(() => {
        if(selectedGener !== null) {
            PostBooksWithHeaders("http://localhost:5257/books/search", "genre", selectedGener.genreName, searchBooks);
            navigate('/booksearch');
        }
    }, [selectedGener]);

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
                            shape="circle" />
                    <ShowMenu/>
                </div>
            </div>

            <ScrollTop />
        </div>
    );
}
