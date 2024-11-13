import { NextResponse } from "next/server";
import { Client } from "pg";

// const client = new Client({
//   connectionString: process.env.DATABASE_URL,
// });
//
// client.connect();

export async function GET() {
  // try {
  //   const result = await client.query("SELECT * FROM employees");
  //   return NextResponse.json(result.rows);
  // } catch (error: unknown) {
  //   console.error("Error fetching employees:", error);
  //   return NextResponse.json(
  //     { error: "Error fetching employees" },
  //     { status: 500 },
  //   );
  // } finally {
  //   client.end();
  // }

  //TODO: Remove later
  return NextResponse.json({ message: "GET /api/employees" });
}
