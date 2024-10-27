import express from 'express';
import { Server } from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';
import { DASHBOARD_PORT } from '../lib/config/config.js';
import { getMetrics, initializeMetrics } from '../lib/queue/metrics.js';
import router from './routes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(router);

initializeMetrics();

io.on('connection', (socket) => {
  console.log('Dashboard client connected');
  sendMetrics(socket);

  socket.on('disconnect', () => {
    console.log('Dashboard client disconnected');
  });
});

setInterval(async () => {
  const metrics = await getMetrics();
  if (metrics) io.emit('metricsUpdate', metrics);
}, 1000);

async function sendMetrics(socket) {
  const metrics = await getMetrics();
  if (metrics) socket.emit('metricsUpdate', metrics);
}

server.listen(DASHBOARD_PORT, () => {
  console.log(`Dashboard running on http://localhost:${DASHBOARD_PORT}`);
});
