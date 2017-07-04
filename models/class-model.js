const mongoose = require('mongoose');

const AssignmentModel = require ('./assignment-model.js'); //Require for Assignments

const Schema = mongoose.Schema;

const ClassSchema = new Schema(
  {
  className: {
    type: String,
    required: [true, 'Please tell us the name of the Class'],
    },
   subject: {
     type: String,
     required: [true, 'Please tell us the Subject'],
    },
    gradeLevel: {
      type: Number
    },

   assignment: {
      type: [AssignmentModel.schema], //connects to assignment model
      default: []
  }
 },
 {
   timestamps: true
   // timestamp creates two additional fields: "createdAt" & "updatedAt"
 }
);

  const ClassModel = mongoose.model ('Class', ClassSchema);
  // db.classes.find() ??????

  module.exports = ClassModel;
