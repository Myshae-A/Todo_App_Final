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

// const express = require('express');
// const cors = require('cors');
// const db = require('./firebase.js');
// require('dotenv').config();

// Your API routes will go here...
app.use(express.json())

let tasks = [];

// app.use("/", (req, res) => {
//   res.send("Server is running, hello world!");
// })

// testing more
export default (req, res) => {
  res.status(200).json({ message: 'Hello, world!' });
};

// Setting the port for the server to listen on
const PORT = process.env.PORT || 3001;

// Starting the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`);
});