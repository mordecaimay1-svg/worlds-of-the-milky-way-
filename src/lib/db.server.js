// Server-only data layer on Cloudflare D1 (the `DB` binding in wrangler.jsonc).
// Tables are created on first use, so a fresh database needs no migration step.
import { env } from "cloudflare:workers";

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS user_planets (
    id TEXT PRIMARY KEY,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL,
    record TEXT NOT NULL,
    image_b64 TEXT
  )`,
  `CREATE INDEX IF NOT EXISTS idx_user_planets_created ON user_planets (created_at DESC)`,
  `CREATE TABLE IF NOT EXISTS rate_limits (
    bucket TEXT PRIMARY KEY,
    count INTEGER NOT NULL,
    expires_at INTEGER NOT NULL
  )`,
];

let ready;

function db() {
  if (!env.DB) {
    throw new Error("The DB binding is missing. Add the D1 database to wrangler.jsonc (see README).");
  }
  // One schema check per Worker isolate, not per request.
  ready ??= env.DB.batch(SCHEMA.map((sql) => env.DB.prepare(sql))).catch((error) => {
    ready = undefined;
    throw error;
  });
  return ready.then(() => env.DB);
}

const imageUrl = (id, updatedAt) => `/api/specimen-image/${id}?v=${updatedAt}`;

const toPlanet = (row) => {
  if (!row) return null;
  return {
    ...JSON.parse(row.record),
    id: row.id,
    created_date: new Date(row.created_at).toISOString(),
    image_url: row.has_image ? imageUrl(row.id, row.updated_at) : "",
  };
};

const COLUMNS = "id, created_at, updated_at, record, image_b64 IS NOT NULL AS has_image";

export async function insertPlanet(record, imageB64) {
  const database = await db();
  const id = crypto.randomUUID();
  const now = Date.now();
  await database
    .prepare("INSERT INTO user_planets (id, created_at, updated_at, record, image_b64) VALUES (?, ?, ?, ?, ?)")
    .bind(id, now, now, JSON.stringify(record), imageB64 || null)
    .run();
  return id;
}

export async function updatePlanet(id, record, imageB64) {
  const database = await db();
  await database
    .prepare("UPDATE user_planets SET record = ?, image_b64 = ?, updated_at = ? WHERE id = ?")
    .bind(JSON.stringify(record), imageB64 || null, Date.now(), id)
    .run();
}

export async function getPlanet(id) {
  const database = await db();
  const row = await database.prepare(`SELECT ${COLUMNS} FROM user_planets WHERE id = ?`).bind(id).first();
  return toPlanet(row);
}

// Newest first. The cursor is the created_at of the last item already shown.
export async function listPlanets({ cursor, limit }) {
  const database = await db();
  const statement = cursor
    ? database
        .prepare(`SELECT ${COLUMNS} FROM user_planets WHERE created_at < ? ORDER BY created_at DESC LIMIT ?`)
        .bind(cursor, limit + 1)
    : database.prepare(`SELECT ${COLUMNS} FROM user_planets ORDER BY created_at DESC LIMIT ?`).bind(limit + 1);
  const { results } = await statement.all();
  const hasMore = results.length > limit;
  const page = results.slice(0, limit);
  return {
    items: page.map(toPlanet),
    has_more: hasMore,
    next_cursor: hasMore ? page[page.length - 1].created_at : null,
  };
}

export async function getPlanetImage(id) {
  const database = await db();
  const row = await database.prepare("SELECT image_b64 FROM user_planets WHERE id = ?").bind(id).first();
  return row?.image_b64 || null;
}

// Counts one hit in a fixed window and returns the running total for that window.
export async function hit(bucket, windowMs) {
  const database = await db();
  const now = Date.now();
  const windowStart = Math.floor(now / windowMs) * windowMs;
  const key = `${bucket}:${windowStart}`;
  const row = await database
    .prepare(
      `INSERT INTO rate_limits (bucket, count, expires_at) VALUES (?, 1, ?)
       ON CONFLICT (bucket) DO UPDATE SET count = count + 1
       RETURNING count`,
    )
    .bind(key, windowStart + windowMs)
    .first();
  // Housekeeping: drop expired windows now and then.
  if (Math.random() < 0.05) {
    await database.prepare("DELETE FROM rate_limits WHERE expires_at < ?").bind(now).run();
  }
  return row?.count ?? 1;
}
