import axios, { AxiosRequestConfig } from 'axios';
import https from 'https';
import { Handler } from 'express';
import { existsSync, promises, writeFileSync, unlinkSync, rmdirSync, readdirSync } from 'fs';
import config from 'config';

export const getLocalCache: Handler = async (req, res) => {
    let params = req.params;
    const query = req.query;
    let path = req.path;
    let noCache = false;
    if (path.includes("nocache")) {
        noCache = true;
        path = path.substring(8);
        params[0] = params[0].substring(8);
    }
    console.log(params[0], path, query)

    const headers: { [key: string]: string } = {};

    req.appVarHeaders?.forEach((selectedHeader, i) =>
        req.rawHeaders.forEach((requestHeader, j) => {
            if (selectedHeader.toLowerCase() == requestHeader.toLowerCase()) {
                headers[(req.appVarHeaders as string[])[i]] = req.rawHeaders[j + 1];
            }
        })
    );

    const requestConfig: AxiosRequestConfig = {
        headers: headers,
        params: query,
    };

    const httpsAgent = {
        httpsAgent: new https.Agent({
            rejectUnauthorized: false,
        }),
    };

    config.get<boolean>('localDatabase.rejectUnauthorized') ? Object.assign(requestConfig, httpsAgent) : null;

    const splittedPath = path.split('/');
    splittedPath.shift();

    const baseUrl = splittedPath.shift() as string;

    const fileName = Object.entries(query)
        .map((p) => p.join('_'))
        .join('_');
    const folderPath = splittedPath.join('/');

    console.log({ baseUrl });
    let responseData = null;
    let messageData: string;
    let cacheData: boolean;

    try {
        if (existsSync(baseUrl) && existsSync(baseUrl + '/' + folderPath + '/' + fileName + '.json')) {
            await promises.readFile(baseUrl + '/' + folderPath + '/' + fileName + '.json').then((res) => {
                responseData = JSON.parse(res.toString());
            });

            messageData = "here/'s you cached data";
            cacheData = true;
        } else {
            const fetch = await axios.get(`https:/${params[0]}`, requestConfig);

            promises
                .mkdir(baseUrl + '/' + folderPath, { recursive: true })
                .then((_) => {
                    if (!noCache) {
                        writeFileSync(baseUrl + '/' + folderPath + '/' + fileName + '.json', JSON.stringify(fetch.data))
                    }
                });

            responseData = fetch.data;
            messageData = "here/'s the fetched data";
            cacheData = false;
        }

        return res.status(200).send({
            error: false,
            cache: cacheData,
            message: messageData,
            data: responseData,
        });
    } catch (error) {
        return res.status(200).send({
            error: true,
            message: error,
        });
    }
};

export const postLocalCache: Handler = async (req, res) => {
    const messageData = 'Just a POST response, data cointains the request body sent, nothing happened';
    const cacheData = false;

    return res.status(200).send({
        error: false,
        cache: cacheData,
        message: messageData,
        data: req.body,
    });
};

export const putLocalCache: Handler = async (req, res) => {
    const messageData = 'Just a PUT response, data cointains the request body sent, nothing happened';
    const cacheData = false;

    return res.status(200).send({
        error: false,
        cache: cacheData,
        message: messageData,
        data: req.body,
    });
};

export const patchLocalCache: Handler = async (req, res) => {
    const messageData = 'Just a PATCH response, data cointains the request body sent, nothing happened';
    const cacheData = false;

    return res.status(200).send({
        error: false,
        cache: cacheData,
        message: messageData,
        data: req.body,
    });
};

export const deleteLocalCache: Handler = async (_, res) => {
    const messageData = 'Just a DELETE response, nothing happened';
    const cacheData = false;

    return res.status(200).send({
        error: false,
        cache: cacheData,
        message: messageData,
    });
};

const recursiveForceRemove = (path: string) => {
    const content = readdirSync(path, { withFileTypes: true });
    content.forEach((f) => {
        if (f.isDirectory()) {
            recursiveForceRemove(`${path}/${f.name}`);
        } else {
            unlinkSync(`${path}/${f.name}`)
        }
    });
    rmdirSync(path);
}

export const forceDeleteCachedData: Handler = async (req, res) => {
    const query = req.query;
    const path = req.path;

    const splittedPath = path.split('/');
    splittedPath.shift();
    splittedPath.shift();

    const baseUrl = splittedPath.shift() as string;

    const fileName = Object.entries(query)
        .map((p) => p.join('_'))
        .join('_');
    const folderPath = splittedPath.join('/');

    let messageData = 'Cache read';

    recursiveForceRemove(folderPath);

    const cacheData = false;

    return res.status(200).send({
        error: false,
        cache: cacheData,
        message: messageData,
    });
}

export const deleteCachedData: Handler = async (req, res) => {
    const query = req.query;
    const path = req.path;

    const splittedPath = path.split('/');
    splittedPath.shift();
    splittedPath.shift();

    const baseUrl = splittedPath.shift() as string;

    const fileName = Object.entries(query)
        .map((p) => p.join('_'))
        .join('_');
    const folderPath = splittedPath.join('/');

    let messageData = 'Cache cleared';

    if (existsSync(baseUrl) && existsSync(baseUrl + '/' + folderPath + '/' + fileName + '.json')) {
        unlinkSync(baseUrl + '/' + folderPath + '/' + fileName + '.json');
        messageData = 'File removed';
    } else if (existsSync(baseUrl) && existsSync(baseUrl + '/' + folderPath)) {
        if (!readdirSync(baseUrl + '/' + folderPath).length) {
            rmdirSync(baseUrl + '/' + folderPath);
            messageData = 'Path removed';
        } else {
            messageData = 'File not found, path not empty';
        }
    } else {
        messageData = 'Nothing to clear';
    }

    const cacheData = false;

    return res.status(200).send({
        error: false,
        cache: cacheData,
        message: messageData,
    });
};
