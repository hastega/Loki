import 'dotenv/config'
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from 'cookie-parser';
import { Router } from "express";


import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { options } from "./swaggerOptions";

import usersRoutes from "./routes/v1/users.routes"
import authRoutes from "./routes/v1/auth.routes"
import { checkUser } from './utils/jwtAuth.utils';

const app = express();

app.set("port", process.env.JPORT || 3000);

app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser())
app.use(express.json());

const specs = swaggerJSDoc(options);


app.use('/', usersRoutes);
app.use('/', authRoutes)
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

app.get('/protected', checkUser, (req, res) => {
    res.send('protected route')
})

app.get('/', (req, res) => {
    res.send('index')
})

app.use((req, res) => {
    res.status(404).send('404: Page Not Found!')
})

export default app
