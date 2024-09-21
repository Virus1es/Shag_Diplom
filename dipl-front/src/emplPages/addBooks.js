import {FloatLabel} from "primereact/floatlabel";
import {InputText} from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';
import {Button} from "primereact/button";
import {Toast} from "primereact/toast";
import { FileUpload } from 'primereact/fileupload';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { MultiSelect } from 'primereact/multiselect';
import { useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {checkPatronymic, GetArrayByUrl} from "../utils";
import {isNullOrUndef} from "chart.js/helpers";
import {useCookies} from "react-cookie";

export function AddBook(title, imageFileName, author, genre, age, price, yearCreation, description, pubs){
    // XNLHttpRequest это и есть реализация AJAX в JavaScript
    let request = new XMLHttpRequest();

    // настройка и отправка AJAX-запроса на сервер
    request.open("PUT", 'http://localhost:5257/books/put');

    // передача на сервер в параметрах формы
    let body = new FormData();
    body.append("Title", title);
    body.append("Image", imageFileName);
    body.append("IdAuthor", author);
    body.append("IdGenre", genre);
    body.append("IdAge", age);
    body.append("Price", price);
    body.append("CreationYear", yearCreation);
    body.append("BookDescription", description);

    // callBack, работающий по окончании запроса
    request.onload = function () {
        // если запрос завершен и завершен корректно вывести полученные от сервера данные
        if (request.status >= 200 && request.status <= 399) {
            let text = request.responseText;
            console.log(text);
            if(!isNaN(text))
                SetPubsToBook(Number(text), pubs);
        } // if
    } // callBack

    // собственно отправка запроса
    request.send();
}

export function SetPubsToBook(id, pubs){
    // XNLHttpRequest это и есть реализация AJAX в JavaScript
    let request = new XMLHttpRequest();

    pubs.forEach((pub) => {
        // настройка и отправка AJAX-запроса на сервер
        // request.open("POST", `http://localhost:4242/people/post/${id}/${fullName}/${age}`);
        // "http://localhost:5257/books/search"
        request.open("PUT", 'http://localhost:5257/pubbooks/put');

        // передача на сервер в параметрах формы
        let body = new FormData();
        body.append("IdBook", id);
        body.append("IdHouse", pub.id);

        // callBack, работающий по окончании запроса
        request.onload = function () {
            // если запрос завершен и завершен корректно вывести полученные от сервера данные
            if (request.status >= 200 && request.status <= 399) {
                let text = request.responseText;
                console.log(text);
            } // if
        } // callBack

        // собственно отправка запроса
        request.send();
    })
}

export default function ShowBookForm(){
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

    const [cookies] = useCookies(['currentUser', 'currentUserRole']);

    if (cookies.currentUserRole !== 'admin') navigate('/');

    let pubs = GetArrayByUrl('http://localhost:5257/PublishingHouses/get');

    let authors = GetArrayByUrl('http://localhost:5257/authors/get').map(
        (author) => {
            return {
                id: author.id,
                fullname: author.surname + ' ' + author.firstName[0] + '. ' + checkPatronymic(author.patronymic)
            }
        }
    );
    let geners = GetArrayByUrl('http://localhost:5257/genres/get');

    let ages = GetArrayByUrl('http://localhost:5257/agerestrictions/get');

    const savePicture = (e) => {
        let file = e.files[0];

        setImageFileName(file.name);
    }

    return(
        <div className="flex flex-column justify-content-center mt-5">

            <p className="text-4xl font-semibold mx-auto">Добавление новой книги</p>

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

            <FloatLabel  className="my-3 mx-auto">
                <InputTextarea id="description"
                               value={description}
                               onChange={(e) => setDescription(e.target.value)}
                               rows={5}
                               cols={30} />
                <label htmlFor="description" style={{fontSize: '12pt', marginTop: '-9px'}}>Описание книги</label>
            </FloatLabel>


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

            <Button label="Добавить"
                    icon="pi pi-check"
                    className="my-3 mx-auto"
                    onClick={() => {
                        if(title !== '' && imageFileName !== '' && !isNullOrUndef(selectedAuthor) &&
                           !isNullOrUndef(selectedGenre) && !isNullOrUndef(selectedAge) && price !== 0 &&
                            yearCreation !== 0 && description !== '' && selectedPubs.length > 0)
                            AddBook(title, imageFileName, selectedAuthor.id, selectedGenre.id, selectedAge.id, price, yearCreation, description, selectedPubs)
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