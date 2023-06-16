import { Router, Request, Response } from 'express'

import getQuestions from '../../Utils/getQuestions'

const router = Router()

router.get('/', async (_req: Request, res: Response) => {
  await getQuestions()
    .then((question) => {
      try {
        return res.json({ question })
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