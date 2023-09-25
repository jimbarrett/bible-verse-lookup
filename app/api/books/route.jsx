import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { NextResponse } from "next/server";

let db = null;

export async function GET(req, res) {
  if (!db) {
    db = await open({
      filename: "./dbs/bible-sqlite.db",
      driver: sqlite3.Database,
    });
  }

  const items = await db.all("SELECT * FROM book_info");

  return NextResponse.json({
    items,
  });
}
