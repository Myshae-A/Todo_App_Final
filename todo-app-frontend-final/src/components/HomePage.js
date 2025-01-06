import React, { useEffect, useState} from "react";
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
import { auth } from "./firebase";
import { onAuthStateChanged } from 'firebase/auth';

export default function HomePage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null)
  // State to hold the list of tasks.
  const [taskList, setTaskList] = useState([]);
  // State for the task name being entered by the user.
  const [newTaskName, setNewTaskName] = useState("");
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

  useEffect(() => {
    if (!isLoading && currentUser == null) {
      navigate('/login');
    } else {
        fetch(`https://todo-app-final-delta.vercel.app/users/${currentUser}/tasks`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if(data.length > 0) {
            setTaskList(data); // Update taskList with the fetched data
            // console.log("1.0 use effect here : "+data)
          }
          
        })
        .catch((error) => {
          console.error("'use effect FAILED TO FETCH: ", error);
        });
      }
  }, [currentUser]);

  // CREATE
  function handleAddTask() {
    // Check if task name is provided and if it doesn't already exist.
    if (newTaskName && !taskList.some((task) => task.name === newTaskName)) {
      fetch(`https://todo-app-final-delta.vercel.app/users/${currentUser}/tasks`, {
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
        // console.log("2.0 use effect here : "+data)
      })
      .catch((error) => {
        console.log("currentUser: "+currentUser)
        console.error('FAILED TO POST: ', error);
      })
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

    fetch(`https://todo-app-final-delta.vercel.app/users/${currentUser}/tasks/${task.id}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(() => {
      const updatedTaskList = taskList.filter((existingTask) => existingTask.id !== task.id)
      setTaskList(updatedTaskList)
      // console.log("3.0 use effect here : "+updatedTaskList)
    })
    .catch((error) => {
      console.error('FAILED TO DELETE: ', error);
    })
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
                  key={task.id}
                  dense
                >
                  <Checkbox
                    checked={task.finished}
                    onChange={() => toggleTaskCompletion(task)}
                  />
                  <ListItemText primary={task.name || "unnamed task"} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Container>
    </>
  );
}