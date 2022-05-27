import { Router } from "express";
import { getRedisCache, logMiddleware } from "../../controllers/redis.controllers";

const router = Router();

router.get("*", getRedisCache);

// router.get("/user/:id", getUser);

// router.post("/users", createUser);

// router.delete("/user/:id", deleteUser);

export default router;