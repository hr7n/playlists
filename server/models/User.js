const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: false,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function () {
      return !this.spotifyConnected;
    },
    minlength: 5,
  },
  playlists: [{ type: Schema.Types.ObjectId, ref: 'playlist' }],
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],

  // spotify fields
  spotifyId: {
    type: String,
    unique: true,
  },
  spotifyConnected: {
    type: Boolean,
    default: false,
    required: true,
  },
  accessToken: { type: String },
  refreshToken: { type: String },
});
// Set up pre-save middleware to create password
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});
// Compare the incoming password with the hashed password
userSchema.methods.isCorrectPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
const User = mongoose.model('User', userSchema);

module.exports = User;
