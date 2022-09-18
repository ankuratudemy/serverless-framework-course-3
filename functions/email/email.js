const AWS = require("aws-sdk");
const ses = new AWS.SES({
  apiVersion: "2010-12-01",
  region: "us-west-2",
});

const sendTextEmail = async (to,subject,message) => {
    try {
        let params = {
        Destination: {
          ToAddresses: [
            to
          ],
        },
        Message: {
          Body: {
            // Html: {
            //  Charset: "UTF-8",
            //  Data: message
            // },
            Text: {
              Charset: "UTF-8",
              Data: message,
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: subject,
          },
        },
        Source: `${process.env.EMAIL_FROM_ADDR}`,
        ReplyToAddresses: [
          `${process.env.EMAIL_FROM_ADDR}`
        ],
      };
  
      let emailResponse = await ses.sendEmail(params).promise();
      console.log(`Email Response ${JSON.stringify(emailResponse)}`);
      if (emailResponse) {
        console.log(`Email send successfully to ${to} with message ${message} and subject ${subject}`);
      } else {
        console.log(`Email sending failed to ${to} with message ${message} and subject ${subject}`);
        return { status: "failed" };
      }
      return {
        status: "success"
      };
    } catch (error) {
      console.log(`caught error  ${error}`);
      return { status: "failed" };
    }
  };

  module.exports = {
    sendTextEmail
}