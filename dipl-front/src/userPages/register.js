import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { FloatLabel } from "primereact/floatlabel";
import { Toast } from 'primereact/toast';
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";

// посыл запроса регистрации на сервер
export function RegisterUser(username, email, password, toast, navigate){
    // XNLHttpRequest это и есть реализация AJAX в JavaScript
    let request = new XMLHttpRequest();

    // настройка и отправка AJAX-запроса на сервер
    // request.open("POST", `http://localhost:4242/people/post/${id}/${fullName}/${age}`);
    // "http://localhost:5257/books/search"
    request.open("POST", "http://localhost:5257/users/register");

    // передача на сервер в параметрах формы
    let body = new FormData();
    // body.append("username", 'username');
    body.append("username", username);
    body.append("email", email);
    body.append("password", password);

    // callBack, работающий по окончании запроса
    request.onload = function () {
        // если запрос завершен и завершен корректно вывести полученные от сервера данные
        if (request.status >= 200 && request.status <= 399) {

            let text = request.responseText;

            if (text.includes('Errors:')) {
                if (text.includes('taken')) {
                    if (text.includes('Username'))
                        toast.current.show({
                            severity: 'error',
                            summary: 'Ошибка',
                            detail: 'Такое имя пользователя уже занято'
                        });
                    if (text.includes('Email'))
                        toast.current.show({
                            severity: 'error',
                            summary: 'Ошибка',
                            detail: 'Почта занята другим пользователем'
                        });
                }
                else
                    toast.current.show({
                        severity: 'error',
                        summary: 'Ошибка',
                        detail: 'Произошла ошибка на сервере, пожалуйста, обратитесь к администратору'
                    });
            }
            else
                navigate('/');
            console.log(text);
        } // if
    } // callBack

    // собственно отправка запроса
    request.send(body);
}


export default function ShowRegister(){
    // для уведомлений Toast
    const toast = useRef(null);

    // регулярка для проверки правильности формата почты
    const regEmail = /[A-Za-z0-9]+@[A-Za-z0-9-]+\.[A-Za-z]+/g;

    // правильная ли форма ввода почты
    const [emailValid, setEmailValid] = useState(false);

    // совпадают ли пароли
    const [passwordValid, setPasswordValid] = useState(false);

    // имя пользователя(логин)
    const [login, setLogin] = useState('');

    // почта пользователя
    const [email, setEmail] = useState('');

    // пароль
    const [password, setPassword] = useState('');

    // подтверждение пароля
    const [passwordCopy, setPasswordCopy] = useState('');

    // используется для redirect
    const navigate = useNavigate();

    // ругаем пользователя за ошибки или регистрируем нового пользователя
    const checkRegister = () => {
        if(passwordValid)
            toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Пароль не совпадает' });
        else if (emailValid)
            toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Не верный формат почты' });
        else
            RegisterUser(login, email, password, toast, navigate);
    }

    // следим за тем чтобы пользователь вводил одинаковые пароли
    useEffect(() => {
        setPasswordValid(password !== '' && passwordCopy !== '' && password !== passwordCopy);
    }, [password, passwordCopy]);

    // следим чтобы пользователь ввёл правильно почту
    useEffect(() => {
        setEmailValid(!email.match(regEmail));
    }, [email])

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
                <InputText id="email"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           invalid={emailValid}
                />
                <label htmlFor="email" style={{fontSize: '12pt', marginTop: '-9px'}}>Почта</label>
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
                <Password value={passwordCopy}
                          id="passwordCopy"
                          onChange={(e) => setPasswordCopy(e.target.value)}
                          toggleMask
                          feedback={false}
                          invalid={passwordValid}
                />
                <label htmlFor="passwordCopy" style={{fontSize: '12pt', marginTop: '-9px'}}>Повторите пароль</label>
            </FloatLabel>

            <Button label="Зарегистрироваться"
                    icon="pi pi-user"
                    className="my-3 mx-auto"
                    onClick={() => {checkRegister()}}
            />
            <Toast ref={toast} />
        </div>
    )
}