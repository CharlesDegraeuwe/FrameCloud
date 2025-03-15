require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "jouw_wachtwoord",
  database: "electron_app",
});

db.connect((err) => {
  if (err) throw err;
  console.log("✅ Database connected!");
});

// 🔹 Registreren
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
    [username, email, hashedPassword],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Gebruiker geregistreerd!" });
    }
  );
});

// 🔹 Inloggen
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0)
        return res.status(401).json({ error: "Ongeldige inloggegevens" });

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password_hash);

      if (!isMatch)
        return res.status(401).json({ error: "Ongeldig wachtwoord" });

      const token = jwt.sign(
        { id: user.id, username: user.username },
        "JOUW_SECRET_KEY",
        { expiresIn: "1h" }
      );

      res.json({ message: "Succesvol ingelogd!", token });
    }
  );
});

app.listen(5000, () => console.log("✅ Server draait op poort 5000"));
