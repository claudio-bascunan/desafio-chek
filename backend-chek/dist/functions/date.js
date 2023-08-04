"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getDatetime() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();
    const datetime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return datetime;
}
exports.default = getDatetime;
