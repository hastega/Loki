import { Router } from 'express';
import {
    deleteLocalCache,
    deleteCachedData,
    getLocalCache,
    patchLocalCache,
    postLocalCache,
    putLocalCache,
} from '../../controllers/localCache.controller';
import { setHeader } from '../../controllers/redis.controllers';
import config from 'config';

const router = Router();

router.get('/clearcache/folder/*', deleteCachedData);

router.get('/clearcache/content*', deleteCachedData);

router.get('*', setHeader([...config.get<string[]>('localDatabase.customHeaders')]), getLocalCache);

router.post('*', postLocalCache);

router.put('*', putLocalCache);

router.patch('*', patchLocalCache);

router.delete('*', deleteLocalCache);

export default router;
