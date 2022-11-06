import { resolve } from "styled-jsx/css";
import Order from "../../../../models/Order.model";
import dbConnect from "../../../../util/db";
// import {Parser,transforms: { unwind }} from 'json2csv'

const {
  Parser,
  transforms: { unwind },
} = require("json2csv");

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        // department wise tickets data
        let orderData = await Order.find({});
        // let orderData = await Order.find(
        //   { "tickets.events.eventCode": code },
        //   { tickets: { $elemMatch: { "events.eventCode": code } } }
        // );
        orderData = JSON.parse(JSON.stringify(orderData));
        let _tickets = [];

        for (var i in orderData) {
          let order = orderData[i];
          let _t = orderData[i].tickets;
          for (var j in _t) {
            _t[j]["payment_mode"] = orderData[i].payment_mode;
            _t[j]["student_name"] = orderData[i].student_name;
            _t[j]["student_phone"] = orderData[i].student_phone;
            _t[j]["payment_mode"] = orderData[i].payment_mode;
            _t[j]["order_taken_by"] = orderData[i].order_taken_by;
            _t[j]["transaction_id"] = orderData[i].transaction_id;
            _t[j]["issue_date"] = orderData[i].issue_date;
            _t[j] = { ..._t[j], ..._t[j].events };
            _t[j].date = _t[j].date.split("T")[0];
            delete _t[j].events;
            // if (_t[j].eventCode == code)
            _tickets.push(_t[j]);
          }
        }

        // show this all data in CSV
        // console.trace( _tickets);

        if (!orderData || orderData == "")
          res
            .status(200)
            .json({ success: true, Message: "No data for given eventCode" });
        else {
          const fields = [
            { lael: "ticket_id", value: "_id" },
            { label: "Event name", value: "name" },
            { label: "Leader Name", value: "student_name" },
            { label: "Leader Phone", value: "student_phone" },
            { label: "Event Date", value: "date" },
            { label: "Event Price", value: "price" },
            { label: "Participants", value: "type" },
            { label: "Issue Date", value: "issue_date" },
            { label: "Order Taken By", value: "order_taken_by" },
            { label: "Event Code", value: "eventCode" },
            { label: "Payment Mode", value: "payment_mode" },
            { label: "Payment ID", value: "transaction_id" },
            {
              label: "Participant Email",
              value: "participants.email",
            },
            {
              label: "Participant Collegeid",
              value: "participants.collegeid",
            },
          ];

          // json to csv conversion
          const transforms = [
            unwind({
              paths: ["participants", "participants.participants"],
            }),
          ];
          const json2csv = new Parser({ fields, transforms });
          const csv = json2csv.parse(_tickets);

          res.setHeader("Content-Type", "text/csv");
          res.status(200).send(csv);
        }
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }

      break;
  }
}
