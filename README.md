## SofleKeyCartographer

Aplicativo React Native para catalogar, visualizar e editar o mapeamento de teclas do teclado Sofle. O foco é guardar qual tecla executa qual função por camada (layer) e permitir ajustes ao longo do tempo, com visualização em SVG do layout usando D3.

### Objetivo
- Registrar e versionar keymaps por camada (layer) do Sofle.
- Visualizar o layout do teclado como SVG, com destaque das teclas e ações.
- Permitir edição simples e futura sincronização/exportação.

### Stack e versões (não fazer downgrade)
- React Native (CLI ou Expo) com componentes funcionais e Hooks.
- TypeScript com tipagem estrita.
- Tailwind via NativeWind v4, respeitando a matriz de compatibilidade da biblioteca e sem downgrade.
- Material Design 3 (MD3) com `react-native-paper` v5+.
- D3 focado em módulos compatíveis com RN (ex.: `d3-shape`, `d3-scale`, `d3-array`) + `react-native-svg`.

### Nome do projeto
SofleKeyCartographer (nome pouco comum para evitar conflitos em repositórios).

## Regras de Arquitetura e Código

### Princípios
- **SOLID e OOP pragmático**: classes e componentes pequenos, de responsabilidade única [[memory:7631976]].
- **Tipagem forte**: todos os componentes e funções públicas tipados. Evitar `any`.
- **Sem services genéricos**: quando houver acesso a dados, preferir o padrão de repositório (interfaces claras) [[memory:7631976]].
- **Separação UI x domínio**: UI em componentes React; regras de negócio e persistência em camadas próprias.
- **Imutabilidade e pureza** onde fizer sentido; evitar efeitos colaterais em render.

### Boas práticas React/React Native
- Componentes funcionais + Hooks. Evitar classes.
- Memorizar renderizações com `React.memo`, `useMemo`, `useCallback` quando necessário.
- Evitar re-render por props instáveis; elevar estado somente quando preciso.
- Acessibilidade: usar `accessibilityLabel`, `accessible`, `role` quando aplicável.
- Listas grandes: usar `FlashList`/`FlatList` com `keyExtractor` estável e `getItemLayout` quando possível.

### TypeScript
- `strict: true`. Ativar `noImplicitAny`, `noUnusedLocals`, `noUnusedParameters`.
- Tipos e interfaces para modelos de domínio (teclado, tecla, camada, ação).
- Exportar APIs bem anotadas; evitar type assertions não seguras.

### Material Design 3 (MD3)
- UI baseada em MD3 com `react-native-paper` v5+: usar `MD3LightTheme`/`MD3DarkTheme` como base e tokens consistentes.
- Componentes padrões: TopAppBar, FAB, SegmentedButtons, Dialogs e Snackbar para feedback.
- Navegação consistente com `@react-navigation/native` integrando o tema do Paper.

### Tailwind + NativeWind (Dark)
- Usar NativeWind v4 com `preset` da lib. Não fazer downgrade do Tailwind.
- `darkMode: "class"` e controle de tema via `nativewind` (`useColorScheme`) + Provider do Paper para sincronizar claro/escuro.
- Utilizar design tokens no Tailwind (cores/cinza/espacamentos) mapeando para MD3 onde fizer sentido.

### D3 + SVG no React Native
- Renderização com `react-native-svg`. Gerar paths e layouts com `d3-shape`, escalas com `d3-scale` e agregações com `d3-array`.
- Evitar módulos dependentes de DOM como `d3-selection`/`d3-zoom` diretamente; interações devem ser implementadas via gestos nativos.
- O layout do Sofle deve ser descrito em dados (posição/rotação das teclas) e o SVG gerado a partir desses dados.

## Estrutura de Diretórios (folder-by-feature)

```
src/
  app/
    App.tsx              # bootstrap de tema, providers e navegação
    providers/           # ThemeProvider (Paper + NativeWind), Query providers
  features/
    keyboard/            # Domínio do teclado Sofle
      components/        # UI específica (KeyboardSvg, KeyCap, Legends)
      models/            # Tipos/entidades de domínio (Key, Layer, Action)
      repositories/      # Interfaces + impl. (ex.: AsyncStorage) – sem services
      hooks/             # Hooks relacionados ao teclado/layout
      utils/             # Cálculos geométricos, normalização de dados
      screens/           # Telas: Viewer, Editor
  ui/                    # Componentes compartilhados (MD3 wrappers, forms, etc.)
  navigation/            # Stacks/tabs e integração com tema
  styles/                # tailwind.config.js related, tokens e helpers
  utils/                 # Funções utilitárias genéricas
  types/                 # Tipos globais (ex.: Result<T>)
  assets/
    svg/                 # SVGs: layout Sofle
    images/
    fonts/
```

