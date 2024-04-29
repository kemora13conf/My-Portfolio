import mongoose from 'mongoose';

const { Schema, models, model } = mongoose;

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    githubUrl: {
        type: String
    },
    demoUrl: {
        type: String
    },
    image: {
        type: String
    },
    technologies: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Technology'
        }]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default models.Project || model('Project', schema);