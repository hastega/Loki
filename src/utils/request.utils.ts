import { Request } from 'express';
import QueryString from 'qs';
import { unlinkSync, rmdirSync, readdirSync, promises, writeFileSync } from 'fs';
import { AxiosRequestConfig } from 'axios';
import https from 'https';
import config from 'config';
import crypto from 'crypto';
import { CachedResponseModel } from '../types/model/cachedResponse.model';

export const splitPath = (path: string, shift: number): { folderPath: string; shifted: string[] } => {
    const shifted: string[] = [];
    const splittedPath = path.split('/');
    splittedPath.shift();

    for (let i = 0; i < shift; i++) {
        shifted.push(splittedPath.shift() as string);
    }
    return {
        folderPath: splittedPath.join('/'),
        shifted: shifted,
    };
};

export const manageHeader = (req: Request): { [key: string]: string } => {
    const headers: { [key: string]: string } = {};
    req.appVarHeaders?.forEach((selectedHeader, i) =>
        req.rawHeaders.forEach((requestHeader, j) => {
            if (selectedHeader.toLowerCase() == requestHeader.toLowerCase()) {
                headers[(req.appVarHeaders as string[])[i]] = req.rawHeaders[j + 1];
            }
        })
    );
    return headers;
};

export const manageQueryParams = (query: QueryString.ParsedQs) => {
    return Object.entries(query)
        .map((p) => p.join('_'))
        .join('_');
};

export const recursiveRemove = (path: string, fileName?: string) => {
    if (fileName) {
        unlinkSync(path + '/' + fileName);
    } else {
        const content = readdirSync(path, { withFileTypes: true });
        content.forEach((f) => {
            if (f.isDirectory()) {
                recursiveRemove(`${path}/${f.name}`);
            } else {
                recursiveRemove(path, f.name);
            }
        });
        rmdirSync(path);
    }
};

export const getRequestConfig = (headers: { [key: string]: string }, queryParam: QueryString.ParsedQs) => {
    const requestConfig: AxiosRequestConfig = {
        headers: headers,
        params: queryParam,
    };

    const httpsAgent = {
        httpsAgent: new https.Agent({
            rejectUnauthorized: false,
        }),
    };

    if (config.get<boolean>('localDatabase.rejectUnauthorized')) Object.assign(requestConfig, httpsAgent);

    return requestConfig;
};

export const getBodyHash = (body: any): string => {
    return crypto.createHash('sha256').update(body).digest('base64url');
};

export const storeResponseFile = (finalFolder: string, filePath: string, payload: object) => {
    promises.mkdir(finalFolder, { recursive: true }).then(() => {
        const expTime: number = parseInt(process.env.EXPIRATION_TIME!);
        writeFileSync(
            filePath,
            JSON.stringify({
                payload, // The actual response
                expiresIn: Date.now() + 1000 * expTime,
            } as CachedResponseModel)
        );
    });
};
