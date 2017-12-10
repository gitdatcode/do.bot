const mongo = require('../../models/mongo');

const ResourceSchema = new mongo.mongoose.Schema({
    url: {
        type: String,
        required: true,
        unique: true
    },
    tags: [{
        type: mongo.mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    user: {
        type: mongo.mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    created_date: {
        type: Date
    }
});

ResourceSchema.plugin(mongo.asyncFindOrCreatePlugin);

var Resource = mongo.mongoose.model('Resource', ResourceSchema);

module.exports = {
    'Resource': Resource
};
