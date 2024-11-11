// pages/api/ingredients.js

import { Pool } from "pg";
import { NextResponse } from "next/server";

// Use connection string directly
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use your environment variable here
});

export async function GET() {
  try {
    // Query to get all ingredients
    const result = await pool.query("SELECT * FROM ingredients");
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
