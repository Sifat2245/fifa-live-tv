import { NextRequest, NextResponse } from "next/server";

/**
 * CORS proxy for HLS streams.
 * Usage: GET /api/proxy/stream?url=https://example.com/stream.m3u8
 * Pipes the m3u8 manifest and subsequent segment requests through the server
 * to avoid CORS restrictions in the browser.
 */
export async function GET(request: NextRequest) {
  const streamUrl = request.nextUrl.searchParams.get("url");

  if (!streamUrl) {
    return NextResponse.json(
      { error: "Missing 'url' query parameter" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(streamUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; FIFA2026Live/1.0)",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Stream returned ${res.status}` },
        { status: res.status }
      );
    }

    // Forward the content with appropriate CORS headers
    const body = await res.arrayBuffer();
    const contentType =
      res.headers.get("content-type") || "application/vnd.apple.mpegurl";

    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Proxy stream error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stream" },
      { status: 502 }
    );
  }
}
