require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const logRoutes = require("./routes/logRoutes");
const alertRoutes = require("./routes/alertRoutes");
const incidentRoutes = require("./routes/incidentRoutes");

const app = express();

/* ---------- DATABASE CONNECTION ---------- */

mongoose.connect(process.env.MONGO_URI)
   .then(() => console.log("MongoDB Connected"))
   .catch(err => {
      console.error("DB Connection Failed:", err.message);
      process.exit(1);
   });

/* ---------- GLOBAL MIDDLEWARE ---------- */

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

/* ---------- ROUTES ---------- */

app.use("/api/auth", authRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/incidents", incidentRoutes);

/* ---------- HEALTH CHECK ---------- */

app.get("/", (req, res) => {
   res.send("SOC360 Backend Running...");
});

/* ---------- SERVER START ---------- */

const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
   cors: {
      origin: "*",
      methods: ["GET", "POST"]
   }
});

/* Make io available in controllers */
app.set("io", io);

io.on("connection", (socket) => {
   console.log("🔌 Client connected:", socket.id);

   socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
   });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
   console.log(`🚀 Server running on port ${PORT}`);
});

