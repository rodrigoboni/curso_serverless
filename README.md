# Resumos e código do curso Ew.it Aplicações Serverless na AWS

(obs arquivos run.sh dentro das pastas, contém detalhes específicos de cada aula)

## Modulo Introdução à apps Serverless

### aws cli
* Instalação https://aws.amazon.com/pt/cli/

### Primeira aplicação na AWS via interface
* Manipular bucket S3:
    * aws s3 ls
    * upload - aws s3 cp <arquivo local> s3://<bucket>/pasta...
    * download aws s3 cp s3://<bucket>/arquivo ./

### Primeira aplicação na AWS sem frameworks
* pasta lambda-sem-framework

### Possíveis limitações ao utilizar aws lambda:
* Runtime environment diferente da máquina local
    * Consultar documentação aws - https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html
    * Testar / fazer deploy com frequência
* Coldstart
    * após 10min a instância é finalizada / próximo request vai demorar um pouco mais (média 500ms)
    * https://mikhail.io/serverless/coldstarts/aws/ 
    * funções com muitas dependências ou muito extensas demoram mais também
* Princing
    * considera o número de requests
    * considera também o tempo de execução de cada chamada - se for acima de 10s pode ser inviável - as lambdas devem ser focadas em tarefas pequenas
    * https://aws.amazon.com/pt/lambda/pricing/

### Introdução ao Serverless framework
* https://www.serverless.com/
* framework criado para ser agnóstico quanto ao provedor (aws, google cloud etc)
* na prática funciona melhor na aws
* pasta demo-sls
* min node v10
