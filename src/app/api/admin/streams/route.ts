import { NextRequest, NextResponse } from "next/server";
import { readStreamsConfig, writeStreamsConfig } from "@/lib/streams";

export async function GET() {
  try {
    const config = readStreamsConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error("API /admin/streams GET error:", error);
    return NextResponse.json(
      { error: "Failed to read streams config" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { channels, matchOverrides } = body;

    if (!channels || !Array.isArray(channels)) {
      return NextResponse.json(
        { error: "Invalid payload: channels array required" },
        { status: 400 }
      );
    }

    writeStreamsConfig({ channels, matchOverrides: matchOverrides || {} });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API /admin/streams POST error:", error);
    return NextResponse.json(
      { error: "Failed to save streams config" },
      { status: 500 }
    );
  }
}
