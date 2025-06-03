import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      return Response.json({ error: "Invalid credentials." }, { status: 401 });
    }

    if (user.status === "blocked") {
      return Response.json(
        { error: "Your account is blocked." },
        { status: 403 }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return Response.json({ error: "Invalid credentials." }, { status: 401 });
    }

    // update last login
    user.lastLogin = new Date();
    await user.save();
    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return Response.json(
      {
        message: "Login successful.",
        token,
        user: {
          name: user.name,
          email: user.email,
          status: user.status,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Login error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
