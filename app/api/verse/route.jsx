import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { NextResponse } from "next/server";

let db = null;

export async function POST(req, res) {
  const data = await req.json();
  const { b, c, v, version, take } = data;
  if (!db) {
    db = await open({
      filename: "./dbs/bible-sqlite.db",
      driver: sqlite3.Database,
    });
  }

  const verse = await db.all(
    `SELECT v.*, b.title_short 
     FROM ${version} v 
     LEFT JOIN book_info b 
       ON v.b = b.\`order\` 
     WHERE v.b=? AND v.c=? AND v.v>=? LIMIT ?`,
    [b, c, v, take]
  );

  return NextResponse.json({
    verse,
  });
}
