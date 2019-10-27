const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    login: { type: String, required: true },
    htmlUrl: { type: String, required: true }
});

module.exports = mongoose.model('GithubUserInfo', postSchema);
