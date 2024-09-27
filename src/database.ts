import mysql, {
  FieldPacket,
  ResultSetHeader,
  RowDataPacket,
} from "mysql2/promise";

import config from "../config.json";
import { TABLE_EXISTS } from "./queries";

interface IDatabaseSelectResult {
  result: boolean;
  value: [RowDataPacket[], FieldPacket[]] | string;
}

export async function select<T>(
  sql: string,
  values: any[] = [],
): Promise<IDatabaseSelectResult> {
  try {
    const connection = await mysql.createConnection(config.database);
    const value = await connection.execute<RowDataPacket[]>(sql, values);
    await connection.end();

    return {
      result: true,
      value,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        result: false,
        value: error.message,
      };
    }

    if (typeof error === "string") {
      return {
        result: false,
        value: error,
      };
    }

    return {
      result: false,
      value: "An error occured",
    };
  }
}

interface IDatabaseInsertResult {
  result: boolean;
  value: [ResultSetHeader, FieldPacket[]] | string;
}

export async function insert<T>(
  sql: string,
  values: any[] = [],
): Promise<IDatabaseInsertResult> {
  try {
    const connection = await mysql.createConnection(config.database);
    const value = await connection.execute<ResultSetHeader>(sql, values);
    await connection.end();

    return {
      result: true,
      value,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        result: false,
        value: error.message,
      };
    }

    if (typeof error === "string") {
      return {
        result: false,
        value: error,
      };
    }

    return {
      result: false,
      value: "An error occured",
    };
  }
}

export async function tableExists(tableName: string): Promise<boolean> {
  const { result, value } = await select(TABLE_EXISTS, [
    config.database.database,
    tableName,
  ]);

  if (result === true && typeof value !== "string") {
    const [rows] = value;
    return rows.length === 1;
  }

  return false;
}
