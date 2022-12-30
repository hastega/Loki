import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import swaggerUi from 'swagger-ui-express';

import usersRoutes from './routes/v1/users.routes';
import authRoutes from './routes/v1/auth.routes';
import redisRoutes from './routes/v1/redis.routes';
import proxyRoutes from './routes/v1/proxy.routes';
import localCacheRoutes from './routes/v1/localCache.routes';

import { checkUser } from './utils/jwtAuth.utils';

import axios from 'axios';
import https from 'https';
import WebSocket from 'ws';
import config from 'config';

// Manager
import processEnvManager from './manager/processEnv/processEnv.manager';
import { logger } from './utils/logger';

// To discuss
// eslint-disable-next-line @typescript-eslint/no-var-requires
const swaggerDocument = require('./swagger-output.json');

if (processEnvManager.isDevelopment()) {
    axios.defaults.httpsAgent = new https.Agent({ rejectUnauthorized: false });
    logger.info('Development: RejectUnauthorized is disabled.');
}

const wss = new WebSocket.Server({ port: processEnvManager.getWebSocketPort() });

// Reractor with a dedicated config manager?
wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        console.log('Recieved Meessage =>', message);
    });

    if (!config.get<boolean>('websocket.setInterval')) return ws.send(config.get<string>('websocket.responseMessage'));

    setInterval(() => ws.send(config.get<string>('websocket.responseMessage')), 5000);
});

const app = express();

app.set('port', processEnvManager.getLocalDatabasePort());

app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());

app.use('/', usersRoutes);
app.use('/', authRoutes);
app.use('/lcache', localCacheRoutes);
app.use('/proxy', proxyRoutes);
app.use('/redis', redisRoutes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/protected', checkUser, (_req, res) => {
    res.send('protected route');
});

app.get('/', (_req, res) => {
    res.send('index');
});

app.use((_req, res) => {
    res.status(404).send('404: Page Not Found!');
});

export default app;
