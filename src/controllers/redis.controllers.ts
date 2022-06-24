import { Handler } from "express";
import * as redis from 'redis';
import config from "config";
import axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios";
import https from "https"


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
    console.log(params, query, headers);


}

export const setHeader = (headers: string[]): Handler => {
    return (req, res, next) => {
        req.appVarHeaders = headers;

        next();
    }
} 

export const getRedisCache: Handler = async (req, res) => {

    // await redisClient.connect()
    console.log("myHeaders", req.appVarHeaders)
    
    const params = req.params
    const query = req.query
    const headers = req.headers
    

    console.log('headers', headers)
    console.log('req.appVarHeaders', req.appVarHeaders)

    // const config: AxiosRequestConfig<any> = {
    //     headers: req.headers as unknown as AxiosRequestHeaders,
    //     params: query
    // }
    
    const config = {
        headers: {
            'Accepts': 'application/json',
            'X-CMC_PRO_API_KEY': process.env.CMCAPIKEY as string
        },
        params: {
            'start': '1',
            'limit': '5',
        }
    }
    // Object.entries(headers).forEach(([key, value]) => {
    //     if (config.headers != undefined) {
    //         config.headers[key] = (value as string)
    //     }
    // });
    

    // const config = {
        
    //     params: {
    //         'start': '1',
    //         'limit': '1',
    //     }
    // }



    console.log(config)

    console.log(params[0])
    const fetch = await axios.get(`https:/${params[0]}`, config)

    return res.status(200).send({
        error: false,
        data: fetch.data
    })


}