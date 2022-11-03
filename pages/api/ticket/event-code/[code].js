import { resolve } from "styled-jsx/css";
import Order from "../../../../models/Order.model"
import dbConnect from '../../../../util/db'
// import {Parser,transforms: { unwind }} from 'json2csv'
const {Parser,transforms:{unwind}} = require('json2csv')



export default async function handler(req,res){
    const {
        query: { code },
        method,
    } = req

    await dbConnect()

    switch (method) {
        case 'GET':
            try {
                // department wise tickets data
                let orderData = await Order.find({"tickets.events.eventCode":code}, {tickets: {$elemMatch:{'events.eventCode':code}}})
                if(!orderData || orderData == "") res.status(200).json({success:true,"Message":"No data for given eventCode"});
                else{
                    var temp = JSON.stringify(orderData); // to get correct json structure
                    temp = JSON.parse(temp); // to get correct json structure
                    // fields as labels for csv download 
                    const fields = [ 
                        {lael:"ticket:id",value:"tickets._id"},
                        {label:"events:name",value:"tickets.events.name"},
                        {label:"events:department",value:"tickets.events.department"},
                        {label:"events:price",value:"tickets.events.price"},
                        {label:"events:date",value:"tickets.events.date"},
                        {label:"events:type",value:"tickets.events.type"},
                        {label:"events:eventCode",value:"tickets.events.eventCode"},
                        {label:"participants:email",value:"tickets.participants.email"},
                        {label:"participants:collegeid",value:"tickets.participants.collegeid"}
                      ];

                    // json to csv conversion
                    const transforms = [unwind({ paths: ["tickets", "tickets.tickets","tickets.participants","tickets.tickets.participants.participants"] })];
                    const json2csv = new Parser({ fields,transforms });
                    const csv = json2csv.parse(temp);
                    res.setHeader('Content-Type', 'text/csv');
                    res.status(200).send(csv);
                }
            } catch (error) {
                res.status(400).json({success:false,"error":error.message})
            }

            break;
    }


}