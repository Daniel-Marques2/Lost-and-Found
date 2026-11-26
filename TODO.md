# Entregas

## Aplicação fiel às referências
- [x] A interface usa a identidade vinho e creme das referências, preservando tipografia de impacto, botões vinho, bordas arredondadas, ícones lineares, separadores finos, espaçamentos arejados e organização visual semelhante às telas enviadas.
- [x] O layout funciona em computadores e celulares, com navegação equivalente e barra inferior adaptada no mobile.

## Autenticação e navegação
- [x] Existem páginas de login, cadastro e recuperação de senha com validação de campos e controle de sessão.
- [x] O login usa o fluxo real de autenticação Manus OAuth do starter; não há usuário fictício ou credencial simulada.
- [x] Todas as ações principais navegam para rotas reais: início, localizar, publicar, perfil, detalhes e contato.

## Itens e publicação
- [x] Usuário autenticado consegue publicar item perdido ou encontrado com título, descrição, categoria, prédio, andar, sala, data, status e fotos.
- [x] Usuário consegue visualizar seus próprios anúncios no perfil, editar o fluxo de acompanhamento e atualizar o status do anúncio.
- [x] Usuários conseguem abrir os detalhes de um item com galeria/prévia, descrição, localização, data, status, anunciante e ação de contato para devolução.

## Busca e localização
- [x] A página inicial e a página de localizar exibem listagem responsiva de cards com imagem, nome, local e informações resumidas.
- [x] Busca por texto e filtros por categoria, prédio, tipo de ocorrência e status funcionam em conjunto.
- [x] A tela de localização permite selecionar prédios da faculdade e visualizar os itens relacionados.
- [x] Existem estados vazios, loading e mensagens de erro compreensíveis.

## Dados e qualidade
- [x] Usuários e itens são persistidos no banco via Drizzle/MySQL, com vínculo do item ao autor.
- [x] O projeto possui manifesto atualizado em `client/public/manus-routes.json` e ele responde com JSON válido.
- [x] Diagnósticos TypeScript e build do projeto passam antes da entrega.
- [x] A prévia foi conferida em desktop e celular; a responsividade e as diferenças visuais relevantes foram corrigidas.
