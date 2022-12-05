import processEnvManager from './../processEnv/processEnv.manager';
import fs from 'fs';
import { Dirent } from 'fs';
import { manageQueryParams } from '../../utils/request.utils';

export default class fileSystemManager {
    private baseUserPath: string;
    private responseType: string;

    constructor(responseType: string) {
        this.responseType = responseType;
        this.baseUserPath = processEnvManager.getBaseDirectory();
    }

    public sanitizePath(path: string, shiftNumber: number) {
        const splittedPath = this.splitPath(path, shiftNumber);
        const baseUrl = splittedPath.shifted[0];
        const folderPath = splittedPath.folderPath;

        let finalPath = '';
        if (this.baseUserPath !== '') finalPath = `${this.baseUserPath}/${baseUrl}/${folderPath}/${this.responseType}`;
        else finalPath = `${baseUrl}/${folderPath}/${this.responseType}`;

        return finalPath;
    }

    public splitPath(path: string, shift: number): { folderPath: string; shifted: string[] } {
        const shifted: string[] = [];
        const splittedPath = path.split('/');
        splittedPath.shift(); // First shift is an empty string.

        for (let i = 0; i < shift; i++) {
            shifted.push(splittedPath.shift() as string);
        }
        return {
            folderPath: splittedPath.join('/'),
            shifted: shifted,
        };
    }

    /**
     * @author @Zenomante
     * @param path :string Can be a directory's or file's path
     */
    public removeRecursive(path: string) {
        if (!fs.existsSync(path)) return;

        if (fs.lstatSync(path).isDirectory()) {
            const dirEntities: Dirent[] = fs.readdirSync(path, { withFileTypes: true });
            // Check all file and directory inside path
            dirEntities.forEach((dirEnt: Dirent) => {
                if (dirEnt.isDirectory()) this.removeRecursive(`${path}/${dirEnt.name}`);
                else fs.unlinkSync(`${path}/${dirEnt.name}`);
            });
            fs.rmdirSync(path);
        } else {
            fs.unlinkSync(path);
        }
    }
}
