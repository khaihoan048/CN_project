class QueryHandler{

	constructor(){
		this.Mongodb = require("./../config/db");
	}

	getUserByUsername(username){
		console.log('getUserByUserName');
		return new Promise( async (resolve, reject) => {
			try {
				const [DB, ObjectID] = await this.Mongodb.onConnect();
				const res = await DB.collection('user').find({ username: username }).toArray();
				// console.log(res[0]);
				// DB.close();
				if (res !== undefined)
					resolve(res[0]);
				else
					reject();
			} catch (error) {
				reject(error)
			}	
		});
	}

	makeUserOnline(userId){
		console.log('Make user online');
		// console.log(userId);
		return new Promise( async (resolve, reject) => {
			try {
				const [DB, ObjectID] = await this.Mongodb.onConnect();
				try{
					await DB.collection('user').updateOne(
						{ _id : Object(userId) },
						{ "$set": {online: 'Y'} },
						{ new: true, upsert: true},
						(err, res) => {
							console.log('Query successfully');
							if (err){
								console.log('Query error');
								reject(err);
							}
							// console.log(res);
							resolve(res.value);
						}
					);
				} catch (err){
					reject(err);
				}

			} catch (error) {
				reject(error)
			}	
		});
	}

	registerUser(data){
		return new Promise( async (resolve, reject) => {
			try {
				const [DB, ObjectID] = await this.Mongodb.onConnect();
				try {
					const res = await DB.collection('user').insertOne(data);
					DB.close();
					// console.log(res);
					resolve(res);
				} catch (err){
					resolve(err);
				}
			} catch (error) {
				reject(error)
			}	
		});
	}

	userSessionCheck(data){
		return new Promise( async (resolve, reject) => {
			try {
				const [DB, ObjectID] = await this.Mongodb.onConnect();
				DB.collection('user').findOne( 
					{ _id : ObjectID(data.userId) , online : 'Y'}, 
					(err, result) => {
						// DB.close();
						if( err ){
							reject(err);
						}
						resolve(result);
					}
				);	
			} catch (error) {
				reject(error)
			}
		});
	}

	getUserInfo({userId,socketId = false}){
		let queryProjection = null;
		if(socketId){
			queryProjection = {
				"socketId" : true
			}
		} else {
			queryProjection = {
				"username" : true,
				"online" : true,
				'_id': false,
				'id': '$_id'
			}
		}
		return new Promise( async (resolve, reject) => {
			try {
				const [DB, ObjectID] = await this.Mongodb.onConnect();
				DB.collection('user').aggregate([{
					$match:  {
						_id : ObjectID(userId)
					}
				},{
					$project : queryProjection
				}
				]).toArray( (err, result) => {
					DB.close();
					if( err ){
						reject(err);
					}
					socketId ? resolve(result[0]['socketId']) : resolve(result);
				});
			} catch (error) {
				reject(error)
			}
		});
	}

	addSocketId({userId, socketId}){
		const data = {
			id : userId,
			value : {
				$set :{
					socketId : socketId,
					online : 'Y'
				}
			}
		};
		return new Promise( async (resolve, reject) => {
			try {
				const [DB, ObjectID] = await this.Mongodb.onConnect();
				DB.collection('user').update( { _id : ObjectID(data.id)}, data.value ,(err, result) => {
					DB.close();
					if( err ){
						reject(err);
					}
					resolve(result);
				});
			} catch (error) {
				reject(error)
			}
		});
	}

	getChatList(userId){
		return new Promise( async (resolve, reject) => {
			try {
				const [DB, ObjectID] = await this.Mongodb.onConnect();
				DB.collection('user').aggregate([{
					$match: {
						'socketId': { $ne : userId}
					}
				},{
					$project:{
						"username" : true,
						"online" : true,
						'_id': false,
						'id': '$_id'
					}
				}
				]).toArray( (err, result) => {
					DB.close();
					if( err ){
						reject(err);
					}
					resolve(result);
				});
			} catch (error) {
				reject(error)
			}
		});
	}

	insertMessages(messagePacket){
		return new Promise( async (resolve, reject) => {
			try {
				const [DB, ObjectID] = await this.Mongodb.onConnect();
				DB.collection('messages').insertOne(messagePacket, (err, result) =>{
					DB.close();
					if( err ){
						reject(err);
					}
					resolve(result);
				});
			} catch (error) {
				reject(error)
			}
		});
	}

	getMessages({userId, toUserId}){
		const data = {
				'$or' : [
					{ '$and': [
						{
							'toUserId': userId
						},{
							'fromUserId': toUserId
						}
					]
				},{
					'$and': [ 
						{
							'toUserId': toUserId
						}, {
							'fromUserId': userId
						}
					]
				},
			]
		};	    
		return new Promise( async (resolve, reject) => {
			try {
				const [DB, ObjectID] = await this.Mongodb.onConnect();
				DB.collection('messages').find(data).sort({'timestamp':1}).toArray( (err, result) => {
					DB.close();
					if( err ){
						reject(err);
					}
					resolve(result);
				});
			} catch (error) {
				reject(error)
			}
		});
	}

	logout(userID,isSocketId){
		const data = {
			$set :{
				online : 'N'
			}
		};
		return new Promise( async (resolve, reject) => {
			try {
				const [DB, ObjectID] = await this.Mongodb.onConnect();		
				let condition = {};
				if (isSocketId) {
					condition.socketId = userID;
				}else{
					condition._id = ObjectID(userID);
				}
				DB.collection('user').update( condition, data ,(err, result) => {
					DB.close();
					if( err ){
						reject(err);
					}
					resolve(result);
				});
			} catch (error) {
				reject(error)
			}
		});
	}
}

module.exports = new QueryHandler();