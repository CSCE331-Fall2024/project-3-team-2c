import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM panda_employees");
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching employees" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, role } = body;

    await pool.query(
      "INSERT INTO panda_employees (name, email, role) VALUES ($1, $2, $3)",
      [name, email, role],
    );

    return NextResponse.json({ message: "Employee added successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error adding employee" },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, email, role } = body;

    await pool.query(
      "UPDATE panda_employees SET name = $1, email = $2, role = $3 WHERE id = $4",
      [name, email, role, id],
    );

    return NextResponse.json({ message: "Employee updated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error updating employee" },
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
        { error: "Employee ID not provided" },
        { status: 400 },
      );
    }

    const result = await pool.query(
      "DELETE FROM panda_employees WHERE id = $1",
      [id],
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error deleting employee" },
      { status: 500 },
    );
  }
}
