import fileSystemManager from './../manager/fileSystem/fileSystem.manager';
import { getBodyHash, getRequestConfig, manageHeader, manageQueryParams } from '../utils/request.utils';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { Handler } from 'express';
import { BodyResponseModel } from '../types/model/bodyResponse.model';
import { existsSync, promises, writeFileSync } from 'fs';
import { logger } from '../utils/logger';

export const getLocalCache: Handler = async (req, res) => {
    const fsManager = new fileSystemManager('Get');
    try {
        const body = await baseRequestHandler(req, 'get', fsManager, false);
        return res.status(200).send(body);
    } catch (e) {
        let err = {};
        // Tutto è un error. Need the if guard to shout up the linter because 'e' is any|unknown at the beginning
        if (e instanceof Error) {
            err = {
                msg: e.message,
                type: e.constructor.name,
            };
        }
        if (e instanceof AxiosError) {
            Object.assign(err, {
                axiosMethod: e.config.method,
                params: e.config.params,
            });
        }
        return res.status(500).send(err);
    }
};

export const postLocalCache: Handler = async (req, res) => {
    const fsManager = new fileSystemManager('Post');
    try {
        const body = await baseRequestHandler(req, 'post', fsManager);
        return res.status(200).send(body);
    } catch (e) {
        return res.status(500).send({ error: e });
    }
};

export const putLocalCache: Handler = async (req, res) => {
    const fsManager = new fileSystemManager('Put');
    try {
        const body = await baseRequestHandler(req, 'put', fsManager);
        return res.status(200).send(body);
    } catch (e) {
        return res.status(500).send({ error: e });
    }
};

export const patchLocalCache: Handler = async (req, res) => {
    const fsManager = new fileSystemManager('Patch');
    try {
        const body = await baseRequestHandler(req, 'patch', fsManager);
        return res.status(200).send(body);
    } catch (e) {
        return res.status(500).send({ error: e });
    }
};

const baseRequestHandler = async (req: any, axiosCall: string, fsManager: fileSystemManager, hashBody = true) => {
    const params = req.params;
    const query = req.query;

    const headers: { [key: string]: string } = manageHeader(req);
    const requestConfig = getRequestConfig(headers, query);

    const sanitizedPath = fsManager.sanitizePath(req.path, 1);
    const noCache = sanitizedPath.noCache;
    const directoryPath = sanitizedPath.finalPath;

    const fileName = manageQueryParams(query);
    let currentFile = '';
    if (hashBody) {
        const bodyHash = await getBodyHash(JSON.stringify(req.body));
        currentFile = directoryPath + '/' + fileName + '_' + bodyHash + '.json';
    } else {
        currentFile = directoryPath + '/' + fileName + '.json';
    }

    const successResponseBody = new BodyResponseModel();

    if (!noCache && existsSync(directoryPath) && existsSync(currentFile)) {
        await promises.readFile(currentFile).then((res) => {
            successResponseBody.data = JSON.parse(res.toString());
        });
        successResponseBody.filenameCached = currentFile;
        successResponseBody.message = "here's you cached data";
        successResponseBody.cache = true;
    } else {
        const fetch = await getServerResponse(
            axiosCall,
            fsManager.sanitizeUrl(`https:/${params[0]}`),
            req.body,
            requestConfig
        );
        promises.mkdir(directoryPath, { recursive: true }).then((_) => {
            if (!noCache) writeFileSync(currentFile, JSON.stringify(fetch.data));
        });
        successResponseBody.data = fetch.data;
        successResponseBody.message = "here's the fetched data";
        successResponseBody.cache = false;
        successResponseBody.filenameCached = currentFile;
    }
    return successResponseBody;
};

/**
 * @description Pass the generalized request to the correct endpoint with Axios.
 * @param type
 * @param url
 * @param body
 * @param requestConfig
 * @throws Error on axios error
 */
const getServerResponse = (type: string, url: string, body: string, requestConfig: AxiosRequestConfig) => {
    switch (type.toUpperCase()) {
        case 'GET':
            return axios.get(url, requestConfig);
        case 'POST':
            return axios.post(url, body, requestConfig);
        case 'PATCH':
            return axios.patch(url, body, requestConfig);
        case 'PUT':
            return axios.put(url, body, requestConfig);
        case 'DELETE':
            return axios.delete(url, requestConfig);
        default:
            throw new InvalidProtocol(`Invalid request: ${type}`);
    }
};

class InvalidProtocol extends Error {
    constructor(message: string) {
        super(message);

        // assign the error class name in your custom error (as a shortcut)
        this.name = this.constructor.name;

        // capturing the stack trace keeps the reference to your error class
        Error.captureStackTrace(this, this.constructor);
    }
}
