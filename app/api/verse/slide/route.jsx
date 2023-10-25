import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { NextResponse } from "next/server";

let db = null;

export async function POST(req, res) {
  const data = await req.json();
  const { direction, from, version, compare, take } = data;
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
    `SELECT v.*, compare.t as compared, b.title_short 
     FROM ${version} v 
     LEFT JOIN ${compare} compare on v.id = compare.id
     LEFT JOIN book_info b 
       ON v.b = b.\`order\` 
     WHERE v.id ` +
      comp +
      " " +
      from +
      ` ORDER BY v.id ` +
      dir +
      ` LIMIT ?`,
    [take]
  );

  return NextResponse.json({
    verse,
  });
}
