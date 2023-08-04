"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const pool = promise_1.default.createPool({
    host: 'desafiochek.cvh7gduuoj7i.us-east-2.rds.amazonaws.com',
    user: 'admin',
    password: '12345678',
    database: 'Chek',
    port: 3306,
});
exports.default = pool;
