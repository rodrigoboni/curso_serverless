# Resumos e código do curso ew.it Aplicações Serverless na AWS

## SEMPRE REMOVER RECURSOS ALOCADOS APÓS CONCLUIR ESTUDOS (P/ NÃO GERAR CUSTOS)

## Modulo Introdução à apps Serverless

### Criação de conta

* Criar conta na aws
* Criar usuário com permissões admin (IAM)
* Salvar arquivo csv com credenciais - NÃO EXPOR ESTE ARQUIVO EM REPOSITÓRIO REMOTO!

### aws cli e credenciais

* Instalação https://aws.amazon.com/pt/cli/
* Configurar perfil / credenciais:
  * aws configure
    * preencher com dados do arquivo csv de secrets
    * selecionar regiao us-east-1
    * output json

### Primeira aplicação na AWS via interface

* Manipular bucket S3:
  * aws s3 ls
  * upload: aws s3 cp (arquivo local) s3://(bucket)/pasta...
  * download: aws s3 cp s3://(bucket)/arquivo ./

### 01demo-lambda-sem-framework - Primeira aplicação na AWS sem frameworks

### Possíveis limitações ao utilizar aws lambda

* Runtime environment diferente da máquina local
  * Consultar documentação aws - <https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html>
  * Testar / fazer deploy com frequência
* Coldstart
  * após 10min a instância é finalizada / próximo request vai demorar um pouco mais (média 500ms)
  * <https://mikhail.io/serverless/coldstarts/aws/>
  * funções com muitas dependências ou muito extensas demoram mais também
* Princing
  * considera o número de requests
  * considera também o tempo de execução de cada chamada - se for acima de 10s pode ser inviável - as lambdas devem ser focadas em tarefas pequenas
  * <https://aws.amazon.com/pt/lambda/pricing/>

### 02demo-sls - Introdução ao Serverless framework

* <https://www.serverless.com/>
* framework criado para ser agnóstico quanto ao provedor (aws, google cloud etc)
* na prática funciona melhor na aws
* min node v10

### 03demo-image-analysis - Criando uma API para analisar imagens com AWS Rekognition

* detalhes implementação comentado no código
* pontos importantes
  * inicializar npm
    * instalar dependencias
    * ajustar serverless.yml com permissionamento para utilizar serviços aws
    * o access key / secret definido nas credenciais / perfil utilizado para deploy tem que ter permissão para autorizar serviços (IAM)
    * arquivo request.json apenas p/ facilitar testes indicando query string parameters
    * testar localmente e remoto (fazer deploy antes)
      * sls invoke local -f img-analysis --path request.json --log
        * sls invoke -f img-analysis --path request.json --log
        * chamar a url gerada passando os parametros no browser para testar também

### 04demo-trigger-dynamodb - Validações inteligentes com Joi e DynamoDB stream events

* obs patterns aplicados
* obs trigger de fn a partir do dynamodb

### 05demo-env-scheduler - Trabalhando com multi-environments e schedulers

* obs tratamento de variáveis de ambiente, validação de var env requeridas p/ start da app
* obs execução de fn por agendamento no cloud watch
* usar npm tasks p/ deploy, remove, invoke etc
* após fazer deploy obs logs no console aws lambda

### 06demo-layers - Lambda layers

* O recurso de camadas da AWS Lambda permite incluir arquivos ou dados adicionais nas funções, geralmente aplicado p/ utilizar binários de bibliotecas
* As camadas são adicionadas ao arquivo ZIP utilizado para upload do código ao ambiente da AWS
* P/ efeito de comparação a AWS Lambda Layer é como uma EC2 AMI, porém voltado a funções
* Um recurso muito interessante é que uma camada pode ser compartilhada / utilizada por várias funções
* No exemplo da pasta um binário é criado e depois utilizado em uma função lambda
* P/ executar a função local e ter o layer injetado é necessário add o param --docker, p/ o fw simular o ambiente runtime
* Cuidado ao fazer deploy, se os layers utilizados estiverem no mesmo projeto o fw entenderá que é uma nova versão da layer, e portanto ocorrerá incremento de versão, dificultando controle de versionamento (manter as layers em projetos separados)

### Comandos úteis / comuns

```bash
# deploy
sls deploy

# invocar funcao na aws
sls invoke -f <nome da funcao> --logger

# invocar funcao local
sls invoke local -f <nome da funcao> --logger

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

# visualizar dashboard
sls dashboard

# remover recursos da aws
sls remove
```

### Links úteis

* <https://www.serverless.com/framework/docs/providers/aws/cli-reference/>

### VSCode extensions

* Serverless Console - visualizar logs das funções, visualizar recursos da aws, como tabelas dynamo etc
* Serverless IDE - code snippets relacionados ao serverless fw
