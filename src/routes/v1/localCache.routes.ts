import { Router } from "express";
import { deleteLocalCache, getLocalCache, patchLocalCache, postLocalCache, putLocalCache } from "../../controllers/localCache.controller";
import { setHeader } from "../../controllers/redis.controllers";

const router = Router();

router.get("*", setHeader([]), getLocalCache);

router.post("*", postLocalCache);

router.put("*", putLocalCache);

router.patch("*", patchLocalCache);

router.delete("*", deleteLocalCache);


export default router;