var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Intent = require('./intent');
var Parameter = require('./parameter');
var async = require('async');
var utils = require('./utils');

// instantiate express
var app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// instantiate mongoose
mongoose.Promise = global.Promise;
var options = {
	useMongoClient: true
}
mongoose.connect('mongodb://localhost/testdb', options).then(
    () => { console.log('DB connected successfully!'); },
    err => { console.error(`Error while connecting to DB: ${err.message}`); }
);

// set our port
var port = process.env.PORT || 8080;

app.post('/api/webhook',function(req,res){
	var intentKey = req.body.result.metadata.intentName;
	console.log(intentKey);
	getSpeech(intentKey, function(speech){
		getParameters(speech, function(keys){
			response(speech, keys, res);
		});
	});
});

app.listen(port);
console.log('Server listening on port: ' + port);

function getSpeech(intentKey, callback)
{
	var query = Intent.find();
	query.where('key').equals(intentKey);
	query.exec(function(err, intents){
		callback(intents[0].value);
	});
}

function getParameters(speech, callback)
{
	var wildcard = "<[a-zA-Z0-9-_]*>";
	var keys = [...new Set(speech.match(wildcard))];
	
	for(var i=0;i<keys.length;i++){
		keys[i] = keys[i].replace(/<|>/g,"");
	}
	
	console.log(keys);
	var query = Parameter.find();
	query.where('key').in(keys);
	query.exec(function(err, params){
		
		console.log(params);
		callback(params);
	});
}

function response(speech, keys, res)
{
	var paramKeys = [];
	var paramCB = [];
	
		console.log(keys);
	keys.forEach(function(param, index){
		console.log(param);
		paramKeys.push(param.key);
		if(param.action)
		{
			paramCB.push(function(c){
				utils[param.action](function(r){
					c(null, r);
				});
			});
		}
		else
		{
			paramCB.push(function(c){
				c(null, param.value);
			});
		}
	});
	async.parallel(paramCB, function(err, values){
			res.setHeader('content-type', 'application/json');
			for(var i = 0; i < values.length; i++)
			{
				var tmp = "<"+paramKeys[i]+">";
				speech = speech.replace(new RegExp(tmp,'g'), values[i]);
			}
			res.send(JSON.stringify({"speech":speech}));
		});
}