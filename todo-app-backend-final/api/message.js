module.exports = (req, res) => {
    console.log("GET (message) endpoint contacted")
    res.json({ message: 'Hello from the server (message.js)!' });
};