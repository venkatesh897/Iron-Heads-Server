import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

async function connect()
{
    const monod = new MongoMemoryServer()
    await monod.start()
    const geturi = monod.getUri()
    mongoose.set('strictQuery',true)
    const db = await mongoose.connect(geturi)
    console.log("data base connect")
    return db

}

export default connect