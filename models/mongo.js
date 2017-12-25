let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * async version of findOrCreate found in the node module mongoose-findorcreate
 * 
 * @param schema mongoose.Schema
 * @param doc mongoose.model
 * @param options object literal of key: value pairs for the doc to be searched or created with
 * @return mongoose.model with mongoose.model.__created__ set to boolean if the model was created or not
 */
async function asyncFindOrCreatePlugin(schema, options){
    schema.statics.findOrCreate = async function findOrCreate(conditions, doc, options){
        let result = await this.findOne(conditions);

        if(result){
            if(options && options.upsert){
                let update = self.update(conditions, doc),
                    obj = await this.findOne(conditions);

                obj.__created__ = false;

                return obj;
            }

            result.__created__ = false;

            return result
        }

        for(let key in doc){
            conditions[key] = doc[key];
        }

        let keys = Object.keys(conditions);

        for(let i = 0, l = keys.length; i < l; i++){
            if(JSON.stringify(conditions[keys[i]]).indexOf('$') !== -1){
                delete conditions[keys[i]];
            }
        }

        let obj = new this(conditions);
        obj.__created__ = true;

        return await obj.save();
    };
}

mongoose.Promise = global.Promise;
let db = mongoose.connect('mongodb://localhost/dobot_app');

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    energy_code: {
        type: String
    },
    notification_hour: {
        type: Number
    },
    notification_minute: {
        type: Number
    },
    notification_ampm: {
        type: String
    },
    energy_enabled: {
        type: Boolean,
        default: true,
    }
});

UserSchema.plugin(asyncFindOrCreatePlugin);

var User = mongoose.model('User', UserSchema);

const TagSchema = new Schema({
    tag: {
        type: String,
        required: true,
        unique: true
    }
});

TagSchema.plugin(asyncFindOrCreatePlugin);

var Tag = mongoose.model('Tag', TagSchema);

module.exports = {
    'asyncFindOrCreatePlugin': asyncFindOrCreatePlugin,
    'db': db,
    'mongoose': mongoose,
    'User': User,
    'Tag': Tag
};

