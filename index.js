require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const db = require("./db");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// Sécurité & middlewares
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.set("trust proxy", 1);

// Routes HTTP
app.get("/", (req, res) => res.json({ message: "API is healthy!" }));
app.use("/api", require("./src/routers"));

// Démarrer les sockets
// require("./src/events/jobEvent")(io); // 👈 on passe `io` ici
app.set("io", io);

io.on("connection", (socket) => {
  console.log("Client connecté :", socket.id);
});
// Serveur
const port = 3000;
server.listen(port, () => {
  console.log(`✅ Server ready on http://localhost:${port}`);
});
