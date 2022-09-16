import { Handler } from "express";
import * as redis from 'redis';
import config from "config";
import axios, { AxiosRequestConfig } from "axios";


const redisClient = redis.createClient({
    socket: {
        port: config.get<number>("redis.port"),
        host: config.get<string>('redis.hostname')
    }
});

redisClient.on("error", (error) => {
    console.error(error)
})


export const setHeader = (headers: string[]): Handler => {
    return (req, _, next) => {
        req.appVarHeaders = headers;
        next();
    }
}

export const getRedisCache: Handler = async (req, res) => {
    const params = req.params;
    const query = req.query;
    const headers: { [key: string]: string } = {};

    req.appVarHeaders?.forEach((selectedHeader, i) => req.rawHeaders.forEach((requestHeader, j) => {
        if (selectedHeader.toLowerCase() == requestHeader.toLowerCase()) {
            headers[(req.appVarHeaders as string[])[i]] = req.rawHeaders[j + 1];
        }
    }));

    const config: AxiosRequestConfig = {
        headers: headers,
        params: query
    };

    await redisClient.connect();

    try {
        const requestName = params[0] + JSON.stringify(query);

        const requestedCache = await redisClient.get(requestName)

        if (requestedCache) {
            return res.status(200).send({
                error: false,
                message: "here/'s the cache data",
                data: JSON.parse(requestedCache)
            });

        } else {

            const fetch = await axios.get(`https:/${params[0]}`, config)

            redisClient.setEx(requestName, 1440, JSON.stringify(fetch.data))

            return res.status(200).send({
                error: false,
                message: "here/'s the fetched data",
                data: fetch.data
            })
        }

    } catch (error) {
        console.log(error);

    } finally {
        redisClient.quit();
    }

}
