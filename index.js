var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Intent = require('./intent');
const path = require('path');
var Parameter = require('./parameter');
var utils = require('./utils');
var request = require('request');

// instantiate express
var app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

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
var port = process.env.PORT || 80;

app.use(express.static(path.join(__dirname, 'dist')));

// Catch all other routes and return the index file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

function returnParameters(res){
	Parameter.find({}).sort('key').exec(function (err, table) {
		var parameters = [];
		for(i in table){
			parameters.push({key : table[i].key, value : table[i].value})
		}
        res.send(parameters);
    });
}

function returnIntents(res){
	Intent.find({}).sort('key').exec(function (err, table) {
		var intents = [];
		for(i in table){
			intents.push({key : table[i].key, value : table[i].value})
		}
        res.send(intents);
    });
}

app.get('/api/parameters', function(req, res){
	returnParameters(res);
});

app.get('/api/intents', function(req,res){
	returnIntents(res);
});

app.delete('/api/parameters', function(req, res){
	var parameters = req.body;
	Parameter.where('key').in(parameters).remove().exec();
	returnParameters(res);
});

app.delete('/api/intents', function(req, res){
	var intents = req.body;
	var fetchUpdates = [];
	Intent.find({}).sort('key').exec(function (err, table) {
		var oldIntents = [];
		for(i in table){
			oldIntents.push(table[i]);
		}
		for(i in intents)
		{
			var current = oldIntents.find(function(x){return x.key == intents[i];});
			if(current != undefined)
			{
				fetchUpdates.push(new Promise(function(resolve,reject){wrapper(current,function(cachedIntent){
				console.log('https://api.dialogflow.com/v1/intents/'+cachedIntent.id+'?v=20150910');
				request.delete({
				headers: {'content-type':'application/json',
								'Authorization': 'Bearer 7426f105132342d8b8c5a3b418c2be3d'},
					url:'https://api.dialogflow.com/v1/intents/'+cachedIntent.id+'?v=20150910'
					}, function(error, response, body){
					  if(!error)
						{
							resolve("");
						}
					})
					})}));
			}
		}
		Promise.all(fetchUpdates).then((resolve,err) => {
			Intent.where('key').in(intents).remove().exec();
			returnIntents(res);
		});
	})
});

app.post('/api/parameters', function(req, res){
	var parameters = req.body;
	var updates = [];
	for(i in parameters)
	{
		var options = {
			upsert: true
		};
		updates.push(Parameter.findOneAndUpdate({key: parameters[i].key},parameters[i],options).exec());
	}
	Promise.all(updates).then(function(err){
		returnParameters(res);
	});
});

function wrapper(index, callback)
{
	callback(index);
}

app.post('/api/intents', function(req, res){
	var newIntents = req.body;
	var DialogUpdates = [];
	Intent.find({}).sort('key').exec(function (err, table) {
		var oldIntents = [];
		for(i in table){
			oldIntents.push(table[i]);
		}
		for(i in newIntents)
		{
			var intent = oldIntents.find(function(x){return x.key == newIntents[i].key;});
			if(intent != undefined)
			{
				console.log("trovato " + newIntents[i].key);
				var questions = []
				for(q in newIntents[i].questions){
					questions.push({
						count: 0,
						data: [
						{
						  text: newIntents[i].questions[q]
						}
						]}
						);
				}
				
				var json_obj = JSON.stringify({
				  id:intent.id,
				  name: newIntents[i].key,
				  priority: 500000,
				  responses: [],
				  userSays: questions,
				  webhookForSlotFilling: false,
				  webhookUsed: true
				});
				var tmpIntent ={
							id: intent.id,
							key:newIntents[i].key,
							value:newIntents[i].value
						}
				DialogUpdates.push(new Promise(function(resolve,reject){wrapper(tmpIntent,function(cachedIntent){request.put({
					headers: {'content-type':'application/json',
								'Authorization': 'Bearer 7426f105132342d8b8c5a3b418c2be3d'},
					url:'https://api.dialogflow.com/v1/intents/'+cachedIntent.id+'?v=20150910',
					body:json_obj
					}, function(error, response, body){
					  //console.log(cachedIntent);
					  //console.log(body);
					  if(!error)
						{
							var options = {
								upsert: true
							};
							Intent.findOneAndUpdate({key: cachedIntent.key},cachedIntent,options).exec(function(){
								resolve("");
							});
						}
					});
				})}));
				console.log(json_obj);
			}
			else
			{
				//console.log("no " + newIntents[i].key);
				var questions = []
				for(q in newIntents[i].questions){
					questions.push({
						count: 0,
						data: [
						{
						  text: newIntents[i].questions[q]
						}
						]}
						);
				}
				
				var json_obj = JSON.stringify({
				  name: newIntents[i].key,
				  priority: 500000,
				  responses: [],
				  userSays: questions,
				  webhookForSlotFilling: false,
				  webhookUsed: true
				});
				DialogUpdates.push(new Promise(function(resolve,reject){
					wrapper(newIntents[i], function(cachedIntent){
					console.log("DF",cachedIntent.key);
					request.post({
						headers: {'content-type':'application/json',
									'Authorization': 'Bearer 7426f105132342d8b8c5a3b418c2be3d'},
						url:'https://api.dialogflow.com/v1/intents?v=20150910',
						body:json_obj
					}, function(error, response, body){
						if(!error)
						{
							var options = {
								upsert: true
							};
							var tmpIntent ={
								id: JSON.parse(body).id,
								key:cachedIntent.key,
								value:cachedIntent.value
							}
							//DBUpdates.push(Intent.findOneAndUpdate({key: tmpIntent.key},tmpIntent,options).exec());
							Intent.findOneAndUpdate({key: tmpIntent.key},tmpIntent,options).exec(function(){
								//console.log("DB", tmpIntent.key);
								resolve("");
							});
						}
					});
				})}));
				//console.log(JSON.stringify(json_obj));
			}
		}
		return Promise.all(DialogUpdates).then(()=>{
			returnIntents(res);
		});
		
    });
	
});

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
		if(intents.length > 0){
			callback(intents[0].value);
		}
	});
}

function getParameters(speech, callback)
{
	var wildcard = "<[a-zA-Z0-9-_]*>";
	var keys = [...new Set(speech.match(wildcard))];
	
	for(var i=0;i<keys.length;i++){
		keys[i] = keys[i].replace(/<|>/g,"");
	}
	
	var query = Parameter.find();
	query.where('key').in(keys);
	query.exec(function(err, params){
		callback(params);
	});
}

function response(speech, keys, res)
{
	var paramKeys = [];
	var paramValues = [];
	
	(function iterate(i){
		if(i < keys.length){
			console.log(keys[i]);
			paramKeys.push(keys[i].key);
			if(keys[i].value in utils){
				utils[keys[i].value](function(r){
					paramValues.push(r);
					iterate(i + 1);
				});
			}
			else{
				paramValues.push(keys[i].value);
				iterate(i + 1);
			}
		}
		else{
			console.log(paramValues);
			res.setHeader('content-type', 'application/json');
			for(j in paramValues)
			{
				var tmp = "<"+paramKeys[j]+">";
				speech = speech.replace(new RegExp(tmp,'g'), paramValues[j]);
			}
			res.send(JSON.stringify({"speech":speech}));
		}
	})(0);
}
