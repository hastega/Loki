export class BodyResponseModel {
    error: boolean;
    cache: boolean;
    message: string;
    data: any;
    filenameCached: string;

    constructor() {
        this.error = false;
        this.cache = false;
        this.message = '';
        this.data = null;
        this.filenameCached = '';
    }
}
