'use strict';

const { get } = require('axios')

class Handler {
  constructor({ rekoSvc, translatorSvc }) { // recebe instâncias dos serviços a serem utilizados (passados pela factory)
    this.rekoSvc = rekoSvc
    this.translatorSvc = translatorSvc
  }

  async detectImageLabels(buffer) {
    const result = await this.rekoSvc.detectLabels({
      Image: {
        Bytes: buffer
      }
    }).promise () // aws permite utilizar promises / elimina uso de callbacks

    const workingItems = result.Labels.filter(({Confidence}) => Confidence > 80)

    const names = workingItems.map(({Name}) => Name).join(' and ')

    return {names, workingItems}
  }

  async translateText(text) {
    const params = {
      SourceLanguageCode: 'en',
      TargetLanguageCode: 'pt',
      Text: text
    }

    const { TranslatedText } = await this.translatorSvc.translateText(params).promise()

    return TranslatedText.split(' e ')
  }

  formatTextResults(texts, workingItems) {
    const finalText = []
    for(const indexText in texts) {
      const nameInPortuguese = texts[indexText]
      const confidence = workingItems[indexText].Confidence;
      finalText.push(
        ` ${confidence.toFixed(2)}% de ser do tipo ${nameInPortuguese}`

      )
    }
    
    return finalText.join('\n')
  }

  async getImageBuffer(imageUrl) {
    const response = await get(imageUrl, {
      responseType: 'arraybuffer'
    })
    const buffer = Buffer.from(response.data, 'base64')

    return buffer
  }

  async main(event) {
    try {
      const { imageUrl } = event.queryStringParameters
      
      console.log('downloading image...')
      // const imgBuffer = await readFile('./images/img1.jpg')
      const imgBuffer = await this.getImageBuffer(imageUrl)

      console.log('Detecting labels...')
      const {names, workingItems} = await this.detectImageLabels(imgBuffer)
      
      console.log('Translating...')
      const texts = await this.translateText(names)

      console.log('handling final object...')
      const finalText = this.formatTextResults(texts, workingItems)

      console.log('finishing...')

      return {
        statusCode: 200,
        body: `A imagem tem\n `.concat(finalText)
      }
    } catch (error) {
      console.log('Error***', error.stack)
      return { // response default esperado pelo aws p/ sucesso ou falha {statusCode: 999, body: str}
        statusCode: 500,
        body: 'Internal server error'
      }
    }
  }
}

//factory
//para gerenciar as dependências passadas para a instância da class Handler
//recomendado definir a factory em arquivo separado (mantido aqui p/ fins didáticos)
const aws = require('aws-sdk')
const reko = new aws.Rekognition() 
const translator = new aws.Translate()
const handler = new Handler({
  rekoSvc: reko,
  translatorSvc: translator
})

//define a função a ser exportada
//utiliza o bind para garantir o contexto (this)
module.exports.main = handler.main.bind(handler)
