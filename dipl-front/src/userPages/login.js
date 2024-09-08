import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { FloatLabel } from "primereact/floatlabel";
import { Divider } from 'primereact/divider';
import {useState} from "react";
import {useNavigate} from "react-router-dom";


export default function ShowLogin(){
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    // используется для redirect
    const navigate = useNavigate();


    return(
        <div className="flex flex-column justify-content-center mt-5">

            <p className="text-4xl font-semibold mx-auto">Вход в аккаунт</p>

            <FloatLabel className="my-3 mx-auto">
                <InputText value={login}
                           id="username"
                           onChange={(e) => setLogin(e.target.value)}
                />
                <label htmlFor="username" style={{fontSize: '12pt', marginTop: '-9px'}}>Логин</label>
            </FloatLabel>

            <FloatLabel className="my-3 mx-auto">
                <Password value={password}
                          id="password"
                          onChange={(e) => setPassword(e.target.value)}
                          toggleMask
                          feedback={false}
                />
                <label htmlFor="password" style={{fontSize: '12pt', marginTop: '-9px'}}>Пароль</label>
            </FloatLabel>

            <Button label="Войти"
                    icon="pi pi-sign-in"
                    className="my-2 mx-auto"
            />

            <Divider type="solid" />

            <p className="text-base text-400 my-2 mx-auto">
                Ещё нет аккаунта?
            </p>

            <Button label="Зарегистрироваться"
                    link
                    onClick={() => navigate('/registration')}
                    className="my-2 mx-auto"
            />
        </div>
    )
}