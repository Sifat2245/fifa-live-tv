import { NextRequest, NextResponse } from "next/server";
import { getChannelsForMatch } from "@/lib/streams";

interface RouteParams {
  params: Promise<{ matchId: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { matchId } = await params;
    const result = getChannelsForMatch(matchId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("API /channels error:", error);
    return NextResponse.json(
      { error: "Failed to fetch channels" },
      { status: 500 }
    );
  }
}
