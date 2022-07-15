import { Router } from "express";
import { setProxyTarget, useProxy } from "../../controllers/proxy.controller";

const router = Router();

router.get("*", setProxyTarget('http://localhost:3000'), useProxy);

export default router;