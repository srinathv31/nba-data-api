import "../../config.js";
import { MongoClient } from "mongodb";

const connectionString = process.env.MONGO_URI || "";
const client = new MongoClient(connectionString);
let conn;
try {
  conn = await client.connect();
  console.log("Connected to Mongo 🤖");
} catch (e) {
  console.error(e);
}
let db = conn.db("nba-data");
export default db;
