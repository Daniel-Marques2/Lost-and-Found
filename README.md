🔎 Lost and Found — Sistema de Achados e Perdidos

Uma plataforma digital para conectar pessoas a objetos perdidos dentro do ambiente acadêmico.

📌 Sobre o Projeto

O Lost and Found é uma aplicação web desenvolvida como parte da disciplina de Práticas Extensionistas Integradoras III, com o objetivo de modernizar e facilitar o processo de achados e perdidos no ambiente universitário.

A proposta é oferecer um espaço centralizado onde alunos e membros da comunidade acadêmica possam anunciar objetos encontrados, pesquisar itens perdidos e solicitar a devolução de seus pertences.

A aplicação busca substituir processos informais de comunicação por uma solução organizada, acessível e eficiente, proporcionando mais praticidade, transparência e segurança na recuperação de objetos.

🎯 Objetivos

- Centralizar os registros de objetos perdidos e encontrados.
- Facilitar a localização de objetos por meio de pesquisas e categorias.
- Permitir a publicação de anúncios com descrições, fotografias e informações sobre o local onde o item foi encontrado.
- Organizar o processo de solicitação e devolução de objetos.
- Proporcionar maior controle e gerenciamento por meio de funcionalidades administrativas.

⚙️ Funcionalidades

👤 Usuários

- Cadastro de usuários: criação de contas para membros da comunidade acadêmica.
- Autenticação: acesso ao sistema utilizando matrícula ou e-mail institucional e senha.
- Pesquisa de itens: busca de anúncios por palavras-chave.
- Visualização de anúncios: consulta aos objetos encontrados e suas respectivas informações.
- Cadastro de itens encontrados: publicação de anúncios com descrição, categoria, localização e data.
- Solicitação de devolução: possibilidade de solicitar a recuperação de um objeto anunciado.

🛡️ Administração

- Gerenciamento de anúncios: moderação e remoção de publicações.
- Gerenciamento de usuários: consulta e administração de contas.
- Controle de solicitações: aprovação ou recusa de solicitações de devolução.
- Relatórios: consulta de métricas relacionadas aos anúncios e às devoluções.

🏗️ Modelagem e Arquitetura

O projeto utiliza modelagem UML para representar sua estrutura e o comportamento esperado da aplicação.

Foram desenvolvidos três diagramas principais:

1. Diagrama de Classes

Representa as principais entidades do sistema, seus atributos, métodos e relacionamentos.

2. Diagrama de Casos de Uso

Apresenta os atores envolvidos e suas respectivas permissões e funcionalidades, destacando as operações realizadas por alunos e administradores.

3. Diagrama de Sequência

Representa o fluxo de cadastro e publicação de um item encontrado, demonstrando a comunicação entre as seguintes camadas:

- Tela do Sistema
- AnuncioController
- AnuncioService
- Banco de Dados

A modelagem busca manter consistência entre as entidades, funcionalidades e fluxos de execução da aplicação.

💻 Tecnologias

As tecnologias selecionadas para o desenvolvimento do projeto são:

Tecnologia| Aplicação
React| Desenvolvimento da interface e componentes
JavaScript| Linguagem de programação
HTML5| Estruturação das páginas
CSS3| Estilização e responsividade
MySQL 8.0| Gerenciamento do banco de dados
Lovable| Apoio à prototipação da interface
Visual Studio Code| Ambiente de desenvolvimento

📋 Organização do Desenvolvimento

O desenvolvimento foi estruturado por meio de um backlog de produto, utilizando histórias de usuário, critérios de aceitação e priorização MoSCoW.

As funcionalidades foram classificadas em:

- Must Have: funcionalidades essenciais, como autenticação, cadastro, pesquisa e solicitação de devolução.
- Should Have: funcionalidades importantes, como moderação administrativa e desempenho da pesquisa.
- Could Have: funcionalidades complementares, como relatórios administrativos.

Também foi estabelecida uma proposta de requisito não funcional para que pesquisas sejam realizadas em até 2 segundos, considerando até 500 anúncios de teste, em pelo menos 95 de 100 tentativas. Essa métrica ainda depende de validação.

🚀 Impacto Esperado

O Lost and Found pretende contribuir para a melhoria da experiência dos estudantes e demais membros da comunidade acadêmica, tornando o processo de recuperação de objetos mais simples e organizado.

Além da solução tecnológica, o projeto busca incentivar a colaboração entre os usuários, reduzir a perda definitiva de pertences e promover uma cultura de responsabilidade coletiva dentro da instituição.

👥 Equipe de Desenvolvimento

Projeto desenvolvido por estudantes do curso de Engenharia de Software:

- João Alixandre Vigorito
- Gustavo Almeida
- Bernardo Ezequiel
- Daniel Marques

Instituição: Centro Universitário de Barra Mansa (UBM)
Disciplina: Práticas Extensionistas Integradoras III
Ano: 2026

---

<p align="center">
  <strong>Lost and Found</strong><br>
  Conectando pessoas aos seus objetos perdidos.
</p>