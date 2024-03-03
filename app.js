import express from 'express'
import morgan from 'morgan'
import crypto from 'node:crypto'

import * as dbfile from './db.json' assert { type: 'json' }

const app = express()
let db = dbfile.default

morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(morgan(
  ':method :url :status :res[content-length] - :response-time ms :body'
))
app.use(express.json())

const queryPersonsById = id => db.find(persons => id === persons.id)
const queryPersonsByName = name => db.find(persons => name.toLowerCase() === persons.name.toLowerCase())

app.get('/api/persons', (_req, res) => {
  res.json(db)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = queryPersonsById(id)
  person ? res.json(person) : res.status(404).send('Person not found')
})

app.get('/info', (req, res) => {
  const htmlInfo = `<p>Phonebook has info for ${db.length} people</p>
<br/>
<p>${(new Date())}</p>
`

  res.send(htmlInfo)
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name) {
    res.status(400).send('Name for contact not specified')
  }
  else if (queryPersonsByName(body.name)) {
    res.status(400).send('Name already exists in phonebook')
  }
  else if (!body.number) {
    res.status(400).send('Number for contact not specified')
  }
  else {
    const newPerson = {
      id: crypto.randomUUID(),
      name: body.name,
      number: body.number
    }

    db.push(newPerson)
    res.json(newPerson)
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  db = db.filter(person => person.id !== id)
  res.status(204).end()
})

app.listen(3001)