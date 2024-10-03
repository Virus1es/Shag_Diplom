import React, {useEffect, useState} from 'react';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import {GetArrayByUrl} from "../utils";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

// вывод магазинов
function ShowStores() {
    const [stores, setStores] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setStores(await GetArrayByUrl('http://localhost:5257/stores/get'));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="card" style={{margin: '10px 20px'}}>
            <DataTable value={stores}
                       paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]}
                       stripedRows
                       tableStyle={{minWidth: '50rem'}}>
                <Column field="name" header="Название" style={{ width: '30%' }}></Column>
                <Column field="idCityNavigation.cityName" header="Город размешения" style={{ width: '30%' }}></Column>
                <Column field="idStreetNavigation.streetName" header="Улица" style={{ width: '30%' }}></Column>
                <Column field="houseNum" header="Дом" style={{ width: '10%' }}></Column>
            </DataTable>
        </div>
    )

}

export default ShowStores;