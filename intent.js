/*globals require, module */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var IntentSchema = new Schema(
        {
            key: String,
            value: String,
			action: String
        });

module.exports = mongoose.model('Intent', IntentSchema, 'DeasyCollection');