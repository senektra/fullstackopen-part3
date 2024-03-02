import express from 'express'

import * as dbfile from './db.json' assert { type: 'json' }

const app = express()
const db = dbfile.default

const htmlInfo = `<p>Phonebook has info for ${db.length} people</p>
<br/>
<p>${(new Date())}</p>
`

app.get('/api/persons', (req, res) => {
  res.json(db)
})

app.get('/info', (req, res) => {
  res.send(htmlInfo)
})

app.listen(3001)