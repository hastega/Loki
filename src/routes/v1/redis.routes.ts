import { Router } from "express";
import { getRedisCache, setHeader, logMiddleware } from "../../controllers/redis.controllers";

const router = Router();

router.get("*", setHeader(['Accept', 'X-CMC_PRO_API_KEY']), getRedisCache);

// router.get("/user/:id", getUser);

// router.post("/users", createUser);

// router.delete("/user/:id", deleteUser);

export default router;