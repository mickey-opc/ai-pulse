import { NextResponse } from "next/server";
import { subscribeSchema } from "@/lib/schema";
import { addSubscriber, removeSubscriber } from "@/lib/subscribers";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = subscribeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const subscriber = await addSubscriber(parsed.data.email);
  return NextResponse.json({ subscriber }, { status: 201 });
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const parsed = subscribeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  await removeSubscriber(parsed.data.email);
  return NextResponse.json({ ok: true });
}
