import Order from "../../../../models/Order.model";
import dbConnect from "../../../../util/db";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req, res) {
  const {
    method,
    query: { orderid },
  } = req;

  const session = await unstable_getServerSession(req, res, authOptions);

  console.log({ session });

  if (!session) {
    res.status(400).json({ success: false, msg: "not logged in" });
    return;
  }

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const orders = await Order.findById(
          orderid
        ); /* find all the data in our database */

        let _emails = [];

        let _ticket = orders.tickets;
        for (let x in _ticket) {
          let _part = _ticket[x].participants;
          for (let y in _part) {
            _emails.push(_part[y].email);
          }
        }

        console.log(_emails);

        for (let x in _emails) {
          let encode_string = `https://e-ticket-omega.vercel.app/order/ticket/${_emails[x].collegeid}`;
          console.log({ encode_string });
          try {
            let response = await fetch(
              `https://genesis-qrcode-api.herokuapp.com/QRGenerate/MakeQR/${_emails[x].email}/${encode_string}`,
              {
                methods: "GET",
              }
            );
            let data = await response.json();
            console.log({ data });
          } catch (err) {
            console.error(err);
          }
        }

        res.status(200).json({ success: true, data: { emails: _emails } });
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, error: error });
      }
      break;
  }
}
