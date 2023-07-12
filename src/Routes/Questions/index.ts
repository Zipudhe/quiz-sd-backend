import { Router, Request, Response } from 'express'

import getQuestions from '../../Utils/getQuestions'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  
  await getQuestions()
    .then((question) => {
      try {
        const resquestTime = new Date().getTime()
        return res.json({ question, requestServerTime: resquestTime })
      } catch (e) {
        throw new Error("failed to parse json");
      }
    })
    .catch(error => {
      console.error({ error })
      return res.status(500).send({ message: 'error', error })
    })
})

export default router