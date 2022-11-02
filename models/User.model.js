import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  access: {
    type: String,
  },
});
export { UserSchema };
export default mongoose.models.User || mongoose.model("User", UserSchema);
