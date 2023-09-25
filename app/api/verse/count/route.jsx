import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { NextResponse } from "next/server";

let db = null;

export async function POST(req, res) {
  const data = await req.json();
  const { b, c } = data;
  if (!db) {
    db = await open({
      filename: "./dbs/bible-sqlite.db",
      driver: sqlite3.Database,
    });
  }

  const results = await db.all(
    "SELECT MAX(v) as count FROM t_kjv WHERE b=? AND c=?",
    [b, c]
  );

  return NextResponse.json({
    count: results[0].count,
  });
}
