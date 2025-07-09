import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("images") as File[];

    if (!files || files.length === 0) {
      return new NextResponse("No images provided", { status: 400 });
    }

    const uploadPromises = files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      return new Promise<string>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "reviews" }, (error: any, result: any) => {
            if (error || !result) {
              reject(error || new Error("Upload failed"));
            } else {
              resolve(result.secure_url);
            }
          })
          .end(buffer);
      });
    });

    const imageUrls = await Promise.all(uploadPromises);

    return NextResponse.json({ imageUrls });
  } catch (error) {
    console.log("[UPLOAD_POST]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
