
import { Pool } from "pg";
import { NextResponse } from "next/server";

// Use connection string directly
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use your environment variable here
});

export async function GET() {
  try {
    // Query to get all ingredients
    const result = await pool.query("SELECT * FROM panda_menu_items");
    const items = result.rows;
    const maxID = await pool.query("SELECT MAX(id) AS max_id FROM panda_menu_items");
    return NextResponse.json({items, maxID});
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
    try {
      // Parse JSON body from the request
      const {name, type } = await request.json();
  
      // Validate the data (make sure required fields are provided)
      if (!name || !type) {
        return NextResponse.json(
          { error: "Missing required fields: 'name' and 'type'" },
          { status: 400 },
        );
      }
  
      // Insert data into the panda_menu_items table
      const result = await pool.query(
        "INSERT INTO panda_menu_items (name, type) VALUES ($1, $2) RETURNING *",
        [name, type]
      );
  
      return NextResponse.json(result.rows[0]);
    } catch (error) {
      console.error("Error inserting menu item:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 },
      );
    }
  }

  export async function DELETE(request: Request) {
    try {
      const id = await request.json();
    
      // Validate the id
      if (!id) {
        return NextResponse.json(
          { error: "Missing required field: 'id'" },
          { status: 400 }
        );
      }
  
      const result = await pool.query(
        "DELETE FROM panda_menu_items WHERE id = $1 RETURNING *",
        [id]
      );
  
      // Check if the row was deleted
      // rowCount returns the number of rows affected by the mutation
      if (result.rowCount === 0) {
        return NextResponse.json(
          { error: "Item not found" },
          { status: 404 }
        );
      }
  
      return NextResponse.json({ message: "Item deleted", deletedItem: result.rows[0] });
    } catch (error) {
      console.error("Error deleting menu item:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }

  export async function PUT(request: Request) {
    try {
      const { name, id } = await request.json();
  
      // Update the item in the database
      const result = await pool.query(
        "UPDATE panda_menu_items SET name = $1 WHERE id = $2 RETURNING *",
        [name, id]
      );
  
      if (result.rowCount === 0) {
        return NextResponse.json(
          { error: "Item not found" },
          { status: 404 }
        );
      }
  
      return NextResponse.json(
        { message: "Item updated successfully", item: result.rows[0] },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error updating item:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }