const request = require("supertest");
const app = require("../index"); 
const User = require("../models/User");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

let authToken;

afterAll(async () => {
  await User.deleteMany({ email: { $in: ["ram@gmail.com", "test@gmail.com", "duplicate@gmail.com"] } });
  await mongoose.disconnect();
});

describe("User Registration API", () => {
  beforeAll(async () => {
    await User.deleteMany({ email: { $in: ["ram@gmail.com", "test@gmail.com", "duplicate@gmail.com"] } });
  });

  test("can validate user registration - missing username", async () => {
    const res = await request(app).post("/api/auth/register").send({
      firstName: "Ram",
      lastName: "Bahadur",
      email: "ram@gmail.com",
      password: "password123",
      phoneno: 9841234567
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Missing fields");
    expect(res.body.success).toBe(false);
  });

  test("can validate user registration - missing email", async () => {
    const res = await request(app).post("/api/auth/register").send({
      firstName: "Ram",
      lastName: "Bahadur",
      username: "ram123",
      password: "password123",
      phoneno: 9841234567
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Missing fields");
    expect(res.body.success).toBe(false);
  });

  test("can validate user registration - missing password", async () => {
    const res = await request(app).post("/api/auth/register").send({
      firstName: "Ram",
      lastName: "Bahadur",
      username: "ram123",
      email: "ram@gmail.com",
      phoneno: 9841234567
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Missing fields");
    expect(res.body.success).toBe(false);
  });

  test("can validate user registration - missing phone number", async () => {
    const res = await request(app).post("/api/auth/register").send({
      firstName: "Ram",
      lastName: "Bahadur",
      username: "ram123",
      email: "ram@gmail.com",
      password: "password123"
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Missing fields");
    expect(res.body.success).toBe(false);
  });

  test("can validate user registration - missing multiple fields", async () => {
    const res = await request(app).post("/api/auth/register").send({
      firstName: "Ram",
      lastName: "Bahadur"
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Missing fields");
    expect(res.body.success).toBe(false);
  });

  test("can create a user with all required fields", async () => {
    const res = await request(app).post("/api/auth/register").send({
      firstName: "Ram",
      lastName: "Bahadur",
      username: "ram123",
      email: "ram@gmail.com",
      password: "password123",
      phoneno: 9841234567
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User Registered");
    expect(res.body.success).toBe(true);
  });

  test("can create a user with only required fields (no firstName/lastName)", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "test123",
      email: "test@gmail.com",
      password: "password123",
      phoneno: 9841234568
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User Registered");
    expect(res.body.success).toBe(true);
  });

  test("can validate duplicate username registration", async () => {
    const res = await request(app).post("/api/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      username: "ram123", // duplicate username
      email: "duplicate@gmail.com",
      password: "password123",
      phoneno: 9841234569
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("User exists");
    expect(res.body.success).toBe(false);
  });

  test("can validate duplicate email registration", async () => {
    const res = await request(app).post("/api/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      username: "john123",
      email: "ram@gmail.com", 
      password: "password123",
      phoneno: 9841234569
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("User exists");
    expect(res.body.success).toBe(false);
  });

  test("can validate duplicate phone number registration", async () => {
    const res = await request(app).post("/api/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      username: "john123",
      email: "duplicate@gmail.com",
      password: "password123",
      phoneno: 9841234567 // duplicate phone number
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("User exists");
    expect(res.body.success).toBe(false);
  });
});

describe("User Login API", () => {
  test("can validate login - missing email", async () => {
    const res = await request(app).post("/api/auth/login").send({
      password: "password123"
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Missing field");
    expect(res.body.success).toBe(false);
  });

  test("can validate login - missing password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "ram@gmail.com"
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Missing field");
    expect(res.body.success).toBe(false);
  });

  test("can validate login - missing both fields", async () => {
    const res = await request(app).post("/api/auth/login").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Missing field");
    expect(res.body.success).toBe(false);
  });

  test("can login a user with valid credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "ram@gmail.com",
      password: "password123"
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Login Successful");
    expect(res.body.success).toBe(true);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.data).toEqual(expect.any(Object));
    expect(res.body.data.email).toBe("ram@gmail.com");
    authToken = res.body.token;
  });

  test("can validate login with non-existent user email", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "nonexistent@gmail.com",
      password: "password123"
    });
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("User not found");
    expect(res.body.success).toBe(false);
  });

  test("can validate login with invalid password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "ram@gmail.com",
      password: "wrongpassword"
    });
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("Invalid credentials");
    expect(res.body.success).toBe(false);
  });

  test("can validate login with empty password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "ram@gmail.com",
      password: ""
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Missing field");
    expect(res.body.success).toBe(false);
  });

  test("can validate login with empty email", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "",
      password: "password123"
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Missing field");
    expect(res.body.success).toBe(false);
  });
});

describe("Password Reset API", () => {
  test("can send reset link with valid email", async () => {
    const res = await request(app).post("/api/auth/send-reset-link").send({
      email: "ram@gmail.com"
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Reset email sent");
    expect(res.body.success).toBe(true);
  });

  test("can validate reset link with non-existent email", async () => {
    const res = await request(app).post("/api/auth/send-reset-link").send({
      email: "nonexistent@gmail.com"
    });
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("User not found");
  });

  test("can validate reset link with missing email", async () => {
    const res = await request(app).post("/api/auth/send-reset-link").send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Missing field");
  });

  test("can reset password with valid token", async () => {
    const user = await User.findOne({ email: "ram@gmail.com" });
    const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: "15m" });
    
    const res = await request(app).post(`/api/auth/reset-password/${token}`).send({
      password: "newpassword123"
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Password updated");
    expect(res.body.success).toBe(true);
  });

  test("can validate reset password with invalid token", async () => {
    const res = await request(app).post("/api/auth/reset-password/invalidtoken").send({
      password: "newpassword123"
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid or expired token");
    expect(res.body.success).toBe(false);
  });

  test("can validate reset password with expired token", async () => {
    const user = await User.findOne({ email: "ram@gmail.com" });
    const expiredToken = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: "-1h" });
    
    const res = await request(app).post(`/api/auth/reset-password/${expiredToken}`).send({
      password: "newpassword123"
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid or expired token");
    expect(res.body.success).toBe(false);
  });

  test("can validate reset password with missing password", async () => {
    const user = await User.findOne({ email: "ram@gmail.com" });
    const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: "15m" });
    
    const res = await request(app).post(`/api/auth/reset-password/${token}`).send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Missing field");
  });

  test("can login with new password after reset", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "ram@gmail.com",
      password: "newpassword123"
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Login Successful");
    expect(res.body.success).toBe(true);
    expect(res.body.token).toEqual(expect.any(String));
  });

  test("can validate old password no longer works after reset", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "ram@gmail.com",
      password: "password123"
    });
    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("Invalid credentials");
    expect(res.body.success).toBe(false);
  });
});

describe("Database Integration Tests", () => {
  test("can verify user is properly stored in database", async () => {
    const user = await User.findOne({ email: "ram@gmail.com" });
    expect(user).toBeTruthy();
    expect(user.username).toBe("ram123");
    expect(user.email).toBe("ram@gmail.com");
    expect(user.phoneno).toBe(9841234567);
    expect(user.role).toBe("normal");
  });

  test("can verify password is properly hashed in database", async () => {
    const user = await User.findOne({ email: "ram@gmail.com" });
    expect(user.password).not.toBe("newpassword123");
    expect(user.password.length).toBeGreaterThan(20); // bcrypt hash length
    const isValid = await bcrypt.compare("newpassword123", user.password);
    expect(isValid).toBe(true);
  });
});