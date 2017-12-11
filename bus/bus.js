var request = require('request');

const URL_DOWN = 'https://maps.googleapis.com/maps/api/directions/json?origin=Povo+Valoni+Trento+Italy&destination=Trento+Italy&mode=transit&transit_mode=bus&key=AIzaSyBoQj3HVRuefewJw55B5CnvjbYFZBibjLA';
const URL_UP = 'https://maps.googleapis.com/maps/api/directions/json?origin=StazioneFS+Trento+Italy&destination=Povo+Trento+Italy&mode=transit&transit_mode=bus&key=AIzaSyBoQj3HVRuefewJw55B5CnvjbYFZBibjLA';
var trainup = 'https://maps.googleapis.com/maps/api/directions/json?origin=Trento,+Piazza+Dante,+38121+Trento+TN&destination=Stazione+Ferroviaria+Trento+Povo+-+Mesiano,+Via+Mesiano,+Trento+TN&mode=transit&transit_mode=train&key=AIzaSyAkgQJiTh4daYfQ0TnlPmq5TSEj36M8geQ';
var traindown = 'https://maps.googleapis.com/maps/api/directions/json?origin=Stazione+Ferroviaria+Trento+Povo+-+Mesiano,+Via+Mesiano,+Trento+TN&destination=Trento,+Piazza+Dante,+38121+Trento+TN&mode=transit&transit_mode=train&key=AIzaSyAkgQJiTh4daYfQ0TnlPmq5TSEj36M8geQ';

module.exports = {
	nextDown: function (callback) {
		request.get(URL_DOWN, function(err, res, body) {
			var time = 'not available';
			try {
				time = JSON.parse(body).routes[0].legs[0].steps[0].transit_details.departure_time.text;
			}
			catch (err){
			}
			callback(time);
		})
	},
	nextUp: function (callback) {
		request.get(URL_UP, function(err, res, body) {
			var time = 'not available';
			try {
				time = JSON.parse(body).routes[0].legs[0].steps[0].transit_details.departure_time.text;
			}
			catch (err){
			}
			callback(time);
		})
	},
	nextTrainDown: function(callback) {
		request.get(traindown, function(err, res,body) {
			var time = '';
			try {
				time = JSON.parse(body).routes[0].legs[0].departure_time.text;
			} catch(err){

			}
			callback(time);
		})
	},
	nextTrainUp: function(callback) {
		request.get(trainup, function(err, res, body) {
			var time = '';
			try {
				time = JSON.parse(body).routes[0].legs[0].departure_time.text;
			} catch(err){

			}
			callback(time);
		})
	}
};