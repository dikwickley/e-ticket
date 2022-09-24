import mongoose from 'mongoose'
import ParticipantSchema from './Participant.model'
import EventSchema from './Event.model'

const TicketSchema = new mongoose.Schema({
    participants: [ParticipantSchema],
    events: [EventSchema],
    issue_date: Date,
    total_price: Number

})

export default mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema)