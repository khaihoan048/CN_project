/*requiring mongodb node modules */
const { MongoClient, ObjectId } = require('mongodb');
const mongodb = require('mongodb');
const DB = mongodb.Db;
const assert = require('assert');
require('dotenv').config();

class Db{

	constructor(){
		this.mongoClient = new MongoClient(process.env.DB_URL);
		this.ObjectID = mongodb.ObjectId;
	}

	onConnect(){
		const mongoURL = process.env.DB_URL;
		return new Promise( async (resolve, reject) => {
		
			try {
				await this.mongoClient.connect();
				console.log('Connected to dababase server');
				// assert.equal(null, err);
				const db = this.mongoClient.db(process.env.DB_NAME);
				resolve([db, this.ObjectID]);
			}
			catch (err){
				reject(err);
			}
		});
	}
}
module.exports = new Db();