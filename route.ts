import { NextRequest, NextResponse } from "next/server";
import { approveClipInStore } from "@/lib/db/store";

export async function POST(req: NextRequest) {
  try {
    const { projectId, clipId } = await req.json();

    if (!projectId || !clipId) {
      return NextResponse.json(
        { error: "projectId and clipId are required" },
        { status: 400 }
      );
    }

    const project = await approveClipInStore(projectId, clipId);
    return NextResponse.json({ project });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to approve clip" },
      { status: 500 }
    );
  }
}
