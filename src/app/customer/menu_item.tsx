"use client";
import React from "react";
import { Item } from "../item";
import { useNavigate } from "node_modules/react-router-dom";

// use next redirect

interface Item {
    id: number;
    price: number;

}

interface navButton {
    text: string;
    to: string;
}
const RedirectButton: React.FC<navButton> = ({ text, to }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(to);  // Navigate to the route passed in the 'to' prop
    };

    return (
        <button onClick={handleClick}>
            {text}
        </button>
    );
};

const App: React.FC = () => {
    return (
        <div>
            <RedirectButton text="Go to Home" to="/home" />
            <RedirectButton text="Go to About" to="/about" />
        </div>
    );
};

export default App;

