# passos para criar lambda:
# criar arquivo de politicas se segurança p/ definir o que a lambda pode acessar (politicas.json)

# criar role na aws (IAM)
aws iam create-role \
    --role-name lambda-exemplo \
    --assume-role-policy-document file://policy.json \
    | tee logs/role.log
    
# criar arquivo index.js

# zipar arquivo
zip function.zip index.js

# criar lambda na aws
# (role - utilizar o resultado do comando p/ criar a role - attr arn)
aws lambda create-function \
    --function-name hello-cli \
    --zip-file fileb://function.zip \
    --handler index.handler \
    --runtime nodejs12.x \
    --role arn:aws:iam::845429459889:role/lambda-exemplo \
    | tee logs/lambda-create.log

# se for preciso alterar a função, zipar novamente e exec comando p/ atualizar a lambda
aws lambda update-function-code \
    --zip-file fileb://function.zip \
    --function-name hello-cli \
    --publish \
    | tee logs/lambda-update.log

# invoke lambda
aws lambda invoke \
    --function-name hello-cli \
    --log-type Tail \
    logs/lambda-invoke.log

# remover lambda e iam p/ não gerar custo / ficar com recursos sem uso
aws lambda delete-function \
    --function-name hello-cli

aws iam delete-role \
    --role-name lambda-exemplo