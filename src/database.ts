import mysql, { FieldPacket, RowDataPacket } from "mysql2/promise";

import config from "../config.json";
import { TABLE_EXISTS } from "./queries";

interface IDatabaseResult {
  result: boolean;
  value: [RowDataPacket[], FieldPacket[]] | string;
}

export async function query(
  sql: string,
  values: any[] = [],
): Promise<IDatabaseResult> {
  try {
    const connection = await mysql.createConnection(config.database);
    const value = await connection.execute<RowDataPacket[]>(sql, values);
    await connection.end();

    return {
      result: true,
      value,
    };
  } catch (error) {
    console.error(error);
    return {
      result: false,
      value: "There was a database error",
    };
  }
}

export async function tableExists(tableName: string): Promise<boolean> {
  const { result, value } = await query(TABLE_EXISTS, [
    config.database.database,
    tableName,
  ]);

  if (result === true && typeof value !== "string") {
    const [rows] = value;
    return rows.length === 1;
  }

  return false;
}
