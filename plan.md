# Achados & Perdidos — plano de implementação

## Objetivo
Transformar as quatro referências enviadas em uma aplicação web responsiva e funcional para uma faculdade: identidade visual vinho/creme, cards de bordas arredondadas, botões vinho, navegação com topo compacto e páginas de login, cadastro, início, busca, localização por prédio, publicação, detalhes e perfil.

## Implementação
- **Frontend:** React + TypeScript + Wouter, com uma casca visual única (`AppShell`) e rotas conectadas.
- **Backend:** Express + tRPC + Drizzle/MySQL, usando as procedures existentes para sessão OAuth Manus e novas procedures para itens.
- **Autenticação:** preservar o fluxo OAuth Manus do starter (`webdev_app_session`), sem criar credenciais paralelas ou usuário fictício. As telas de login/cadastro mantêm o visual de referência e chamam o login real.
- **Persistência:** tabela `lost_items` com título, descrição, categoria, tipo (perdido/encontrado), prédio, andar, sala, data, status, foto principal, fotos adicionais, autor, contato público e timestamps.
- **Fotos:** o formulário aceita arquivos locais e mostra prévias reais durante a sessão; os metadados e a URL/valor de foto são persistidos quando fornecidos. O fallback visual por categoria evita cards quebrados quando nenhum arquivo foi selecionado.
- **Busca e filtros:** procedure pública para listagem por termo, categoria, prédio, tipo e status; localização por prédio reutiliza os mesmos filtros.
- **Feedback:** toasts, loading states, estados vazios e mensagens de erro; ações de contato abrem o cliente de e-mail com assunto contextualizado.

## Design
- **Design Movement:** editorial utilitário de campus, inspirado em cartazes de achados e perdidos e interfaces mobile de início dos anos 2000.
- **Core Principles:** contraste alto, informação escaneável, detalhes desenhados como sinalização, acolhimento sem aparência infantil.
- **Color Philosophy:** vinho profundo para confiança e ação; creme para reduzir a dureza do contraste; rosé e marrom como camadas de contexto e estados.
- **Layout Paradigm:** cabeçalho horizontal no desktop e barra inferior fixa no celular; conteúdo alterna entre hero de anúncio e trilhas de cards, sem dashboards genéricos.
- **Signature Elements:** marca “LOST AND FOUND” com arco/caixa, dividers finos creme e cards de item com faixa de metadados.
- **Interaction Philosophy:** ações principais são diretas e previsíveis; filtros atualizam a leitura da página e cada card leva a uma rota real.
- **Animation:** entradas suaves por fade/slide curto; hover com elevação mínima; sem animações decorativas que atrapalhem a leitura.
- **Typography System:** Inter para interface, com títulos em peso 800 e caixa alta onde a referência usa impacto; escala ampla para hero e compacta para metadados.
- **Brand Essence:** a forma simples e confiável de devolver o que foi perdido dentro da faculdade. Personalidade: comunitária, prática, cuidadosa.
- **Brand Voice:** CTAs objetivos (“Localizar um item”, “Publicar item”); microcopy humana (“Talvez alguém esteja procurando por isso”).
- **Wordmark & Logo:** wordmark em duas linhas “LOST / AND FOUND”, acompanhado por um símbolo de caixa aberta.
- **Signature Brand Color:** `#74171c` (vinho principal).

## Estrutura
- `client/src/App.tsx`: roteamento e providers.
- `client/src/index.css`: tokens, responsividade e componentes visuais próprios.
- `client/src/pages/`: telas públicas e autenticadas.
- `client/src/components/`: shell, navegação, cards e controles compartilhados.
- `server/routers.ts`: procedures de autenticação e itens.
- `server/db.ts`: acesso às tabelas e consultas.
- `drizzle/schema.ts` + migração: modelo persistente.
- `public/manus-routes.json`: manifesto de rotas para o ambiente Webdev.

## Restrições
A aparência deve manter a paleta, tipografia, botões, cards, ícones e ordem visual das referências. Não usar um design SaaS genérico, azul padrão, imagens decorativas aleatórias ou botões sem ação.
