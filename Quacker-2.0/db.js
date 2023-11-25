const { MongoClient, ObjectId } = require('mongodb');


// MongoDB setup
const url = 'mongodb+srv://swade:iam@cluster0.ig7di0j.mongodb.net/?retryWrites=true&w=majority'; // Replace with your MongoDB URL
const dbName = 'quackdb'; // Your database name
const client = new MongoClient(url);


// Define your functions (login, makePost, etc.)

// MongoDB setup
async function connectDB() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");
  } catch (e) {
    console.error(e);
  }
}

connectDB();

// Login function
async function login(username, password) {
  const usersCollection = client.db("quackdb").collection("users");
  const user = await usersCollection.findOne({ username, password }); // Replace with hashed password check in production
  return user;
}

// Make Post function
async function addNewQuack(quack) {
  const quacksCollection = client.db("quackdb").collection("quacks");
  await quacksCollection.insertOne(quack);
  return getAllQuacks();
}

// Get All Quacks function
async function getAllQuacks() {
  const quacksCollection = client.db("quackdb").collection("quacks");
  const quacks = await quacksCollection.find({}).toArray();
  return quacks;
}

// Get Top 5 Quacks function
async function getTopFiveQuacks() {
  const quacksCollection = client.db("quackdb").collection("quacks");
  const topQuacks = await quacksCollection.find({}).sort({ likeCount: -1 }).limit(5).toArray();
  return topQuacks;
}



// Delete Post function
async function deletePost(quackId) {
  const quacksCollection = client.db("quackdb").collection("quacks");
  await quacksCollection.deleteOne({ _id: new ObjectId(quackId) });
  return getAllQuacks();
}

// Increment Likes function
async function incrementLikes(quackId) {
  const quacksCollection = client.db("quackdb").collection("quacks");
  await quacksCollection.updateOne({ _id: new ObjectId(quackId) }, { $inc: { likeCount: 1 } });
  return quacksCollection.findOne({ _id: new ObjectId(quackId) });
}

// Add Comment function
async function addComment(quackId, comment) {
  const quacksCollection = client.db("quackdb").collection("quacks");
  await quacksCollection.updateOne({ _id: new ObjectId(quackId) }, { $push: { comments: comment } });
  return quacksCollection.findOne({ _id: new ObjectId(quackId) });
}

// Expose functions for use in your application
module.exports = {
  login,
  addNewQuack,
  getAllQuacks,
  getTopFiveQuacks,
  deletePost,
  incrementLikes,
  addComment
};



