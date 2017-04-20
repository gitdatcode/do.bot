const mongo = require('../../models/mongo');

const TagSchema = new mongo.mongoose.Schema({
    tag: {
        type: String,
        required: true,
        unique: true
    }
});

TagSchema.plugin(findOrCreate);

var Tag = mongo.mongoose.model('Tag', TagSchema);

const ResourceSchema = new mongo.mongoose.Schema({
    url: {
        type: String,
        required: true,
        unique: true
    }
});

ResourceSchema.plugin(findOrCreate);

var Resource = mongo.mongoose.model('Resource', ResourceSchema);

module.export = {
    'Tag': Tag,
    'Resource': Resource
};
