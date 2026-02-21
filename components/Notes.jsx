"use client";
import { useEffect, useState } from "react";
import SearchBox from "./SearchBox";
import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const Notes = ({ initialNotes }) => {
  const [notes, setNotes] = useState(initialNotes);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filteredNotes, setFilterNotes] = useState(notes);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !author.trim()) return;
    setLoading(true);
    try {
      const url = editingId
        ? `${BASE_URL}/api/notes/${editingId}`
        : `${BASE_URL}/api/notes`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content, author }),
      });
      const result = await res.json();
      if (result.success) {
        if (editingId) {
          setNotes(notes.map((n) => (n._id === editingId ? result.data : n)));
          toast.success("Note updated successfully");
        } else {
          setNotes([result.data, ...notes]);
          toast.success("Note added successfully");
        }
        setTitle("");
        setContent("");
        setAuthor("");
        setEditingId(null);
        setLoading(false);
      }
    } catch (error) {
      toast.error("Something went wrong");
      setLoading(false);
    }
  };

  const handleEdit = (note) => {
    setEditingId(note._id);
    setTitle(note.title);
    setContent(note.content);
    setAuthor(note.author);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/api/notes/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result?.success) {
        setNotes(notes.filter((note) => note._id !== id));
        return toast.success(result.message);
      }
      return toast.error(result.error);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (search === "") {
      setFilterNotes(notes);
    } else {
      const lowerSearch = search.toLowerCase();
      const filtered = notes.filter(
        (note) =>
          note.title.toLowerCase().includes(lowerSearch) ||
          note.content.toLowerCase().includes(lowerSearch),
      );
      setFilterNotes(filtered);
    }
  }, [search, notes]);

  return (
    <div className="space-y-6">
      <h2>{editingId ? "Edit Note" : "Add New Note"}</h2>
      <SearchBox setSearch={setSearch} search={search} />
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
          onClick={handleSubmit}
        >
          {loading
            ? editingId
              ? "Updating..."
              : "Adding..."
            : editingId
              ? "Update Note"
              : "Add Note"}
        </button>
        {editingId && (
          <button
            type="button"
            className="ml-2 px-4 py-2 bg-gray-500 text-white rounded-md cursor-pointer"
            onClick={() => {
              setEditingId(null);
              setTitle("");
              setContent("");
              setAuthor("");
            }}
          >
            Cancel
          </button>
        )}
      </form>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">
          Your Notes ({filteredNotes?.length})
        </h2>
        {filteredNotes.length === 0 ? (
          <p className="text-center text-gray-500">No notes found</p>
        ) : (
          filteredNotes?.map((note) => (
            <div
              key={note._id}
              className="bg-white p-6 rounded-lg shadow-md hover:bg-gray-100 transition-colors"
            >
              <h3 className="text-xl font-bold text-gray-800">{note.title}</h3>
              <p className="text-gray-600">{note.content}</p>
              <p className="text-gray-500">{note.author}</p>
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer"
                  onClick={() => handleEdit(note)}
                >
                  Edit
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-md cursor-pointer"
                  onClick={() => handleDelete(note._id)}
                >
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
