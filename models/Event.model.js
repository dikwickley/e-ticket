import mongoose from 'mongoose'

const EventSchema = new mongoose.Schema({
    name: {
        type: String
    },
    department: {
        type: String
    },
    description: {
        type: String
    },
    date:{
        type: Date
    },
    price:{
        type: Number
    },
    type:{
        type: String
    }
})

export default mongoose.models.Event || mongoose.model('Event', EventSchema)