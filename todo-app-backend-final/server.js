// Importing required modules
//const express = require("express");
import express from 'express';
import bodyParser from 'body-parser';
//const bodyParser = require("body-parser");
import cors from 'cors';
//const cors = require("cors");
console.log("testing")

// Creating an instance of Express // created an express server
const app = express();

// Loading environment variables from a .env file into process.env
// require("dotenv").config();
import dotenv from 'dotenv';
dotenv.config();


// Importing the Firestore database instance from firebase.js
// const db = require("./firebase");
import db from './firebase.js';


// Middlewares to handle cross-origin requests and to parse the body of incoming requests to JSON
app.use(cors());
app.use(bodyParser.json());

// Your API routes will go here...
app.use(express.json())

let tasks = [];

// GET: Endpoint to retrieve all tasks
app.get("/users/:userId/tasks", async (req, res) => {
  try {
    const { userId } = req.params; // don't forget this part when trying to get userId

    // Fetching all documents from the "tasks" collection in Firestore
    const snapshot = await db.collection("users").doc(userId).collection("tasks").get();
    
    tasks = [];
    
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

// GET: Endpoint to retrieve all tasks for a user
// app.get('/users/:userId/tasks/:taskId', async (req, res) => {
//   const userId = req.params.userId;
//   const userTasks = tasks.filter(task => task.userId === userId);
//   res.status(200).send(userTasks+" number 3");
// });

// CREATE
// POST: Endpoint to add a new task
app.post("/users/:userId/tasks", async (req, res) => {
  const newTask = req.body;
  try {
    // console.log("starting try")
    const { userId } = req.params;
    
    // Adding the new task to the "tasks" collection in Firestore
    const docRef = await db.collection("users").doc(userId).collection("tasks").add(newTask);
    // const docRef = await addDoc(collection(db, "tasks"), {
    //   finished: false,
    //   text: newTask.text,
    //   user: newTask.user
    // });
    // Sending a successful response with the new task ID
    res.status(201).send("worked! "+{ id: docRef.id, ...newTask });
    //res.status(201).json({ id: docRef.id, ...newTask });
    //console.log("ending try")

  } catch (error) {
    //console.log("starting catch")
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
  //tasks = tasks.filter(task => task.id !== taskId);
  res.status(200).send(`taskId: ${taskId} is deleted!!!`);
});

// Setting the port for the server to listen on
const PORT = process.env.PORT || 3001;

// Starting the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`);
});