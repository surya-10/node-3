import { MongoClient } from "mongodb";
import dotenv from "dotenv"
dotenv.config()
let connectionStr = process.env.str;

async function dbConnection(){
    let client = new MongoClient(connectionStr);
    await client.connect();
    console.log("DB Connected");
    return client;
}
export let client = await dbConnection();