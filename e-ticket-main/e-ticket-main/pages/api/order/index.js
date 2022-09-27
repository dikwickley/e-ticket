import Event from "../../../models/Event.model"
import Ticket from "../../../models/Ticket.model"
import Order from "../../../models/Order.model"

import Participant from "../../../models/Participant.model"
import dbConnect from '../../../util/db'

export default async function handler(req, res) {
  const { method } = req

  await dbConnect()

  switch (method) {
    case 'GET':
      try {
        const orders = await Order.find({}) /* find all the data in our database */
        res.status(200).json({ success: true, data: orders })
      } catch (error) {
        res.status(400).json({ success: false, error: error })
      }
      break
    case 'POST':
      try {

        let _tickets = []
        let _order = req.body.order
        let student_name = req.body.student_name
        let student_phone = req.body.student_phone
        let student_email = req.body.student_email
        let issue_date = req.body.issue_date
        for(let x=0;x<_order.length;x++){
          let event_data = _order[x].event
          delete event_data._id
          let _event = new Event(event_data)



          let participants_data =_order[x].participants
          let _participants = []

          for (var index in participants_data) {
            let _p = new Participant()
            _p.collegeid = participants_data[index].collegeid
            _p.email = participants_data[index].email
            console.log(_p)
            _participants.push(_p)
          }

          _tickets.push(new Ticket({events: _event, participants: _participants}))
          
        }

        console.log(_tickets)
        
        let order = await Order.create(
          {
            tickets: _tickets,
            issue_date,
            student_name,
            student_phone,
            student_email
          }
        )
        res.status(201).json({ success: true, data: order })
      } catch (error) {
        res.status(400).json({ success: false , error: error})
      }
      break
    default:
      res.status(400).json({ success: false})
      break
  }
}