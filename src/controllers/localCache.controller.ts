import axios, { AxiosError } from 'axios';
import { Handler } from 'express';
import { existsSync, promises, writeFileSync, unlinkSync } from 'fs';
import { manageHeader, manageQueryParams, splitPath, recursiveRemove, getRequestConfig } from '../utils/request.utils';
import { ClearType } from '../properties/localCache.property';

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

    let responseData = null;
    let messageData: string;
    let cacheData: boolean;

    try {
        if (existsSync(baseUrl) && existsSync(baseUrl + '/' + folderPath + '/' + fileName + '.json')) {
            await promises.readFile(baseUrl + '/' + folderPath + '/' + fileName + '.json').then((res) => {
                responseData = JSON.parse(res.toString());
            });

            messageData = "here's you cached data";
            cacheData = true;
        } else {
            const fetch = await axios.get(`https:/${params[0]}`, requestConfig);

            promises.mkdir(baseUrl + '/' + folderPath, { recursive: true }).then((_) => {
                if (!noCache) {
                    writeFileSync(baseUrl + '/' + folderPath + '/' + fileName + '.json', JSON.stringify(fetch.data));
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

export const postLocalCache: Handler = async (req, res) => {
    const params = req.params;
    const query = req.query;
    let path = req.path;
    let noCache = false;
    if (path.includes('nocache')) {
        noCache = true;
        path = path.substring(8);
        params[0] = params[0].substring(8);
    }
    console.log(params[0], path, query);

    const headers: { [key: string]: string } = manageHeader(req);

    const requestConfig = getRequestConfig(headers, query);

    const splittedPath = splitPath(path, 1);
    const baseUrl = splittedPath.shifted[0];

    const fileName = manageQueryParams(query);
    const folderPath = splittedPath.folderPath;

    console.log({ baseUrl });
    let responseData = null;
    let messageData: string;
    let cacheData: boolean;

    try {
        if (existsSync(baseUrl) && existsSync(baseUrl + '/' + folderPath + '/post.' + fileName + '.json')) {
            await promises.readFile(baseUrl + '/' + folderPath + '/' + fileName + '.json').then((res) => {
                responseData = JSON.parse(res.toString());
            });

            messageData = "here's you cached data";
            cacheData = true;
        } else {
            const fetch = await axios.post(`https:/${params[0]}`, req.body, requestConfig);
            // TODO how to store multiple <req.body, fetch.data> map inside single post.XX.json file
            // promises.mkdir(baseUrl + '/' + folderPath, { recursive: true }).then((_) => {
            //     if (!noCache) {
            //         writeFileSync(
            //             baseUrl + '/' + folderPath + '/post.' + fileName + '.json',
            //             JSON.stringify(fetch.data)
            //         );
            //     }
            // });

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
        const code = error instanceof AxiosError ? error.response?.status || 500 : 500;
        return res.status(code).send({
            error: true,
            message: error.message,
        });
    }
};

// export const postLocalCache: Handler = async (req, res) => {
//     const messageData = 'Just a POST response, data cointains the request body sent, nothing happened';
//     const cacheData = false;
//     console.log('req', req);
//     // console.log('res', res);
//     return res.status(200).send({
//         error: false,
//         cache: cacheData,
//         message: messageData,
//         data: req.body,
//     });
// };

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
