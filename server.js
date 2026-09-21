import {
  loadModel,
  LLAMA_3_2_1B_INST_Q4_0,
  completion,
  unloadModel
} from "@qvac/sdk";

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

let modelId = null;

async function initializeAI() {
  console.log("Loading StudyBuddy AI...");

  modelId = await loadModel({
    modelSrc: LLAMA_3_2_1B_INST_Q4_0
  });

  console.log("StudyBuddy AI ready.");
}

function serveFile(res, filePath, contentType) {
  try {
    const data = fs.readFileSync(filePath);

    res.writeHead(200, {
      "Content-Type": contentType
    });

    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", () => {
      resolve(body);
    });

    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {

  // Frontend
  if (req.method === "GET" && req.url === "/") {
    return serveFile(
      res,
      path.join(__dirname, "public", "index.html"),
      "text/html"
    );
  }

  if (req.method === "GET" && req.url === "/style.css") {
    return serveFile(
      res,
      path.join(__dirname, "public", "style.css"),
      "text/css"
    );
  }

  if (req.method === "GET" && req.url === "/app.js") {
    return serveFile(
      res,
      path.join(__dirname, "public", "app.js"),
      "application/javascript"
    );
  }

  // AI endpoint
  if (req.method === "POST" && req.url === "/api/chat") {
    try {
      const body = await readBody(req);
      const { question } = JSON.parse(body);

      if (!question || !question.trim()) {
        res.writeHead(400, {
          "Content-Type": "application/json"
        });

        return res.end(
          JSON.stringify({
            error: "Please enter a question."
          })
        );
      }

      if (!modelId) {
        res.writeHead(503, {
          "Content-Type": "application/json"
        });

        return res.end(
          JSON.stringify({
            error: "AI model is still loading."
          })
        );
      }

      const history = [
        {
          role: "system",
          content:
            "You are StudyBuddy, a helpful AI study assistant. " +
            "Explain concepts clearly and accurately. " +
            "Use simple language, examples, bullet points, and code when useful. " +
            "Keep responses focused and educational."
        },
        {
          role: "user",
          content: question
        }
      ];

      const result = completion({
        modelId,
        history,
        stream: true
      });

      res.writeHead(200, {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache"
      });

      for await (const token of result.tokenStream) {
        res.write(token);
      }

      res.end();

    } catch (error) {
      console.error("AI error:", error);

      if (!res.headersSent) {
        res.writeHead(500, {
          "Content-Type": "application/json"
        });
      }

      res.end(
        JSON.stringify({
          error: "Something went wrong while generating the answer."
        })
      );
    }

    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

async function start() {
  try {
    await initializeAI();

    server.listen(PORT, () => {
      console.log(`StudyBuddy running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start StudyBuddy:", error);
    process.exit(1);
  }
}

async function shutdown() {
  console.log("\nShutting down...");

  if (modelId) {
    await unloadModel({
      modelId
    });
  }

  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

start();