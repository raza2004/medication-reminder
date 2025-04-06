// services/twilioService.js
const twilio = require('twilio');
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, FROM_NUMBER, SERVER_DOMAIN } = require('../config.js');


const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

module.exports.triggerCall = async function(toNumber)
 {
  const twimlUrl = `https://${SERVER_DOMAIN}/twilioWebhook/incoming`;
  const call = await client.calls.create({
    to: toNumber,
    from: FROM_NUMBER,
    url: twimlUrl,
  });
  return call;
}
