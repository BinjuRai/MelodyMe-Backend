require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoute"); 
const PORT = process.env.PORT || 5000;
const cors = require("cors")

const app = express();

app.use(express.json());
let corsOptions = {
    origin: "*" 
}
app.use(cors(corsOptions))

connectDB();

app.use("/api/auth", userRoutes);

app.get("/test", (req, res) => {
  res.send("Server is working!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});