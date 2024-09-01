import React, {useContext, useEffect, useRef} from 'react';
import { DataView } from 'primereact/dataview';
import {Toast} from "primereact/toast";
import {BooksContext} from "../Context";
import {PrintBookCard} from "../utils";

function ShowResults(){
    const toast = useRef(null);

    // шаблоны вывода каждого элемента(книги)
    const itemTemplate = (book) => {
        return (
            <div className="sm:col-12 lg:col-6 xl:col-6 p-3">
                {PrintBookCard(book)}
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

    const {books} = useContext(BooksContext);
    // вывод сообщения в случае пустого результата
    useEffect(() => {
        // убираем предыдущее сообщение
        toast.current.clear();

        // если результат - пустой массив, выводим сообщение об этом
        if(books.length === 0){
            toast.current.show(
                {
                    severity: 'error',
                    summary: 'Упс :(',
                    detail: 'Таких книг не найдено'
                }
            );
        }
    }, [books]);

    return (
        <>
            <div className="card" style={{ margin: '50px 10px'}}>
                <DataView value={books}
                          listTemplate={listTemplate}
                          layout="grid"
                          paginator rows={5}
                          alwaysShowPaginator={false}/>
                <Toast ref={toast} />
            </div>
        </>
    )
}

export default ShowResults;