// Make sure you have a helper for your Firestore setup
import { db } from '../../../firebase/firebase.js';
 
export default async function handler(req, res) {
    const { userId } = req.query; // Extract userId from the query string (URL param)
    
    // GET: Endpoint to retrieve all tasks
    if (req.method === 'GET') {
      try {
        const { userId } = req.params;
        // Fetching tasks (same as above)
        const snapshot = await db.collection("users").doc(userId).collection("tasks").get();
        const tasks = [];
        snapshot.forEach((doc) => {
          tasks.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        res.status(200).send(tasks);
      } catch (error) {
        res.status(500).send(error.message+" number 2");
      }
    }
    // CREATE
    // POST: Endpoint to add a new task
    else if (req.method === 'POST') {
      try {
        const { userId } = req.params;
        const newTask = req.body; // Expecting the task to be sent in the request body
        // Adding the new task to the Firestore collection
        const docRef = await db.collection("users").doc(userId).collection("tasks").add(newTask);
  
        // Sending a successful response with the new task ID and data
        res.status(201).send("worked! "+{ id: docRef.id, ...newTask });
      } catch (error) {
        res.status(500).send(error.message);
      }
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  };