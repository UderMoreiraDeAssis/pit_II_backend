const mongoose = require('mongoose');

const timeEntrySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  duration: { type: Number }, // in seconds
});

timeEntrySchema.pre('save', function (next) {
  if (this.endTime && this.startTime) {
    this.duration = (this.endTime - this.startTime) / 1000; // Duration in seconds
  }
  next();
});

timeEntrySchema.path('startTime').validate(function (value) {
  return !this.endTime || value <= this.endTime;
}, 'Start time must be before end time.');

module.exports = mongoose.model('TimeEntry', timeEntrySchema);
