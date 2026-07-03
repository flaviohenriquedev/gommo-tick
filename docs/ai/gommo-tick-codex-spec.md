# Gommo Tick — Especificação Oficial de Arquitetura Mobile

> Este documento define o padrão de desenvolvimento do aplicativo **Gommo Tick**. Todas as implementações devem seguir rigorosamente estas diretrizes.

---

# Objetivo

Construir um aplicativo de registro de ponto moderno, extremamente fluido, elegante e preparado para Android e iOS.

O foco do projeto é:

- Performance
- Escalabilidade
- Componentização
- Código limpo
- UX de alto nível
- Aparência semelhante aos melhores aplicativos da Apple
- Resposta imediata às ações do usuário (clicou, respondeu)

O aplicativo deve transmitir sensação de qualidade premium.

---

# Stack Tecnológica

Utilizar obrigatoriamente:

- React Native
- TypeScript
- Expo (última versão estável)
- Expo Router
- React Navigation
- React Query (TanStack Query)
- Zustand
- React Hook Form
- Zod
- MMKV Storage
- React Native Reanimated 3
- React Native Gesture Handler
- FlashList (Shopify)
- React Native SVG
- Expo Secure Store
- Expo Local Authentication
- Expo Camera
- Expo Notifications
- Expo Image
- Expo Haptics
- Axios
- NativeWind (Tailwind CSS para React Native)

Não utilizar bibliotecas desnecessárias.

Toda biblioteca adicionada deve possuir justificativa técnica.

---

# Performance

O projeto deve ser construído visando máxima performance.

Evitar completamente:

- Re-renderizações desnecessárias
- `useEffect` sem necessidade
- Loops durante renderização
- Cálculos repetitivos
- Estados duplicados
- Chamadas de API repetidas

Utilizar sempre que fizer sentido:

- `React.memo`
- `useMemo`
- `useCallback`
- FlashList
- Lazy Loading
- Virtualização
- Cache inteligente

Todas as listas grandes devem utilizar **FlashList**.

O aplicativo deve responder imediatamente às interações do usuário.

---

# Arquitetura

Organizar em módulos.

```text
src/
│
├── app/
├── assets/
├── components/
├── features/
│   ├── auth/
│   ├── home/
│   ├── ponto/
│   ├── espelho/
│   ├── banco-horas/
│   ├── solicitacoes/
│   └── perfil/
│
├── hooks/
├── services/
├── store/
├── theme/
├── types/
└── utils/
```

Cada feature deve possuir seus próprios:

- Components
- Hooks
- Services
- Types
- Screens

---

# Componentização (Obrigatória)

Esta é uma das regras mais importantes do projeto.

Sempre que qualquer estrutura visual ou lógica puder ser reutilizada mais de uma vez, ela deve obrigatoriamente ser transformada em componente reutilizável.

Exemplos:

- Button
- Card
- Avatar
- Input
- Header
- Bottom Navigation
- Modal
- Bottom Sheet
- Badge
- Tag
- Chip
- List Item
- Timeline Item
- Histórico de Batidas
- Campo de Formulário
- Skeleton
- Loading
- Empty State
- Toast
- Calendar
- Date Picker
- User Photo
- Status Pill

Nunca duplicar código.

Sempre utilizar `map()` para renderizar listas de componentes.

---

# Componentes Devem

- Ser pequenos
- Possuir responsabilidade única
- Receber dados via Props
- Não conter regra de negócio
- Não acessar APIs diretamente
- Ser altamente reutilizáveis

---

# UI / UX

A interface deve seguir o padrão visual dos melhores aplicativos da Apple.

Características:

- Muito espaço em branco
- Interface limpa
- Poucos elementos por tela
- Cantos bastante arredondados
- Hierarquia visual clara
- Cards elegantes
- Sombras suaves
- Excelente legibilidade
- Layout respirando

Jamais poluir a interface.

---

# Sistema de Espaçamento

Utilizar múltiplos de 4.

Valores:

- 4
- 8
- 12
- 16
- 20
- 24
- 32
- 40
- 48
- 64

Nunca utilizar valores aleatórios.

---

# Bordas

Cards:

- 20~24px

Botões:

- 18~20px

Inputs:

- 18~20px

Bottom Sheets:

- 28px

---

# Tipografia

A fonte oficial do projeto será **Inter**.

## Pesos

### Títulos

- Inter 700

### Subtítulos

- Inter 600

### Texto

- Inter 400

### Botões

- Inter 600

### Números grandes (Relógio do Ponto)

- Inter 800

Toda a aplicação deve seguir exatamente esta hierarquia tipográfica.

---

# Ícones

Utilizar exclusivamente **Lucide Icons**.

Não misturar bibliotecas de ícones.

---

# Paleta

Baseada na identidade visual do Gommo Tick.

Predominância:

- Branco
- Roxo institucional
- Cinzas muito claros
- Roxos suaves

Pouquíssimo preto.

Evitar cores saturadas.

---

# Sombras

Sombras extremamente discretas.

Apenas para criar profundidade.

Nunca utilizar sombras pesadas.

---

# Botões

Todos os botões devem possuir:

- Feedback tátil (Expo Haptics)
- Escala ao pressionar
- Ripple no Android
- Press Animation semelhante ao iOS

---

# Animações

Utilizar **React Native Reanimated 3**.

As animações devem seguir o padrão Apple.

Características:

- Naturais
- Suaves
- Spring Animation
- Muito rápidas
- Sem exageros

Evitar:

- Bounce exagerado
- Fade lentos
- Efeitos chamativos

A sensação deve ser de fluidez.

---

# Navegação

Utilizar Expo Router.

Separar:

- Auth
- Área Principal
- Configurações

---

# Estado Global

Utilizar Zustand.

Evitar Context API para estados globais complexos.

---

# Comunicação com API

Utilizar React Query.

Todas as requisições devem possuir:

- Cache
- Retry
- Loading
- Tratamento de erro
- Invalidação inteligente

---

# Formulários

Utilizar:

- React Hook Form
- Zod

Validação tipada.

---

# Persistência

Utilizar MMKV para:

- Preferências
- Cache
- Configurações
- Dados rápidos

Utilizar Secure Store para:

- Tokens
- Credenciais
- Dados sensíveis

---

# Qualidade de Código

Obrigatório:

- TypeScript Strict
- ESLint
- Prettier

Não utilizar:

- `any`
- Código duplicado
- Gambiarras

---

# Filosofia de Desenvolvimento

Toda decisão técnica deve seguir esta ordem:

1. Performance
2. Reutilização
3. Escalabilidade
4. Organização
5. Experiência do Usuário

Sempre optar pela solução mais limpa, reutilizável e de menor custo de manutenção.

O resultado esperado é um aplicativo com aparência premium, extremamente fluido, elegante e preparado para crescer durante muitos anos sem necessidade de grandes refatorações estruturais.