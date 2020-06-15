/*
retorna uma função para validar os parâmetros recebidos e realizar parse / inferir tipos
e em seguida chama a função passada no param fn
é a mesma ideia do .next() do express (chamada em cadeia)

(pattern decorator)
*/

/**
 * decoratorValidator
 * @param {*} fn fn a ser invocada após validação / chain
 * @param {*} schema fn com regras de validação do schema (hapi/joi)
 * @param {*} argsType tipo de validação (atributo de event - body, header etc)
 */
const decoratorValidator = (fn, schema, argsType) => {
    return async function(event) {
        // json parse do tipo indicado em argsType
        // nas fn lambda os parâmetros são recebidos como string, por isso é necessário converter p/ json
        const data = JSON.parse(event[argsType])

        // validar o schema de acordo com as regras indicadas na fn passada por param
        const {error, value} = await schema.validate(
            data, {abortEarly: true} // abortEarly indica para retornar todos os erros de uma vez
        )

        // alterar / atualizar no event o atributo passado em argsType com os valores tratados / inferidos pelo Joi
        event[argsType] = value

        // se não houve erro
        // invoca a fn que invocou o decorator (equivale ao .next() do express)
        // o arguments representa todos os argumentos nesta fn - é útil p/ não ter que definir manualmente os argumentos / ser dinâmico
        if(!error) return fn.apply(this, arguments)

        // se a validação falhou retornar status 422 + as mensagens de validação
        return {
            statusCode: 422, // unprocessable entity
            body: error.message
        }
    }
}

module.exports = decoratorValidator