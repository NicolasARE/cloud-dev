import './tracing.js';
console.log('Tracing import executed');
import express, { Application } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import * as promClient from 'prom-client';

import db from './persistence/index.js';
import getGreeting from './controllers/getGreeting.js';
import getItems from './controllers/getItems.js';
import addItem from './controllers/addItem.js';
import updateItem from './controllers/updateItem.js';
import deleteItem from './controllers/deleteItem.js';
import register from './controllers/register.js';
import login from './controllers/login.js';
import getProfile from './controllers/getProfile.js';
import changePassword from './controllers/changePassword.js';
import deleteAccount from './controllers/deleteAccount.js';
import { authenticateToken } from './middleware/auth.js';

const app: Application = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Prometheus setup
const metricsRegistry = new promClient.Registry();
promClient.collectDefaultMetrics({ register: metricsRegistry });

const httpRequestDurationMicroseconds = new promClient.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in microseconds',
    labelNames: ['method', 'route', 'code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10],
});
metricsRegistry.registerMetric(httpRequestDurationMicroseconds);

app.use(express.json());

// Metrics middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const route = req.route ? req.route.path : req.path;
        httpRequestDurationMicroseconds
            .labels(req.method, route, res.statusCode.toString())
            .observe(duration / 1000);
    });
    next();
});

// Metrics endpoint
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', metricsRegistry.contentType);
    res.end(await metricsRegistry.metrics());
});

app.get('/api/greeting', getGreeting);

// Auth Routes
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);

// Profile Routes (Protected)
app.get('/api/auth/profile', authenticateToken as any, getProfile as any);
app.put('/api/auth/password', authenticateToken as any, changePassword as any);
app.delete('/api/auth/account', authenticateToken as any, deleteAccount as any);

// Item Routes (Protected)
app.get('/api/items', authenticateToken as any, getItems as any);
app.post('/api/items', authenticateToken as any, addItem as any);
app.put('/api/items/:id', authenticateToken as any, updateItem as any);
app.delete('/api/items/:id', authenticateToken as any, deleteItem as any);

app.use(express.static(path.join(__dirname, 'static')));


db.init()
    .then(() => {
        app.listen(3000, () => console.log('Listening on port 3000'));
    })
    .catch((err: unknown) => {
        console.error(err);
        process.exit(1);
    });

const gracefulShutdown = (): void => {
    db.teardown()
        .catch(() => {})
        .then(() => process.exit());
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown);
