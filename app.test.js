const { test, after } = require("node:test");
const assert = require("node:assert/strict");
const { getWinner, createServer } = require("./app");

test("detects X across the top row", () => {
  assert.equal(getWinner(["X", "X", "X", "O", null, "O", null, null, null]), "X");
});

test("detects O on a diagonal", () => {
  assert.equal(getWinner(["O", "X", "X", null, "O", null, "X", null, "O"]), "O");
});

test("detects a draw", () => {
  assert.equal(getWinner(["X", "O", "X", "X", "O", "O", "O", "X", "X"]), "draw");
});

test("returns null when the game is not finished", () => {
  assert.equal(getWinner(["X", "O", null, null, "X", null, null, null, "O"]), null);
});

test("health endpoint responds successfully", async () => {
  const server = createServer();
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  try {
    const response = await fetch(`http://127.0.0.1:${server.address().port}/api/health`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: "ok", app: "Tic-Tac-Toe" });
  } finally {
    await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }
});
