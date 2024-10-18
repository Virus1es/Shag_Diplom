import {useEffect, useRef, useState} from 'react';
import { DataView } from 'primereact/dataview';
import { Toast } from "primereact/toast";
import {PrintBookCard} from "../utils";
import {useNavigate} from "react-router-dom";

function ShowResults(){
    // используется для redirect в коде
    const navigate = useNavigate();

    const toast = useRef(null);

    const [rezBooks, setRezBooks] = useState([]);

    // шаблоны вывода каждого элемента(книги)
    const itemTemplate = (book) => {
        return (
            <div className="sm:col-12 lg:col-6 xl:col-6 p-3">
                {PrintBookCard(book, navigate)}
            </div>);
    };

    // вывод итогового списка
    const listTemplate = (items) => {
        if (!items || items.length === 0) return null;

        let list = items.map((product) => {
            return itemTemplate(product);
        });

        return <div className="grid grid-nogutter">{list}</div>;
    };

    useEffect(() => {
        setRezBooks(JSON.parse(localStorage.getItem('books')));
    }, []);

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

    return (
        <>
            <div className="card" style={{ margin: '50px 10px'}}>
                <DataView value={rezBooks}
                          listTemplate={listTemplate}
                          layout="grid"
                          paginator rows={6}
                          alwaysShowPaginator={false}/>
                <Toast ref={toast} />
            </div>
        </>
    )
}

export default ShowResults;