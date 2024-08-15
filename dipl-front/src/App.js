import './styles/index.css';
import React, {useEffect, useState} from 'react';
import {Sidebar} from 'primereact/sidebar';
import { AutoComplete } from "primereact/autocomplete";
import {isUndefined} from "swr/_internal";
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import {getArrayByUrl} from "./utils";
import {ScrollTop} from "primereact/scrolltop";
import { Dropdown } from 'primereact/dropdown';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { Avatar } from 'primereact/avatar';


// вывод строки для поиска книг
function ShowSearchField(){
    const [value, setValue] = useState('');
    const [items, setItems] = useState([]);

    // получаем название книг
    let booksName = getArrayByUrl('http://localhost:5257/books/get').map(item => item.title);

    // заполняем подсказки для пользователя
    const search = (event) => {
        setItems([...booksName.values()].filter(item => item.toLowerCase()
                                                            .startsWith(event.query.toLowerCase())));
    };

    // передаём для отрисовки разметку
    return (
        <span className="p-float-label search">
            <AutoComplete inputId="ac"
                          value={value}
                          suggestions={items}
                          completeMethod={search}
                          onChange={(e) => isUndefined(e) ? console.log(e) : setValue(e.value)}
                          style={{fontSize: '11pt', height: '40px'}}/>
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
    return (
        <>
            <Sidebar visible={visible}
                     position="right"
                     onHide={() => setVisibleSlidebar(false)}>
                <h2>Right Sidebar</h2>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
                    ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                    ex ea commodo consequat.
                </p>
            </Sidebar>
            <div className="profile-menu" onClick={() => setVisibleSlidebar(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor"
                     strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
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
    const geners = getArrayByUrl('http://localhost:5257/genres/get');

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
                <div className="header-title">Прочти<span>ка</span></div>
                <div className="profile">
                    <Avatar image={require('./img/Neet.jpg')}
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
