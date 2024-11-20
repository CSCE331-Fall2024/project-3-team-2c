// "use client"

// import React from "react";
// import Link from "next/link";
// import { redirect } from "next/navigation";

// export default function MainMenu() {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-[#FEC6B5] p-5">
//       <header className="text-center mb-10 text-3xl font-bold">PANDA EXPRESS</header>
//       <div className="grid grid-cols-2 gap-5">

//         <Link href="./manager/menu_item">
//           <div className="relative w-48 h-48 flex items-center justify-center cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg rounded-lg border border-black">
//             <span className="text-2xl font-bold text-black z-10">Manager</span>
//             <div
//               className="absolute inset-0 bg-cover bg-center rounded-lg opacity-60"
//               style={{ backgroundImage: "url('/MainMenuImages/food1.jpg')" }}
//             ></div>
//           </div>
//         </Link>

//         <div className="relative w-48 h-48 flex items-center justify-center cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg rounded-lg border border-black">
//           <span className="text-2xl font-bold text-black z-10">Cashier</span>
//           <div
//             className="absolute inset-0 bg-cover bg-center rounded-lg opacity-60"
//             style={{ backgroundImage: "url('/MainMenuImages/food2.jpeg')" }}
//           >
//           </div>
//         </div>

//         <Link href="./Customer">
//           <div
//             className="relative w-48 h-48 flex items-center justify-center cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg rounded-lg border border-black">
//             <span className="text-2xl font-bold text-black z-10">Customer</span>
//             <div
//               className="absolute inset-0 bg-cover bg-center rounded-lg opacity-60"
//               style={{ backgroundImage: "url('/MainMenuImages/food3.jpg')" }}
//             ></div>
//           </div>
//         </Link>

//         <div className="relative w-48 h-48 flex items-center justify-center cursor-pointer transition-transform transform hover:scale-105 hover:shadow-lg rounded-lg border border-black">
//           <span className="text-2xl font-bold text-black z-10">Menu Board</span>
//           <div
//             className="absolute inset-0 bg-cover bg-center rounded-lg opacity-60"
//             style={{ backgroundImage: "url('/MainMenuImages/food4.jpg')" }}
//           ></div>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import React from "react";
// import Link from "next/link";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "~/components/ui/popover";
// import { Button } from "~/components/ui/button";
// import { useLanguage } from "~/context/LanguageContext";

// export default function MainMenu() {
//   const { selectedLanguage, setSelectedLanguage } = useLanguage();

//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center bg-[#FEC6B5] p-5">
//       <header className="mb-10 text-center text-3xl font-bold">
//         PANDA EXPRESS
//       </header>

//       <Popover>
//         <PopoverTrigger asChild>
//           <Button className="mb-5">Select Language</Button>
//         </PopoverTrigger>
//         <PopoverContent className="rounded-lg border border-black bg-white p-2">
//           <div
//             onClick={() => setSelectedLanguage("en")}
//             className="cursor-pointer p-2 hover:bg-gray-200"
//           >
//             English
//           </div>
//           <div
//             onClick={() => setSelectedLanguage("es")}
//             className="cursor-pointer p-2 hover:bg-gray-200"
//           >
//             Spanish
//           </div>
//           <div
//             onClick={() => setSelectedLanguage("fr")}
//             className="cursor-pointer p-2 hover:bg-gray-200"
//           >
//             French
//           </div>
//           <div
//             onClick={() => setSelectedLanguage("zh")}
//             className="cursor-pointer p-2 hover:bg-gray-200"
//           >
//             Chinese
//           </div>
//         </PopoverContent>
//       </Popover>

//       <div className="grid grid-cols-2 gap-5">
//         <Link href="./manager/menu_item">
//           <div className="relative flex h-48 w-48 transform cursor-pointer items-center justify-center rounded-lg border border-black transition-transform hover:scale-105 hover:shadow-lg">
//             <span className="z-10 text-2xl font-bold text-black">Manager</span>
//             <div
//               className="absolute inset-0 rounded-lg bg-cover bg-center opacity-60"
//               style={{ backgroundImage: "url('/MainMenuImages/food1.jpg')" }}
//             ></div>
//           </div>
//         </Link>

//         <div className="relative flex h-48 w-48 transform cursor-pointer items-center justify-center rounded-lg border border-black transition-transform hover:scale-105 hover:shadow-lg">
//           <span className="z-10 text-2xl font-bold text-black">Cashier</span>
//           <div
//             className="absolute inset-0 rounded-lg bg-cover bg-center opacity-60"
//             style={{ backgroundImage: "url('/MainMenuImages/food2.jpeg')" }}
//           ></div>
//         </div>

//         <Link href="./Customer">
//           <div className="relative flex h-48 w-48 transform cursor-pointer items-center justify-center rounded-lg border border-black transition-transform hover:scale-105 hover:shadow-lg">
//             <span className="z-10 text-2xl font-bold text-black">Customer</span>
//             <div
//               className="absolute inset-0 rounded-lg bg-cover bg-center opacity-60"
//               style={{ backgroundImage: "url('/MainMenuImages/food3.jpg')" }}
//             ></div>
//           </div>
//         </Link>

