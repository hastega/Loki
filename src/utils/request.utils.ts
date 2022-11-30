import { Request } from "express";
import QueryString from "qs";
import { unlinkSync, rmdirSync, readdirSync } from 'fs';

export const splitPath = (path: string, shift: number): {folderPath: string, shifted: string[]} => {
    const shifted: string[] = [];
    const splittedPath = path.split('/');
    splittedPath.shift()
    
    for(let i = 0; i < shift; i++) {
        shifted.push(splittedPath.shift() as string);
    }
    return {
        folderPath: splittedPath.join('/'),
        shifted: shifted
    };
};

export const manageHeader = (req: Request): { [key: string]: string } => {
    const headers: { [key: string]: string } = {};
    req.appVarHeaders?.forEach((selectedHeader, i) =>
    req.rawHeaders.forEach((requestHeader, j) => {
        if (selectedHeader.toLowerCase() == requestHeader.toLowerCase()) {
            headers[(req.appVarHeaders as string[])[i]] = req.rawHeaders[j + 1];
        }
    }));
    return headers;
};

export const manageQueryParams = (query: QueryString.ParsedQs) => {
    return Object.entries(query)
    .map((p) => p.join('_'))
    .join('_');
};

export const recursiveRemove = (path: string, fileName?: string) => {
    if (fileName) {
        unlinkSync(path + '/' + fileName)
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