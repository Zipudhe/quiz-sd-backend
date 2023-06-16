import express, { Request, Response } from 'express'
import { app } from '../../index'
import { v4 as uuid } from 'uuid'

const router = express.Router()

type NewSessionRequest = Request<{}, {}, {}, { session: string }>
type StartSession = Request<{}, {}, { session: string }, {}>

router.put('/session', (req: NewSessionRequest, res: Response) => {
  const { session } = req.query
  const { Broker } = app.locals

  //TODO create function to check if sessions exists
  // sends messagem to subscribers on 'session'
  Broker.publish(session)
  const newUuid = uuid()

  return res.json({ session, id: newUuid })
})

router.post('/session/start', (req: StartSession, res: Response) => {
  const { Broker } = app.locals
  const { session } = req.body
  //TODO: check if all players in session are with status 'ready'
  Broker.publish(`start_${session}`)
  res.json({ message: 'ok' })
})

router.get('/session/ranking/:session', (req: Request, res: Response) => {
  const { session } = req.body
  //TODO: Get points from database and return in order of ranking

  res.json({ message: 'ok' })
})

export default router