import "dotenv/config";
import express, { Application, Request, Response } from "express";
import usersRouter from "./routes/users";
import { requestLogger } from "./middleware/logger";
import { errorHandler } from "./middleware/errorHandler";
import { connectDB } from "./config/db";
import { ensureSeeded } from "./data/ensureSeed";

const app: Application = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(express.json());

app.use(requestLogger);

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "API Users opérationnelle", version: "1.0.0" });
});

app.use("/api/users", usersRouter);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route non trouvée" });
});

app.use(errorHandler);

async function start(): Promise<void> {
  await connectDB();
  if (process.env.AUTO_SEED !== "false") {
    await ensureSeeded();
  }
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
    console.log(`API disponible sur http://localhost:${PORT}/api/users`);
  });
}

start().catch((err) => {
  console.error("Erreur au démarrage :", err);
  process.exit(1);
});

export default app;
