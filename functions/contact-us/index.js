const AWS = require("@aws-sdk/client-ssm");
const hubspot = require("@hubspot/api-client");

const handler = async (event, context) => {
  const body = JSON.parse(event.body);

  const ssm = new AWS.SSM({
    region: "eu-west-1",
  });

  const hubspot_key = await ssm.getParameter({
    Name: "HUBSPOT_ACCESS_KEY",
    WithDecryption: true,
  });

  const hubspot_access_key = hubspot_key.Parameter.Value;

  const hubspotClient = new hubspot.Client({
    accessToken: hubspot_access_key,
  });

  await hubspotClient.crm.contacts.basicApi.create({
    properties: {
      email: body.email,
      firstname: body.firstname,
      lastname: body.lastname,
      phone: body.phone,
      message: body.message,
    },
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Thanks for contacting us! We will be in touch soon.",
    }),
  };
};

module.exports = { handler };
