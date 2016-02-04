var express = require('express');
var app = express();
var PORT = process.env.PORT || 8000;
var gcm = require('node-gcm');

// The GCM API key is AIzaSyDNlm9R_w_0FDGjSM1fzyx5I5JnJBXACqU

app.use(express.static(__dirname));

app.use("/push/:token", function(req, res, next) {
    var senderToken=req.params["token"];
    if(!senderToken){
      res.status(500).set('Content-Type', 'text/plain').send({text:"No sender token found!!!",status:"500"});
    }

    var message = new gcm.Message({});
    var sender = new gcm.Sender('AIzaSyDNlm9R_w_0FDGjSM1fzyx5I5JnJBXACqU');
    var registrationTokens = [];
    registrationTokens.push(req.params["token"]);
    setTimeout(function() {
        console.log("[[SENDING PUSH NOW: "+registrationTokens+"]]");
        sender.send(message, {

            registrationTokens: registrationTokens
        }, function(err, response) {
            if (err)
                console.error("PUSH ERR: " + err);
            else
                console.log("PUSH RESPONSE: " + response);
        });
    }, 5000);
    res.set('Content-Type', 'text/plain').send({text:'Sending push in 5',status:"200"});
})

app.listen(PORT, function() {
    console.log('express server listening on port ', PORT);
});