const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Auth service is running" });
});

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

const adminAuthRoutes = require("./routes/admin.auth.routes");
app.use("/admin/auth", adminAuthRoutes);

const organizerRoutes = require("./routes/organizer.routes");
app.use("/organizer", organizerRoutes);

const eventRoutes = require("./routes/event.routes");
app.use("/api", eventRoutes);

module.exports = app;
