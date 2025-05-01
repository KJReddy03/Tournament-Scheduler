const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../config/db.config");

export const login = async (req, res) => {
  try {
    // 1. Find user by email
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) return res.status(400).json({ message: "User not found" });

    // 2. Compare password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).json({ message: "Invalid credentials" });

    // 3. Generate token
    const token = jwt.sign(
      { id: user.id, role: user.role }, // Include role in token
      process.env.JWT_SECRET || "default_secret",
      {
        expiresIn: "1d",
      }
    );

    // 4. Send response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
