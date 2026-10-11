import mongoose from 'mongoose';

const jobApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    jobTitle: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    jobUrl: { type: String, trim: true, default: '' },
    applicationDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['saved', 'applied', 'assessment', 'interview', 'offer', 'rejected'],
      default: 'saved',
    },
    notes: { type: String, trim: true, default: '' },
    followUpDate: { type: Date },
    salary: { type: String, trim: true, default: '' },
    location: { type: String, trim: true, default: '' },
    remote: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);
export default JobApplication;
