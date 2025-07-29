// require("dotenv").config();

// const express = require("express");
// const path = require("path");


// // const connectDB = require('./config/connectDB'); // or correct path
// const connectDB = require("./config/db");
// const userRoutes = require("./routes/userRoute"); 
// const adminUserRoutes = require("./routes/admin/userRouteAdmin")
// const adminCoursesRoutes = require("./routes/admin/coursesRoute")
// const adminLessonRoutes = require("./routes/admin/lessonContentRoute")
// const wishlistRoutes = require("./routes/wishlistRoute")



// connectDB();
// const PORT = process.env.PORT || 5000;
// const cors = require("cors")

// const app = express();

// app.use(express.json());
// let corsOptions = {
//     origin: "*" 
// }
// app.use(cors(corsOptions))
// app.use("/uploads", express.static(path.join(__dirname, "uploads")))


// app.use("/api/auth", userRoutes);
// app.use("/api/admin/users", adminUserRoutes)

// app.use("/api/admin/courses", adminCoursesRoutes)

// app.use("/api/admin/lesson", adminLessonRoutes)

// app.use("/api/normal/wishlist", wishlistRoutes);


// app.get("/test", (req, res) => {
//   res.send("Server is working!");
// });

// module.exports = app

// new one made after notification 

// require("dotenv").config();




// const express = require("express");
// const path = require("path");
// const cors = require("cors");

// const connectDB = require("./config/db");
// const userRoutes = require("./routes/userRoute"); 
// const adminUserRoutes = require("./routes/admin/userRouteAdmin")
// const adminCoursesRoutes = require("./routes/admin/coursesRoute")
// const adminLessonRoutes = require("./routes/admin/lessonContentRoute")
// const wishlistRoutes = require("./routes/wishlistRoute")
// const paymentRoutes = require("./routes/paymentRoute")
// const userLessonProgressRoutes = require('./routes/lessonProgressRoute');

// connectDB();

// const app = express();

// app.use(express.json());
// app.use(cors({ origin: "*" }));


// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.use("/api/auth", userRoutes);
// app.use("/api/admin/users", adminUserRoutes);
// app.use("/api/admin/courses", adminCoursesRoutes);
// app.use("/api/admin/lesson", adminLessonRoutes);
// app.use("/api/normal/wishlist", wishlistRoutes);
// app.use("/api/payment", paymentRoutes);

// // app.use("/api/user-progress", userLessonProgressRoutes); 
// app.use("/api", userLessonProgressRoutes);


// app.get("/test", (req, res) => { 
//   res.send("Server is working!");
// });

// fetch("http://localhost:5000/api/user-progress/summary", {
//   method: "GET",
//   credentials: "include", // required if cookies or auth headers are used
// })

// module.exports = app;

// Example of restricted CORS and route registration
const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoute");
const adminUserRoutes = require("./routes/admin/userRouteAdmin");
const adminCoursesRoutes = require("./routes/admin/coursesRoute");
const adminLessonRoutes = require("./routes/admin/lessonContentRoute");
const wishlistRoutes = require("./routes/wishlistRoute");
const paymentRoutes = require("./routes/paymentRoute");
const userLessonProgressRoutes = require('./routes/lessonProgressRoute');
// const userProgressRoutes =require("./routes/userProgressRoutes");

// Connect to DB
connectDB();

const app = express();

// Setup CORS
// app.use(cors({ origin: "*" }));
let corsOptions = {
  origin: "http://localhost:5173", // Change to the correct frontend URL
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/courses", adminCoursesRoutes);
app.use("/api/admin/lesson", adminLessonRoutes);
app.use("/api/normal/wishlist", wishlistRoutes);
app.use("/api/payment", paymentRoutes);
// app.use("api/user-progress", userLessonProgressRoutes);
 app.use("/api", userLessonProgressRoutes);




app.get("/test", (req, res) => {
  res.send("Server is working!");
});

module.exports = app;


