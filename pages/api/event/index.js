import { unstable_getServerSession } from "next-auth";
import Event from "../../../models/Event.model";
import dbConnect from "../../../util/db";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const { method } = req;

  const session = await unstable_getServerSession(req, res, authOptions);
  console.log({ session });

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const events = await Event.find(
          {}
        ); /* find all the data in our database */
        res.status(200).json({ success: true, data: events });
      } catch (error) {
        res.status(400).json({ success: false, error: error });
      }
      break;
    case "POST":
      if (!session) {
        res.status(400).json({ success: false, msg: "not logged in" });
        return;
      }

      if (session.user.access != "admin") {
        res.status(400).json({ success: false, msg: "not admin" });
        return;
      }

      try {
        const event = await Event.create(req.body);
        res.status(201).json({ success: true, data: event });
      } catch (error) {
        res.status(400).json({ success: false, error: error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
