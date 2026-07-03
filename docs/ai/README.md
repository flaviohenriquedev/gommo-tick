# Materiais para agentes de IA

Esta pasta guarda as referencias que todo agente deve consultar antes de trabalhar no Gommo Tick.

## Leitura obrigatoria

1. `gommo-tick-codex-spec.md`
   - Fonte oficial de arquitetura mobile, stack tecnica, padroes de codigo, UX e qualidade.

2. `gommo-tick-layout-preview.html`
   - Preview visual fornecido como esboco. Deve orientar a aparencia e o fluxo, mas nao define a implementacao final.

## Como usar estes arquivos

- Comece pela especificacao.
- Consulte o preview HTML para entender a direcao visual.
- Ao implementar, prefira componentes React Native/Expo reais em vez de copiar estruturas do HTML.
- Use ingles para nomes tecnicos de pastas, arquivos, componentes, funcoes, tipos e variaveis. Use portugues apenas no que aparece para o usuario, como labels, mensagens, exceptions e textos de interface.
- Use `defaultSpacing` como espacamento padrao entre componentes, margins e gaps. Ele corresponde a `spacing[3]`. Paddings estruturais podem ser maiores quando fizer sentido visual.
- Se houver conflito entre o preview e a especificacao, a especificacao prevalece.
