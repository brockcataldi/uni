import mysql, {
  FieldPacket,
  ResultSetHeader,
  RowDataPacket,
} from "mysql2/promise";

import config from "../config.json";

/**
 * IDatabaseSelectResult
 *
 * @param result {boolean} whether or not the query ran into an error
 * @param value {string | [RowDataPacket[], FieldPacket[]]} if there's an error, return the error if not return the values
 */
interface IDatabaseSelectResult {
  result: boolean;
  value: [RowDataPacket[], FieldPacket[]] | string;
}

/**
 * A function meant for select statements, handles return values cleanly.
 *
 * @param sql {string} SELECT statement
 * @param values {any[]} Values for placeholders
 * @returns IDatabaseSelectResult
 */
export async function select(
  sql: string,
  /* eslint-disable  @typescript-eslint/no-explicit-any */
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

/**
 * IDatabaseInsertResult
 *
 * @param result {boolean} whether or not the query ran into an error
 * @param value {string | [ResultSetHeader, FieldPacket[]]} if there's an error, return the error if not return the values
 */
interface IDatabaseInsertResult {
  result: boolean;
  value: [ResultSetHeader, FieldPacket[]] | string;
}

/**
 * A function meant for insert statements, handles return values cleanly.
 *
 * @param sql {string} INSERT or UPDATE statement
 * @param values {any[]} Values for placeholders
 * @returns IDatabaseInsertResult
 */
export async function upsert(
  sql: string,
  /* eslint-disable  @typescript-eslint/no-explicit-any */
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

/**
 * Checks if a table exists
 *
 * @param tableName {string} the table to query
 * @returns Promise<boolean>
 */
export async function tableExists(tableName: string): Promise<boolean> {
  const { result, value } = await select(
    `
    SELECT * 
    FROM information_schema.tables
    WHERE table_schema = ? 
    AND table_name = ?
    LIMIT 1;
`,
    [config.database.database, tableName],
  );

  if (result === true && typeof value !== "string") {
    const [rows] = value;
    return rows.length === 1;
  }

  return false;
}
