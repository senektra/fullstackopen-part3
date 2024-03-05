import express from 'express'
import artTemplate from 'express-art-template'
import morgan from 'morgan'
import cors from 'cors'
import 'dotenv/config'

import Person from './models/person.js'

const app = express()

// Set template engine
app.engine('art', artTemplate)
app.set('view engine', 'art')

// Set up express and express included middleware
app.use(express.json())

// Set up morgan
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(
  ':method :url :status :res[content-length] - :response-time ms :body'
))

// Set up cors
app.use(cors())

/* Get requests */

app.get('/api/persons', (_req, res, next) => {
  Person.find({})
    .then(persons => res.json(persons))
    .catch(next)
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => res.json(person))
    .catch(next)
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
  const { name, number } = req.body

  if (!name) {
    next({
      status: 400,
      error: 'NameError',
      message: 'Name for contact not specified'
    })
  }
  else if (!number) {
    next({
      status: 400,
      error: 'NumberError',
      message: 'Number for contact not specified'
    })
  }
  else {
    const newPerson = new Person({ name, number })

    newPerson.save()
      .then(savedPerson => res.json(savedPerson))
      .catch(next)
  }
})

/* Put requests */

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => res.json(updatedPerson))
    .catch(next)
})

/* Delete requests */

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch(next)
})

// Catch 404 and forward to error handler
app.use((_req, _res, next) => {
  next({
    status: 404,
    message: 'Resource not found'
  })
})

// Catch non-api errors
app.use((err, req, res, next) => {
  if (err.name === 'CastError') {
    next({
      status: 400,
      message: 'Invalid id'
    })
  }
  else if (err.name === 'ValidationError') {
    next({
      status: 400,
      message: Object.values(err.errors)[0].message
    })
  } else {
    console.log(err)
    next(err)
  }
})

// Handle errors
app.use((err, req, res, next) => {
  res.status(err.status || 500).json(err)
})

// Set port and listen
const port = process.env.PORT || 3001
app.listen(port)
