var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var PORT = process.env.PORT || 8000;
var gcm = require('node-gcm');

// The GCM API key is AIzaSyDNlm9R_w_0FDGjSM1fzyx5I5JnJBXACqU

app.use(express.static(__dirname));

app.use(bodyParser.json());

app.use("/push", function(req, res, next) {
  if (req.body.action === 'subscribe') {
    var subEndpoint = req.body.subscription.endpoint;
    var senderToken = subEndpoint.slice(40, subEndpoint.length);
    if(!senderToken){
      res.status(500)
         .send({text:"No sender token found!!!",status:"500"});
    }

    var message = new gcm.Message({});
    var sender = new gcm.Sender('AIzaSyDNlm9R_w_0FDGjSM1fzyx5I5JnJBXACqU');
    var registrationTokens = [];
    registrationTokens.push(senderToken);
    setTimeout(function() {
      console.log("[[SENDING PUSH NOW: "+registrationTokens+"]]");
      sender.send(message, {
        registrationTokens: registrationTokens
      }, function(err, response) {
        if (err)
          console.error("PUSH ERR: " + err);
        else
          console.log("PUSH RESPONSE: ", response);
      });
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

app.listen(PORT, function() {
  console.log('express server listening on port ', PORT);
});
