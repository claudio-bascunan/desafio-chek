import mysql from 'mysql2/promise';
import { RowDataPacket } from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'desafiochek.cvh7gduuoj7i.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: '12345678',
  database: 'Chek',
  port: 3306,
});

export default pool;
export { RowDataPacket };