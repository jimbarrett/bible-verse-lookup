import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { NextResponse } from "next/server";

let db = null;

export async function POST(req, res) {
  const data = await req.json();
  const { direction, from } = data;
  let comp = ">",
    dir = "ASC";
  if (direction == "prev") {
    comp = "<";
    dir = "DESC";
  }

  if (!db) {
    db = await open({
      filename: "./dbs/bible-sqlite.db",
      driver: sqlite3.Database,
    });
  }

  const verse = await db.all(
    `SELECT v.*, b.title_short 
     FROM t_kjv v 
     LEFT JOIN book_info b 
       ON v.b = b.\`order\` 
     WHERE v.id ` +
      comp +
      from +
      ` ORDER BY v.id ` +
      dir +
      ` LIMIT 1`
  );

  return NextResponse.json({
    verse: verse[0],
  });
}
