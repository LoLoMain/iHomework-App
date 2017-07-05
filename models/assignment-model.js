const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AssignmentSchema = new Schema({
  assignmentName: {
    type: String,
    required: [true, 'Please tell us the name of the Assignment'],
    },
  dateAssigned: {
    type: Date,
    required: [true, 'When was the assignment given?']
    },
  dateDue:{
    type: Date,
    required: [true, 'When is the assignment due?']
    },
  assignmentType: {
      enum: ['Homework', 'Project','Quiz', 'Test', 'Essay', 'Other']
      // category field can only be one of the specified field above
      //drop down menu?
    },
  description: { type: String},
},
{
  timestamps: true
  // timestamp creates two additional fields: "createdAt" & "updatedAt"

});

const AssignmentModel = mongoose.model ('Assignment', AssignmentSchema);
// db.assignments.find()


module.exports =  AssignmentModel;
