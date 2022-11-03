import User from "../../../models/User.model";
import dbConnect from "../../../util/db";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const {
    query: { username },
    method,
  } = req;
  const session = await unstable_getServerSession(req, res, authOptions);

  await dbConnect();

  switch (method) {
    case "GET" /* Get a model by its ID */:
      try {
        const user = await User.find({ username: username });
        if (!user) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
