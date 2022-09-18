require("dotenv").config();
const response = require("../../utils/response");
const { createUser,
         getUser,
         getUsersByCountryAndCreateTime,
         getUsersByCountryAndCreateTimeScan } = require("../../utils/dynamodb");
const { USERS_TABLE } = process.env;
const { sendTextEmail } = require("../email/email")

module.exports.createUser = async (event, context) => {
  try {
    console.log(event.body);
    const body = JSON.parse(event.body);
    //Save user in table. catch errors and get back response.

    const res = await createUser(body, USERS_TABLE);
    console.log(res);

    return { ...response.success, body: JSON.stringify(res) };
  } catch (error) {
    console.log(error);
    return { ...response.error, body: JSON.stringify(error) };
  }
};


module.exports.getUser = async (event,context) => {
  try{
  console.log(event);
  const email = event.pathParameters.email;
  //fetch user info by passing email( primary key)
 const res = await getUser(email,USERS_TABLE)
 return { ...response.success, body: JSON.stringify(res) };
} catch (error) {
  console.log(error);
  return { ...response.error, body: JSON.stringify(error) };
}
}


module.exports.getUsersByCountryAndCreateTime = async (event,context) => {
  try{
  console.log(event);
  const body = JSON.parse(event.body);
  //fetch user info by passing email( primary key)
 const res = await getUsersByCountryAndCreateTime(body,USERS_TABLE)
 return { ...response.success, body: JSON.stringify(res) };
} catch (error) {
  console.log(error);
  return { ...response.error, body: JSON.stringify(error) };
}
}

module.exports.getUsersByCountryAndCreateTimeScan = async (event,context) => {
  try{
  console.log(event);
  const body = JSON.parse(event.body);
  //fetch user info by passing email( primary key)
 const res = await getUsersByCountryAndCreateTimeScan(body,USERS_TABLE)
 return { ...response.success, body: JSON.stringify(res) };
} catch (error) {
  console.log(error);
  return { ...response.error, body: JSON.stringify(error) };
}
}

module.exports.notifyUser = async (event,context) => {
  try{
  console.log(JSON.stringify(event));
  for (const item of event.Records){
    if(item.eventName === "INSERT"){
      //send Email
      const user = item.dynamodb.NewImage;
      const emailresponse = await sendTextEmail(user.email.S,"welcome",`Hello ${user.firstName.S} ${user.lastName.S}`);
      if(emailresponse.status === "success"){
        console.log('welcome email sent to user successfully')
    }
    else{
        console.log('Failed to send welcome email to user')
    }

    }
  }
 
} catch (error) {
  console.log(error);
}
}

