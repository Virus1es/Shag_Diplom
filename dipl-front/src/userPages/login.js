import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { FloatLabel } from "primereact/floatlabel";
import { Divider } from 'primereact/divider';
import {useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Checkbox} from "primereact/checkbox";
import {useCookies} from "react-cookie";
import {Toast} from "primereact/toast";

// посыл запроса входа в аккаунт на сервер
export function LoginUser(username, password, remember, toast, navigate, setFunc){
    // XNLHttpRequest это и есть реализация AJAX в JavaScript
    let request = new XMLHttpRequest();

    // настройка и отправка AJAX-запроса на сервер
    // request.open("POST", `http://localhost:4242/people/post/${id}/${fullName}/${age}`);
    // "http://localhost:5257/books/search"
    request.open("POST", "http://localhost:5257/users/login");

    // передача на сервер в параметрах формы
    let body = new FormData();
    // body.append("username", 'username');
    body.append("username", username);
    body.append("password", password);
    body.append("remember", remember);

    // callBack, работающий по окончании запроса
    request.onload = function () {
        // если запрос завершен и завершен корректно вывести полученные от сервера данные
        if (request.status >= 200 && request.status <= 399) {

            let text = request.responseText;

            if (text.includes('Errors:'))
                toast.current.show({
                            severity: 'error',
                            summary: 'Ошибка',
                            detail: 'Не верно указан логин или пароль'
                });
            else if (text === 'Пользователь заблокирован')
                toast.current.show({
                    severity: 'error',
                    summary: 'Ошибка',
                    detail: 'Данный пользователь заблокирован'
                });
            else {
                setFunc('currentUser', username);
                setFunc('currentUserRole', text);
                navigate('/');
            }
            console.log(text);
        } // if
    } // callBack

    // собственно отправка запроса
    request.send(body);
}


export default function ShowLogin(){
    // для уведомлений Toast
    const toast = useRef(null);

    // имя пользователя(логин)
    const [login, setLogin] = useState('');

    // пароль пользователя
    const [password, setPassword] = useState('');

    // запоминать ли данные для входа
    const [remember, setRemember] = useState(false);

    // используется для redirect
    const navigate = useNavigate();

    // cookie - если человек вошёл, запоминаем что он вошёл
    const [cookies, setCookie] = useCookies(['currentUser', 'currentUserRole']);


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

            <div className="my-3 mx-auto">
                <Checkbox inputId="remember"
                          onChange={(e) => {setRemember(e.checked)}}
                          checked={remember} />
                <label htmlFor="remember" className="ml-2">Запомнить данные</label>
            </div>

            <Button label="Войти"
                    icon="pi pi-sign-in"
                    className="my-2 mx-auto"
                    onClick={() => {
                        if(login !== '' && password !== '') {
                            LoginUser(login, password, remember, toast, navigate, setCookie);
                            localStorage.removeItem('cart');
                        }
                    }}
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

            <Toast ref={toast} />
        </div>
    )
}