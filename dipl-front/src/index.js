import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ShowStores from "./userPages/stores";
import Home from "./userPages/home";
import ShowResults from "./userPages/serchRez"


const root = ReactDOM.createRoot(document.getElementById('root'));
const router = createBrowserRouter([
    {
        path: "/",
        element: <Home/>,
    },
    {
        path: "stores",
        element: <ShowStores/>,
    },
    {
        path: "booksearch",
        element: <ShowResults/>
    }
]);

root.render(
    <RouterProvider router={router} />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
