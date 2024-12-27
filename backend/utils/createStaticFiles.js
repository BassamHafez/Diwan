const fs = require("fs");
const path = require("path");

// Define the paths
const rootPath = path.join(__dirname, "../", "uploads");
const usersPath = path.join(rootPath, "users");
const compoundsPath = path.join(rootPath, "compounds");
const estatesPath = path.join(rootPath, "estates");
const designsPath = path.join(rootPath, "designs");

function ensureDirectories() {
  if (!fs.existsSync(rootPath)) {
    fs.mkdirSync(rootPath);
    console.log("Created uploads directory");
  }

  if (!fs.existsSync(usersPath)) {
    fs.mkdirSync(usersPath);
    console.log("Created users directory");
  }

  if (!fs.existsSync(compoundsPath)) {
    fs.mkdirSync(compoundsPath);
    console.log("Created compounds directory");
  }

  if (!fs.existsSync(estatesPath)) {
    fs.mkdirSync(estatesPath);
    console.log("Created estates directory");
  }

  if (!fs.existsSync(designsPath)) {
    fs.mkdirSync(designsPath);
    console.log("Created designs directory");
  }
}

module.exports = ensureDirectories;
