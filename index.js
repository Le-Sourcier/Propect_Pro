require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
require("./db"); //initialize db instance
require("./src/events/cleanupMapped"); //Auto clean up unsable files from mapped folder
require("./src/events/dbDownloader"); //Auto download database

const app = express();
const server = http.createServer(app);

const ORIGINE_URL = process.env.ORIGINE_URL;
console.log("ORIGINE: ", ORIGINE_URL);
const io = socketIo(server, {
    cors: {
        origin: ORIGINE_URL,
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
        origin: ORIGINE_URL,
        credentials: true,
    })
);
app.set("trust proxy", 1);

// Routes HTTP
app.get("/", (req, res) => res.json({ message: "API is healthy!" }));
app.use("/api", require("./src/routers"));

// Démarrer les sockets
app.set("io", io);

io.on("connection", (socket) => {
    console.log("Client connecté :", socket.id);
});

// silence all console outputs on production
if (process.env.NODE_ENV === "production") {
    console.log = () => {};
    console.warn = () => {};
    console.info = () => {};
    console.debug = () => {};
    console.error; //remains active
}

// Serveur
const port = process.env.PORT;
server.listen(port, () => {
    console.log(`✅ Server ready on http://localhost:${port}`);
});
