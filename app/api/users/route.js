import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();
    const users = await User.find({}, "name email lastLogin isBlocked").sort({
      lastLogin: -1,
    });
    return Response.json(users);
  } catch (err) {
    return new Response("Failed to fetch users", { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const { action, userIds } = await req.json();

    if (!Array.isArray(userIds) || userIds.length === 0)
      return new Response("No user IDs provided", { status: 400 });

    let update = {};
    if (action === "block") update = { isBlocked: true };
    else if (action === "unblock") update = { isBlocked: false };
    else if (action === "delete") {
      await User.deleteMany({ _id: { $in: userIds } });
      return new Response("Users deleted", { status: 200 });
    } else return new Response("Invalid action", { status: 400 });

    await User.updateMany({ _id: { $in: userIds } }, update);
    return new Response("Users updated", { status: 200 });
  } catch (err) {
    return new Response("Error updating users", { status: 500 });
  }
}
