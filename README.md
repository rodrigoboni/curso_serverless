# Resumos e código do curso ew.it Aplicações Serverless na AWS

## Criação de conta

* Criar conta na aws
* Criar usuário com permissões admin (IAM)
* Salvar arquivo csv com credenciais

## aws cli e credenciais

* Instalação <https://aws.amazon.com/pt/cli/>
* Configurar perfil / credenciais:
  * aws configure
    * preencher com dados do arquivo csv de secrets
    * selecionar regiao us-east-1
    * output json
* Testar credenciais fazendo upload de arquivo p/ bucket s3
  * criar bucket via console aws
  * upload aws s3 cp (arquivo) s3://(bucket)
  * listar aws s3 ls
  * remover aws s3 rm s3://(bucket)/(arquivo)

## Comandos úteis / comuns

```bash
# instalação serverless
npm i -g serverless

# criar projeto
sls

# deploy
sls deploy

# invocar funcao na aws
sls invoke -f <nome da funcao> -l

# invocar funcao local / sem chamar aws
sls invoke local -f <nome da funcao> -l

# invocar funcao local simulando ambiente runtime (p/ uso de layers)
sls invoke local --docker -f <nome da funcao>

# ver logs
sls logs -f <nome da funcao> --tail

# configurar dashboard
# (p/ autenticar na conta do site serverless, onde ficam os dashboards)
sls login 
# (configurar monitoração)
sls 
# (p/ atualizar deploy)
sls deploy 

# info do projeto e deploy
sls info

# visualizar dashboard
sls dashboard

# remover recursos da aws
sls remove
```

### Links úteis

* <https://www.serverless.com/framework/docs/providers/aws/cli-reference/>

### VSCode extensions

* Serverless Console
* Serverless IDE
* Serverless Framework

## Detalhes importantes sobre serverless

* Arquitetura serverless
  * A arquitetura serverless envolve o  vendor lock-in (ao escolher uma plataforma o projeto fica restrito / limitado aos recursos desta plataforma, tornando o projeto dependente da plataforma em questão)
  * O framework Serverless tenta / propõe resolver o vendor lock-in, fornecendo vários providers para compilar o projeto (aws, google, azure etc)
  * Tempo limite de execução 15min <https://aws.amazon.com/pt/about-aws/whats-new/2018/10/aws-lambda-supports-functions-that-can-run-up-to-15-minutes/>
  * Coldstart
    * após 10min a instância é finalizada / próximo request vai demorar um pouco mais (média 500ms)
    * <https://mikhail.io/serverless/coldstarts/aws/>
    * funções com muitas dependências ou muito extensas demoram mais também
  * Princing
    * considera o número de requests
    * considera também o tempo de execução de cada chamada - se for acima de 10s pode ser inviável - as lambdas devem ser focadas em tarefas pequenas
    * <https://aws.amazon.com/pt/lambda/pricing/>
* Runtime:
  * Opções de runtime env p/ lambdas: <https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html>
  * Uma opção muito utilizada é runtime node.js
  * Portanto tratar como um projeto node (inicializar com npm init, gerenciar / instalar dependências etc)
  * Ter o hábito de fazer deploy várias vezes durante o desenvolvimento, para garantir que código / projeto funcione no runtime da aws
* Funções:
  * Manter padrão / assinatura de resposta das lambdas: {statusCode: 200, body: 'blabla'}
* Framework:
  * <https://www.serverless.com/>
  * Framework criado para ser agnóstico quanto ao provedor (aws, google cloud etc) - porém funciona melhor com aws
  * Requer node na versão 10 no mínimo
  * Utiliza as credenciais (access key e secret key) configuradas no aws cli do ambiente (.aws/credentials)
  * As credenciais utilizadas tem que ter permissão suficiente para acessar os recursos utilizados nas lambdas
  * Através do serverless.yml é possível aprovisionar recursos, gerenciar permissões etc

## Módulo 03 - Criando uma API para analisar imagens com AWS Rekognition (03demo-image-analysis)

* detalhes implementação comentado no código
* ajustar serverless.yml com permissionamento para utilizar serviços aws
* arquivo request.json apenas p/ facilitar testes indicando query string parameters
* sls invoke (local) -f img-analysis --path request.json --log
* executar a fn por http também - ex: <https://xxx.execute-api.us-east-1.amazonaws.com/dev/analyse?imageUrl=https://englishlive.ef.com/pt-br/blog/wp-content/uploads/sites/16/2014/07/beagle-lindo.jpg>

## Módulo 04 - Validações inteligentes com Joi e DynamoDB stream events (04demo-trigger-dynamodb)

* obs patterns aplicados
* obs trigger de fn a partir do dynamodb

## Módulo 05 - Trabalhando com multi-environments e schedulers (05demo-env-scheduler)

* obs tratamento de variáveis de ambiente, validação de var env requeridas p/ start da app
* obs execução de fn por agendamento no cloud watch
* usar npm tasks p/ deploy, remove, invoke etc
* após fazer deploy obs logs no console aws lambda

## Módulo 06 - Lambda layers (06demo-layers)

* O recurso de camadas da AWS Lambda permite incluir arquivos ou dados adicionais nas funções, geralmente aplicado p/ utilizar binários de bibliotecas
* As camadas são adicionadas ao arquivo ZIP utilizado para upload do código ao ambiente da AWS
* P/ efeito de comparação a AWS Lambda Layer é como uma EC2 AMI, porém voltado a funções
* Um recurso muito interessante é que uma camada pode ser compartilhada / utilizada por várias funções
* No exemplo da pasta um binário é criado e depois utilizado em uma função lambda
* P/ executar a função local e ter o layer injetado é necessário add o param --docker, p/ o fw simular o ambiente runtime
* Cuidado ao fazer deploy, se os layers utilizados estiverem no mesmo projeto o fw entenderá que é uma nova versão da layer, e portanto ocorrerá incremento de versão, dificultando controle de versionamento (manter as layers em projetos separados)

