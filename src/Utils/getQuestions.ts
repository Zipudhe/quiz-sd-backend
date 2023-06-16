import { Configuration, OpenAIApi } from 'openai'
import { Request, Response } from 'express'
import dotenv from 'dotenv'
import { stringify } from 'querystring'
dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.GPT3_SECRET_KEY
})

type Opcoes = { 
  a: string,
  b: string,
  c: string,
  d: string
}

type Questions = {
  pergunta: string,
  opcoes: Opcoes,
  resposta: keyof Opcoes
}

const openai = new OpenAIApi(configuration)

const formatQuestion = (question: string): object => {
  const questionsArray = question.split('\n').splice(1)
  const statment = questionsArray.shift().trim()
  const answer = Number.parseInt(questionsArray.pop())
  const options = questionsArray.map((value, index) => (value.trim()))

  return { statment, answer, options } 
}

const getQuestions = async ()  => {
  const defaultPrompt = `
  Você é um banco de dados com perguntas e respostas sobre Sistemas Distribuidos.
    
  Agora forneça uma questão da seguinte forma: Na primeira linha da coloque o enunciado da pergunta,
  nas próximas linhas forneça 4 opções de resposta, enumeradas por números seguidos de pontos, e na ultima linha somente o número da opção correta.
  `

  const handleGetQuestions = async () => await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: defaultPrompt,
    temperature: 1,
    max_tokens: 2047
  })

  try {
    const { data } = await handleGetQuestions()
    const { choices, usage } = data
    if(choices[0].finish_reason == 'stop') {
      return formatQuestion(choices[0].text)
    } else {
      console.log('finished_reason: ', choices[0].finish_reason)
      throw new Error('Missing data')
    }

  } catch(e) {
    console.error({ e })
    console.log(typeof e)
  }


}

export default getQuestions