import 'dotenv/config'
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from 'cookie-parser';

import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { options } from "./swaggerOptions";

import usersRoutes from "./routes/v1/users.routes";
import authRoutes from "./routes/v1/auth.routes";
import redisRoutes from './routes/v1/redis.routes';
import proxyRoutes from "./routes/v1/proxy.routes";
import localCacheRoutes from './routes/v1/localCache.routes';

import { checkUser } from './utils/jwtAuth.utils';

import axios from 'axios';
import https from "https";
import WebSocket from 'ws';
import config from 'config';

if (process.env.NODE_ENV === 'development') {
    const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
    });

    axios.defaults.httpsAgent = httpsAgent;
    console.log(process.env.NODE_ENV, `RejectUnauthorized is disabled.`);
}

const wss = new WebSocket.Server({ port: Number(process.env.WSPORT) || 8080 });

wss.on('connection', ws => {
    ws.on('message', message => {
        console.log('Recieved Meessage =>', message);
    })

    if (!config.get<boolean>("websocket.setInterval")) return ws.send(config.get<string>("websocket.responseMessage"))

    setInterval(
        () => ws.send(config.get<string>("websocket.responseMessage")),
        5000
    );
})

const app = express();

app.set("port", process.env.JPORT || 3000);

app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser())
app.use(express.json());

const specs = swaggerJSDoc(options);

app.use('/', usersRoutes);
app.use('/', authRoutes);
app.use('/lcache', localCacheRoutes);
app.use('/proxy', proxyRoutes);
app.use('/redis', redisRoutes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

app.get('/protected', checkUser, (_req, res) => {
    res.send('protected route');
});

app.get('/', (_req, res) => {
    res.send('index')
})

app.use((_req, res) => {
    res.status(404).send('404: Page Not Found!');
})

export default app
