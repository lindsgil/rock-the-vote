const functions = require('firebase-functions');
var twilio = require('twilio');
var MessagingResponse = require('twilio').twiml.MessagingResponse;
var admin = require('firebase-admin');
var serviceAccount = require('./serviceAccountKey.json');
const express = require("express");

var accountSid = ''; // Your Account SID from www.twilio.com/console
var authToken = '';   // Your Auth Token from www.twilio.com/console
var client = new twilio(accountSid, authToken);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://rock-the-vote-ang.firebaseio.com'
});

function updateVoteCount(vote) {
  if (vote === "1") {
    //get snapshot value
    new Promise((resolve, reject) => {
      resolve(admin.database().ref('/votes/1').once('value'));
    }).then((snapshot) => {
      var currentCount = snapshot.val().count;
      return currentCount
    }).then((cCount) => {
      admin.database().ref('/votes/1').set({
        count: cCount + 1
      })
      return cCount;
    }).catch((err) => {
      throw new Error(`new error: ${err}`);
    })
  }
  else if (vote === "2") {
    //get snapshot value
    new Promise((resolve, reject) => {
      resolve(admin.database().ref('/votes/2').once('value'));
    }).then((snapshot) => {
      var currentCount = snapshot.val().count;
      return currentCount
    }).then((cCount) => {
      admin.database().ref('/votes/2').set({
        count: cCount + 1
      })
      return cCount;
    }).catch((err) => {
      throw new Error(`new error: ${err}`);
    })
  }
}

const expressRouter = new express.Router();
expressRouter.post("/sms", (req, res) => {
  let vote = req.body.Body;
  updateVoteCount(vote);
  res.set('Content-Type', 'text/plain')
  res.send(';)')
});

// Cloud Function
exports.sms = functions.https.onRequest(expressRouter);
