import { NextRequest, NextResponse } from "next/server";


/**
 * GET API Handler for Weather Data
 * 
 * This function handles GET requests to fetch weather data from the OpenWeatherMap API
 * based on the latitude and longitude provided in the query parameters.
 * 
 * **Flow:**
 * 1. Extracts `lat` (latitude) and `lon` (longitude) from the request's query parameters.
 * 2. Validates the presence of these parameters; returns an error if missing.
 * 3. Sends a request to the OpenWeatherMap API to fetch weather data.
 * 4. Returns the weather data as JSON if successful.
 * 5. Handles errors gracefully, returning appropriate status codes and messages.
 * 
 * **Returns:**
 * - `200`: Success, with the fetched weather data.
 * - `400`: Bad request, with an error message if latitude or longitude is missing.
 * - `500`: Internal server error, with an error message for API or server failures.
 * 
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "Missing latitude or longitude" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.WEATHER_API_KEY}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
