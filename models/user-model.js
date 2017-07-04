const mongoose = require('mongoose');

const Schema = mongoose.Schema;


// User Schema
const UserSchema = new Schema(
  {
  firstName: {
    type: String,
    required: [true, 'Please tell us your First Name.'],
    },
    
  username: {
    type: String,
    required: [true, 'Please tell us your Username.'],
    minlength: [5, 'Username must be minimum of 5 characters.'],
    maxlength: [15, 'Username cannot be longer than 15 Characters.']
    },

  birthday: {
    type: Date,
    required: [true, 'Please provide your birthday'],
    },

  // SIGN UP/LOG IN FORM users----------
  encryptedPassword: {
    type: String,
    required: [true, 'Please provide a password']
  },

  //GOOGLE users
  googleId: {type: String},

  //FACEBOOK users ------------------
  facebookId: {type: String}
  },
{
  timestamps: true
  // timestamp creates two additional fields: "createdAt" & "updatedAt"

 }
);

const UserModel = mongoose.model ('User', UserSchema);
// db.users.find()

module.exports = UserModel;
