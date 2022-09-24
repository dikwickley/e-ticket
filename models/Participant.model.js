import mongoose from 'mongoose'

const ParticipantSchema = new mongoose.Schema({
    name: {
        type: String
    },
    department: {
        type: String
    },
    email : {
        email: String
    },
    id:{
        type: Number
    }
})

export default mongoose.models.Participant || mongoose.model('Participant', ParticipantSchema)