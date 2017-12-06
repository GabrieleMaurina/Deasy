var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Intent = require('./intent');
const path = require('path');
var Parameter = require('./parameter');
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
mongoose.connect('mongodb://deasybot:deasybot@ds117156.mlab.com:17156/deasydb', options).then(
    () => { console.log('DB connected successfully!'); },
    err => { console.error(`Error while connecting to DB: ${err.message}`); }
);
// set our port
var port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, 'dist')));

// Catch all other routes and return the index file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
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
			res.setHeader('content-type', 'application/json');
			console.log(paramKeys, paramValues);
			for(j in paramValues)
			{
				var tmp = "<"+paramKeys[j]+">";
				speech = speech.replace(new RegExp(tmp,'g'), paramValues[j]);
			}
			res.send(JSON.stringify({"speech":speech}));
		}
	})(0);
}