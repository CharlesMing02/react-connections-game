const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();

// Enable CORS for all routes
app.use(cors());

const PORT = 3000; // You can choose any port
const API_SERVICE_URL = "https://www.nytimes.com";

app.use(
  "/svc",
  createProxyMiddleware({
    target: API_SERVICE_URL,
    changeOrigin: true,
    // pathRewrite: {
    //   [`^/svc`]: "",
    // },
  })
);

app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
