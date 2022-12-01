import axios, { AxiosError } from 'axios';
import { Handler } from 'express';
import { existsSync, promises, writeFileSync, unlinkSync } from 'fs';
import {
    manageHeader,
    manageQueryParams,
    splitPath,
    recursiveRemove,
    getRequestConfig,
    getBodyHash,
    storeResponseFile,
} from '../utils/request.utils';
import { ClearType } from '../properties/localCache.property';
import { ResponseModel } from '../types/model/responseModel';

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

    const requestConfig = getRequestConfig(headers, query);

    const splittedPath = splitPath(path, 1);
    const baseUrl = splittedPath.shifted[0];

    const fileName = manageQueryParams(query);
    const folderPath = splittedPath.folderPath;

    const finalFolder = baseUrl + '/' + folderPath + '/Get';
    const currentFile = finalFolder + '/' + fileName + '.json';

    console.log({ baseUrl });
    let responseData = null;
    let messageData: string;
    let cacheData: boolean;

    try {
        if (existsSync(baseUrl) && existsSync(currentFile)) {
            await promises.readFile(currentFile).then((res) => {
                responseData = JSON.parse(res.toString());
            });

            messageData = "here's you cached data";
            cacheData = true;
        } else {
            const fetch = await axios.get(`https:/${params[0]}`, requestConfig);

            promises.mkdir(finalFolder, { recursive: true }).then((_) => {
                if (!noCache) {
                    writeFileSync(currentFile, JSON.stringify(fetch.data));
                }
            });

            responseData = fetch.data;
            messageData = "here's the fetched data";
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
/**
 * @description function layer that caches (or not)
 * @param req
 * @param res
 */
export const postLocalCache: Handler = async (req, res) => {
    const params = req.params;
    const query = req.query;
    let path = req.path;
    let noCache = false;

    // TODO Da rivedere come implementare la nocache (query params o nel path)
    if (path.includes('nocache')) {
        noCache = true;
        path = path.substring(8);
        params[0] = params[0].substring(8);
    }

    const headers: { [key: string]: string } = manageHeader(req);

    const requestConfig = getRequestConfig(headers, query);

    const splittedPath = splitPath(path, 1);
    const baseUrl = splittedPath.shifted[0];

    const fileName = manageQueryParams(query);
    const folderPath = splittedPath.folderPath;

    let responseData = null;
    let messageData: string | undefined;
    let cacheData: boolean | undefined;

    const bodyHash = await getBodyHash(JSON.stringify(req.body));
    const finalFolder = baseUrl + '/' + folderPath + '/Post';
    const currentFile = finalFolder + '/' + fileName + '_' + bodyHash + '.json';

    // 3 cases
    // - No Cache -> Directly the axios call.
    // - Yes Cache but no file o file is obsolete -> Axios call and cache it
    // - Yes Cache and file exists -> return the chached data

    // Guard that makes the axios call to the endpoint or not.
    let axiosCall = true;

    try {
        // A file is already cached
        if (!noCache && existsSync(baseUrl) && existsSync(currentFile)) {
            const readFileRes: Buffer = await promises.readFile(currentFile);

            responseData = JSON.parse(readFileRes.toString()) as ResponseModel;
            // Check if the response is still good. If true, no need to call the endpoint.
            if (responseData.expiresIn && responseData.expiresIn >= Date.now()) {
                axiosCall = false;
                responseData = responseData.payload;
                messageData = "here's you cached data";
                cacheData = true;
            } else responseData = null; // The cached response is expired.
        }

        // If I need to get the response from the endpoint
        if (axiosCall) {
            const fetch = await axios.post(`https:/${params[0]}`, req.body, requestConfig);
            responseData = fetch.data;
            messageData = "here's the fetched data";
            cacheData = false;
            // If I want to cache the response
            if (!noCache) storeResponseFile(finalFolder, currentFile, fetch.data);
        }

        // Send back the response
        return res.status(200).send({
            error: false,
            cache: cacheData,
            message: messageData,
            data: responseData,
            filenameCached: currentFile,
        });
    } catch (error: any) {
        const code = error instanceof AxiosError ? error.response?.status || 500 : 500;
        return res.status(code).send({
            error: true,
            message: error.message,
        });
    }
};

export const putLocalCache: Handler = async (req, res) => {
    const params = req.params;
    const query = req.query;
    let path = req.path;
    let noCache = false;

    console.log('PUT');

    // TODO Da rivedere come implementare la nocache (query params o nel path)
    if (path.includes('nocache')) {
        noCache = true;
        path = path.substring(8);
        params[0] = params[0].substring(8);
    }

    const headers: { [key: string]: string } = manageHeader(req);

    const requestConfig = getRequestConfig(headers, query);

    const splittedPath = splitPath(path, 1);
    const baseUrl = splittedPath.shifted[0];

    const fileName = manageQueryParams(query);
    const folderPath = splittedPath.folderPath;

    let responseData = null;
    let messageData: string | undefined;
    let cacheData: boolean | undefined;

    const bodyHash = await getBodyHash(JSON.stringify(req.body));
    const finalFolder = baseUrl + '/' + folderPath + '/Put';
    const currentFile = finalFolder + '/' + fileName + '_' + bodyHash + '.json';

    // Guard that makes the axios call to the endpoint or not.
    let axiosCall = true;

    try {
        // A file is already cached
        if (!noCache && existsSync(baseUrl) && existsSync(currentFile)) {
            const readFileRes: Buffer = await promises.readFile(currentFile);

            responseData = JSON.parse(readFileRes.toString()) as ResponseModel;
            // Check if the response is still good. If true, no need to call the endpoint.
            if (responseData.expiresIn && responseData.expiresIn >= Date.now()) {
                axiosCall = false;
                responseData = responseData.payload;
                messageData = "here's you cached data";
                cacheData = true;
            } else responseData = null; // The cached response is expired.
        }
        // If I need to get the response from the endpoint
        if (axiosCall) {
            const fetch = await axios.patch(`https:/${params[0]}`, req.body, requestConfig);
            responseData = fetch.data;
            messageData = "here's the fetched data";
            cacheData = false;
            // If I want to cache the response
            if (!noCache) storeResponseFile(finalFolder, currentFile, fetch.data);
        }

        // Send back the response
        return res.status(200).send({
            error: false,
            cache: cacheData,
            message: messageData,
            data: responseData,
            filenameCached: currentFile,
        });
    } catch (error: any) {
        console.error(error);
        const code = error instanceof AxiosError ? error.response?.status || 500 : 500;
        return res.status(code).send({
            error: true,
            message: error.message,
        });
    }
};

export const patchLocalCache: Handler = async (req, res) => {
    const params = req.params;
    const query = req.query;
    let path = req.path;
    let noCache = false;

    // TODO Da rivedere come implementare la nocache (query params o nel path)
    if (path.includes('nocache')) {
        noCache = true;
        path = path.substring(8);
        params[0] = params[0].substring(8);
    }

    const headers: { [key: string]: string } = manageHeader(req);

    const requestConfig = getRequestConfig(headers, query);

    const splittedPath = splitPath(path, 1);
    const baseUrl = splittedPath.shifted[0];

    const fileName = manageQueryParams(query);
    const folderPath = splittedPath.folderPath;

    let responseData = null;
    let messageData: string | undefined;
    let cacheData: boolean | undefined;

    const bodyHash = await getBodyHash(JSON.stringify(req.body));
    const finalFolder = baseUrl + '/' + folderPath + '/Patch';
    const currentFile = finalFolder + '/' + fileName + '_' + bodyHash + '.json';

    // 3 cases
    // - No Cache -> Directly the axios call.
    // - Yes Cache but no file o file is obsolete -> Axios call and cache it
    // - Yes Cache and file exists -> return the chached data

    // Guard that makes the axios call to the endpoint or not.
    let axiosCall = true;

    try {
        // A file is already cached
        if (!noCache && existsSync(baseUrl) && existsSync(currentFile)) {
            const readFileRes: Buffer = await promises.readFile(currentFile);

            responseData = JSON.parse(readFileRes.toString()) as ResponseModel;
            // Check if the response is still good. If true, no need to call the endpoint.
            if (responseData.expiresIn && responseData.expiresIn >= Date.now()) {
                axiosCall = false;
                responseData = responseData.payload;
                messageData = "here's you cached data";
                cacheData = true;
            } else responseData = null; // The cached response is expired.
        }

        // If I need to get the response from the endpoint
        if (axiosCall) {
            const fetch = await axios.post(`https:/${params[0]}`, req.body, requestConfig);
            responseData = fetch.data;
            messageData = "here's the fetched data";
            cacheData = false;
            // If I want to cache the response
            if (!noCache) storeResponseFile(finalFolder, currentFile, fetch.data);
        }

        // Send back the response
        return res.status(200).send({
            error: false,
            cache: cacheData,
            message: messageData,
            data: responseData,
            filenameCached: currentFile,
        });
    } catch (error: any) {
        const code = error instanceof AxiosError ? error.response?.status || 500 : 500;
        return res.status(code).send({
            error: true,
            message: error.message,
        });
    }
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

    switch (type) {
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
