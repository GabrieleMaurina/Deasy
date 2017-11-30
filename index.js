var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Intent = require('./intent');
const path = require('path');
var async = require('async');
var utils = require('./utils');

// instantiate express
var app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'dist')));

// Catch all other routes and return the index file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// instantiate mongoose
mongoose.Promise = global.Promise;
var options = {
	useMongoClient: true
}
mongoose.connect('mongodb://deasybot:deasybot@ds117156.mlab.com:17156/deasydb', options).then(
    () => { console.log('DB connected successfully!'); },
    err => { console.error(`Error while connecting to DB: ${err.message}`); }
);

// set our port
var port = process.env.PORT || 8080;

app.post('/api/webhook',function(req,res){
	var obj = req.body.result.parameters;
	var keys = Object.keys(obj);
	console.log(keys);
	console.log(req.body);
	getValues(keys, res);
});

app.listen(port);
console.log('Server listening on port: ' + port);

function getValues(keys, res)
{
	var query = Intent.find();
	query.where('key').in(keys);
	query.exec(function (err, intents) {
		var paramKeys = [];
		var paramCB = [];
		intents.forEach(function(intent, intentIndex){
			paramKeys.push(intent.key);
			if(intent.action)
			{
				paramCB.push(function(c){
					utils[intent.action](function(r){
						c(null, r);
					});
				});
			}
			else
			{
				paramCB.push(function(c){
					c(null, intent.value);
				});
			}
		});
		async.parallel(paramCB, function(err, values){
			res.setHeader('content-type', 'application/json');
			var params = {};
			for(var i = 0; i < values.length; i++)
			{
				params[paramKeys[i]] = values[i]; 
			}
			var result = JSON.stringify({"contextOut":[{"name":"webhook","parameters":params}]});
			res.send(result);
			console.log(result);
		});
	});
}

//var functions = {"nextDown": nextDown};
