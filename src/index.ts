import express, { json } from 'express'
import cors from 'cors'

import SubscriptionRouter from './Routes/Subscripitons'
import AnswerRouter from './Routes/Answer'
import SessionRouter from './Routes/Session'
import QuestionRouter from './Routes/Questions'

import Broker from './Middleware/Broker'

const myMiddleware = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next()
}

/* This code is creating an Express server and defining various routes using middleware. */
export const app = express()
app.locals = {
  Broker: new Broker()
}

// app.use(myMiddleware)
app.use(cors())
app.use(json())

app.get('/ping', (_, res) => res.json({ message: 'pong' }))
app.use('/subscribe', SubscriptionRouter)
app.use('/answer', AnswerRouter)
app.use('/question', QuestionRouter)
app.use(SessionRouter)

app.listen(5000, () => console.log(`linstening to port 5000`))