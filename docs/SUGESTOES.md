# Sistema de Sugestões Cidadãs

## Visão Geral

O Sistema de Sugestões Cidadãs é um módulo de participação cidadã que permite aos moradores da cidade enviar sugestões para melhorias urbanas, votar nas sugestões de outros cidadãos e acompanhar o status das implementações.

## Funcionalidades Principais

### 1. Envio de Sugestões
- **Título**: Nome descritivo da sugestão
- **Descrição**: Detalhamento completo da proposta
- **Categoria**: Classificação da sugestão (Infraestrutura, Saúde, Educação, etc.)
- **Localização**: Local específico da cidade (opcional)
- **Prioridade**: Nível de urgência (Baixa, Média, Alta, Crítica)

### 2. Sistema de Votação
- **Upvote/Downvote**: Usuários podem votar a favor ou contra sugestões
- **Contagem de Votos**: Exibição do saldo de votos (positivos - negativos)
- **Voto Único**: Cada usuário pode votar apenas uma vez por sugestão

### 3. Comentários
- **Discussão**: Usuários podem comentar nas sugestões
- **Edição**: Autores podem editar seus próprios comentários
- **Exclusão**: Autores podem excluir seus comentários

### 4. Filtros e Busca
- **Por Categoria**: Filtrar por tipo de sugestão
- **Por Prioridade**: Filtrar por nível de urgência
- **Por Status**: Filtrar por estado da sugestão
- **Busca Textual**: Pesquisar por título ou descrição
- **Ordenação**: Por votos ou data de criação

### 5. Status das Sugestões
- **Pendente**: Aguardando análise
- **Em Análise**: Sendo avaliada pela prefeitura
- **Aprovada**: Aprovada para implementação
- **Rejeitada**: Não aprovada
- **Implementada**: Já foi implementada

## Estrutura do Banco de Dados

### Tabela `suggestions`
```sql
CREATE TABLE suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  location text,
  priority text DEFAULT 'medium',
  status text DEFAULT 'pending',
  votes_count int DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### Tabela `suggestion_votes`
```sql
CREATE TABLE suggestion_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  suggestion_id uuid REFERENCES suggestions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  vote_type text NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(suggestion_id, user_id)
);
```

### Tabela `suggestion_comments`
```sql
CREATE TABLE suggestion_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  suggestion_id uuid REFERENCES suggestions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

## Categorias Disponíveis

1. **Infraestrutura** - Obras, pavimentação, iluminação
2. **Saúde** - Unidades de saúde, campanhas, equipamentos
3. **Educação** - Escolas, bibliotecas, programas educacionais
4. **Transporte** - Ônibus, ciclovias, estacionamentos
5. **Segurança** - Policiamento, iluminação, câmeras
6. **Meio Ambiente** - Parques, coleta seletiva, arborização
7. **Cultura** - Teatros, museus, eventos culturais
8. **Outros** - Demais sugestões

## Níveis de Prioridade

1. **Baixa** - Melhorias não urgentes
2. **Média** - Melhorias importantes
3. **Alta** - Problemas que afetam a população
4. **Crítica** - Problemas de segurança ou saúde pública

## Fluxo de Trabalho

### Para Cidadãos
1. **Enviar Sugestão**: Preencher formulário com detalhes da proposta
2. **Votar**: Apoiar ou rejeitar sugestões de outros cidadãos
3. **Comentar**: Participar da discussão sobre as sugestões
4. **Acompanhar**: Verificar o status das sugestões enviadas

### Para Administradores
1. **Revisar**: Analisar sugestões recebidas
2. **Classificar**: Definir prioridade e categoria
3. **Atualizar Status**: Marcar como aprovada, rejeitada ou implementada
4. **Responder**: Comentar sobre decisões tomadas

## Segurança e Permissões

### Políticas de Acesso
- **Leitura Pública**: Todas as sugestões são visíveis publicamente
- **Criação Autenticada**: Apenas usuários logados podem criar sugestões
- **Edição Própria**: Usuários só podem editar suas próprias sugestões
- **Votação Autenticada**: Apenas usuários logados podem votar
- **Comentários Autenticados**: Apenas usuários logados podem comentar

### Validações
- **Campos Obrigatórios**: Título, descrição e categoria são obrigatórios
- **Limite de Caracteres**: Título (100), descrição (1000), comentários (500)
- **Voto Único**: Um usuário por sugestão
- **Edição Limitada**: Comentários só podem ser editados pelo autor

## Interface do Usuário

### Tela Principal (`/sugestoes`)
- Lista de sugestões com filtros
- Botão para nova sugestão
- Busca textual
- Ordenação por votos ou data

### Tela de Detalhes (`/sugestoes/[id]`)
- Informações completas da sugestão
- Sistema de votação
- Lista de comentários
- Formulário para novo comentário

### Modal de Nova Sugestão
- Formulário completo
- Seleção de categoria e prioridade
- Validação em tempo real
- Preview da sugestão

## Próximas Funcionalidades

### Planejadas
1. **Upload de Imagens**: Anexar fotos às sugestões
2. **Geolocalização**: Marcar localização no mapa
3. **Notificações**: Alertas sobre status das sugestões
4. **Relatórios**: Estatísticas de participação
5. **Moderação**: Sistema de denúncias e moderação

### Futuras
1. **Integração com SIG**: Sistema de Informações Geográficas
2. **API Pública**: Acesso para outros sistemas
3. **Gamificação**: Pontos por participação
4. **Votação em Massa**: Consultas populares
5. **Transparência**: Acompanhamento de gastos

## Tecnologias Utilizadas

- **Frontend**: React Native com Expo
- **Backend**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth
- **Storage**: Supabase Storage (para futuras imagens)
- **Estado**: React Hooks personalizados
- **Navegação**: Expo Router

## Contribuição

Para contribuir com o desenvolvimento:

1. **Fork** o repositório
2. **Crie** uma branch para sua feature
3. **Implemente** as mudanças
4. **Teste** as funcionalidades
5. **Submeta** um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes. 