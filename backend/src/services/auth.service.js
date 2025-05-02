const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

class AuthService {
  // Register new user
  async register(userData) {
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = new User({
      username: userData.username,
      email: userData.email,
      password: hashedPassword,
    });

    await user.save();

    return {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }

  // Login user and return JWT token
  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid password");

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return {
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }
}

module.exports = new AuthService();
