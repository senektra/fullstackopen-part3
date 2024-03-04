import express from 'express'
import artTemplate from 'express-art-template'
import morgan from 'morgan'
import cors from 'cors'
import 'dotenv/config'

import Person from './models/person.js'

const app = express()
const environment = process.env.NODE_ENV

// Set template engine
app.engine('art', artTemplate)
app.set('view engine', 'art');

// Set up express and express included middleware
app.use(express.json())

// Set up morgan
morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(
  ':method :url :status :res[content-length] - :response-time ms :body'
))

// Set up cors
app.use(cors())

/* Get requests */

app.get('/api/persons', (_req, res, next) => {
  Person.find({})
    .then(persons => {
      res.json(persons)
    })
    .catch(next)
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      res.json(person)
    })
    .catch(err => {
      if (err.name === 'CastError') {
        next({
          status: 400,
          message: 'Invalid id'
        })
      } else {
        next(err)
      }
    })
})

app.get('/info', (req, res, next) => {
  Person.find({})
    .then(persons => {
      res.render('index', {
        personCount: persons.length,
        dateRequested: (new Date()).toUTCString()
      })
    })
    .catch(next)
})

/* Post Requests */

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body.name) {
    next({
      status: 400,
      message: 'Name for contact not specified'
    })
  }
  else if (!body.number) {
    next({
      status: 400,
      message: 'Number for contact not specified'
    })
  }
  else {
    const newPerson = new Person({
      name: body.name,
      number: body.number
    })

    newPerson.save()
      .then(savedPerson => {
        res.json(savedPerson)
      })
      .catch(next)
  }
})

/* Delete requests */

app.delete('/api/persons/:id', (req, res) => {
  throw {
    status: 501,
    error: 'Service not implemented'
  }
})

// Catch 404 and forward to error handler
app.use((_req, _res, _next) => {
  throw {
    status: 404,
    message: 'Resource not found'
  }
})

// Error handler
app.use((err, req, res, _next) => {
  res.status(err.status || 500).json(err)
})

// Set port and listen
const port = process.env.PORT || 3001
app.listen(port)
