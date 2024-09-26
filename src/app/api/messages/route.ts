import { DB, readDB, writeDB } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  readDB();

  const roomId = request.nextUrl.searchParams.get("roomId");
  const room = DB.rooms.find((room ) => room.roomId === roomId);

  if (!room) {
    return NextResponse.json(
      {
        ok: false,
        message: "Room is not found",
      },
      { status: 404 }
    );
  }

  const messages = DB.messages.filter((message ) => message.roomId === roomId);

  return NextResponse.json({
    ok: true,
    messages
  });
};

export const POST = async (request: NextRequest) => {
  readDB();

  const body = await request.json()
  const roomId = body.roomId 
  const messageText = body.messageText 
  const room = DB.rooms.find((room ) => room.roomId === roomId);

  if (!room) {
    return NextResponse.json(
      {
        ok: false,
        message: "Room is not found",
      },
      { status: 404 }
    );
  }

  const messageId = nanoid();

  DB.messages.push({ roomId, messageId, messageText });

  writeDB();

  return NextResponse.json({
    ok: true,
    messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request: NextRequest) => {
const payload = checkToken();
const body = await request.json();

//quiz said only for SUPER_ADMIN

if (!payload || ( payload.role !== "SUPER_ADMIN")) {
  return NextResponse.json(
    {
      ok: false,
      message: "Invalid token",
    },
    { status: 401 }
  );
}
 

  const roomId = body.roomId 
  const messageId = body.messageId 

  const messageIndex = DB.messages.findIndex(
    (message ) => message.roomId === roomId && message.messageId === messageId
  );

  if (messageIndex === -1) {
    return NextResponse.json(
      {
        ok: false,
        message: "Message is not found",
      },
      { status: 404 }
    );
  }

  DB.messages.splice(messageIndex, 1);

  writeDB();

  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
};

  