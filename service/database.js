const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;

const client = new MongoClient(url);
const db = client.db('startup');
const collection = db.collection('users');
const fileCollection = db.collection('files');

(async function testConnection() {
    try {
        await db.command({ ping: 1 });
        console.log(`DB connected to ${config.hostname}`);
      } catch (ex) {
        console.log(`Error with ${url} because ${ex.message}`);
        process.exit(1);
      }
})();

async function addUser(user) {
    await collection.insertOne(user);
}

async function addFiles(user, file) {
    await collection.updateOne({ userName: user.userName }, { $push: { files: file } });
}

async function findUser(token) {
    return await collection.findOne({ token: token });
}

async function findByUserName(userName) {
    return await collection.findOne({ userName: userName });
}

async function updateUserToken(userName, token) {
    await collection.updateOne({ userName: userName }, { $set: { token: token } });
}

async function updateFileChatHistory(userName, fileID, history) {
    await collection.updateOne({ userName: userName, "files.fileID": fileID }, { $set: { "files.$.fileChatHistory": history } });
}

async function addFile(file) {
    await fileCollection.insertOne(file);
}

async function findFile(fileID) {
    return await fileCollection.findOne({ fileID: fileID });
}

module.exports = { addUser, addFiles, findUser, findByUserName, updateUserToken, updateFileChatHistory, addFile, findFile };
