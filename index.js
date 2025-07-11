require("dotenv").config();

const express = require("express");
const path = require("path");

// const connectDB = require('./config/connectDB'); // or correct path
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoute"); 
const adminUserRoutes = require("./routes/admin/userRouteAdmin")
const adminCoursesRoutes = require("./routes/admin/coursesRoute")
const adminLessonRoutes = require("./routes/admin/lessonContentRoute")
const wishlistRoutes = require("./routes/wishlistRoute")



connectDB();
const PORT = process.env.PORT || 5000;
const cors = require("cors")

const app = express();

app.use(express.json());
let corsOptions = {
    origin: "*" 
}
app.use(cors(corsOptions))
app.use("/uploads", express.static(path.join(__dirname, "uploads")))


app.use("/api/auth", userRoutes);
app.use("/api/admin/users", adminUserRoutes)

app.use("/api/admin/courses", adminCoursesRoutes)

app.use("/api/admin/lesson", adminLessonRoutes)

app.use("/api/normal/wishlist", wishlistRoutes);


app.get("/test", (req, res) => {
  res.send("Server is working!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

