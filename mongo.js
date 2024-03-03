import mongoose from "mongoose"

const args = {
  password: null,
  name: null,
  number: null
}

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

if (process.argv.length > 3) {
  args.name = process.argv[3]
  args.number = process.argv[4]
}

args.password = process.argv[2]

const url = 
  `mongodb+srv://rcvallada:${args.password}@fso.qwd1v1s.mongodb.net/phonebook?retryWrites=true&w=majority&appName=fso`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (args.name) {
  const person = new Person({
    name: args.name,
    number: args.number,
  })
  
  person.save().then(result => {
    console.log('person saved')
    mongoose.connection.close()
  })
} else {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}
