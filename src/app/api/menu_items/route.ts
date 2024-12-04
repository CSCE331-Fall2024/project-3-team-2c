import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM panda_menu_items");
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
    const { name, type } = body;

    const upperType = type.toUpperCase();

    await pool.query(
      "INSERT INTO panda_menu_items (name, type) VALUES ($1, $2)",
      [name, upperType],
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
    const { id, name, type } = body;

    const upperType = type.toUpperCase();

    await pool.query(
      "UPDATE panda_menu_items SET name = $1, type = $2 WHERE id = $3",
      [name, upperType, id],
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
      "DELETE FROM panda_menu_items WHERE id = $1",
      [id],
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Item deleted successfully" });
  } catch (error: any) {
    if (error.code === "23503") {
      return NextResponse.json(
        {
          error:
            "Cannot delete this item because it is still referenced in other records. Please remove all references before deleting.",
        },
        { status: 400 },
      );
    }

    console.error(error);
    return NextResponse.json({ error: "Error deleting item" }, { status: 500 });
  }
}
