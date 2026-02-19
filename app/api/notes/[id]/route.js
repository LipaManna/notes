import connectDB from "@/lib/db";
import Note from "@/models/Note";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        await connectDB();
        const note = await Note.findByIdAndDelete(id);
        if (!note) {
            return NextResponse.json({ success: false, message: "Note not found" }, { status: 404 })
        }
        return NextResponse.json({ success: true, message: "Note deleted successfully" }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

export async function PUT(request, {params}){
    try {
        const {id} = await params;
        await connectDB();
        const body = await request.json();
        const note = await Note.findByIdAndUpdate(id, {...body, updatedAt: new Date()}, {new: true})
        if(!note){
            return NextResponse.json({success: false, message: "Note not found"}, {status: 404})
        }
        return NextResponse.json({success: true, data: note}, {status: 200})
    } catch (error) {
        return NextResponse.json({success: false, error: error.message}, {status: 500})
    }
}