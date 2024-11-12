// models/UserModel.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, minlength: 3, maxlength: 30 },
        email: { type: String, required: true, minlength: 3, maxlength: 200, unique: true },
        password: { type: String, required: true, minlength: 8, maxlength: 1024 },
        pfUrl: { type: String, required: false },
        blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    },
    {
        timestamps: true
    }
);

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
