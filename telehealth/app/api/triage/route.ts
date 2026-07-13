import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { symptom } = await req.json();
    let response = { 
      level: "Routine", 
      advice: "Monitor symptoms." 
    };

    if (symptom === "chest_pain") {
      response = { level: "Emergency", advice: "Call 911 immediately." };
    } else if (symptom === "fever") {
      response = { level: "Urgent", advice: "Schedule a visit." };
    }
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}