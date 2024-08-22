import React from 'react';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import {GetArrayByUrl} from "../utils";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import App from "../App";


// вывод магазинов
function ShowStores() {
    let stores = GetArrayByUrl('http://localhost:5257/stores/get');

    return (
        <>
            <React.StrictMode>
                <App/>
            </React.StrictMode>
            <div className="card" style={{margin: '10px 20px'}}>
                <DataTable value={stores}
                           paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]}
                           stripedRows
                           tableStyle={{minWidth: '50rem'}}>
                    <Column field="name" header="Название" style={{ width: '30%' }}></Column>
                    <Column field="idCityNavigation.cityName" header="Город размешения" style={{ width: '30%' }}></Column>
                    <Column field="idStreetNavigation.streetName" header="Улица" style={{ width: '30%' }}></Column>
                    <Column field="houseNum" header="Дом" style={{ width: '10%' }}></Column>
                </DataTable>
            </div>
        </>
    )

}

export default ShowStores;