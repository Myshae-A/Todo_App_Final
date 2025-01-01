// Make sure you have a helper for your Firestore setup
const db = require('../../utils/firebase');

module.exports = async (req, res) => {
    const { userId } = req.query; // Extract userId from the query string (URL param)
    
    if (req.method === 'GET') {
      try {
        // Fetching tasks (same as above)
        const snapshot = await db.collection("users").doc(userId).collection("tasks").get();
        const tasks = [];
        snapshot.forEach((doc) => {
          tasks.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        res.status(200).json(tasks);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    } else if (req.method === 'POST') {
      try {
        const newTask = req.body; // Expecting the task to be sent in the request body
        // Adding the new task to the Firestore collection
        const docRef = await db.collection("users").doc(userId).collection("tasks").add(newTask);
  
        // Sending a successful response with the new task ID and data
        res.status(201).json({ id: docRef.id, ...newTask });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  };