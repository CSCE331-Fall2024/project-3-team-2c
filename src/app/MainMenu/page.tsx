"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import { useLanguage } from "~/context/LanguageContext";
import Head from "next/head";
import { Title } from "@radix-ui/react-dialog";
import SwitchBase from "@mui/material/internal/SwitchBase";
import { useSession } from "next-auth/react";

/**
 * MainMenu Component
 *
 * This component serves as the main entry point for users to navigate to different roles and functionalities
 * within the Panda Express system (e.g., Manager, Cashier, Customer, Menu Board). It also includes weather
 * information, language selection, and text size toggling features for enhanced usability.
 *
 * **Key Features:**
 * - **Navigation Buttons:** Four main buttons for navigating to:
 *   - Manager menu items.
 *   - Cashier view.
 *   - Customer interface.
 *   - Menu board.
 * - **Weather Display:**
 *   - Fetches and displays current weather based on the user's geolocation.
 *   - Shows an error message if location access fails.
 * - **Language Selection:**
 *   - Allows users to select from predefined languages (English, Spanish, French, Chinese).
 * - **Text Size Toggle:**
 *   - Provides an accessibility feature to toggle between standard and large text sizes.
 *   - Persists the preference in `localStorage`.
 *
 * @returns {JSX.Element} A responsive main menu interface for Panda Express.
 */

export default function MainMenu() {
  const session = useSession();
  const { selectedLanguage, setSelectedLanguage } = useLanguage();
  const [weather, setWeather] = useState<{
    description: string;
    temp: number;
    icon: string;
  } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isTextLarge, setIsTextLarge] = useState(false);

  useEffect(() => {
    const persistedSize = localStorage.getItem("textSizeLarge") === "true";
    setIsTextLarge(persistedSize);
    document.documentElement.style.fontSize = persistedSize ? "150%" : "";
  }, []);

  const toggleTextSize = (newSize: boolean) => {
    setIsTextLarge(newSize);
    document.documentElement.style.fontSize = newSize ? "150%" : "";
    localStorage.setItem("textSizeLarge", newSize.toString());
  };

  useEffect(() => {
    const fetchWeather = async (latitude: number, longitude: number) => {
      console.log("Fetching weather data for:", { latitude, longitude });

      try {
        const response = await fetch(
          `/api/weather?lat=${latitude}&lon=${longitude}`,
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
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#FEC6B5] p-5">
      <Head>
        <Title>Panda Express Main Menu</Title>
        <meta
          name="description"
          content="Main navigation for the Panda Express System"
        />
      </Head>

      {/* Skip Links */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:rounded focus:bg-blue-500 focus:p-2 focus:text-white focus:outline-none"
      >
        Skip to Main Content
      </a>

      <a
        href="#footer"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-20 focus:rounded focus:bg-blue-500 focus:p-2 focus:text-white focus:outline-none"
      >
        Skip to Footer
      </a>

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

      <div>
        <Link href={session.data ? "/api/auth/signout" : "/api/auth/signin"}>
          <Button aria-label="Sign In/Out" className="mb-5 mr-2">
            {session.data ? "Sign Out" : "Sign In"}
          </Button>
        </Link>
        <Popover>
          <PopoverTrigger asChild>
            <Button aria-label="Language Select" className="mb-5 ml-2">
              Select Language
            </Button>
          </PopoverTrigger>
          <PopoverContent className="rounded-lg border border-black bg-white p-2">
            <div
              onClick={() => setSelectedLanguage("en-US")}
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
      </div>

      <div
        className="grid grid-cols-2 gap-5"
        role="main-content"
        id="main-content"
      >
        <Link href="./manager/menu_item" role="contentinfo">
          <div className="relative flex h-48 w-48 transform cursor-pointer items-center justify-center rounded-lg border border-black transition-transform hover:scale-105 hover:shadow-lg">
            <span className="z-10 text-3xl font-bold text-black">Manager</span>
            <div
              role="img"
              aria-label="Background Image for Manager View"
              className="absolute inset-0 rounded-lg bg-cover bg-center opacity-60"
              style={{ backgroundImage: "url('/MainMenuImages/food1.jpg')" }}
            ></div>
          </div>
        </Link>

        <Link href="./cashier">
          <div className="relative flex h-48 w-48 transform cursor-pointer items-center justify-center rounded-lg border border-black transition-transform hover:scale-105 hover:shadow-lg">
            <span className="z-10 text-3xl font-bold text-black">Cashier</span>
            <div
              role="img"
              aria-label="Background Image for Cashier"
              className="absolute inset-0 rounded-lg bg-cover bg-center opacity-60"
              style={{ backgroundImage: "url('/MainMenuImages/food2.jpeg')" }}
            ></div>
          </div>
        </Link>

        <Link href="./Customer">
          <div className="relative flex h-48 w-48 transform cursor-pointer items-center justify-center rounded-lg border border-black transition-transform hover:scale-105 hover:shadow-lg">
            <span className="z-10 text-3xl font-bold text-black">Customer</span>
            <div
              role="img"
              aria-label="Background Image for Customer"
              className="absolute inset-0 rounded-lg bg-cover bg-center opacity-60"
              style={{ backgroundImage: "url('/MainMenuImages/food3.jpg')" }}
            ></div>
          </div>
        </Link>
        <Link href="./menuBoard">
          <div className="relative flex h-48 w-48 transform cursor-pointer items-center justify-center rounded-lg border border-black transition-transform hover:scale-105 hover:shadow-lg">
            <span className="z-10 text-3xl font-bold text-black">
              Menu Board
            </span>
            <div
              role="img"
              aria-label="Background Image for Menu Board"
              className="absolute inset-0 rounded-lg bg-cover bg-center opacity-60"
              style={{ backgroundImage: "url('/MainMenuImages/food4.jpg')" }}
            ></div>
          </div>
        </Link>
      </div>

      <div className="fixed right-2 top-2 flex items-center space-x-2">
        <label
          htmlFor="text-size-toggle"
          className="text-sm font-bold"
          aria-label="Increase Text Size"
        >
          Increase Text Size
        </label>
        <Switch
          aria-label="TextSize Toggle"
          role="none"
          id="text-size-toggle"
          checked={isTextLarge}
          onCheckedChange={toggleTextSize}
        />
      </div>
    </div>
  );
}
