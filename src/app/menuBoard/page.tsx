import React from 'react';

export default function MenuBoard() {
    const menuCategories = [
        {
            title: "SIDES",
            items: [
                { name: "Chow Mein", price: null, image: "/menuBoardImages/chowMein.png" },
                { name: "Fried Rice", price: null, image: "/menuBoardImages/friedRice.png" },
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
                { name: "Sprite", price: "2", image: "/menuBoardImages/sprite.jpg" },
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
                padding: "40px",
                fontFamily: "Arial, sans-serif",
            }}
        >
            <h1
                style={{
                    textAlign: "center",
                    marginBottom: "30px",
                    color: "black",
                    fontSize: "72px", // Increased size
                    fontWeight: "bold",
                }}
            >
                Menu Board
            </h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "40px", justifyContent: "center" }}>
                {menuCategories.map((category, index) => (
                    <div
                        key={index}
                        style={{
                            background: "#fff",
                            border: "2px solid #ccc", // Increased border width
                            borderRadius: "12px", // Slightly larger rounding
                            padding: "25px", // Increased padding
                            width: "350px", // Increased width of each card
                            boxShadow: "0 6px 8px rgba(0, 0, 0, 0.15)", // Larger shadow for emphasis
                        }}
                    >
                        <h2
                            style={{
                                textAlign: "center",
                                fontSize: "36px", // Increased category title size
                                borderBottom: "3px solid #ccc",
                                paddingBottom: "15px",
                                marginBottom: "20px",
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
                                        padding: "15px 0", // Increased padding between items
                                        fontSize: "20px", // Larger font for menu items
                                        borderBottom: i < category.items.length - 1 ? "1px solid #eee" : "none",
                                    }}
                                >
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        style={{
                                            width: "75px", // Larger image size
                                            height: "75px",
                                            marginRight: "15px",
                                            borderRadius: "8px",
                                        }}
                                    />
                                    <span style={{ flex: 1 }}>{item.name}</span>
                                    <span style={{ fontSize: "18px" }}>{item.price ? `$${item.price}` : "N/A"}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
