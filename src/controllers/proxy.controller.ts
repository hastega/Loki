import { Handler } from 'express';
import httpProxy from 'http-proxy';

const appProxy = httpProxy.createProxyServer();

export const setProxyTarget = (target: string): Handler => {
    return (req, _, next) => {
        req.appVarProxyTarget = target;
        next();
    };
};

export const useProxy: Handler = async (req, res) => {
    appProxy.web(req, res, { target: req.appVarProxyTarget });
    res.send('Proxy at ' + req.appVarProxyTarget);
};
