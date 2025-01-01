import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Box,
  Grid,
} from "@mui/material";
import Header from "./Header";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth } from "./firebase";
import { onAuthStateChanged } from 'firebase/auth';
import {
  query,
  collection,
  onSnapshot,
  updateDoc,
  doc,
  addDoc,
  deleteDoc
} from 'firebase/firestore'

// Importing the Firestore database instance from firebase.js
//const db = require("./firebase");
import db from "./firebase";

export default function HomePage() {
  const navigate = useNavigate();
  //const currentUser = useAuth();
  // const [currentUser, setCurrentUser] = useState(useAuth());

  const [currentUser, setCurrentUser] = useState(null)
  // State to hold the list of tasks.
  const [taskList, setTaskList] = useState([]);

  // State for the task name being entered by the user.
  const [newTaskName, setNewTaskName] = useState("");

  const [rendering, setRendering] = useState(0);

  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if(user) {
        // console.log("user detected 1: "+user.uid);
        setCurrentUser(user.uid)
        
      } else {
        // console.log("no user detected 2: "+user.uid);
        setCurrentUser(null)
        navigate('/login');
      }
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [navigate]);

  // console.log("88: "+currentUser)

  // TODO: Support retrieving your todo list from the API.
  // Currently, the tasks are hardcoded. You'll need to make an API call
  // to fetch the list of tasks instead of using the hardcoded data.

  useEffect(() => {
    let isMounted = true;
    //console.log("use effect ran-through")
    //console.log("is null 1? : "+(currentUser))
    if (!isLoading && currentUser == null) {
      navigate('/login');
    } else {
      // fetch(`http://localhost:3001/users/${currentUser}/tasks`)
      //   .then((response) => response.json())
      //   .then((data) => {
      //     // console.log("new one here work")
      //     // console.log(currentUser)
      //     // console.log("is null 2? : "+(currentUser == null))
          
      //     setTaskList(data);
      //     console.log("use effect here : "+data)
      //     // setCurrentUser(currentUser)
      //   })
      //   .catch((error) => {
      //     console.error('use effect FAILED TO FETCH: ', error);
      //   })
        fetch(`http://localhost:3001/users/${currentUser}/tasks`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if(isMounted) {
            setTaskList(data); // Update taskList with the fetched data
            isMounted = false;
            console.log("use effect here : "+data)
          }
          
        })
        .catch((error) => {
          console.error("'use effect FAILED TO FETCH: ", error);
        });
    }
  }, [currentUser, rendering]);

  // if (isLoading) {
  //   return <div>Loading...</div>; // Show a loading indicator
  // }

  // CREATE
  function handleAddTask() {
    // Check if task name is provided and if it doesn't already exist.
    if (newTaskName && !taskList.some((task) => task.name === newTaskName)) {

      // TODO: Support adding todo items to your todo list through the API.
      // In addition to updating the state directly, you should send a request
      // to the API to add a new task and then update the state based on the response.
      //console.log(currentUser.id);
      fetch(`http://localhost:3001/users/${currentUser}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          finished: false,
          name: newTaskName,
          // user: currentUser.currentUser
          // should always be false when adding a new task (i think)
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setTaskList((prevTaskList) => [...prevTaskList, data]);
          // console.log("handle add tak : "+taskList)
        })
        .catch((error) => {
          // console.log("currentUser: "+currentUser)
          // console.error('FAILED TO POST: ', error);
        })
        // setRefreshCount(refreshCount + 1)
        setRendering(rendering + 1)
        // console.log("rendering: "+rendering)
        setNewTaskName("") // clears the input field
        //console.log("new task added -- passed through")
    } else if (taskList.some((task) => task.name === newTaskName)) {
      alert("Task already exists!");
    } else {
      alert("Task name is required!");
    }
  }

  // UPDATE
  // Function to toggle the 'finished' status of a task.
  function toggleTaskCompletion(task) {

    // TODO: Support removing/checking off todo items in your todo list through the API.
    // Similar to adding tasks, when checking off a task, you should send a request
    // to the API to update the task's status and then update the state based on the response.

    fetch(`http://localhost:3001/users/${currentUser}/tasks/${task.id}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(() => {
        const updatedTaskList = taskList.filter((existingTask) => existingTask.id !== task.id)
        setTaskList(updatedTaskList)
        // console.log("toggle task : "+taskList)
      })
      .catch((error) => {
        // console.error('FAILED TO DELETE: ', error);
      })
      // console.log("task deleted -- passed through")
      setRendering(rendering + 1)
  }

  // Function to compute a message indicating how many tasks are unfinished.
  function getUnfinishedTaskMessage() {
    const unfinishedTasks = taskList.filter((task) => !task.finished).length;
    return unfinishedTasks === 1
      ? `You have 1 unfinished task`
      : `You have ${unfinishedTasks} tasks left to do`;
  }

  return (
    <>
      <Header />
      <Container component="main" maxWidth="sm">
        {/* Main layout and styling for the ToDo app. */}
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Display the unfinished task summary */}
          <Typography variant="h4" component="div" fontWeight="bold">
            {getUnfinishedTaskMessage()}
          </Typography>
          <Box
            sx={{
              width: "100%",
              marginTop: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Input and button to add a new task */}
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={6}>
                <TextField 
                  fullWidth
                  variant="outlined"
                  size="small" // makes the textfield smaller
                  value={newTaskName}
                  placeholder="Type your task here"
                  onChange={(event) => setNewTaskName(event.target.value)}
                />
              </Grid>
              <Grid item xs={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddTask}
                  //onClick={createTask}
                  fullWidth
                >
                  Add
                </Button>
              </Grid>
            </Grid>
            {/* List of tasks */}
            <List sx={{ marginTop: 3 }}>
              {taskList.map((task) => (
                <ListItem
                  key={task.name}
                  dense
                >
                  <Checkbox
                    checked={task.finished}
                    onChange={() => toggleTaskCompletion(task)}
                  />
                  <ListItemText primary={task.name} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Container>
    </>
  );
}