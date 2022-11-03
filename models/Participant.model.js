import mongoose from "mongoose";

const ParticipantSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  collegeid: {
    type: String,
  },
});
export { ParticipantSchema };
export default mongoose.models.Participant ||
  mongoose.model("Participant", ParticipantSchema);
