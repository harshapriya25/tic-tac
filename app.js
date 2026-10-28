const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORT = Number(process.env.PORT) || 3000;

function getWinner(board) {
  if (!Array.isArray(board) || board.length !== 9) return null;
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return board.every(Boolean) ? "draw" : null;
}

function createServer() {
  return http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    if (req.method === "GET" && url.pathname === "/api/health") {
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      return res.end(JSON.stringify({ status: "ok", app: "Tic-Tac-Toe" }));
    }

    if (req.method === "POST" && url.pathname === "/api/check-winner") {
      let body = "";
      req.on("data", chunk => {
        body += chunk;
        if (body.length > 10_000) req.destroy();
      });
      req.on("end", () => {
        try {
          const parsed = JSON.parse(body || "{}");
          if (!Array.isArray(parsed.board) || parsed.board.length !== 9 ||
              !parsed.board.every(cell => cell === null || cell === "X" || cell === "O")) {
            res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
            return res.end(JSON.stringify({ error: "board must contain 9 cells with X, O, or null" }));
          }
          res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ result: getWinner(parsed.board) }));
        } catch {
          res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ error: "Invalid JSON" }));
        }
      });
      return;
    }

    if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/index.html")) {
      return fs.readFile(path.join(__dirname, "public", "index.html"), (error, content) => {
        if (error) {
          res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
          return res.end("Could not load the game.");
        }
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(content);
      });
    }

    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  });
}

if (require.main === module) {
  createServer().listen(PORT, () => {
    console.log(`Tic-Tac-Toe is running at http://localhost:${PORT}`);
  });
}

module.exports = { getWinner, createServer };
