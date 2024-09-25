import mysql, { ConnectionOptions, FieldPacket, QueryResult } from 'mysql2/promise';

const configuration: ConnectionOptions = {
    user: 'uni',
    password: 'password',
    database: 'uni',
}

export async function query(sql: string, values: any = undefined): Promise<[QueryResult, FieldPacket[]]> {
    const connection = await mysql.createConnection(configuration);
    const result =  await connection.execute(sql, values);
    await connection.end();
    return result;
}