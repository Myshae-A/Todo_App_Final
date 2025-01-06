// Importing required modules
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import db from './firebase/firebase.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json()); // must keep this...


// enable CORS for specific routes or origins ??
app.use(cors({
  origin: 'https://todo-app-final-frontend.vercel.app' // Allow only this origin
}));

// Your API routes will go here...
app.use(express.json())

// GET: Endpoint to retrieve all tasks
app.get("/users/:userId/tasks", async (req, res) => {
  try {
    const { userId } = req.params; // don't forget this part when trying to get userId

    // Fetching all documents from the "tasks" collection in Firestore
    const snapshot = await db.collection("users").doc(userId).collection("tasks").get();
    
    let tasks = [];
    
    // Looping through each document and collecting data
    snapshot.forEach((doc) => {
      tasks.push({
        id: doc.id,  // Document ID from Firestore
        ...doc.data(),  // Document data
      });
    });
    
    // Sending a successful response with the tasks data
    res.status(200).send(tasks);
  } catch (error) {
    // Sending an error response in case of an exception
    res.status(500).send(error.message+" number 2");
  }
});

// CREATE
// POST: Endpoint to add a new task
app.post("/users/:userId/tasks", async (req, res) => {
  const newTask = req.body;
  try {
    const { userId } = req.params;
    // Adding the new task to the "tasks" collection in Firestore
    const docRef = await db.collection("users").doc(userId).collection("tasks").add(newTask);
    const taskData = { id: docRef.id, ...newTask }; // Ensure task data includes the name
    res.status(201).send(taskData);  // Send the complete task back
  } catch (error) {
    // Sending an error response in case of an exception
    res.status(500).send(error.message);
  }
});

// DELETE: Endpoint to remove a task
app.delete('/users/:userId/tasks/:taskId', async (req, res) => {
  const taskId = req.params.taskId;
  const { userId } = req.params;
  if(taskId === undefined) {
    res.status(404).send('Task not found');
    return;
  }
  const taskRef = db.collection("users").doc(userId).collection("tasks").doc(taskId);
  // Delete the document with the given taskId
  await taskRef.delete();
  res.status(200).send(taskRef);
  // res.status(200).send(`taskId: ${taskId} is deleted!!!`);
});

// Setting the port for the server to listen on
const PORT = process.env.PORT || 3001;

// Starting the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`);
});