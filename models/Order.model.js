import mongoose from "mongoose";
import { TicketSchema } from "./Ticket.model";

const OrderSchema = new mongoose.Schema({
  tickets: [TicketSchema],
  issue_date: Date,
  student_name: String,
  student_phone: String,
  student_email: String,
  student_collegeid: String,
  payment_mode: String,
  transaction_id: String,
  order_taken_by: String,
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
