import express, { Request, Response } from 'express'
import { app } from '../../index'
import { v4 as uuid } from 'uuid'
import { client } from '../../index'

const router = express.Router()

type User =  {
  [x: string]: number
}

export type SessionData = {
  users: User[],
}

type NewSessionRequest = Request<{}, {}, {}, { session: string, userId?: string }>
type StartSession = Request<{}, {}, { session: string }, {}>

router.put('/session', async (req: NewSessionRequest, res: Response) => {
  const { session, userId } = req.query
  const { Broker } = app.locals

  //TODO create function to check if sessions exists
  const dbSession = await client.get(session)
  if(!dbSession) {
    console.log('session does not exists, will create a new one')
    const sessionData = {
      users: [],
    } as SessionData

    const createdSession = await client.set(session, JSON.stringify(sessionData))
    console.log({ createdSession })
  }

  // if is sending userId user already know this session
  if(userId) {
    return res.json({ session, userId })
  }

  // sends messagem to subscribers on 'session'
  const newUuid = uuid()

  return res.json({ session, userId: newUuid })
})

router.post('/session/start', (req: StartSession, res: Response) => {
  const { Broker } = app.locals
  const { session } = req.body

  // send message to all players to start game
  Broker.publish(`start_${session}`)
  res.json({ message: 'ok' })
})

router.get('/session/ranking/:session', async (req: Request, res: Response) => {
  const { session } = req.params
  //TODO: Get points from database and return in order of ranking
  console.log({ session })

  const sessionData = await client.get(session as string)
    .then(session => JSON.parse(session) as SessionData)

  console.log({ sessionData })

  const { users } = sessionData

  res.status(200).json({ users })
})

export default router