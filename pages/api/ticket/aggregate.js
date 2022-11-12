import Ticket from "../../../models/Ticket.model";
import Pass from "../../../models/Pass.model";
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

        let _tickets = JSON.parse(JSON.stringify(tickets));

        console.log(_tickets.length);

        let _students = {};
        let csv = "";

        for (let x in _tickets) {
          let _t = tickets[x];
          let event_price = tickets[x].events.price;
          let event_type = tickets[x].events.type;
          for (let y in _t.participants) {
            let _participant = _t.participants[y];

            if (!_students.hasOwnProperty(_participant.collegeid)) {
              _students[_participant.collegeid] = {
                points: 0,
                email: _participant.email,
              };
            }

            _students[_participant.collegeid].points +=
              event_price / event_type;
          }
        }

        for (let x in _students) {
          if (_students[x].points >= 70) {
            let cid = x;
            let email = _students[x].email;
            let _pass = await Pass.create({
              email: email,
              collegeid: cid,
              active: true,
            });
            console.log(_pass);
            // csv += `${x},${_students[x].email}\n`;
          }
        }
        res.status(200).json({ success: true, data: _students });
      } catch (error) {
        console.log(error);
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
