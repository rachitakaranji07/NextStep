import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    dueDate: { type: Date },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
    completedAt: { type: Date },
  },
  { _id: true }
);

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    currentLevel: { type: Number, min: 0, max: 5, default: 0 },
    targetLevel: { type: Number, min: 0, max: 5, default: 3 },
    resources: { type: [String], default: [] },
  },
  { _id: true }
);

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    dueDate: { type: Date },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'completed'],
      default: 'todo',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
  },
  { _id: true }
);

const careerGoalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    targetRole: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    targetDate: { type: Date },
    status: {
      type: String,
      enum: ['draft', 'active', 'completed', 'paused'],
      default: 'draft',
    },
    milestones: { type: [milestoneSchema], default: [] },
    skills: { type: [skillSchema], default: [] },
    tasks: { type: [taskSchema], default: [] },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Virtual: percentage of completed milestones
careerGoalSchema.virtual('progressPercentage').get(function () {
  const milestones = this.milestones;
  if (!milestones || milestones.length === 0) return 0;
  const completed = milestones.filter((m) => m.status === 'completed').length;
  return Math.round((completed / milestones.length) * 100);
});

const CareerGoal = mongoose.model('CareerGoal', careerGoalSchema);
export default CareerGoal;
