var express = require('express');
var app = express();
var PORT = process.env.PORT || 8000;

// The GCM API key is AIzaSyDNlm9R_w_0FDGjSM1fzyx5I5JnJBXACqU

app.use(express.static(__dirname));

app.listen(PORT, function() {
  console.log('express server listening on port ', PORT);
});
