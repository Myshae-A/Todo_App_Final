module.exports = (req, res) => {
    console.log("GET (index) endpoint contacted")
    res.json({ message: 'Hello world (index.js)!' });
};