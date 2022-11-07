import Order from "./../../../../models/Order.model";
import dbConnect from "../../../../util/db";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req, res) {
  const {
    query: { collegeid },
    method,
  } = req;

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
        console.log({ collegeid });
        const orders = await Order.find({
          student_collegeid: collegeid,
        }); /* find all the data in our database */
        res.status(200).json({ success: true, data: orders });
      } catch (error) {
        res.status(400).json({ success: false, error: error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
