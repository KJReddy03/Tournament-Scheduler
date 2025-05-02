require("dotenv").config();
const express = require("express");
const app = require("./app"); // Import the app with routes and middleware

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
