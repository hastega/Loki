import { Router } from 'express';
import {
    deleteLocalCache,
    getLocalCache,
    patchLocalCache,
    postLocalCache,
    putLocalCache,
} from '../../controllers/localCache.controller';
import { setHeader } from '../../controllers/redis.controllers';
import config from 'config';

const router = Router();

router.get('*', setHeader([...config.get<string[]>('localDatabase.customHeaders')]), getLocalCache);

router.get('nocache/*', setHeader([...config.get<string[]>('localDatabase.customHeaders')]), getLocalCache);

router.post('*', postLocalCache);

router.put('*', putLocalCache);

router.patch('*', patchLocalCache);

router.delete('*', deleteLocalCache);

export default router;
