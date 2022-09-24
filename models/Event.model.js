import mongoose from 'mongoose'

const EventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name for event'],
    },
    department: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date:{
        type: Date,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    type:{
        type: String,
        required: true
    }
})

export default mongoose.models.Event || mongoose.model('Event', EventSchema)