import React from 'react';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import {GetArrayByUrl} from "../utils";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import App from "../App";
import '../styles/stores.css';

// вывод магазинов
function ShowResults() {
    let stores = GetArrayByUrl('http://localhost:5257/stores/get');

    return (
        <>
            <React.StrictMode>
                <App/>
            </React.StrictMode>
            <div className="card">
                <DataTable value={stores} stripedRows tableStyle={{minWidth: '50rem'}}>
                    <Column field="name" header="Название"></Column>
                    <Column field="idCityNavigation.cityName" header="Город размешения"></Column>
                    <Column field="idStreetNavigation.streetName" header="Улица"></Column>
                    <Column field="houseNum" header="Дом"></Column>
                </DataTable>
            </div>
        </>
    )

}

export default ShowResults;