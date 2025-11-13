import { Router } from "express";
import {createProxyMiddleware} from 'http-proxy-middleware';
import ENV from "../Env";
const router = Router();

const USER_SERVICE_URL = ENV.USER_SERVICE_URL;

router.use('/users', createProxyMiddleware({
    target: USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '/users': '', // remove /users prefix when forwarding to user service
    },
}));

export default router;