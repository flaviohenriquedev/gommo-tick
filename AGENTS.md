# Gommo Tick - Orientacoes para agentes de IA

Antes de qualquer tarefa neste repositorio, leia os materiais em `docs/ai/`:

- `docs/ai/gommo-tick-codex-spec.md`: especificacao oficial de arquitetura, stack, padroes e criterios de qualidade do app mobile.
- `docs/ai/gommo-tick-layout-preview.html`: esboco visual de referencia. Use como inspiracao de layout, hierarquia e experiencia, nao como implementacao final.

Regras permanentes:

- O app deve ser mobile-first, construido com React Native, TypeScript e Expo.
- Siga a especificacao oficial antes de introduzir bibliotecas, arquitetura ou convencoes novas.
- Pastas, arquivos, componentes, funcoes, tipos e variaveis devem usar nomes em ingles que representem claramente seu papel tecnico. Portugues deve ficar apenas em textos exibidos ao usuario, labels, mensagens, exceptions e conteudo de dominio.
- O espacamento padrao entre componentes, margins e gaps e `defaultSpacing`, definido como `spacing[3]`. Paddings estruturais de telas, cards e containers podem usar valores maiores quando precisarem de respiro visual.
- Preserve performance, fluidez, componentizacao e UX premium como requisitos centrais.
- Trate o HTML apenas como mockup de direcao visual.
- Documente decisoes relevantes quando elas afetarem arquitetura, navegacao, estado, persistencia ou design system.
