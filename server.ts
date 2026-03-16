import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { getZenQuote } from "./src/services/geminiService.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("zhinian.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS timer (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    start_date TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS envelopes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    candles INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    completed_at DATETIME
  );
`);

// Seed initial timer if not exists
const timerExists = db.prepare("SELECT * FROM timer WHERE id = 1").get();
if (!timerExists) {
  db.prepare("INSERT INTO timer (id, start_date) VALUES (1, ?)").run(new Date().toISOString());
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/timer", (req, res) => {
    const timer = db.prepare("SELECT start_date FROM timer WHERE id = 1").get();
    res.json(timer);
  });

  app.post("/api/timer/reset", (req, res) => {
    const newDate = new Date().toISOString();
    db.prepare("UPDATE timer SET start_date = ? WHERE id = 1").run(newDate);
    res.json({ start_date: newDate });
  });

  app.get("/api/envelopes", (req, res) => {
    const envelopes = db.prepare("SELECT * FROM envelopes ORDER BY created_at DESC").all();
    res.json(envelopes);
  });

  app.post("/api/envelopes", (req, res) => {
    const { content } = req.body;
    db.prepare("INSERT INTO envelopes (content) VALUES (?)").run(content);
    res.json({ success: true });
  });

  app.get("/api/posts", (req, res) => {
    const posts = db.prepare("SELECT * FROM posts ORDER BY created_at DESC").all();
    res.json(posts);
  });

  app.post("/api/posts", (req, res) => {
    const { content } = req.body;
    db.prepare("INSERT INTO posts (content) VALUES (?)").run(content);
    res.json({ success: true });
  });

  app.post("/api/posts/:id/candle", (req, res) => {
    const { id } = req.params;
    db.prepare("UPDATE posts SET candles = candles + 1 WHERE id = ?").run(id);
    res.json({ success: true });
  });

  app.get("/api/tasks", (req, res) => {
    const tasks = db.prepare("SELECT * FROM tasks ORDER BY id DESC").all();
    res.json(tasks);
  });

  app.get("/api/zen-quote", async (req, res) => {
    const quote = await getZenQuote();
    res.json({ quote });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
