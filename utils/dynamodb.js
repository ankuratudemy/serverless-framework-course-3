const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const bcrypt = require('bcryptjs');

const createUser = async(item,tableName) => {
    try{
        const timestamp = new Date().toISOString();
        const params = {
            "TableName": tableName,
            "Item": { 
                ...item,
                password:  bcrypt.hashSync(item.password, 8),
                createdAt: timestamp,
                updatedAt: timestamp
            }
        };

        return dynamoDb.put(params).promise();

    }
    catch(error){
        console.log(error)
        throw err

    }
}

const getUser = async (email,tableName) => {

    const params = {
        TableName: tableName,
        Key: {
            "email": email
        },
        ProjectionExpression: "email,lastName,Firstname",
        ReturnConsumedCapacity: "TOTAL", // INDEX
        ConsistentRead: true

    }
    return dynamoDb.get(params).promise();
}


const getUsersByCountryAndCreateTime = async (item,tableName) => {

    const params = {
        TableName: tableName,
        IndexName: 'createdAtIndex',
        KeyConditionExpression: "country = :country AND createdAt > :createdAt",
        FilterExpression: "firstName = :firsName",
        ExpressionAttributeValues: {
            ":createdAt": item.createdAt,
            ":country": item.country,
            ":firsName": item.firstName

        },
        ProjectionExpression: "email,country,createdAt,lastName,Firstname",
        ReturnConsumedCapacity: "TOTAL", // INDEX

    }
    return dynamoDb.query(params).promise();
}


const getUsersByCountryAndCreateTimeScan = async (item,tableName) => {

    const params = {
        TableName: tableName,
        IndexName: 'createdAtIndex',
        FilterExpression: "firstName = :firsName AND country = :country AND createdAt > :createdAt",
        ExpressionAttributeValues: {
            ":createdAt": item.createdAt,
            ":country": item.country,
            ":firsName": item.firstName

        },
        ProjectionExpression: "email,country,createdAt,lastName,Firstname",
        ReturnConsumedCapacity: "TOTAL", // INDEX

    }
    return dynamoDb.scan(params).promise();
}



module.exports = {
    createUser,
    getUser,
    getUsersByCountryAndCreateTime,
    getUsersByCountryAndCreateTimeScan
}