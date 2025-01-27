// src/server.ts
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";

const app = express();
//on configure le fichier .env pour le serveur.ts dans le répertoire src/server/.env
dotenv.config({ path: path.resolve(__dirname, ".env") });

// Middleware
app.use(cors());
app.use(bodyParser.json());

//port
const PORT = process.env.PORT;

// MongoDB connection
mongoose
  .connect(process.env.MONGO_DB_SERVER_PRODUCTION as string, {
    //useNewUrlParser: true,
    //useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Task Schema and Model
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  done: Boolean,
});

const Task = mongoose.model("Task", taskSchema);

// Routes  recuperation de toutes les tables
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

/// Route d ajou dune table
app.post("/tasks", async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.json(task);
});

//// ROUTE DE MODIFICATION de toute la table
app.put("/tasks/:id", async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(task);
});

/////// Nouvelle route pour faire une modification selement du checkbox

app.put("/updatetaskdone/", async (req, res) => {
  //Where ID
  const myquery = { _id: req.body._id };
  var newvalues = { $set: { done: req.body.done } };
  //Set
  const task = await Task.updateOne(myquery, newvalues);
  res.json(task);
});

app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

app.get("/getTask/:id", async (req, res) => {
  await Task.findById(req.params.id);
  res.json({ message: "Get task" });
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
