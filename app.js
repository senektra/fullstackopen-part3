import express from 'express'

import * as dbfile from './db.json' assert { type: 'json' }

const app = express()
const db = dbfile.default

app.get('/api/persons', (_req, res) => {
  res.json(db)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = db.find(person => person.id === id)
  person ? res.json(person) : res.status(404).send('Person not found')
})

app.get('/info', (req, res) => {
  const htmlInfo = `<p>Phonebook has info for ${db.length} people</p>
<br/>
<p>${(new Date())}</p>
`

  res.send(htmlInfo)
})

app.listen(3001)