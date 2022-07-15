import { Router } from "express";
import { getRedisCache, setHeader } from "../../controllers/redis.controllers";

const router = Router();

router.get("*", setHeader(['Accept', 'X-CMC_PRO_API_KEY']), getRedisCache);

export default router;