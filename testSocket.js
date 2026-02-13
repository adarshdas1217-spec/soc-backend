const { io } = require("socket.io-client");

const socket = io("https://soc-backend-production.up.railway.app", {
   transports: ["websocket"]
});

socket.on("connect", () => {
   console.log("✅ Connected to SOC server");
});

socket.on("newAlert", (data) => {
   console.log("🚨 REAL-TIME ALERT RECEIVED:");
   console.log(data);
});
