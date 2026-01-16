import { uploadToR2 } from "@/lib/r2";
import { NextRequest, NextResponse } from "next/server";

// CORS headers for draw.kkrll.com
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://draw.kkrll.com",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Handle preflight requests
export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const txtContent = await request.text();

    if (!txtContent || txtContent.length === 0) {
      return NextResponse.json(
        { success: false, error: "No content provided" },
        { status: 400, headers: corsHeaders },
      );
    }
    if (txtContent.length > 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: "File too large (max 1MB)" },
        { status: 400, headers: corsHeaders },
      );
    }

    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const filename = `${timestamp}-${random}.txt`;
    const key = `ascii/${filename}`;

    const url = await uploadToR2(txtContent, key, "text/plain; charset=utf-8");

    return NextResponse.json(
      {
        success: true,
        url,
      },
      { headers: corsHeaders },
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Upload failed",
      },
      { status: 500, headers: corsHeaders },
    );
  }
}
