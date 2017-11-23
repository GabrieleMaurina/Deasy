var request = require('request');

const URL_DOWN = 'https://maps.googleapis.com/maps/api/directions/json?origin=Povo+Valoni+Trento+Italy&destination=Trento+Italy&mode=transit&transit_mode=bus&key=AIzaSyBoQj3HVRuefewJw55B5CnvjbYFZBibjLA';
const URL_UP = 'https://maps.googleapis.com/maps/api/directions/json?origin=StazioneFS+Trento+Italy&destination=Povo+Trento+Italy&mode=transit&transit_mode=bus&key=AIzaSyBoQj3HVRuefewJw55B5CnvjbYFZBibjLA';

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
			try {
				time = JSON.parse(body).routes[0].legs[0].steps[0].transit_details.departure_time.text;
			}
			catch (err){
			}
			callback(time);
		})
	}
};