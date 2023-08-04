import mysql from 'mysql2/promise';
import { RowDataPacket } from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'claud',
  database: 'Chek',
  port: 3306,
});

export default pool;
export { RowDataPacket };