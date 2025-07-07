# Cidade Conectada

Aplicativo para facilitar o acesso a serviços públicos, informações e comunicação entre cidadãos e prefeitura, promovendo cidadania digital e inclusão.

## Status do Projeto
Em produção — novas funcionalidades e melhorias estão sendo implementadas continuamente.

## Demonstração
As principais funcionalidades do app são:
- **Sugestão:** Envie ideias e sugestões para a prefeitura, vote e comente nas propostas da comunidade.

  ![Demonstração Sugestão 1](assets/demo-sugestao-1.gif)
  
  ![Demonstração Sugestão 2](assets/demo-sugestao-2.gif)

## Funcionalidades Detalhadas

### Sugestões
- Envie sugestões de melhorias para a cidade diretamente pelo app.
- Vote e comente em sugestões de outros cidadãos, promovendo participação ativa.
- Acompanhe o status das suas sugestões e veja as mais votadas pela comunidade.

### Alertas
- Receba notificações e comunicados oficiais da prefeitura em tempo real.
- Visualize alertas importantes sobre serviços urbanos, saúde, eventos e emergências.
- Solicite serviços urbanos (ex: limpeza, iluminação, manutenção) com acompanhamento do status.

### Saúde
- Consulte informações sobre unidades de saúde próximas.
- Agende consultas e visualize seu histórico de atendimentos.
- Acesse campanhas de vacinação, informações sobre exames e serviços de saúde pública.

### Educação
- Veja informações sobre escolas e creches municipais.
- Consulte calendário escolar e datas de matrícula.
- Acompanhe comunicados e eventos da área de educação.

### Empregos
- Acesse oportunidades de emprego e estágios na sua região.
- Visualize vagas abertas e envie candidaturas.
- Receba dicas e orientações para o mercado de trabalho.

### Social
- Consulte informações sobre programas sociais e benefícios.
- Realize pré-cadastro em programas de assistência.
- Veja documentos e requisitos para acesso a benefícios.

### Perfil
- Gerencie seus dados pessoais e preferências.
- Configure notificações, privacidade e temas do app.
- Visualize seu histórico de interações e solicitações.

### Onboarding e Painel de Ajuda
- Fluxo de boas-vindas para novos usuários, explicando as principais funções do app.
- Painel de ajuda acessível a qualquer momento, com dicas de uso e perguntas frequentes.

## Tecnologias Utilizadas
- **React Native / Expo:** Base do app mobile, garantindo performance e compatibilidade multiplataforma.
- **TypeScript:** Tipagem estática para maior segurança e produtividade no desenvolvimento.
- **Supabase:** Backend como serviço (BaaS) para autenticação, banco de dados e armazenamento de arquivos.
- **AsyncStorage:** Armazenamento local de dados e flags de onboarding.
- **Context API:** Gerenciamento de estado global (tema, autenticação, etc).
- **Expo Router:** Navegação moderna baseada em arquivos.
- **Outras:** Hooks customizados, componentes otimizados, integração com câmera e galeria.

## Roadmap (Funcionalidades Futuras)

- **Chatbot integrado à prefeitura:** Canal direto para comunicação entre usuário e cidade, com respostas automáticas e encaminhamento de solicitações.
- **Melhoria na marcação de consultas:** Processo mais intuitivo, com confirmação em tempo real e integração com a agenda das unidades de saúde.
- **Realização de matrículas escolares pelo app:** Permitir que responsáveis realizem e acompanhem matrículas de alunos diretamente pelo aplicativo.
- **Site da prefeitura integrado ao app:** Canal de comunicação unificado, permitindo acesso a notícias, serviços e solicitações tanto pelo site quanto pelo app.

## Como Rodar o Projeto
1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/cidade-conectada.git
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente e acesso ao Supabase conforme necessário.
4. Rode o app:
   ```bash
   npx expo start
   ```

## Contribuição
Contribuições são bem-vindas! Para contribuir:
1. Faça um fork do projeto.
2. Crie uma branch para sua feature ou correção:
   ```bash
   git checkout -b minha-feature
   ```
3. Commit suas alterações:
   ```bash
   git commit -m "feat: minha feature"
   ```
4. Faça push para sua branch:
   ```bash
   git push origin minha-feature
   ```
5. Abra um Pull Request explicando suas mudanças.

## Contato
Dúvidas ou sugestões? Abra uma issue ou envie um e-mail para [jonathas.fosilva@icloud.com](mailto:jonathas.fosilva@icloud.com)

## Licença
Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes. 