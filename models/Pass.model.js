import mongoose from "mongoose";

const PassSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  collegeid: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
  },
});
export { PassSchema };
export default mongoose.models.Pass || mongoose.model("Pass", PassSchema);
