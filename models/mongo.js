let mongoose = require('mongoose'),
    findOrCreate = require('mongoose-findorcreate'),
    Schema = mongoose.Schema;

mongoose.Promise = global.Promise;
let db = mongoose.connect('mongodb://localhost/dobot');

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    }
});

UserSchema.plugin(findOrCreate);

var User = mongoose.model('User', UserSchema);

module.exports = {
    'db': db,
    'mongoose': mongoose,
    'User': User
};
