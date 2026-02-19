
import connectDB from "@/lib/db";
import Notes from "@/components/Notes";
import Note from "@/models/Note";

async function getNotes() {
  await connectDB();
  const notes = (await Note?.find({}).sort({ createdAt: -1 }).lean()) || [];
  return notes.map((note) => ({
    ...note,
    _id: note._id.toString()
  }))
}


export default async function Home() {
  const notes = await getNotes()

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">Notes</h1>
      <Notes initialNotes={notes} />
    </div>
  );
}
