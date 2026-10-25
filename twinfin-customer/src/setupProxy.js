// Dev-only: forwards /api/* to the backend on whatever port it started on.
// The backend writes its port to <repo>/.backend-port when it boots.
const fs = require("fs");
const path = require("path");
const { createProxyMiddleware } = require("http-proxy-middleware");

const PORT_FILE = path.join(__dirname, "..", "..", ".backend-port");
const backendUrl = () => {
  try {
    return `http://localhost:${fs.readFileSync(PORT_FILE, "utf8").trim()}`;
  } catch (_) {
    return "http://localhost:5000";
  }
};

module.exports = (app) => {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:5000",
      router: backendUrl, // re-read on every request, so backend restarts on a new port just work
      changeOrigin: true,
      pathRewrite: { "^/api": "" },
    })
  );
};
