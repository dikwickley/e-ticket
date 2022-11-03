import User from "../../../models/User.model";
import dbConnect from "../../../util/db";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const { method } = req;
  const session = await unstable_getServerSession(req, res, authOptions);

  console.log({ session });

  if (!session) {
    res.status(400).json({ success: false, msg: "not logged in" });
    return;
  }

  if (session.user.access != "admin") {
    res.status(400).json({ success: false, msg: "not admin" });
    return;
  }

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const users = await User.find(
          {}
        ); /* find all the data in our database */
        res.status(200).json({ success: true, data: users });
      } catch (error) {
        res.status(400).json({ success: false, error: error });
      }
      break;
    case "POST":
      try {
        const user = await User.create(req.body);
        res.status(201).json({ success: true, data: user });
      } catch (error) {
        res.status(400).json({ success: false, error: error });
      }
      break;
    case "DELETE":
      try {
        const users = await User.find({ username: req.body.username }).remove();
        res.status(200).json({ success: true, data: users });
      } catch (error) {
        res.status(400).json({ success: false, error: error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
