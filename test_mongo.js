const { MongoClient } = require('mongodb');
const dotenv = require('dotenv')

dotenv.config()
const client = new MongoClient(process.env.MONGO_URL);

async function connect_mongo() {
    try {
        await client.connect()
        const db = client.db(process.env.MONGO_DB_NAME);
        const collection = db.collection(process.env.MONGO_COLLECTION_NAME)
        const data = await collection.findOne()
        console.log(data._id)
    } catch (error) {
       console.log (error) 
    } finally{
        client.close()
    }
}

connect_mongo();