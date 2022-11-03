import Order from "../../../../models/Order.model";
import dbConnect from "../../../../util/db";

export default async function handler(req, res) {
  const {
    query: { collegeid },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case "GET" /* Get a model by its ID */:
      try {
        const orders = await Order.find({ student_collegeid: collegeid }).all();
        let _tickets = [];
        for (var i in orders) {
          for (var j in orders[i]["tickets"]) {
            _tickets.push(orders[i]["tickets"][j]);
          }
        }
        console.log(_tickets);

        if (!orders) {
          return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: _tickets });
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, error: error });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