//         <div className="relative flex h-48 w-48 transform cursor-pointer items-center justify-center rounded-lg border border-black transition-transform hover:scale-105 hover:shadow-lg">
//           <span className="z-10 text-2xl font-bold text-black">Menu Board</span>
//           <div
//             className="absolute inset-0 rounded-lg bg-cover bg-center opacity-60"
//             style={{ backgroundImage: "url('/MainMenuImages/food4.jpg')" }}
//           ></div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { useLanguage } from "~/context/LanguageContext";

export default function MainMenu() {
  const { selectedLanguage, setSelectedLanguage } = useLanguage();
  const [weather, setWeather] = useState<{
    description: string;
    temp: number;
    icon: string;
  } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async (latitude: number, longitude: number) => {
      console.log("Fetching weather data for:", { latitude, longitude });
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}`,
        );

        if (!response.ok) {
          throw new Error(
            `API Error: ${response.status} ${response.statusText}`,
          );
        }

        type WeatherResponse = {
          weather: { description: string; icon: string }[];
          main: { temp: number };
        };

        const data: WeatherResponse =
          (await response.json()) as WeatherResponse;
        console.log("Weather API response:", data);

        if (data.weather && data.main) {
          setWeather({
            description:
              data.weather?.[0]?.description ?? "No description available",
            temp: data.main.temp,
            icon: data.weather[0]?.icon
              ? `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
              : "",
          });
        } else {
          console.log("Incomplete weather data");
          setWeather(null);
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setWeather(null);
      }
    };

    const getUserLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            void fetchWeather(latitude, longitude);
          },
          (error) => {
            console.error("Error getting location:", error);
            setLocationError("Unable to retrieve location");
          },
        );
      } else {
        setLocationError("Geolocation is not supported by this browser.");
      }
    };

    void getUserLocation();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FEC6B5] p-5">
      <header className="mb-5 text-center text-3xl font-bold">
        PANDA EXPRESS
      </header>

      {locationError ? (
        <div className="mb-5 text-lg font-semibold text-red-500">
          {locationError}
        </div>
      ) : weather ? (
        <div className="mb-5 flex items-center space-x-3 text-lg font-semibold">
          <img src={weather.icon} alt="Weather icon" className="h-12 w-12" />
          <span>
            {weather.description}, {weather.temp}°C
          </span>
        </div>
      ) : (
        <div className="mb-5 text-lg font-semibold">Loading weather...</div>
      )}

      <Popover>
        <PopoverTrigger asChild>
          <Button className="mb-5">Select Language</Button>
        </PopoverTrigger>
        <PopoverContent className="rounded-lg border border-black bg-white p-2">
          <div
            onClick={() => setSelectedLanguage("en")}
            className="cursor-pointer p-2 hover:bg-gray-200"
          >
            English
          </div>
          <div
            onClick={() => setSelectedLanguage("es")}
            className="cursor-pointer p-2 hover:bg-gray-200"
          >
            Spanish
          </div>
          <div
            onClick={() => setSelectedLanguage("fr")}
            className="cursor-pointer p-2 hover:bg-gray-200"
          >
            French
          </div>
          <div
            onClick={() => setSelectedLanguage("zh")}
            className="cursor-pointer p-2 hover:bg-gray-200"
          >
            Chinese
          </div>
        </PopoverContent>
      </Popover>

      <div className="grid grid-cols-2 gap-5">
        <Link href="./manager/menu_item">
          <div className="relative flex h-48 w-48 transform cursor-pointer items-center justify-center rounded-lg border border-black transition-transform hover:scale-105 hover:shadow-lg">
            <span className="z-10 text-3xl font-bold text-black">Manager</span>
            <div
              className="absolute inset-0 rounded-lg bg-cover bg-center opacity-60"
              style={{ backgroundImage: "url('/MainMenuImages/food1.jpg')" }}
            ></div>
          </div>
        </Link>

        <Link href="./cashier">
          <div className="relative flex h-48 w-48 transform cursor-pointer items-center justify-center rounded-lg border border-black transition-transform hover:scale-105 hover:shadow-lg">
            <span className="z-10 text-3xl font-bold text-black">Cashier</span>
            <div
              className="absolute inset-0 rounded-lg bg-cover bg-center opacity-60"
              style={{ backgroundImage: "url('/MainMenuImages/food2.jpeg')" }}
            ></div>
          </div>
        </Link>

        <Link href="./Customer">
          <div className="relative flex h-48 w-48 transform cursor-pointer items-center justify-center rounded-lg border border-black transition-transform hover:scale-105 hover:shadow-lg">
            <span className="z-10 text-3xl font-bold text-black">Customer</span>
            <div
              className="absolute inset-0 rounded-lg bg-cover bg-center opacity-60"
              style={{ backgroundImage: "url('/MainMenuImages/food3.jpg')" }}
            ></div>
          </div>
        </Link>

        <div className="relative flex h-48 w-48 transform cursor-pointer items-center justify-center rounded-lg border border-black transition-transform hover:scale-105 hover:shadow-lg">
          <span className="z-10 text-3xl font-bold text-black">Menu Board</span>
          <div
            className="absolute inset-0 rounded-lg bg-cover bg-center opacity-60"
            style={{ backgroundImage: "url('/MainMenuImages/food4.jpg')" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
