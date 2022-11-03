import Ticket from "../../../models/Ticket.model";
import dbConnect from "../../../util/db";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const { method } = req;
  const session = await unstable_getServerSession(req, res, authOptions);

  console.log({ session });

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const tickets = await Ticket.find(
          {}
        ); /* find all the data in our database */
        res.status(200).json({ success: true, data: tickets });
      } catch (error) {
        res.status(400).json({ success: false, error: error });
      }
      break;
    case "POST":
      try {
        const tickets = await Ticket.create(req.body);
        res.status(201).json({ success: true, data: tickets });
      } catch (error) {
        res.status(400).json({ success: false, error: error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
