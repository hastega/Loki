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

export const getRedisCache: Handler = async (req, res) => {
    // await redisClient.connect()

    
    const params = req.params
    const query = req.query
    const headers = req.headers
    
    const config: AxiosRequestConfig<any> = {
        // headers: {
        //             'Accepts': 'application/json',
        //             // 'X-CMC_PRO_API_KEY': process.env.CMCAPIKEY as string
        //             'x-cmc_pro_api_key': '-'
        //         },
        headers: {
            // Accepts: 'application/json',
            // // 'X-CMC_PRO_API_KEY': '-',
            // 'user-agent': 'Thunder Client (https://www.thunderclient.com)',
            // 'x-cmc_pro_api_key': '-',
            // // 'accept-encoding': 'gzip, deflate, br',
            // // host: 'localhost:4201',
            // // connection: 'close'
        },
        params: query
    }
    
    Object.entries(headers).forEach(([key, value]) => {
        if (config.headers != undefined) {
            config.headers[key] = (value as string)
        }
    });
    
    // const config = {
    //     
    //     params: {
    //         'start': '1',
    //         'limit': '1',
    //     }
    // }

    console.log(config)

    const fetch = await axios.get(`https:/${params[0]}`, config).then(res => console.log(res.data))
    .catch(err => console.log(err.response.data));


}