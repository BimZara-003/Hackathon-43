const mongoose = require('mongoose');

const CATEGORIES = [
  'Pothole',
  'Streetlight',
  'Drainage',
  'Road Damage',
  'Unsafe Area',
  'Other',
];

const SEVERITIES = ['Low', 'Medium', 'High'];
const STATUSES = ['Open', 'In Progress', 'Resolved'];

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: CATEGORIES,
      required: [true, 'Category is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    severity: {
      type: String,
      enum: SEVERITIES,
      default: 'Medium',
    },
    status: {
      type: String,
      enum: STATUSES,
      default: 'Open',
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    timeOfDay: {
      type: String,
      default: null,
    },
    safetyContext: {
      type: String,
      default: null,
    },
    aiSummary: {
      type: String,
      default: '',
    },
    aiUrgency: {
      type: String,
      enum: SEVERITIES,
      default: 'Medium',
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: SEVERITIES,
      default: 'Medium',
    },
    lat: {
      type: Number,
      default: 6.9271, // Colombo latitude fallback
    },
    lng: {
      type: Number,
      default: 79.8612, // Colombo longitude fallback
    },
    userId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

const Report = mongoose.model('Report', reportSchema);

module.exports = {
  Report,
  CATEGORIES,
  SEVERITIES,
  STATUSES,
};
