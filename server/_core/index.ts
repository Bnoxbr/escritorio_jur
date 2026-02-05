import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { serveStatic, setupVite } from "./vite.js";

// 1. Criamos a instância do App fora da função para poder exportá-la
const app = express();
const server = createServer(app);

// Configurações básicas de Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// 2. Exportamos o 'app' para o arquivo api/index.ts (Vercel)
export { app };

// Funções Auxiliares de Porta (Mantidas para uso Local)
function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const serverCheck = net.createServer();
    serverCheck.listen(port, () => {
      serverCheck.close(() => resolve(true));
    });
    serverCheck.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) return port;
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

// 3. Lógica de Inicialização condicional
async function init() {
  // Somente configura Vite ou Static se NÃO estivermos no ambiente Serverless da Vercel
  // A Vercel cuida dos arquivos estáticos via vercel.json
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else if (!process.env.VERCEL) {
    serveStatic(app);
  }

  // 4. SÓ liga o listen se NÃO estiver na Vercel
  if (!process.env.VERCEL) {
    const preferredPort = parseInt(process.env.PORT || "5000");
    const port = await findAvailablePort(preferredPort);
    
    server.listen(port, () => {
      console.log(`[Local] Servidor rodando em http://localhost:${port}/`);
    });
  }
}

init().catch(console.error);
