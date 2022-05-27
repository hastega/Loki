import { Handler } from "express";
import * as redis from 'redis';
import config from "config";
import axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios";



const redisClient = redis.createClient({
    socket: {
        port: config.get<number>("redis.port"),
        host: config.get<string>('redis.hostname')
    }
});

redisClient.on("error", (error) => {
    console.error(error)
})


export const logMiddleware: Handler = (req, res) => {
    const params = req.params
    const query = req.query
    const headers = req.headers
    console.log( params, query, headers);

    
}

export const getRedisCache: Handler = async (req, res) => {
    // await redisClient.connect()

    const params = req.params
    const query = req.query
    const headers = req.headers
    
    const config: AxiosRequestConfig<any> = {
        headers: {}, 
        params: query
    }

    for (const h in headers) {
        console.log()
        Object.assign(config.headers, `{${h}: ${headers[h]}}`)
    }

    console.log( headers);

    console.log( config);

    // const fetch = await axios.get(`https:/${params[0]}`, config).then(res => console.log(res.data))
    // .catch(err => console.log(err));

    
}