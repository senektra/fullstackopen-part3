import mongoose from "mongoose";

const mongoose_uri = process.env.MONGOOSE_URI

mongoose.set('strictQuery', false)
mongoose.connect(mongoose_uri)

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'Name must be at least 3 characters long'],
    required: [true, 'Name is required']
  },
  number: String
})

personSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id.toString()
    delete ret._id
    delete ret.__v
  }
})

export default mongoose.model('Person', personSchema)
