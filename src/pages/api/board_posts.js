let posts = [];

export default function handler(req, res) {
    if (req.method === "GET") {
        res.status(200).json(posts);
    } else if (req.method === "POST") {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).json({ error: "Title and content are required" });
        }
        const newPost = { id: Date.now(), title, content, x: 0, y: 0, comments: [] };
        posts.push(newPost);
        res.status(201).json(newPost);
    } else if (req.method === "PUT") { // New: Update position
        const { id, x, y } = req.body;
        const post = posts.find(post => post.id === id);
        if (!post) {
            return res.status(404).json({ error: "Note not found" });
        }
        post.x = x;
        post.y = y;
        res.status(200).json(post);
    } else if (req.method === "DELETE") {
        const { id } = req.body;
        posts = posts.filter((post) => post.id !== id);
        res.status(200).json({ message: "Note deleted" });
    } else {
        res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
