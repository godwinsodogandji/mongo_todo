const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Génération d'une clé secrète pour JWT
const generateSecret = () => {
  return crypto.randomBytes(64).toString("hex"); // Génère une clé secrète de 64 octets
};

const JWT_SECRET = generateSecret(); // Génération de la clé secrète

// Créer une instance de l'application Express
const app = express();

// Middleware
app.use(cors()); // Pour autoriser les requêtes cross-origin
app.use(bodyParser.json()); // Pour parser les requêtes JSON

// Connexion à MongoDB
mongoose
  .connect("mongodb://localhost:27017/todoDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Définir le modèle d'utilisateur
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  })
);

// Définir le modèle d'événement
const Event = mongoose.model(
  "Event",
  new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Association avec l'utilisateur
  })
);

// Middleware pour vérifier le token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  console.log("Received token:", token); // Log du token reçu
  if (!token) {
    return res.status(403).json({ message: "A token is required for authentication" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid Token" });
    }
    req.userId = decoded.id;
    next();
  });
};

// Routes pour gérer les utilisateurs

// Route pour s'inscrire
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;

  // Hachage du mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(400).json({ message: "Error registering user" });
  }
});

// Route pour se connecter
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid password" });
  }

  // Création du token
  const token = jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ token });
});

// Routes pour gérer les événements
app.get("/api/events", verifyToken, async (req, res) => {
  try {
    const events = await Event.find({ userId: req.userId }); // Récupérer uniquement les événements de l'utilisateur
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Error fetching events" });
  }
});

app.post("/api/events", verifyToken, async (req, res) => {
  const newEvent = new Event({
    title: req.body.title,
    date: req.body.date,
    userId: req.userId, // Associer l'événement à l'utilisateur
  });
  
  try {
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error("Error adding event:", error);
    res.status(400).json({ message: "Error adding event" });
  }
});

app.put("/api/events/:id", verifyToken, async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(400).json({ message: "Error updating event" });
  }
});

app.delete("/api/events/:id", verifyToken, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(400).json({ message: "Error deleting event" });
  }
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});