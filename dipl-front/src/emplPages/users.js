import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { ConfirmPopup } from 'primereact/confirmpopup';
import {useCookies} from "react-cookie";
import {useNavigate} from "react-router-dom";

export default function ShowUsers(){
    const [cookies] = useCookies(['currentUser', 'currentUserRole']);

    // используется для redirect
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [visible, setVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const selectUser = (user) => {
        setSelectedUser(user);
        setVisible(true);
    }

    const accept = () => {
        const formData = new URLSearchParams();
        formData.append('userId', selectedUser.userId);
        formData.append('newRole', selectedUser.roles[0] === 'user' ? 'admin' : 'user');

        fetch('http://localhost:5257/users/ChangeUserRole', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.text(); // Или response.json() если ожидается JSON
            })
            .catch(error => {
                console.error('Error:', error);
            });

        setUsers([]);
        setVisible(false);
    };

    const reject = () => {setVisible(false)};

    const roleBodyTemplate = (user) => {
        return <Tag value={user.roles[0] === 'user' ? 'Пользователь' : 'Администратор'}
                    severity={user.roles[0] === 'user' ? 'success' : 'danger'}></Tag>;
    };

    useEffect( () => {
        fetch('http://localhost:5257/users/GetUsers')
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                setUsers(data);
            });
        }, [users]);

    if (cookies.currentUserRole !== 'admin') navigate('/');

    return(
        <div className="flex justify-content-center my-3">
            <DataTable className="w-8"
                       paginator
                       alwaysShowPaginator={false}
                       rows={10}
                       value={users}
                       stripedRows
                       tableStyle={{minWidth: '50rem'}}
                       selection={selectedUser} onSelectionChange={e => setSelectedUser(e.value)}>
                <Column field="userName" header="Логин"></Column>
                <Column field="email" header="Почта"></Column>
                <Column header="Роль" body={roleBodyTemplate}></Column>
                <Column header="" body={rowData => (<Button onClick={() => selectUser(rowData)} label="Сменить роль"/>)}></Column>
            </DataTable>
            <ConfirmPopup
                visible={visible}
                onHide={() => setVisible(false)}
                message='Уверены что хотите изменить роль пользователю?'
                header="Подтверждение"
                icon='pi pi-exclamation-triangle'
                defaultFocus='accept'
                acceptLabel='Да'
                rejectLabel='Нет'
                accept={accept}
                reject={reject}
            />

        </div>
    )
}