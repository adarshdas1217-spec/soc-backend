const { io } = require("socket.io-client");

const socket = io("http://localhost:5000");

socket.on("connect", () => {
   console.log("✅ Connected to SOC server");
});

socket.on("newAlert", (data) => {
   console.log("🚨 REAL-TIME ALERT RECEIVED:");
   console.log(data);
});
