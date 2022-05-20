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
import * as redis from 'redis';
import config from "config";


const proxyTarget = "http://localhost:3000";

const app = express();
const appProxy = httpProxy.createProxyServer();
const redisClient = redis.createClient({
    socket: {
        // port: config.get<number>("redis.port"),
        // host: config.get<string>('redis.hostname')
        port: 6379,
        host: 'localhost'
    }
});

redisClient.on("error", (error) => {
    console.error(error)
})


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

app.get('/protected', checkUser, (_req, res) => {
    res.send('protected route');
})

//cacheing 

app.get('/cmc', async (req, res) => {
    await redisClient.connect();

    const config = {
        headers: {
            'Accepts': 'application/json',
            'X-CMC_PRO_API_KEY': process.env.CMCAPIKEY as string
        },
        params: {
            'start': '1',
            'limit': '1000',
        }
    }

    try {
        const requestName = "listings";

        let listings = await redisClient.get(requestName)

        if (listings) {
            return res.status(200).send({
                error: false,
                message: "here/'s the cache data",
                data: listings
            })
            console.log(listings);

        } else {
            const recipe = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', config);

            redisClient.setEx(requestName, 1440, JSON.stringify(recipe.data))

            return res.status(200).send({
                error: false,
                data: recipe.data
            })
        }

    } catch (error) {
        console.log(error);
    } finally {
        redisClient.quit()
    }
});

app.get('/', (_req, res) => {
    res.send('index')
})

app.use((_req, res) => {
    res.status(404).send('404: Page Not Found!');
})

export default app
