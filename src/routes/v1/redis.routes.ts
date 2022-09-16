import { Router } from "express";
import { getRedisCache, setHeader } from "../../controllers/redis.controllers";

const router = Router();

router.get("*", setHeader([]), getRedisCache);

export default router;