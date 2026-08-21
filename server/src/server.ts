// src/server.ts
// Entry point — starts the HTTP server after loading config.

import './config/env'; // Validates env vars before anything else
import app from './app';
import { config } from './config/env';

app.listen(config.port, () => {
  console.log(`[TaskFlow API] Server running on http://localhost:${config.port}`);
  console.log(`[TaskFlow API] Environment: ${config.nodeEnv}`);
});
