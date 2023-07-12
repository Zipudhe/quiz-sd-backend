import express, { json, Response, Request, NextFunction } from 'express'
import cors from 'cors'

import SubscriptionRouter from './Routes/Subscripitons'
import AnswerRouter from './Routes/Answer'
import SessionRouter from './Routes/Session'
import QuestionRouter from './Routes/Questions'

import Broker from './Middleware/Broker'
import { createClient } from 'redis'

export const client = createClient({
  url: 'redis://127.0.0.1:6379'
})

client.connect()
  .catch(err => {
    console.error('Failed to connect with redis: ', { err })
  })

const myMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log({ req })
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next()
}

/* This code is creating an Express server and defining various routes using middleware. */
export const app = express()

app.locals = {
  Broker: new Broker(),
}

app.use(myMiddleware)
app.use(cors())
app.use(json())

app.get('/ping', (_, res) => res.json({ message: 'pong' }))
app.use('/subscribe', SubscriptionRouter)
app.use('/answer', AnswerRouter)
app.use('/question', QuestionRouter)
app.use(SessionRouter)

app.listen(5000, () => console.log(`linstening to port 5000`))