Regras do diretório:
- Cada feature encapsula UI, modelo, repositórios e hooks próprios.
- `repositories/` expõe interfaces (ex.: `KeyboardLayoutRepository`) e implementações.
- `ui/` contém componentes visuais desacoplados de domínio.
- `styles/` guarda tokens e ponte entre Tailwind e MD3.

## Modelos de Domínio (resumo)

```ts
// src/features/keyboard/models/types.ts
export type LayerId = string;

export interface KeyAction {
  type: "char" | "modifier" | "layerToggle" | "macro" | "custom";
  label: string;           // ex.: "A", "Ctrl", "Raise"
  code?: string;           // scancode ou keycode, quando aplicável
  payload?: unknown;       // metadados opcionais
}

export interface KeyPosition {
  x: number;               // em unidades do SVG
  y: number;
  r?: number;              // rotação opcional
  w?: number;              // largura opcional
  h?: number;              // altura opcional
}

export interface Key {
  id: string;              // estável
  position: KeyPosition;
  legends?: string[];      // linhas de legenda no keycap
}

export interface Layer {
  id: LayerId;
  name: string;
  keyActions: Record<Key["id"], KeyAction>;
}

export interface KeyboardLayout {
  keyboard: "sofle";
  keys: Key[];
  layers: Layer[];
  updatedAt: string;       // ISO
}
```

## Repositórios (persistência)
- Definir interface `KeyboardLayoutRepository` com métodos como `getCurrent()`, `save(layout)`, `listHistory()`.
- Implementação inicial pode usar `AsyncStorage` (ou filesystem) com serialização JSON. Nada de "services" genéricos; somente repositórios por domínio.

## Tema escuro e integração de tema
- O tema do Paper (MD3) e o esquema do NativeWind devem estar sincronizados.
- Detectar esquema via `useColorScheme()` e permitir override pelo usuário.
- Preferir cores de superfície/primárias MD3 mapeadas para tokens Tailwind.

## Tailwind/NativeWind – configuração base

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6750A4", // MD3 primary sample
          on: "#FFFFFF",
        },
      },
    },
  },
  plugins: [],
};
```

## Dependências recomendadas
- `react-native-paper` v5+ (MD3).
- `nativewind` v4 + `tailwindcss` (sem downgrade; seguir docs de compatibilidade).
- `react-native-svg` para renderização.
- `d3-shape`, `d3-scale`, `d3-array` (evitar partes dependentes de DOM).
- Estado: `zustand` (leve) ou Context API conforme a necessidade.
- Testes: `jest` + `@testing-library/react-native`.
- Qualidade: `eslint` (typescript + react) e `prettier`.

## Convenções
- Nomes em Inglês; arquivos `PascalCase` para componentes e `camelCase` para ids/variáveis.
- Commits: Conventional Commits (`feat:`, `fix:`, `chore:`...).
- Imports absolutos via paths do TS para `src/*`.

## Ativos (SVG Sofle)
- SVG inicial baixado em `src/assets/svg/sofle.svg`.
- Para atualizar via shell:

```bash
curl -L -o src/assets/svg/sofle.svg \
  https://git.noi.se.net/ashe/zmk-sofle/raw/commit/e8ccd222a9b0cb109e41fa08e4049a9151d1b9e6/keymap-drawer/sofle.svg
```

Outras referências úteis: layouts do projeto `keymap-drawer` (GitHub) e docs do Sofle.

## Roadmap inicial
- Visualizador de layout (SVG) com destaque por layer.
- Editor simples de ação por tecla por layer.
- Persistência local e histórico.

## Desenvolvimento
- Preferir RN CLI/Expo atual. Não realizar downgrades de libs.
- Garantir build sem warnings de TypeScript/ESLint.
- PRs com testes quando alterarem lógica de domínio.
