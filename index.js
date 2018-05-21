const express = require('express'),
      app = express(),
      server = require('http').Server(app);

app.get('/', (req, res) => res.sendFile(__dirname + '/client/index.html'));
app.use('/client', express.static(__dirname + '/client'));

server.listen(process.env.PORT || 7000);