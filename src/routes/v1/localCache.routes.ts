import { Router } from "express";
import { getLocalCache } from "../../controllers/localCache.controller";
import { setHeader } from "../../controllers/redis.controllers";

const router = Router();

router.get("*", setHeader(['Accept', 'X-CMC_PRO_API_KEY']), getLocalCache);

export default router;