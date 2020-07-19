const uuid = require('uuid')
const Joi = require('@hapi/joi')
const decoratorValidator = require('./util/decoratorValidator')
const {enumParams} = require('./util/globalenum')

class Handler {
    constructor({dynamoDbSvc}) {
        this.dynamoDbSvc = dynamoDbSvc
        this.dynamoDbTable = process.env.DYNAMODB_TABLE
    }

    // regras de validação do schema / body do request
    // o joi além de validar o schema de acordo com as regras
    // também já retorna no attr value um obj com os tipos de dados inferidos (valors numéricos voltam como number por ex)
    static validator() {
        return Joi.object({
            nome: Joi.string().max(100).min(2).required(),
            poder: Joi.string().max(20).required()
        })
    }

    async insertItem(params) {
        return this.dynamoDbSvc.put(params).promise() // usar sempre promises, não usar callbacks
    }

    prepareData(data) {
        const params = {
            TableName: this.dynamoDbTable,
            Item: {
                ...data,
                id: uuid.v1(),
                createdAt: new Date().toISOString()
            }
        }

        return params;
    }

    handleSuccesss(data) {
        const response = {
            statusCode: 200,
            body: JSON.stringify(data)
        }

        return response
    }

    handlerError(data) {
        const response = {
            statusCode: data.statusCode || 501,
            headers: {'Content-Type': 'text/plain'},
            body: 'Coudn\'t create item!!'
        }
        
        return response
    }

    async main(event) {
        try {
            const data = event.body
            const dbParams = this.prepareData(data)
            await this.insertItem(dbParams)
        
            return this.handleSuccesss(dbParams.Item)
        } catch(error) {
            console.error('Deu ruim', error.stack)
        
            return this.handlerError({statusCode: 500})
        }
    }
}

//factory
const AWS = require('aws-sdk')
const dynamoDB = new AWS.DynamoDB.DocumentClient()
const handler = new Handler({
    dynamoDbSvc: dynamoDB
})

// declarando o decorator validator no exports indica que as chamadas
// da lambda resultarão na chamada do validator primeiro
// desta forma o validator atuará como um middleware,
// validando e tratando os parâmetros, padronizando o código e permitindo que o handler das funções lambda sejam simplificados
module.exports = decoratorValidator(
    handler.main.bind(handler),
    Handler.validator(),
    enumParams.ARG_TYPE.BODY)
