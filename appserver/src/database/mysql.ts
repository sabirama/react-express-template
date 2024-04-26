import mysql2 from "mysql2";
import { queryOption } from "../datatypes/types";
import { config } from "dotenv";

config();

export const pool = mysql2.createPool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_DATABASE
});

// Promisify the pool.query function
export const query = (sql: string, values: any[]) => {
    return new Promise<{ results: any, fields: any }>((resolve, reject) => {
        pool.query(sql, values, (error, results, fields) => {
            if (error) {
                return reject(error);
            }
            resolve({ results, fields });
        });
    });
};

export const select = async (table: string, options: queryOption = null) => {
    const { get, where = {}, pageSize, orderBy, order } = options || {};

    const keys = Object.keys(where);
    const sqlWhere = keys.length > 0 ? ` WHERE ${keys.map(key => `${key} = ?`).join(` ${keys.length === 1 ? "" : " AND "} `)}` : '';
    const sqlValues = keys.map(key => where[key]);

    const sqlOrderBy = orderBy && order ? `ORDER BY ${orderBy} ${order}` : '';

    const sqlQuery = `SELECT ${get || "*"} FROM ${table} ${sqlWhere} ${sqlOrderBy} ${pageSize ? ` LIMIT ${pageSize}` : ''}`;

    try {
        const { results, fields } = await query(sqlQuery, sqlValues);
        return { results, fields };
    } catch (error) {
        throw new Error(`Error executing select query: ${error}`);
    }
};

export const insert = async (table: string, data: object) => {
    const dataKeys = Object.keys(data);
    const sqlData = dataKeys.length > 0 ? `(${dataKeys.join(', ')}) VALUES (?)` : '';

    const sqlQuery = `INSERT INTO ${table} ${sqlData}`;

    const sqlDataValues = [dataKeys.map(key => data[key])]; // Wrap data in an array

    try {
        const { results, fields } = await query(sqlQuery, sqlDataValues);
        return { results, fields };
    } catch (error) {
        throw new Error(`Error executing insert query: ${error}`);
    }
};

export const update = async (table: string, id: number, data: object) => {
    const dataKeys = Object.keys(data);
    const sqlSet = dataKeys.length > 0 ? `SET ${dataKeys.map(key => `${key} = ?`).join(', ')}` : '';

    const sqlDataValues = Object.values(data);

    const sqlQuery = `UPDATE ${table} ${sqlSet} WHERE id = ?`;

    try {
        const { results, fields } = await query(sqlQuery, [...sqlDataValues, id]);
        return { results, fields };
    } catch (error) {
        throw new Error(`Error executing update query: ${error}`);
    }
};

export const remove = async (table: string, id: number) => {

    const sqlQuery = `DELETE FROM ${table} WHERE id = ?`;

    try {
        const { results, fields } = await query(sqlQuery, [id]);
        return { results, fields };
    } catch (error) {
        throw new Error(`Error executing delete query: ${error}`);
    }
};

export const create = async (table: string, columns: Array<string>) => {

    const sqlQuery = `CREATE TABLE IF NOT EXISTS ${table} (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        ${columns.join(', ')},
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    )`;

    try {
        const { results, fields } = await query(sqlQuery, []);
        console.log(`table ${table} created...`);
        return { results, fields };
    } catch (error) {
        throw new Error(`Error executing create table query: ${error}`);
    }
};

export const drop = async (table: string) => {

    const sqlQuery = `DROP TABLE IF EXISTS ${table}`;

    try {
        const { results, fields } = await query(sqlQuery, []);
        console.log(`Table ${table} dropped...`);
        return { results, fields };
    } catch (error) {
        throw new Error(`Error executing drop table query: ${error}`);
    }
};