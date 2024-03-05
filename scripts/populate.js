import mongoose from 'mongoose'
import { readFileSync } from 'fs'

let db = JSON.parse(readFileSync('../db.json'))

const args = {
  password: null,
}

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
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

const personsToSave = db.map(person => new Person({ ...person }))

Person.bulkSave(personsToSave)
  .then(data => {
    console.log(data)
    mongoose.connection.close()
  })
