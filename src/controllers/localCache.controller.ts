import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import https from 'https';
import { Handler } from 'express';
import { existsSync, promises, writeFileSync, unlinkSync } from 'fs';
import config from 'config';
import { manageHeader, manageQueryParams, splitPath, recursiveRemove } from '../utils/request.utils';
import { ClearType } from '../types/enums/ClearType.enum';

export const getLocalCache: Handler = async (req, res) => {
    const params = req.params;
    const query = req.query;
    let path = req.path;
    let noCache = false;
    if (path.includes('nocache')) {
        noCache = true;
        path = path.substring(8);
        params[0] = params[0].substring(8);
    }

    const headers: { [key: string]: string } = manageHeader(req);

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

    const splittedPath = splitPath(path, 1);
    const baseUrl = splittedPath.shifted[0];

    const fileName = manageQueryParams(query);
    const folderPath = splittedPath.folderPath;

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

            promises.mkdir(baseUrl + '/' + folderPath, { recursive: true })
            .then((_) => {
                if (!noCache) {
                    writeFileSync(baseUrl + '/' + folderPath + '/' + fileName + '.json', JSON.stringify(fetch.data));
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
    } catch (error: any) {
        const isAxiosError = error instanceof AxiosError;
        const code = isAxiosError ? error.response?.status || 500 : 500;
        return res.status(code).send({
            error: true,
            message: isAxiosError ? error.message : error,
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

export const deleteCachedData: Handler = async (req, res) => {
    const query = req.query;
    const path = req.path;

    const splittedPath = splitPath(path, 3);

    const type = splittedPath.shifted[1];
    const baseUrl = splittedPath.shifted[2];

    const fileName = manageQueryParams(query);
    const folderPath = splittedPath.folderPath;

    let messageData = 'Cache cleared';

    switch(type) {
        case ClearType.FOLDER:
            if (existsSync(baseUrl) && existsSync(`${baseUrl}/${folderPath}`)) {
                recursiveRemove(`${baseUrl}/${folderPath}`);
                messageData = `Force deleted ${folderPath}`;
            } else {
                messageData = `${folderPath} not found`;
            }
        break;
        case ClearType.CONTENT:
            if (existsSync(baseUrl) && existsSync(baseUrl + '/' + folderPath + '/' + fileName + '.json')) {
                unlinkSync(baseUrl + '/' + folderPath + '/' + fileName + '.json');
                messageData = 'File removed';
            } else if (existsSync(baseUrl) && existsSync(baseUrl + '/' + folderPath)) {
                messageData = 'File not found';
            } else {
                messageData = 'Nothing to clear';
            }
        break;
    }

    const cacheData = false;

    return res.status(200).send({
        error: false,
        cache: cacheData,
        message: messageData,
    });
};
