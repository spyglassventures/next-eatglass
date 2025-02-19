// src/components/IntBoard/BulletinBoard.tsx
import React, { useState, useEffect, FC } from "react";
import NotePin from "./NotePin";

export interface Kommentar {
    text: string;
    time: string;
}

export interface Note {
    id: number;
    title: string;
    content: string;
    x: number;
    y: number;
    comments: Kommentar[];
    author: string;
    time: string;
    heartCount: number;
    thumbUpCount: number;
    thumbDownCount: number;
}

const BulletinBoard: FC = () => {
    const [posts, setPosts] = useState<Note[]>([]);
    const [author, setAuthor] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    // Load posts from localStorage on component mount.
    useEffect(() => {
        const storedPosts = localStorage.getItem("posts");
        if (storedPosts) {
            setPosts(JSON.parse(storedPosts));
        }
    }, []);

    // Update localStorage whenever posts change.
    useEffect(() => {
        localStorage.setItem("posts", JSON.stringify(posts));
    }, [posts]);

    const addPost = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!title || !content || !author) return;
        const now = new Date().toLocaleString("de-DE");
        const newPost: Note = {
            id: Date.now(),
            title,
            content,
            x: 0,
            y: 0,
            comments: [],
            author,
            time: now,
            heartCount: 0,
            thumbUpCount: 0,
            thumbDownCount: 0,
        };
        setPosts([...posts, newPost]);
        setTitle("");
        setContent("");
        setAuthor("");
        setModalOpen(false);
    };

    const updatePost = (id: number, updatedFields: Partial<Note>) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) =>
                post.id === id ? { ...post, ...updatedFields } : post
            )
        );
    };

    const deletePost = (id: number) => {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    };

    return (
        <div
            style={{
                maxWidth: "1200px",
                width: "100%",
                margin: "0 auto",
                position: "relative",
            }}
        >
            {/* Plus-Button in der oberen rechten Ecke */}
            <button
                onClick={() => setModalOpen(true)}
                style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: "#3b82f6",
                    color: "#fff",
                    border: "none",
                    fontSize: "24px",
                    cursor: "pointer",
                    zIndex: 10,
                }}
                title="Notiz hinzufügen"
            >
                +
            </button>

            {/* Bulletin-Board Container als Grid */}
            <div
                id="boardContainer"
                style={{
                    position: "relative",
                    backgroundColor: "#d1d5db",
                    padding: "32px",
                    minHeight: "80vh",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "16px",
                }}
            >
                {posts.length === 0 ? (
                    <p
                        style={{
                            textAlign: "center",
                            color: "#374151",
                            gridColumn: "1 / -1",
                        }}
                    >
                        Keine Notizen vorhanden.
                    </p>
                ) : (
                    posts.map((post) => (
                        <NotePin
                            key={post.id}
                            note={post}
                            onUpdate={updatePost}
                            onDelete={deletePost}
                        />
                    ))
                )}
            </div>

            {/* Modal zum Hinzufügen einer neuen Notiz */}
            {modalOpen && (
                <div
                    onClick={() => setModalOpen(false)}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            backgroundColor: "#fff",
                            padding: "24px",
                            borderRadius: "8px",
                            width: "320px",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                        }}
                    >
                        <h2
                            style={{
                                fontSize: "18px",
                                fontWeight: "bold",
                                marginBottom: "12px",
                            }}
                        >
                            Neue Notiz erstellen
                        </h2>
                        <form onSubmit={addPost}>
                            <input
                                type="text"
                                placeholder="Autor"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                required
                                style={{
                                    width: "100%",
                                    padding: "8px",
                                    marginBottom: "12px",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    color: "#000",
                                }}
                            />
                            <input
                                type="text"
                                placeholder="Titel"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                style={{
                                    width: "100%",
                                    padding: "8px",
                                    marginBottom: "12px",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    color: "#000",
                                }}
                            />
                            <textarea
                                placeholder="Inhalt (Links klickbar)"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                rows={3}
                                style={{
                                    width: "100%",
                                    padding: "8px",
                                    marginBottom: "12px",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    color: "#000",
                                }}
                            />
                            <button
                                type="submit"
                                style={{
                                    width: "100%",
                                    padding: "8px",
                                    backgroundColor: "#3b82f6",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                }}
                            >
                                Notiz hinzufügen
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BulletinBoard;
