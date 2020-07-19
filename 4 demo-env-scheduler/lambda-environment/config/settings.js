const env = require('env-var')
const settings = {
    // valida var env
    // a fn required() indica que se a var env não existir a app deve lançar erro
    // asString aplica formatação / tipagem da var env - existem várias opções, como json, portnumber etc
    NODE_ENV: env.get('NODE_ENV').required().asString(),
    commitMessageUrl: env.get('APICommitMessagesURL').required().asString(),
    dbTableName: env.get('DbTableName').required().asString()
}

module.exports = settings