import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ShowStores from "./pages/stores";
import Home from "./pages/home";
import ShowResults from "./pages/serchRez"


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
