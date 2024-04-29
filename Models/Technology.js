import mongoose from 'mongoose';

const { Schema, models, model } = mongoose;

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    logo: {
        type: String
    },
});

export default models.Technology || model('Technology', schema);