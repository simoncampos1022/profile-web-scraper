import { NextResponse } from "next/server";
import { FilterQuery } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Profile } from "@/models/Profile";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get("limit") || "100");
  const page = parseInt(url.searchParams.get("page") || "1");
  const name = url.searchParams.get("name");
  const age = url.searchParams.get("age");
  const location = url.searchParams.get("location");
  const funding = url.searchParams.get("funding");
  const keyword = url.searchParams.get("keyword");
  const technicalStatus = url.searchParams.get("technicalStatus");

  const skip = (page - 1) * limit;
  const query: FilterQuery<typeof Profile> = {};

  // Ensure age is parsed as an integer before using it in the query
  if (age) {
    const parsedAge = parseInt(age);
    if (!isNaN(parsedAge)) {
      query.age = { $gte: parsedAge };
    }
  }

  if (name) query.name = { $regex: name, $options: "i" };
  if (location) query.location = { $regex: location, $options: "i" };
  if (funding) query["startup.funding"] = { $regex: funding, $options: "i" };

  // Broad keyword search across many text fields
  if (keyword && keyword.trim().length > 0) {
    const rx = { $regex: keyword, $options: "i" } as const;
    query.$or = [
      { name: rx },
      { location: rx },
      { sumary: rx },
      { intro: rx },
      { lifeStory: rx },
      { freeTime: rx },
      { other: rx },
      { accomplishments: rx },
      { linkedIn: rx },
      { "startup.name": rx },
      { "startup.description": rx },
      { "startup.progress": rx },
      { "startup.funding": rx },
      { education: rx }, // matches any array element with regex
      { employment: rx },
      { "cofounderPreferences.requirements": rx },
      { "cofounderPreferences.idealPersonality": rx },
      { "cofounderPreferences.equity": rx },
      { "interests.shared": rx },
      { "interests.personal": rx },
    ];
  }

  // Add technicalStatus filter
  if (technicalStatus === "technical") {
    // Include 'technical' but not 'non-technical' in sumary OR intro
    query.$and = [
      {
        $or: [
          { sumary: { $regex: "\\btechnical\\b", $options: "i" } },
          { intro: { $regex: "\\btechnical\\b", $options: "i" } },
        ],
      },
      {
        $nor: [
          { sumary: { $regex: "\\bnon[- ]?technical\\b", $options: "i" } },
          { intro: { $regex: "\\bnon[- ]?technical\\b", $options: "i" } },
        ],
      },
    ];
  } else if (technicalStatus === "non-technical") {
    // Only match 'non-technical' (or nontechnical etc)
    query.$or = [
      { sumary: { $regex: "\\bnon[- ]?technical\\b", $options: "i" } },
      { intro: { $regex: "\\bnon[- ]?technical\\b", $options: "i" } },
    ];
  }

  try {
    await connectDB();

    // Get total count of matching documents
    const total = await Profile.countDocuments();
    const matched = await Profile.countDocuments(query);

    // Fetch profiles based on the query
    const profiles = await Profile.find(query)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return NextResponse.json(
      { data: profiles, total, matched }, // Simplified object syntax
      { status: 200 }
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    const errorStack = error instanceof Error ? error.stack : "";

    console.error("Fetching error details:", {
      message: errorMessage,
      stack: errorStack,
    });

    return NextResponse.json(
      { data: [], message: errorMessage },
      { status: 500 }
    ); // Added error message to response
  }
}
