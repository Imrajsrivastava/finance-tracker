import dotenv from "dotenv";
import connectDB from "./lib/db.js";
import User from "./models/User.js";
import Transaction from "./models/Transaction.js";

dotenv.config();

async function run() {
  await connectDB(process.env.MONGO_URI);
  await User.deleteMany({});
  await Transaction.deleteMany({});

  const admin = await User.create({ name: "Admin", email: "admin@test.com", password: "admin123", role: "admin" });
  const user = await User.create({ name: "User", email: "user@test.com", password: "user123", role: "user" });
  const readOnly = await User.create({ name: "Viewer", email: "viewer@test.com", password: "viewer123", role: "read-only" });

  const now = new Date();
  const sample = [
    { user: user._id, type: "income", category: "Salary", amount: 50000, date: new Date(now.getFullYear(), 0, 1), note: "Jan salary" },
    { user: user._id, type: "expense", category: "Food", amount: 3500, date: new Date(now.getFullYear(), 0, 5), note: "Groceries" },
    { user: user._id, type: "expense", category: "Transport", amount: 1200, date: new Date(now.getFullYear(), 1, 12), note: "Metro card" },
    { user: user._id, type: "income", category: "Investment", amount: 3000, date: new Date(now.getFullYear(), 2, 10), note: "FD interest" }
  ];
  await Transaction.insertMany(sample);

  console.log("Seeded users: admin@test.com/admin123, user@test.com/user123, viewer@test.com/viewer123");
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
