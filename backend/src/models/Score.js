import mongoose from "mongoose";

const ScoreSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true, maxlength: 20 },
  price: { type: Number, required: true },
  savings: { type: Number, required: true },
  rounds: { type: Number, required: true },
  rank: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Score", ScoreSchema);
