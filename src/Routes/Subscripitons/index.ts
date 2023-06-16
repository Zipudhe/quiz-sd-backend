/* This is a module that defines a set of routes for subscribing to events using Server-Sent Events
(SSE) in an Express.js application. */
import express, { Request } from 'express'
import { app } from '../../index'

const router = express.Router()

/**
 * naming pattern for subscriptions:
 * - ':session' -> subscribes to events of type 'joined' for when somewone joins a session
 * - ':session_questions' -> subscribes to events of type 'answered' for listem to answering events
 */

// subscribes to watch joning players
router.get('/:session', (req: Request<{ session: string }>, res) => {
  const { session } = req.params
  const { Broker } = app.locals
  
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  console.log(`Subscribed to events of join in session: ${session}`)

  Broker.subscribe(session, () => {
    res.write('event: joined\n')
    res.write('data: connect\n\n')
  })

  res.on('close', () => {
    console.log('closed subscribing connection')
  })
})


// subscribes to watch starting game
router.get('/start/:session', (req: Request<{ session: string }>, res) => {
  const { session } = req.params
  const { Broker } = app.locals

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  
  console.log(`Subscribed to events of start in session: ${session}`)

  Broker.subscribe(`start_${session}`, () => {
    res.write('event: start\n')
    res.write('data: starting\n\n')
  })

  res.on('close', () => {
    console.log('closed start event')
  })
})

router.get('/:session/question/:id', (req: Request<{ session: string, id: string }>, res) => {
  const { session, id } = req.params
  const { Broker } = app.locals

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  
  console.log(`Subscribed to events of start in session: ${session}`)

  Broker.subscribe(`question_${session}_${id}`, () => {
    res.write('event: awnsered\n')
    res.write('data: player awnsered!\n\n')
  })

  res.on('close', () => {
    console.log('closed start event')
  })
})

export default router 