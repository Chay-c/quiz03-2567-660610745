import jwt from "jsonwebtoken";

import { DB, readDB } from "@lib/DB";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  readDB();
  const body = await request.json();
  const { username, password } = body;

  const user = DB.users.find(
    (user : any) => user.username === username && user.password === password
  );

  if (!user) {
    return NextResponse.json(
      {
        ok: false,
        message: "Username or password is incorrect",
      },
      { status: 400 }
    );
  }
 
  const secret = process.env.JWT_SECRET || "My secret token";

  const token = jwt.sign(
    { username, password },
    secret,
  );

  return NextResponse.json({ ok: true, token });
};
