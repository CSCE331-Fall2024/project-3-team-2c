import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM panda_ingredients");
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching ingredients" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, quantity } = body;

    await pool.query(
      "INSERT INTO panda_ingredients (name, quantity) VALUES ($1, $2)",
      [name, quantity],
    );

    return NextResponse.json({ message: "Ingredient added successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error adding ingredient" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, quantity } = body;

    await pool.query(
      "UPDATE panda_ingredients SET name = $1, quantity = $2 WHERE id = $3",
      [name, quantity, id],
    );

    return NextResponse.json({ message: "Ingredient updated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error updating ingredient" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Ingredient ID not provided" },
        { status: 400 },
      );
    }

    const result = await pool.query(
      "DELETE FROM panda_ingredients WHERE id = $1",
      [id],
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Ingredient not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Ingredient deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error deleting ingredient" },
      { status: 500 },
    );
  }
}
