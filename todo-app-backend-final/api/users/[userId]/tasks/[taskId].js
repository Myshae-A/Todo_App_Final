import { db } from '../../../../firebase/firebase.js';

export default async function handler(req, res) {
    const taskId = req.params.taskId;
    const { userId } = req.params;
    if (req.method === 'DELETE') {
        if (taskId === undefined) {
            res.status(404).send('Task not found');
            return;
        }

        try {
            const taskRef = db.collection("users").doc(userId).collection("tasks").doc(taskId);

            // Attempt to delete the task document
            await taskRef.delete();

            res.status(200).send(`taskId: ${taskId} is deleted!!!`);
        } catch (error) {
            res.status(500).send(`Error deleting task: ${error.message}`);
        }
    } else {
        res.setHeader('Allow', ['DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}