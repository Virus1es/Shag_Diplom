import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { FileUpload } from 'primereact/fileupload';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { MultiSelect } from 'primereact/multiselect';
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {checkPatronymic, GetArrayByUrl} from "../utils";
import {isNullOrUndef} from "chart.js/helpers";
import {useCookies} from "react-cookie";

async function BookRequest(id, title, imageFileName, author, genre, age, price, yearCreation, description, pubs, cPubs, comState){
    const dataReq = {
        Title: title,
        Image: imageFileName,
        IdAuthor: author,
        IdGenre: genre,
        IdAge: age,
        Price: price,
        CreationYear: yearCreation,
        BookDescription: description
    };

    let url = 'http://localhost:5257/books/put';
    let method = 'PUT';

    if (comState) {
        dataReq.id = id;
        url = 'http://localhost:5257/books/post';
        method = 'POST';
    }

    try {
        const response = await fetch(url, {
            method: method, // Метод запроса
            headers: {
                'Content-Type': 'application/json' // Указываем, что отправляем JSON
            },
            body: JSON.stringify(dataReq) // Преобразуем объект в JSON-строку
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.text();
        let giveData = !comState ? data : dataReq.id;
        console.log('here: ' + giveData);

        // Дождитесь завершения SetPubsToBook, если она возвращает промис
        await SetPubsToBook(giveData, pubs, cPubs, comState);
    } catch (error) {
        console.error('Error:', error); // Обрабатываем ошибки
    }
}

async function SetPubsToBook(id, pubs, cPubs, state) {
    // Удаляем публикации, если state истинно
    if (state) {
        let pubIds = cPubs.filter((p) => p.idBook === id);
        const deletePromises = pubIds.map(async (pId) => {
            const response = await fetch('http://localhost:5257/pubbooks/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json', // Указываем тип контента
                },
                body: JSON.stringify(pId) // Отправляем ID в теле запроса
            });

            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text(); // Если нужно обработать ответ
        });

        // Ждем завершения всех операций удаления
        try {
            await Promise.all(deletePromises);
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }

    // Обновляем публикации
    const updatePromises = pubs.map(async (pub) => {
        const data = {
            IdBook: id,
            IdHouse: pub.id
        };

        const response = await fetch('http://localhost:5257/pubbooks/put', {
            method: 'PUT', // Метод запроса
            headers: {
                'Content-Type': 'application/json' // Указываем, что отправляем JSON
            },
            body: JSON.stringify(data) // Преобразуем объект в JSON-строку
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response; // Возвращаем ответ
    });

    // Ждем завершения всех операций обновления
    try {
        const results = await Promise.all(updatePromises);
        results.forEach(data => {
            console.log('Success:', data); // Обрабатываем успешный ответ
        });
    } catch (error) {
        console.error('Error:', error); // Обрабатываем ошибки
    }
}

async function GetPubsByBook(searchType, value, setFunc) {
    // XNLHttpRequest это и есть реализация AJAX в JavaScript
    let request = new XMLHttpRequest();

    // настройка и отправка AJAX-запроса на сервер
    request.open("POST", "http://localhost:5257/pubbooks/searchpubsbyid");

    // передача на сервер в параметрах формы
    let body = new FormData();
    body.append(searchType, value);

    // callBack, работающий по окончании запроса
    request.onload = function () {
        // если запрос завершен и завершен корректно вывести полученные от сервера данные
        if (request.status >= 200 && request.status <= 399) {
            let books = JSON.parse(request.responseText);
            setFunc('pubs', books);
        } // if
    } // callBack

    // собственно отправка запроса
    request.send(body);
}

export default function ShowBookForm(){
    const [flagEdit, setFlagEdit] = useState(false);

    const [buttonName, setButtonName] = useState('Добавить');

    const [headerName, setHeaderName] = useState('Добавление новой');

    // для уведомлений Toast
    const toast = useRef(null);

    // Название книги
    const [title, setTitle] = useState('');

    // обложка книги
    const [imageFileName, setImageFileName] = useState('');

    // автор книги
    const [selectedAuthor, setSelectedAuthor] = useState();

    // жанр книги
    const [selectedGenre, setSelectedGenre] = useState();

    // возрастное ограничение книги
    const [selectedAge, setSelectedAge] = useState();

    // цена самой книги
    const [price, setPrice] = useState();

    // год написания книги
    const [yearCreation, setYearCreation] = useState();

    // описание книги
    const [description, setDescription] = useState('');

    // выбранные публикации книги
    const [selectedPubs, setSelectedPubs] = useState([]);

    // используется для redirect
    const navigate = useNavigate();

    const [cookies, setCookie] = useCookies(['currentUserRole', 'BookEdit', 'pubs']);

    if (cookies.currentUserRole !== 'admin') navigate('/');

    const [pubs, setPubs] = useState([]);

    const [authors, setAuthors] = useState([]);

    const [geners, setGeners] = useState([]);

    const [ages, setAges] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const pubsData = await GetArrayByUrl('http://localhost:5257/PublishingHouses/get');
                const authorsData = await GetArrayByUrl('http://localhost:5257/authors/get');
                const genersData = await GetArrayByUrl('http://localhost:5257/genres/get');
                const agesData = await GetArrayByUrl('http://localhost:5257/agerestrictions/get');

                setPubs(pubsData);
                setAuthors(authorsData.map(author => ({
                    id: author.id,
                    fullname: `${author.surname} ${author.firstName[0]}. ${checkPatronymic(author.patronymic)}`
                })));
                setGeners(genersData);
                setAges(agesData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const savePicture = (e) => {
        let file = e.files[0];

        setImageFileName(file.name);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                if(!isNullOrUndef(cookies.BookEdit)) {
                    setFlagEdit(true);
                    setButtonName('Изменить');
                    setHeaderName('Изменение');

                    let book = cookies.BookEdit;

                    await GetPubsByBook("id", book.id, setCookie);

                    let curPubs = cookies.pubs.map((pub) => {
                        return pub.idHouse
                    });

                    console.log(curPubs);
                    let author = authors.find((author) => author.id === book.idAuthor);
                    let genre = geners.find((gener) => gener.id === book.idGenre);
                    let age = ages.find((age) => age.id === book.idAge);
                    let pubsToSet = pubs.filter((pub) => curPubs.includes(pub.id));

                    setTitle(book.title);
                    setImageFileName(book.bookImage);
                    setSelectedAuthor(author);
                    setSelectedGenre(genre);
                    setSelectedAge(age);
                    setPrice(book.price);
                    setYearCreation(book.creationYear);
                    setDescription(book.bookDescription);
                    setSelectedPubs(pubsToSet);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [authors]);

    return(
        <div className="flex flex-column justify-content-center mt-5">

            <p className="text-4xl font-semibold mx-auto">{headerName} книги</p>

            <FloatLabel className="my-3 mx-auto">
                <InputText value={title}
                           id="title"
                           onChange={(e) => setTitle(e.target.value)}
                />
                <label htmlFor="title" style={{fontSize: '12pt', marginTop: '-9px'}}>Название книги</label>
            </FloatLabel>


            <FileUpload className="my-3 mx-auto"
                        name="image"
                        url={"http://localhost:5257/books/UploadImage"}
                        accept="image/*"
                        maxFileSize={1000000}
                        onUpload={savePicture}
                        chooseLabel="Добавить обложку"
                        uploadLabel="Загрузить"
                        cancelLabel="Сбросить"
            />

            <FloatLabel className="w-full w-14rem my-3 mx-auto">
                <Dropdown Id="author"
                          value={selectedAuthor}
                          onChange={(e) => setSelectedAuthor(e.value)}
                          options={authors}
                          optionLabel="fullname"
                          className="w-full"/>
                <label htmlFor="author" style={{fontSize: '12pt', marginTop: '-9px'}}>Выбрать автора</label>
            </FloatLabel>

            <FloatLabel className="w-full w-14rem my-3 mx-auto">
                <Dropdown Id="genre"
                          value={selectedGenre}
                          onChange={(e) => setSelectedGenre(e.value)}
                          options={geners}
                          optionLabel="genreName"
                          className="w-full"/>
                <label htmlFor="genre" style={{fontSize: '12pt', marginTop: '-9px'}}>Выбрать жанр</label>
            </FloatLabel>

            <FloatLabel className="my-3 mx-auto w-full w-20rem">
                <Dropdown Id="age"
                          value={selectedAge}
                          onChange={(e) => setSelectedAge(e.value)}
                          options={ages}
                          optionLabel="ageRange"
                          className="w-full"/>
                <label htmlFor="age" style={{fontSize: '12pt', marginTop: '-9px'}}>Выбрать возрастное ограничение</label>
            </FloatLabel>

            <FloatLabel className="my-3 mx-auto w-15rem">
                <InputNumber id="price"
                             value={price}
                             onValueChange={(e) => setPrice(e.value)}
                             mode="currency"
                             currency="RUB"
                             locale="ru-RU"
                             min={10}
                />
                <label htmlFor="price" style={{fontSize: '12pt', marginTop: '-9px'}}>Стоимость книги</label>
            </FloatLabel>

            <FloatLabel className="my-3 mx-auto w-15rem">
                <InputNumber id="year"
                             value={yearCreation}
                             onValueChange={(e) => setYearCreation(e.value)}
                             min={900}
                             max={new Date().getFullYear()}
                             useGrouping={false}
                />
                <label htmlFor="year" style={{fontSize: '12pt', marginTop: '-9px'}}>Год написания</label>
            </FloatLabel>

            <div className="my-3 mx-auto">
                <FloatLabel>
                    <InputTextarea id="description"
                                   value={description}
                                   onChange={(e) => setDescription(e.target.value)}
                                   maxLength={500}
                                   rows={5}
                                   cols={30} />
                    <label htmlFor="description" style={{fontSize: '12pt', marginTop: '-9px'}}>Описание книги</label>
                </FloatLabel>
                <p className="text-end">{description.length}/500</p>
            </div>


            <FloatLabel className="my-3 mx-auto w-full md:w-20rem">
                <MultiSelect id="ms-pubs"
                             value={selectedPubs}
                             onChange={(e) => {setSelectedPubs(e.value)}}
                             options={pubs}
                             optionLabel="name"
                             maxSelectedLabels={3}
                             display="chip"
                             className="w-full" />
                <label htmlFor="ms-pubs" style={{fontSize: '12pt', marginTop: '-9px'}}>Издательства книги</label>
            </FloatLabel>

            <Button label={buttonName}
                    icon="pi pi-check"
                    className="my-3 mx-auto"
                    onClick={async () => {
                        if(title !== '' && imageFileName !== '' && !isNullOrUndef(selectedAuthor) &&
                            !isNullOrUndef(selectedGenre) && !isNullOrUndef(selectedAge) && price !== 0 &&
                            yearCreation !== 0 && description !== '' && selectedPubs.length > 0) {
                            await BookRequest(flagEdit ? cookies.BookEdit.id : 0, title, imageFileName, selectedAuthor.id,
                                        selectedGenre.id, selectedAge.id, price, yearCreation, description, selectedPubs,
                                        cookies.pubs, flagEdit);
                            navigate('/adminbooks');
                        }
                        else
                            toast.current.show({
                                severity: 'error',
                                summary: 'Ошибка',
                                detail: 'Пожалуйста, заполните все поля',
                                life: 3000
                            }
                            );
                    }}
            />
            <Toast ref={toast}/>
        </div>
    )
}