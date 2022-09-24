import mongoose from 'mongoose'

const ParticipantSchema = new mongoose.Schema({
    name: {
        type: String
    },
    department: {
        type: String
    },
    id:{
        type: Number
    }
})

export default mongoose.models.Participant || mongoose.model('Participant', ParticipantSchema)