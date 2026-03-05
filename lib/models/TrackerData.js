import mongoose from 'mongoose';

const TrackerDataSchema = new mongoose.Schema(
  {
    userId:           { type: String, default: 'default', unique: true },
    statuses:         { type: mongoose.Schema.Types.Mixed, default: {} },
    notes:            { type: mongoose.Schema.Types.Mixed, default: {} },
    ratings:          { type: mongoose.Schema.Types.Mixed, default: {} },
    subtopicStatuses: { type: mongoose.Schema.Types.Mixed, default: {} },
    timelineChecked:  { type: mongoose.Schema.Types.Mixed, default: {} },
    problems:         { type: Array, default: [] },
    interviews:       { type: Array, default: [] },
    meta: {
      lastUpdated: { type: String, default: null },
      version:     { type: String, default: '1.0.0' },
    },
  },
  { strict: false }
);

export default mongoose.models.TrackerData ||
  mongoose.model('TrackerData', TrackerDataSchema);
