import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM panda_disposable_items");
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching items" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, quantity } = body;

    await pool.query(
      "INSERT INTO panda_disposable_items (name, quantity) VALUES ($1, $2)",
      [name, quantity],
    );

    return NextResponse.json({ message: "Item added successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error adding item" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, quantity } = body;

    await pool.query(
      "UPDATE panda_disposable_items SET name = $1, quantity = $2 WHERE id = $3",
      [name, quantity, id],
    );

    return NextResponse.json({ message: "Item updated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error updating item" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Item ID not provided" },
        { status: 400 },
      );
    }

    const result = await pool.query(
      "DELETE FROM panda_disposable_items WHERE id = $1",
      [id],
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error deleting item" }, { status: 500 });
  }
}
