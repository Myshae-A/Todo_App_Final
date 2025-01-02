export default async function handler(req, res) {
    if( req.method == 'GET' ) {
        console.log("GET (message) endpoint contacted")
        res.json({ message: 'Hello from the server (message.js)!' });
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};