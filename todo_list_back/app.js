const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

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

// Définir le modèle d'événement
const Event = mongoose.model(
  "Event",
  new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: String, required: true },
  })
);

// Routes pour gérer les événements
app.get("/api/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events" });
  }
});

app.post("/api/events", async (req, res) => {
  const newEvent = new Event({ title: req.body.title, date: req.body.date });
  try {
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(400).json({ message: "Error adding event" });
  }
});

app.put("/api/events/:id", async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ message: "Error updating event" });
  }
});

app.delete("/api/events/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: "Error deleting event" });
  }
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
