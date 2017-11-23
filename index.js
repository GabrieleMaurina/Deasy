var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Intent = require('./intent');

// instantiate express
var app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// instantiate mongoose
mongoose.Promise = global.Promise;
var options = {
    useMongoClient: true,
    user: 'Deasy',
    pass: 'deasybot'
  };
mongoose.connect('mongodb://Deasy:deasybot@ds117956.mlab.com:17956/marvashdb', options).then(
    () => { console.log('DB connected successfully!'); },
    err => { console.error(`Error while connecting to DB: ${err.message}`); }
);

// set our port
var port = process.env.PORT || 8080;

app.post('/api/webhook',function(req,res){
	var obj = req.body.result.parameters;
	var keys = Object.keys(obj);
	console.log(keys);
	getValues(keys, res);
});

app.listen(port);
console.log('Server listening on port: ' + port);

function getValues(keys, res)
{
	var query = Intent.find();
	var params = {};
	query.where('key').in(keys);
	query.exec(function (err, intents) {
		intents.forEach(function(intent, intentIndex){
			params[intent.key] = intent.value;
		});
		res.setHeader('content-type', 'application/json');
		res.send(JSON.stringify({"contextOut":[{"name":"webhook","parameters":params}]}));
	});
}
