import mongoose from "mongoose";

const ConfigSchema = new mongoose.Schema(
  {
    visitorsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: false }
);

ConfigSchema.set("timestamps", { createdAt: false, updatedAt: true });

export default mongoose.model("Config", ConfigSchema);
