import { createContext, useReducer } from "react";

export const BooksContext = createContext();

const reducer = (books, action) => {
    switch (action.type) {
        case "SEARCH":
            return books = action.payload;
        default:
            return books;
    }
};

export default function Context(props) {
    const [books, dispatch] = useReducer(reducer, []);

    const searchBooks = (books) => {
        dispatch({ type: "SEARCH", payload: books });
    };

    const value = { searchBooks, books };

    return (
        <BooksContext.Provider value={value}>
            {props.children}
        </BooksContext.Provider>
    );
}
