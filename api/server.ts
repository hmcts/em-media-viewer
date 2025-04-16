import { logger } from './logger';
import * as path from 'path';
import * as nunjucks from 'nunjucks';
import * as express from 'express';
import { ClientRequest } from 'http';
import { config } from './config';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { TokenRepository } from './security/token-repository';
import { ServiceAuthProviderClient } from './security/service-auth-provider-client';
import { IdamClient } from './security/idam-client';
import { healthcheckRoutes } from './health';

interface EnhancedProxyOptions extends Options {
    context?: string | string[];
}

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const frontendRoot = path.join(__dirname, '..', 'demo-app');
const app = express();

app.use(express.static(frontendRoot));
nunjucks.configure(frontendRoot, {
    autoescape: true,
    express: app
});

const serviceAuthRepository = new TokenRepository(new ServiceAuthProviderClient(), config.tokenRefreshTime);
const idamRepository = new TokenRepository(new IdamClient(), config.tokenRefreshTime);

Promise.all([serviceAuthRepository.init(), idamRepository.init()])
    .then(() => {

        logger.info('idamToken: ' + idamRepository.getToken());
        logger.info('s2sToken: ' + serviceAuthRepository.getToken());

        const addHeaders = (req: ClientRequest) => {
            req.setHeader('Authorization', idamRepository.getToken());
            req.setHeader('ServiceAuthorization', serviceAuthRepository.getToken());
        };

        const proxyOptions = {
            onProxyReq: (proxyReq, req, res) => {
                logger.info(`Proxying request to: ${proxyReq.path}`);
                proxyReq.setHeader('Authorization', idamRepository.getToken());
                proxyReq.setHeader('ServiceAuthorization', serviceAuthRepository.getToken());
            },
            onProxyRes: (proxyRes, req, res) => {
                logger.info(`Received response with status: ${proxyRes.statusCode}`);
            },
            secure: false,
            changeOrigin: true
        };

        const assemblyProxy = config.proxies.assembly;
        app.use(createProxyMiddleware({
            context: assemblyProxy.endpoints,
            target: assemblyProxy.target,
            pathRewrite: assemblyProxy.pathRewrite,
            ...proxyOptions
        } as EnhancedProxyOptions));

        const annotationProxy = config.proxies.annotation;
        app.use(createProxyMiddleware({
            context: annotationProxy.endpoints,
            target: annotationProxy.target,
            pathRewrite: annotationProxy.pathRewrite,
            ...proxyOptions
        } as EnhancedProxyOptions));

        const dmStoreProxy = config.proxies.dmStore;
        app.use(createProxyMiddleware({
            context: dmStoreProxy.endpoints,
            target: dmStoreProxy.target,
            onProxyReq: (req: ClientRequest) => {
                req.setHeader('user-roles', 'caseworker');
                req.setHeader('ServiceAuthorization', serviceAuthRepository.getToken());
            },
            secure: false,
            changeOrigin: true
        } as EnhancedProxyOptions));

        const npaProxy = config.proxies.npa;
        app.use(createProxyMiddleware({
            context: npaProxy.endpoints, target: npaProxy.target, ...proxyOptions
        } as EnhancedProxyOptions));

        const icpProxy = config.proxies.icp;
        app.use(createProxyMiddleware({
            context: icpProxy.endpoints,
            target: icpProxy.target,
            ...proxyOptions,
            ws: true,
            headers: { 'Authorization': idamRepository.getToken() }
        } as EnhancedProxyOptions));

        const hrsProxy = config.proxies.hrsApi;
        app.use(createProxyMiddleware({
            context: hrsProxy.endpoints, target: hrsProxy.target, ...proxyOptions
        } as EnhancedProxyOptions));

        app.use('/', healthcheckRoutes);
        app.use('/dm-store', (req, res) => res.render('index.html'));
        app.use('/', (req, res) => res.render('index.html'));

        logger.info('Listening on port ' + config.port);

        app.listen(config.port);

    })
    .catch(err => {
        logger.error('Could not start em-showcase application >> ', err.message);
        logger.error('\n', err.stack);
    });


