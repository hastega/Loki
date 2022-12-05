import fileSystemManager from './../manager/fileSystem/fileSystem.manager';
import { getRequestConfig, manageHeader, manageQueryParams } from '../utils/request.utils';
import { promises } from 'fs';
import axios from 'axios';
import { Handler } from 'express';
import * as path from 'path';
import { BodyResponseModel } from '../types/model/bodyResponse.model';

export const getLocalCache: Handler = async (req, res) => {
    const fsManager = new fileSystemManager('Get');
    const body = baseRequestHandler(req, axios.get, fsManager, false);
    return res.status(200).send(body);
};
/**
 * @description function layer that caches (or not)
 * @param req
 * @param res
 */
export const postLocalCache: Handler = async (req, res) => {
    const fsManager = new fileSystemManager('Post');
    const body = baseRequestHandler(req, axios.post);
    return res.status(200).send(body);
};

export const putLocalCache: Handler = async (req, res) => {
    const fsManager = new fileSystemManager('Put');
    const body = baseRequestHandler(req, axios.put);
    return res.status(200).send(body);
};

export const patchLocalCache: Handler = async (req, res) => {
    const fsManager = new fileSystemManager('Patch');
    const body = baseRequestHandler(req, axios.patch);
    return res.status(200).send(body);
};

const baseRequestHandler: object = (req, axiosCall, fsManager: fileSystemManager, hashBody = true) => {
    const params = req.params;
    const query = req.query;

    const headers: { [key: string]: string } = manageHeader(req);
    const requestConfig = getRequestConfig(headers, query);

    const directoryPath = fsManager.sanitizePath(req.path, 1);

    const fileName = manageQueryParams(query);

    const successResponseBody = new BodyResponseModel();
};
