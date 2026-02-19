"use client";
import { useState } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const Notes = ({ initialNotes }) => {
  const [notes, setNotes] = useState(initialNotes);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);

  const createNote = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !author.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content, author }),
      });
      const result = await res.json();
      if (result.success) {
        setNotes([result.data, ...notes]);
        setTitle("");
        setContent("");
        setAuthor("");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2>Add New Note</h2>
      <form
        action=""
        className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto"
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4 text-gray-800"
        />
        <textarea
          name=""
          id=""
          cols="30"
          rows="10"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4 text-gray-800"
          placeholder="Content"
        ></textarea>
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg mb-4 text-gray-800"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer"
          onClick={createNote}
        >
          {loading ? "Adding..." : "Add Note"}
        </button>
      </form>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Your Notes ({notes?.length})</h2>
        {notes.length === 0 ? (
          <p className="text-center text-gray-500">No notes found</p>
        ) : (
          notes.map((note) => (
            <div key={note._id} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold">{note.title}</h3>
              <p className="text-gray-600">{note.content}</p>
              <p className="text-gray-500">{note.author}</p>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer">
                  Edit
                </button>
                <button className="px-4 py-2 bg-red-500 text-white rounded-md cursor-pointer">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notes;
