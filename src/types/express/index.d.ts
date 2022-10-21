declare namespace Express {
    export interface Request {
        appVarHeaders?: string[];
        appVarProxyTarget: string;
    }
}
