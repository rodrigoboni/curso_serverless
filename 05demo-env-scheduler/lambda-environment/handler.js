'use strict';

// (projeto sem aplicação de patterns como factory etc para efeitos de aprendizado)

const settings = require('./config/settings')
const axios = require('axios')
const cheerio = require('cheerio')
const AWS = require('aws-sdk')
const uuid = require('uuid')
const dynamoDB = new AWS.DynamoDB.DocumentClient()

module.exports.scheduler = async event => {
  console.log('at', new Date().toISOString(), JSON.stringify(event, null, 2))
  
  // buscar conteúdo no site configurado
  // await é um suggar-syntax, decorando uma promise (retornada pelo get do axios)
  // se a promise for resolvida o retorno é atribuído ao operador
  // se a promise for rejeitada é lançada uma exception
  const { data } = await axios.get(settings.commitMessageUrl)

  // cheerio atua como um jquery no backend, permitindo manipular conteúdo html
  const $ = cheerio.load(data)

  const [commitMessage] = await $("#content").text().trim().split('\n')
  console.log('Message', commitMessage)

  const params = {
    TableName: settings.dbTableName,
    Item: {
      commitMessage,
      id: uuid.v1(),
      createdAt: new Date().toISOString()
    }
  }
  await dynamoDB.put(params).promise()
  console.log('Process finished at', new Date().toISOString())

  return {
    statusCode: 200
  }
};
