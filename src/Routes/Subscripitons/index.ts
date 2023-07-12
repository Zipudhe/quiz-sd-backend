/* This is a module that defines a set of routes for subscribing to events using Server-Sent Events
(SSE) in an Express.js application. */
import express, { Request } from 'express'
import { app, client } from '../../index'
import { SessionData } from "../Session"

const router = express.Router()

/**
 * naming pattern for subscriptions:
 * - ':session' -> subscribes to events of type 'joined' for when somewone joins a session
 * - ':session_questions' -> subscribes to events of type 'answered' for listem to answering events
 */

// subscribes to watch joning players
router.get('/:session/:userId', async (req: Request<{ session: string, userId: string }>, res) => {
  const { session, userId } = req.params
  const { Broker } = app.locals

  const currentSession = await client.get(session)
    .then(session => JSON.parse(session) as SessionData)
  
  if(!currentSession) {
    return res.status(400)
  }

  if(currentSession.users.length == 4) {
    return res.status(400).json({ message: 'session is full' })
  }

  // updates current sesssion with new user
  if(!currentSession.users.find(user => Object.keys(user)[0] == userId)) {
    currentSession.users.push({ [userId]: 0 })
    client.set(session, JSON.stringify(currentSession))
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  console.log(`Subscribed to events of join in session: ${session} with user: ${userId}`)
  // get on redis all current users on session and send this data
  Broker.subscribe(session, async() => {
    const currentSession = await client.get(session)
    .then(session => JSON.parse(session) as SessionData)

    res.write('event: joined\n')
    res.write(`data: ${currentSession.users.length}\n\n`)
  })

  Broker.publish(session)

  res.on('close', () => {
    Broker.unsubscribe(session)
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
    res.write(`data: ${new Date().toString()}\n\n`)
  })

  res.on('close', () => {
    console.log('closed start event')
  })
})

// subscribes to a question
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