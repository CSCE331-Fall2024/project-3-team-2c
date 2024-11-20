import React from 'react';

export default function MenuBoard() {
    const menuCategories = [
        {
            title: "SIDES",
            items: [
                { name: "Chow Mein", price: null, image: "/menuBoardImages/chowMein.png" },
                { name: "Fried Rice", price: null, image: "/menuBoardImages/friedRice.png"},
                { name: "White Rice", price: null, image: "/menuBoardImages/whiteSteamedRice.png" },
                { name: "Super Greens", price: null, image: "/menuBoardImages/superGreens.png" },
            ],
        },
        {
            title: "ENTREES",
            items: [
                { name: "Orange Chicken", price: null, image: "/menuBoardImages/orangeChicken.png" },
                { name: "Grilled Teriyaki Chicken", price: null, image: "/menuBoardImages/grilledTeriyakiChicken.png" },
                { name: "SweetFire Chicken Breast", price: null, image: "/menuBoardImages/sweetFireChickenBreast.png" },
                { name: "Kung Pao Chicken", price: null, image: "/menuBoardImages/kungPaoChicken.png" },
                { name: "Mushroom Chicken", price: null, image: "/menuBoardImages/mushroomChicken.png" },
                { name: "Broccoli Beef", price: null, image: "/menuBoardImages/broccoliBeef.png" },
                { name: "Bejing Beef", price: null, image: "/menuBoardImages/beijingBeef.png" },
                { name: "Honey Walnut Shrimp", price: "1.25", image: "/menuBoardImages/honeyWalnutShrimp.png" },
            ],
        },
        {
            title: "APPETIZERS",
            items: [
                { name: "Chicken Egg Roll", price: "2", image: "/menuBoardImages/chickenEggRoll.avif" },
                { name: "Veggie Spring Roll", price: "2", image: "/menuBoardImages/veggieSpringRoll.avif" },
                { name: "Cream Cheese Rangoon", price: "2", image: "/menuBoardImages/creamCheeseRagoon.avif" },
                { name: "Apple Pie Roll", price: "2", image: "/menuBoardImages/applePieRoll.avif" },
            ],
        },
        {
            title: "DRINKS",
            items: [
                { name: "Coca Cola", price: "2", image: "/menuBoardImages/coke.webp" },
                { name: "Sprite", price: "2", image: "/menuBoardImages/sprite.jpg"},
                { name: "Dr.Pepper", price: "2", image: "/menuBoardImages/dr.pepper.webp" },
                { name: "Fanta", price: "2", image: "/menuBoardImages/fanta.webp" },
            ],
        },
    ];

    return (
        <div
            style={{
                background: "url('/MainMenuImages/food1.jpg') no-repeat center center fixed",
                backgroundSize: "cover", 
                backgroundAttachment: "fixed", 
                imageRendering: "auto", 
                minHeight: "100vh",
                margin: 0,
                padding: "20px",
                fontFamily: "Arial, sans-serif",
            }}
        >
            <h1 style={{ textAlign: "center", marginBottom: "20px", color: "black", fontSize: "64px", fontWeight: "bold"}}>Menu Board</h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
                {menuCategories.map((category, index) => (
                    <div
                        key={index}
                        style={{
                            background: "#fff",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            padding: "15px",
                            width: "300px",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <h2
                            style={{
                                textAlign: "center",
                                borderBottom: "2px solid #ccc",
                                paddingBottom: "10px",
                            }}
                        >
                            {category.title}
                        </h2>
                        <ul style={{ listStyle: "none", padding: "0", margin: "0" }}>
                            {category.items.map((item, i) => (
                                <li
                                    key={i}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "8px 0",
                                        borderBottom: i < category.items.length - 1 ? "1px solid #eee" : "none",
                                    }}
                                >
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        style={{ width: "50px", height: "50px", marginRight: "10px", borderRadius: "5px" }}
                                    />
                                    <span style={{ flex: 1 }}>{item.name}</span>
                                    <span>{item.price ? `$${item.price}` : "N/A"}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
