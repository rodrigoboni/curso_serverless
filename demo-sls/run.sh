# install serverless framework
npm i -g serverless

# call framework cli
sls | serverless

# create project
sls

# deploy
sls deploy

# invocar funcao na aws
sls invoke -f <nome da funcao> --log

# invocar funcao local
sls invoke local -f <nome da funcao> --log

# ver logs
sls logs -f <nome da funcao> --tail

# configurar dashboard
sls login (p/ autenticar na conta do site serverless, onde ficam os dashboards)
sls (configurar monitoração)
sls deploy (p/ atualizar deploy)

# visualizar dashboard
sls dashboard (p/ ver o dashboard)

# remover recursos da aws
sls remove 