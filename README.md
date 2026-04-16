# Projeto

Estruturado seguindo a metodologia Feature-Sliced Design.

- App: contém as configurações do projeto como providers e css.
- Features: contém funcionalidades que podem ou não estar direcionadas com regras de negócio. Ex.: DarkMode.
- Entities: contém todas as entidades das regras de negócio. Ex.: Reseller, Store.
- Pages: reunião de Features, Entities e componentes para exibir uma funcionalidade completa.
- Shared: contém componentes reutilizáveis, utilidades comuns, configurações de api.

# Rotas

A pasta App que está na raíz do projeto serve como rotas. Não use ./src/App.

# Identificação de componentes/interfaces

Toda pasta chamada de "ui" terá um componete (.tsx).

# CI/CD AWS Amplify

O workflow [deploy_aws_amplify.yml](.github/workflows/deploy_aws_amplify.yml) faz CI + deploy automatico para AWS Amplify em push para `main` e `develop`.

## Secrets necessarios no GitHub

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION` (opcional, padrao: `us-east-1`)
- `AMPLIFY_APP_ID` (opcional, fallback: `d1pfge0jj4y5ly`)

## Fluxo

- Executa checks do workflow de PR (`lint`, `tsc`, `test`)
- Dispara `aws amplify start-job --job-type RELEASE`
- Aguarda status final do deploy e falha o pipeline se o job falhar

## Deploy manual

Tambem e possivel disparar manualmente em `Actions > Deploy AWS Amplify` usando `workflow_dispatch` e informando um branch.
