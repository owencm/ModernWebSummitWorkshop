var express = require('express');
var app = express();
var PORT = process.env.PORT || 8000;

app.use(express.static(__dirname));

app.listen(PORT, function() {
  console.log('express server listening on port ', PORT);
});
