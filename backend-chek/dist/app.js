"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const resetPasswordController_1 = require("./controllers/resetPasswordController");
const changePasswordController_1 = require("./controllers/changePasswordController");
const registerController_1 = require("./controllers/registerController");
const verifyEmailController_1 = require("./controllers/verifyEmailController");
const loginController_1 = require("./controllers/loginController");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// Se definen los endpoints con sus respectivas funciones
app.post('/api/reset-password', resetPasswordController_1.resetPassword);
app.post('/api/change-password', changePasswordController_1.changePassword);
app.post('/api/register', registerController_1.register);
app.get('/api/verify-email', verifyEmailController_1.verifyEmail);
app.post('/api/login', loginController_1.login);
const port = 3000;
// Se inicia el servidor en el puerto 3000
app.listen(port, () => {
    console.log('Servidor iniciado');
});
exports.default = app;
