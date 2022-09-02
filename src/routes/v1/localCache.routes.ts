import { Router } from "express";
import { getLocalCache, postLocalCache } from "../../controllers/localCache.controller";
import { setHeader } from "../../controllers/redis.controllers";

const router = Router();

router.get("*", setHeader(['Accept', 'X-CMC_PRO_API_KEY']), getLocalCache);
router.post("*", postLocalCache)

export default router;