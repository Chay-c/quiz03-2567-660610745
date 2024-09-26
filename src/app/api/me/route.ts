import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Chayangkul Chanjarupong",
    studentId: "660610745",
  });
};
