const fs = require("fs");
const path = require("path");

// Define the paths
const rootPath = path.join(__dirname, "../", "uploads");
const usersPath = path.join(rootPath, "users");

function ensureDirectories() {
  if (!fs.existsSync(rootPath)) {
    fs.mkdirSync(rootPath);
    console.log("Created uploads directory");
  }

  if (!fs.existsSync(usersPath)) {
    fs.mkdirSync(usersPath);
    console.log("Created users directory");
  }
}

module.exports = ensureDirectories;
