import mongoose from 'mongoose'
import {TicketSchema} from './Ticket.model'

const OrderSchema = new mongoose.Schema({
    tickets: [TicketSchema],
    issue_date: {
        type:Date,
        default:new Date()
    },
    student_name: String,
    student_phone: String,
    student_email: String,
    payment_mode:String,
    tarnsection_id:String,
    
})

export default mongoose.models.Order || mongoose.model('Order', OrderSchema)