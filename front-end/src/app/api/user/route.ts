// app/api/user/route.ts
import { NextResponse } from "next/server";
import { getUserInfo } from "@/api-actions/auth";

export async function GET() {
  try {
    const data = await getUserInfo();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(err);
  }
}
