import axios, { AxiosRequestConfig } from "axios";
import { Handler } from "express";

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

    try {
        if (false) {
        //if path of request exist in path file 
        //Read file from system

        } else {
            const splittedPath = path.split('/')
            splittedPath.shift();

            const baseUrl = splittedPath.shift();

            console.log({baseUrl, splittedPath});

            const fetch = await axios.get(`https:/${params[0]}`, config)

            return res.status(200).send({
                error: false,
                message: "here/'s the fetched data",
                data: fetch.data
            })
            
        }

    } catch (error) {
        console.log(error);

    } finally {
    }

}