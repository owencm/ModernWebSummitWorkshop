var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var PORT = process.env.PORT || 8000;
var webPush = require('web-push');

// The GCM API key is AIzaSyDNlm9R_w_0FDGjSM1fzyx5I5JnJBXACqU
webPush.setGCMAPIKey('AIzaSyDNlm9R_w_0FDGjSM1fzyx5I5JnJBXACqU');

app.use(express.static(__dirname));

app.use(bodyParser.json());

app.use("/push", function(req, res, next) {
  console.log(res.body);
  if (req.body.action === 'subscribe') {
    var endpoint = req.body.subscription.endpoint;

    // Send a push once immediately after subscribing, and one 5 seconds later
    sendNotification(endpoint);
    setTimeout(function() {
      console.log("[[SENDING PUSH NOW: " + endpoint + "]]");
      sendNotification(endpoint);
    }, 5000);
    res.send({text:'Sending push in 5',status:"200"});
  } else {
    throw new Error ('Unsupported action');
  }
});

app.use("/pushdata",function(req,res,next){
  res.send(JSON.stringify({
    msg: "We have "+parseInt(Math.random()*9+1)+" cabs available for you for next one hour"
  }));
});

app.listen(PORT, 'localhost', function() {
  console.log('express server listening on port', PORT);
});

function sendNotification(endpoint) {
  console.log('endpoint', endpoint)
  webPush.sendNotification(endpoint)
  .then(function(response) {
    if (response) {
      console.log("PUSH RESPONSE: ", response);
    } else {
      console.log("PUSH SENT");
    }
  })
  .catch(function(err) {
    console.error("PUSH ERR: " + err);
  });
}
