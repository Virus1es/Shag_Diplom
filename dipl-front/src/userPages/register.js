import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { FloatLabel } from "primereact/floatlabel";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

export default function ShowRegister(){
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    // используется для redirect
    const navigate = useNavigate();

    return(
        <div className="flex flex-column justify-content-center mt-5">

            <p className="text-4xl font-semibold mx-auto">Регистрация нового аккаунта</p>

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

            <FloatLabel className="my-3 mx-auto">
                <Password value={password}
                          id="password"
                          onChange={(e) => setPassword(e.target.value)}
                          toggleMask
                          feedback={false}
                />
                <label htmlFor="password" style={{fontSize: '12pt', marginTop: '-9px'}}>Повторите пароль</label>
            </FloatLabel>

            <Button label="Зарегистрироваться"
                    icon="pi pi-user"
                    className="my-3 mx-auto"
            />
        </div>
    )
}