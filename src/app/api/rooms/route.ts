import { DB, readDB, writeDB } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  readDB();
  const rooms = DB.rooms;
  const totalRooms = rooms.length;
  return NextResponse.json({
    ok: true,
    rooms,
    totalRooms,
  });
};

export const POST = async (request: NextRequest) => {
  readDB();
  const body = await request.json();
  const payload = checkToken();

  // Check if the user has the required role
  
  if (!payload || (typeof payload !== "string" || (payload.role !== "ADMIN" && payload.role !== "SUPER_ADMIN"))) {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },{
        status : 401
      }
    );
  }

  const roomName = body.roomName; 

  // Check if the room already exists
  const existingRoom = DB.rooms.find((room ) => room.roomName === roomName);
  if (existingRoom) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room ${roomName} already exists`,
      },
      { status: 400 }
    );
  }

  const roomId = nanoid();

  // Add the new room to the DB
  DB.rooms.push({ roomId, roomName });

  // Call writeDB after modifying the DB
  writeDB();

  return NextResponse.json({
    ok: true,
    roomId,
    message: `Room ${roomName} has been created`,
  });
};
