import axios, { AxiosRequestConfig } from "axios";
import { Handler } from "express";
import { existsSync, promises, writeFileSync } from 'fs'


export const getLocalCache: Handler = async (req, res) => {
    const params = req.params;
    const query = req.query;
    const path = req.path;

    let headers: { [key: string]: string } = {};

    req.appVarHeaders?.forEach((selectedHeader, i) => req.rawHeaders.forEach((requestHeader, j) => {
        if (selectedHeader.toLowerCase() == requestHeader.toLowerCase()) {
            headers[(req.appVarHeaders as string[])[i]] = req.rawHeaders[j + 1];
        }
    }));

    const config: AxiosRequestConfig<any> = {
        headers: headers,
        params: query
    };

    
    const splittedPath = path.split('/')
    splittedPath.shift();
    
    const baseUrl = splittedPath.shift() as string;
    
    const fileName = Object.entries(query).map((p) => p.join('_')).join('_');
    const folderPath = splittedPath.join('/');
    
    console.log({baseUrl})
    let responseData: any;
    let messageData: string;
    let cacheData: boolean;

    try {
        if (existsSync(baseUrl) && existsSync(baseUrl + '/' + folderPath + '/' + fileName + '.json')) {
            await promises.readFile(baseUrl + '/' + folderPath + '/' + fileName + '.json')
                .then(res => {
                    responseData = JSON.parse(res.toString());
                });

            messageData = "here/'s you cached data";
            cacheData = true;
        } else {
            const fetch = await axios.get(`https:/${params[0]}`, config);

            promises.mkdir(baseUrl + '/' + folderPath, { recursive: true }).then(_ =>
                writeFileSync(baseUrl + '/' + folderPath + '/' + fileName + '.json', JSON.stringify(fetch.data))
            );

            responseData = fetch.data;
            messageData = "here/'s the fetched data"
            cacheData = false;

        }

        return res.status(200).send({
            error: false,
            cache: cacheData,
            message: messageData,
            data: responseData
        })

    } catch (error) {
        return res.status(200).send({
            error: true,
            message: error
        })

    }

}

export const postLocalCache: Handler =async (req, res) => {

    let messageData: string;
    let cacheData: boolean;

    return res.status(200).send({
        error: false,
        cache: false,
        message: 
    })
    
}