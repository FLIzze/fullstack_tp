import express, { Application, Request, Response } from "express";
import usersRouter from "./routes/users";
import { requestLogger } from "./middleware/logger";
import { errorHandler } from "./middleware/errorHandler";

const app: Application = express();
const PORT = 3001;

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

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
  console.log(`API disponible sur http://localhost:${PORT}/api/users`);
});

export default app;
