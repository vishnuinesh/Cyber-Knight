import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { app, BACKEND_PORT } from "./app.js";

const frontendApp = express();
const FRONTEND_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// ==========================================
// VITE SETUP FOR DEV VS PRODUCTION
// ==========================================
async function startServer() {
  // Mount the backend app inside the frontend app to route API calls directly
  frontendApp.use(app);

  // Serve frontend/assets statically so image assets are resolvable in both dev and production
  frontendApp.use("/assets", express.static(path.join(process.cwd(), "frontend/assets")));

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    frontendApp.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    frontendApp.use(express.static(distPath));
    frontendApp.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(BACKEND_PORT, () => {
    console.log(`[Cyber Knight Backend] API server operational at http://localhost:${BACKEND_PORT}`);
  });

  frontendApp.listen(FRONTEND_PORT, () => {
    console.log(`[Cyber Knight Frontend] Portal operational at http://localhost:${FRONTEND_PORT}`);
  });
}

startServer();
