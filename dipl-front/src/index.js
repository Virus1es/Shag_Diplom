import React from 'react';
import ReactDOM from 'react-dom/client';
import '../node_modules/primereact/resources/themes/lara-light-cyan/theme.css';
import '../node_modules/primeflex/primeflex.min.css';
import reportWebVitals from './reportWebVitals';
import {Route, BrowserRouter, Routes} from "react-router-dom";
import ShowStores from "./userPages/stores";
import Home from "./userPages/home";
import ShowResults from "./userPages/serchRez"
import Context from "./Context";
import App from "./App";
import ShowBook from "./userPages/book";
import ShowLogin from "./userPages/login";
import ShowRegister from "./userPages/register";
import ShowReports from "./emplPages/reports";
import ShowBookForm from "./emplPages/addBooks";


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <Context>
        <BrowserRouter>
            <React.StrictMode>
                <App/>
            </React.StrictMode>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/stores" element={<ShowStores/>} />
                <Route path="/booksearch" element={<ShowResults/>} />
                <Route path="/book" element={<ShowBook/>} />
                <Route path="/login" element={<ShowLogin/>} />
                <Route path="/registration" element={<ShowRegister/>} />
                <Route path="/reports" element={<ShowReports/>} />
                <Route path="/addbooks" element={<ShowBookForm/>} />
            </Routes>
        </BrowserRouter>
    </Context>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
