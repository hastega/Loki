import 'dotenv/config'
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from 'cookie-parser';
import { Router } from "express";
import httpProxy from "http-proxy"

import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { options } from "./swaggerOptions";

import usersRoutes from "./routes/v1/users.routes"
import authRoutes from "./routes/v1/auth.routes"
import { checkUser } from './utils/jwtAuth.utils';

import axios from 'axios';
import redis from 'redis';
import config from "config";


const proxyTarget = "http://localhost:3000";

const app = express();
const appProxy = httpProxy.createProxyServer();
// const redisClient = redis.createClient({
//     host: config.get<string>("redis.hostname"),
//     port: config.get<number>("redis.port")
//   });

// app.all("/proxy/*", function(req, res) {
//     appProxy.web(req, res, {target: proxyTarget})
//     console.log(req)
// });

app.set("port", process.env.JPORT || 3000);

app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser())
app.use(express.json());

const specs = swaggerJSDoc(options);


app.use('/', usersRoutes);
app.use('/', authRoutes);
// app.use('/cache', cacheRoutes)
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

app.get('/protected', checkUser, (req, res) => {
    res.send('protected route');
})

//cacheing 

app.get('/cmc', async (req,res) => {
    const config = {
        headers: {
            'Accepts': 'application/json',
            'X-CMC_PRO_API_KEY': '05790f06-87eb-4619-85fb-f54e1ca557e5'
        },
        params: {
            'start': '1',
            'limit': '1000',
        }
    }

    try {
        // client.get('common', async (err, recipe) => {})

        const recipe = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', config);
        return res.status(200).send({
            error: false,
            data: recipe.data
        })
    } catch (error) {
        console.log(error);
    }
});

app.get('/', (req, res) => {
    res.send('index')
})

app.use((req, res) => {
    res.status(404).send('404: Page Not Found!');
})

export default app
