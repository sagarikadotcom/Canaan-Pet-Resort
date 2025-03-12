import { NextRequest, NextResponse } from "next/server";
import multer from "multer";
import { writeFile } from "fs/promises";
import path from "path";

// Configure multer storage (Memory Buffer)
const upload = multer({ storage: multer.memoryStorage() });

// Function to handle file upload
export async function POST(req: NextRequest) {
  try {
    // Parse form-data request
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Define upload path
    const uploadPath = path.join(process.cwd(), "public/uploads", file.name);

    // Write file to server
    await writeFile(uploadPath, buffer);

    // Return uploaded file URL
    return NextResponse.json({ fileUrl: `/uploads/${file.name}` }, { status: 200 });
  } catch (error: any) {
    console.error("File Upload Error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
