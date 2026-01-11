import { NextRequest, NextResponse } from "next/server";
import { getThreadMessages, replyToThread } from "@/app/actions";

// Simple auth check - in production, use proper authentication
function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const adminToken = process.env.ADMIN_API_TOKEN;

  if (!adminToken) {
    console.warn("ADMIN_API_TOKEN not configured - API is unprotected");
    return true; // Allow access if no token configured (dev mode)
  }

  return authHeader === `Bearer ${adminToken}`;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> },
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { threadId } = await params;
    const messages = await getThreadMessages(threadId);
    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ threadId: string }> },
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { threadId } = await params;
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    const businessEmail = process.env.BUSINESS_EMAIL;
    if (!businessEmail) {
      return NextResponse.json(
        { error: "Business email not configured" },
        { status: 500 },
      );
    }

    const result = await replyToThread(threadId, message, businessEmail);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Reply sent successfully",
      });
    } else {
      return NextResponse.json(
        { error: result.error || "Failed to send reply" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error sending reply:", error);
    return NextResponse.json(
      { error: "Failed to send reply" },
      { status: 500 },
    );
  }
}
