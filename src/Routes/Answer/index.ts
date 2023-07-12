import express, { Request, Response } from 'express'
import { app } from '../../index'
import { client } from '../../index'
import { SessionData } from '../Session'

const router = express.Router()

const caclPoints = (value: number) => {
  return 100 - value*(100/200000)
} 

router.post('/', async (req: Request<{}, { correct: boolean, session: string, question: string, user_id: string, sentQuestionTime: number }>, res: Response) => {
  const responseTime = new Date().getTime()
  const { Broker } = app.locals
  const { correct, session, question, user_id, sentQuestionTime } = req.body
  const deltTime = responseTime - sentQuestionTime
  console.log({ deltTime })
  const points = Math.round(caclPoints(deltTime))
  const currentSession = await client.get(session)
    .then(session => JSON.parse(session) as SessionData)

  console.log({ correct, session, question, user_id, points })
  if(correct) {
    const user = currentSession.users.find(user => Object.keys(user)[0] == user_id)
    if(user) {
      console.log({ usersBefore: currentSession.users })
      const indexOfUser = currentSession.users.indexOf(user)
      user[`${user_id}`] = user[`${user_id}`] + points

      console.log({ indexOfUser, updatedUsersPoints: user[`${user_id}`] })

      currentSession[indexOfUser] = user
      console.log({ usersAfter: currentSession.users })

      client.set(session, JSON.stringify(currentSession))
    }
  }

  res.json({ isCorrect: false })  
  return 
})

export default router