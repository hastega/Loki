export class CachedResponseModel {
    expiresIn: number;
    payload: object;

    constructor(expiresIn: number, payload: object) {
        this.expiresIn = expiresIn;
        this.payload = payload;
    }
}
