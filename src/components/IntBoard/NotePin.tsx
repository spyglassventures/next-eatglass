// src/components/BulletinBoard/NotePin.tsx
import React, { useState, useRef, useEffect, FC } from "react";
import Draggable from "react-draggable";
import { Note, Kommentar } from "./BulletinBoard";

// Helper function to convert URLs in text into clickable links.
function parseLinks(text: string = ""): React.ReactNode {
    const regex = /((https?:\/\/)|(www\.))([\w.-]+\.[a-z]{2,})(\/\S*)?/gi;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
        const index = match.index;
        if (index > lastIndex) {
            parts.push(text.slice(lastIndex, index));
        }
        let url = match[0];
        if (!url.startsWith("http")) {
            url = "http://" + url;
        }
        parts.push(
            <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{ color: "#2563eb", textDecoration: "underline" }}
            >
                {match[0]}
            </a>
        );
        lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }
    return parts;
}

interface NotePinProps {
    note: Note;
    onUpdate: (id: number, updatedFields: Partial<Note>) => void;
    onDelete: (id: number) => void;
}

const NotePin: FC<NotePinProps> = ({ note, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [localTitle, setLocalTitle] = useState<string>(note.title);
    const [localContent, setLocalContent] = useState<string>(note.content);
    const [newCommentText, setNewCommentText] = useState<string>("");
    const [expanded, setExpanded] = useState<boolean>(false);
    const nodeRef = useRef<HTMLDivElement>(null);

    const saveChanges = () => {
        onUpdate(note.id, { title: localTitle, content: localContent });
        setIsEditing(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isEditing &&
                nodeRef.current &&
                !nodeRef.current.contains(event.target as Node)
            ) {
                saveChanges();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [isEditing]);

    const addComment = () => {
        if (!newCommentText.trim()) return;
        const now = new Date().toLocaleString("de-DE", {
            hour: "2-digit",
            minute: "2-digit",
        });
        const newKommentar: Kommentar = { text: newCommentText.trim(), time: now };
        const updatedComments = [...(note.comments || []), newKommentar];
        onUpdate(note.id, { comments: updatedComments });
        setNewCommentText("");
    };

    const likeHeart = () => {
        onUpdate(note.id, { heartCount: note.heartCount + 1 });
    };
    const likeThumbUp = () => {
        onUpdate(note.id, { thumbUpCount: note.thumbUpCount + 1 });
    };
    const likeThumbDown = () => {
        onUpdate(note.id, { thumbDownCount: note.thumbDownCount + 1 });
    };

    const displayedContent =
        expanded || localContent.length <= 100
            ? localContent
            : localContent.substring(0, 100) + "...";

    return (
        <Draggable
            nodeRef={nodeRef}
            defaultPosition={{ x: note.x, y: note.y }}
            onStop={(e, data) => onUpdate(note.id, { x: data.x, y: data.y })}
        >
            <div
                ref={nodeRef}
                style={{
                    backgroundColor: "#fff",
                    padding: "16px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    border: "1px solid #ccc",
                    maxWidth: "350px",
                    maxHeight: "350px",
                    overflowY: "auto",
                    color: "#000",
                    position: "relative",
                    marginBottom: "8px",
                    userSelect: "none",
                }}
            >
                {/* Delete Button */}
                <button
                    onClick={() => onDelete(note.id)}
                    title="Notiz löschen"
                    style={{
                        position: "absolute",
                        top: "4px",
                        right: "4px",
                        background: "transparent",
                        border: "none",
                        color: "#dc2626",
                        fontWeight: "bold",
                        fontSize: "16px",
                        cursor: "pointer",
                    }}
                >
                    &times;
                </button>

                {/* Header */}
                <div
                    style={{
                        marginBottom: "8px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "12px",
                        color: "#555",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <h3
                            style={{
                                fontWeight: "bold",
                                marginBottom: "4px",
                                display: "inline-block",
                            }}
                        >
                            {note.title}
                        </h3>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsEditing(true);
                            }}
                            style={{
                                background: "transparent",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "16px",
                                marginLeft: "8px",
                                color: "#3b82f6",
                            }}
                            title="Bearbeiten"
                        >
                            &#9998;
                        </button>
                    </div>
                    <div style={{ textAlign: "right" }}>
                        <div>
                            <strong>Autor:</strong> {note.author}
                        </div>
                        <div>
                            <strong>Zeit:</strong> {note.time}
                        </div>
                    </div>
                </div>

                {/* Like Counters */}
                <div
                    style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                        marginBottom: "8px",
                        fontSize: "12px",
                        color: "#555",
                    }}
                >
                    <button
                        onClick={likeHeart}
                        style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "16px",
                        }}
                        title="Gefällt mir (Herz)"
                    >
                        ❤️
                    </button>
                    <span>{note.heartCount}</span>
                    <button
                        onClick={likeThumbUp}
                        style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "16px",
                            marginLeft: "8px",
                            marginRight: "4px",
                        }}
                        title="Gefällt mir (Daumen hoch)"
                    >
                        👍
                    </button>
                    <span>{note.thumbUpCount}</span>
                    <button
                        onClick={likeThumbDown}
                        style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "16px",
                            marginLeft: "8px",
                            marginRight: "4px",
                        }}
                        title="Gefällt mir nicht (Daumen runter)"
                    >
                        👎
                    </button>
                    <span>{note.thumbDownCount}</span>
                </div>

                {/* Content */}
                {isEditing ? (
                    <>
                        <input
                            type="text"
                            value={localTitle}
                            onChange={(e) => setLocalTitle(e.target.value)}
                            placeholder="Titel bearbeiten"
                            style={{
                                width: "100%",
                                padding: "8px",
                                marginBottom: "8px",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                color: "#000",
                            }}
                        />
                        <textarea
                            value={localContent}
                            onChange={(e) => setLocalContent(e.target.value)}
                            rows={3}
                            placeholder="Inhalt bearbeiten"
                            style={{
                                width: "100%",
                                padding: "8px",
                                marginBottom: "8px",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                color: "#000",
                            }}
                        />
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                            <button
                                onClick={() => setIsEditing(false)}
                                style={{
                                    padding: "6px 12px",
                                    backgroundColor: "#d1d5db",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                }}
                            >
                                Abbrechen
                            </button>
                            <button
                                onClick={saveChanges}
                                style={{
                                    padding: "6px 12px",
                                    backgroundColor: "#3b82f6",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                }}
                            >
                                Speichern
                            </button>
                        </div>
                    </>
                ) : (
                    <div>
                        <p>
                            {parseLinks(displayedContent)}{" "}
                            {localContent.length > 100 && !expanded && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setExpanded(true);
                                    }}
                                    style={{
                                        background: "transparent",
                                        border: "none",
                                        color: "#3b82f6",
                                        cursor: "pointer",
                                        fontSize: "12px",
                                    }}
                                >
                                    Mehr anzeigen
                                </button>
                            )}
                            {expanded && localContent.length > 100 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setExpanded(false);
                                    }}
                                    style={{
                                        background: "transparent",
                                        border: "none",
                                        color: "#3b82f6",
                                        cursor: "pointer",
                                        fontSize: "12px",
                                    }}
                                >
                                    Weniger
                                </button>
                            )}
                        </p>
                    </div>
                )}

                {/* Comments */}
                <div
                    style={{
                        marginTop: "12px",
                        borderTop: "1px solid #e5e7eb",
                        paddingTop: "8px",
                        fontSize: "14px",
                    }}
                >
                    {(note.comments || []).map((comment, idx) => (
                        <p key={idx} style={{ marginBottom: "4px", color: "#374151" }}>
                            {parseLinks(comment.text)}{" "}
                            <span style={{ fontSize: "10px", color: "#6b7280" }}>
                                {comment.time}
                            </span>
                        </p>
                    ))}
                    <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                        <input
                            type="text"
                            value={newCommentText}
                            onChange={(e) => setNewCommentText(e.target.value)}
                            placeholder="Kommentar hinzufügen..."
                            style={{
                                flex: 1,
                                padding: "6px",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                fontSize: "12px",
                                color: "#000",
                            }}
                        />
                        <button
                            onClick={addComment}
                            style={{
                                padding: "6px 12px",
                                backgroundColor: "#10b981",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                fontSize: "12px",
                                cursor: "pointer",
                            }}
                        >
                            Hinzufügen
                        </button>
                    </div>
                </div>
            </div>
        </Draggable>
    );
};

export default NotePin;
