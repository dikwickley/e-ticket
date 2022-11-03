import { resolve } from "styled-jsx/css";
import Order from "../../../models/Order.model"
import dbConnect from '../../../util/db'
const {Parser} = require('json2csv')



export default async function handler(req,res){
    const {
        method
    } = req

    await dbConnect()

    switch (method) {
        case 'GET':
            try {
                // console.log("here");
                // department wise tickets data
                let yesterdayDate = new Date((new Date().getTime() - (1 * 24 * 60 * 60 * 1000)));
                let todaysOrders = await Order.find({issue_date:{$gte:yesterdayDate}});
                if(!todaysOrders || todaysOrders == "") res.status(200).json({success:true,"Message":"No tickets created today"});
                else{
                    var temp = JSON.stringify(todaysOrders); // to get correct json structure
                    temp = JSON.parse(temp); // to get correct json structure
                    // fields as labels for csv download 
                    const fields = [ 
                        {label:"order:id",value:"_id"},
                        {label:"order:issue date",value:"issue_date"},
                        {label:"student name",value:"student_name"},
                        {label:"student email",value:"student_email"},
                        {label:"student phone",value:"student_phone"},
                        {label:"payment mode",value:"payment_mode"},
                        {label:"transaction id",value:"transaction_id"},
                        // will update it
                        // {lael:"ticket:id",value:"tickets._id"},
                        // {label:"events:name",value:"tickets.events.name"},
                        // {label:"events:department",value:"tickets.events.department"},
                        // {label:"events:price",value:"tickets.events.price"},
                        // {label:"events:date",value:"tickets.events.date"},
                        // {label:"events:type",value:"tickets.events.type"},
                        // {label:"events:eventCode",value:"tickets.events.eventCode"},
                        // {label:"participants:email",value:"tickets.participants.email"},
                        // {label:"participants:collegeid",value:"tickets.participants.collegeid"}
                      ];

                    // json to csv conversion
                    const json2csv = new Parser({ fields });
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