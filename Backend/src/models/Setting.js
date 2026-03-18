import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    storeClosed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Setting = mongoose.model("Setting", settingSchema);

export default Setting;
