// "use client";
// import { useEffect } from "react";

// export default async function Home() {
//   useEffect(() => {
//     const fetchIngredients = async () => {
//       try {
//         const response = await fetch("/api/ingredients");
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         const data = await response.json();
//         console.log("Ingredients:", data);
//       } catch (error) {
//         console.error("Error fetching ingredients:", error);
//       }
//     };

//     fetchIngredients();
//   }, []);

//   return <div>Check the console for ingredients data.</div>;
// }

import MainMenu from "./MainMenu/page";
import EntreesPage from "./_components/entrees";

export default function Home() {
  // return (
  //   <MainMenu />
  // );
  return (
    <EntreesPage />
  );
}