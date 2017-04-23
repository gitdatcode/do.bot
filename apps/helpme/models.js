const mongo = require('../../models/mongo');

const HelpmeSchema = new mongo.mongoose.Schema({
    question: String,
    tags: [{
        type: mongo.mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    user: {
        type: mongo.mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    resolved_user: {
        type: mongo.mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    created_date: {
        type: Date
    },
    resolved_date: {
        type: Date
    },
    resolved: Boolean
});

HelpmeSchema.plugin(mongo.asyncFindOrCreatePlugin);

var Helpme = mongo.mongoose.model('Helpme', HelpmeSchema);

module.exports = {
    'Helpme': Helpme
};
