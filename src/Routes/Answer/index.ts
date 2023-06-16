import express, { Request, Response } from 'express'
import { app } from '../../index'

const router = express.Router()

router.post('/', (req: Request<{}, { answer: string, session: string, question: string }>, res: Response) => {
  const { Broker } = app.locals
  const { answer, session, question } = req.body
  console.log({ answer, session, question })

  const timeStamp = new Date().getTime()
  //TODO: fetch specific answer, session and question and check if it's true. Then return result
  
  return res.json({ isCorrect: false })
})

export default router