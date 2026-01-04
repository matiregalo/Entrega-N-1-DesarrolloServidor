import express from "express";
import http from "http";
import { engine } from "express-handlebars";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import connectMongoDB from "./config/db.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.static(join(__dirname, "../public")));
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", join(__dirname, "views"));

// Middleware para asegurar conexión a MongoDB antes de procesar requests
// Esto es importante para Vercel serverless donde las funciones pueden "dormirse"
app.use(async (req, res, next) => {
  try {
    await connectMongoDB();
  } catch (error) {
    console.error("Error de conexión a MongoDB:", error);
    // No bloquear el request aquí, dejar que las rutas manejen el error
    // La conexión puede reconectarse en el próximo request
  }
  next();
});

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Conectar al inicio (para desarrollo local)
if (process.env.VERCEL !== "1") {
  connectMongoDB();
}

// Solo iniciar el servidor si no estamos en Vercel (modo serverless)
if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 8080;
  server.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
  });
}

export default app;
