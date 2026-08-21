// src/db/prisma.ts
// Singleton Prisma client using the pg pool adapter for persistent TCP connections.
// Using a persistent pg.Pool avoids Neon serverless HTTP cold starts on every query,
// reducing response times from ~2000ms → ~30-80ms after the first warm connection.

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL environment variable is required');

// Strip sslmode/channel_binding from the URL to prevent pg-connection-string
// deprecation warnings; we configure SSL explicitly in the pool options instead.
const cleanUrl = databaseUrl
    .replace(/[?&]sslmode=[^&]*/g, '')
    .replace(/[?&]channel_binding=[^&]*/g, '')
    .replace(/\?&/, '?')
    .replace(/[?&]$/, '');

// Pool maintains a persistent TCP connection to the Neon pooler endpoint.
// min:1 keeps at least one connection alive to avoid cold start penalties.
const pool = new Pool({
    connectionString: cleanUrl,
    min: 1,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

export default prisma;
