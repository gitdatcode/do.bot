const mongo = require('../../models/mongo');

const EnergyDaySchema = new mongo.mongoose.Schema({
    user: {
        type: mongo.mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    day: {
        type: Date
    }
});

EnergyDaySchema.plugin(mongo.asyncFindOrCreatePlugin);

var Energy = mongo.mongoose.model('Energy', EnergyDaySchema);

module.exports = {
    'Energy': Energy
};

