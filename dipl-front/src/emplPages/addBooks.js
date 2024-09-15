import {FloatLabel} from "primereact/floatlabel";
import {InputText} from "primereact/inputtext";
import { Dropdown } from 'primereact/dropdown';
import {Button} from "primereact/button";
import {Toast} from "primereact/toast";
import { FileUpload } from 'primereact/fileupload';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import {useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {checkPatronymic, GetArrayByUrl} from "../utils";


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
    const [description, setDescription] = useState();

    // используется для redirect
    const navigate = useNavigate();

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
                        mode="basic"
                        name="demo[]"
                        accept="image/*"
                        maxFileSize={1000000}
                        onSelect={savePicture}
                        onUpload={savePicture}
                        chooseLabel="Добавить обложку"/>

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

            <Button label="Добавить"
                    icon="pi pi-check"
                    className="my-3 mx-auto"
                    onClick={() => {
                    }}
            />
            <Toast ref={toast}/>
        </div>
    )
}