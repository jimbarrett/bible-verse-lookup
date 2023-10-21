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

  const versions = await db.all("SELECT * FROM bible_version_key");

  return NextResponse.json({
    versions,
  });
}
