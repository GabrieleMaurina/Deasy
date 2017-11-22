var express = require('express');
var bodyParser = require('body-parser');

// instantiate express
var app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// set our port
var port = process.env.PORT || 8080;

app.post('/api/webhook',function(req,res){
	var obj = req.body.result.parameters;

	console.dir(obj, {depth: null, colors: true});
//	var obj = JSON.parse(result);
	var keys = Object.keys(obj);
	/*for (var i = 0; i < keys.length; i++) {
	  console.log(obj[keys[i]]);
	}*/
	console.log(keys);
});

app.listen(port);
console.log('Server listening on port: ' + port);
