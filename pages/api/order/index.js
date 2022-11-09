import Event from "../../../models/Event.model";
import Ticket from "../../../models/Ticket.model";
import Order from "../../../models/Order.model";
import Participant from "../../../models/Participant.model";
import dbConnect from "../../../util/db";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  const { method } = req;

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
        const orders = await Order.find(
          {}
        ); /* find all the data in our database */
        res.status(200).json({ success: true, data: orders });
      } catch (error) {
        res.status(400).json({ success: false, error: error });
      }
      break;
    case "DELETE":
      try {
        if (session.user.access != "admin") {
          res.status(400).json({ success: false, msg: "not admin" });
          return;
        }

        let order_id = req.body.orderid;
        console.log({ order_id });
        // fetch all ticket ids from order_id

        const _orders = await Order.findById(order_id);

        if (!_orders) {
          console.log("NO such order by id");
          res.status(400).json({ success: false, msg: "not such order by id" });
        }

        res.status(200).json({ success: true });
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, error: error });
      }

      break;

    case "POST":
      try {
        let _tickets = [];
        let _order = req.body.order;
        let student_name = req.body.student_name;
        let student_phone = req.body.student_phone;
        let student_email = req.body.student_email;
        let student_collegeid = req.body.student_collegeid;
        student_collegeid = student_collegeid.toUpperCase();
        let issue_date = req.body.issue_date;
        let transaction_id = req.body.transaction_id;
        let payment_mode = req.body.payment_mode;
        let order_taken_by = req.body.order_taken_by;
        let _participant_emails = [];
        for (let x = 0; x < _order.length; x++) {
          let event_data = _order[x].event;
          delete event_data._id;
          let _event = new Event(event_data);

          let participants_data = _order[x].participants;
          let _participants = [];

          for (var index in participants_data) {
            let _p = new Participant();
            _p.collegeid = participants_data[index].collegeid;
            _p.collegeid = _p.collegeid.toUpperCase();
            _p.email = participants_data[index].email;
            _participant_emails.push(_p);
            _participants.push(_p);
          }

          let _ticket = await Ticket.create({
            events: _event,
            participants: _participants,
          });
          _tickets.push(_ticket);
        }

        _order = {
          tickets: _tickets,
          transaction_id,
          payment_mode,
          issue_date,
          student_name,
          student_phone,
          student_email,
          student_collegeid,
          order_taken_by,
        };

        let order = await Order.create(_order);
        console.log({ order });
        // send email
        for (let x in _participant_emails) {
          let encode_string = `https://e-ticket-omega.vercel.app/order/ticket/${_participant_emails[x].collegeid}`;
          console.log({ encode_string });
          try {
            let response = await fetch(
              `https://genesis-qrcode-api.herokuapp.com/QRGenerate/MakeQR/${_participant_emails[x].email}/${encode_string}`,
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

        res.status(201).json({ success: true, data: order });
      } catch (error) {
        res.status(400).json({ success: false, error: error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
