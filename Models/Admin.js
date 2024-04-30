import mongoose from 'mongoose';
import CryptoJS from 'crypto-js';

const { Schema, models, model } = mongoose;

const adminSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true, 
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    hashed_password: {
        type: String,
        required: true,
    }
});

adminSchema.pre('save', async function (next) {
    if (this.isModified("hashed_password")) {
      this.hashed_password = CryptoJS.SHA256(this.hashed_password).toString();
    }
  next();
});

export default models.Admin || model('Admin', adminSchema);
