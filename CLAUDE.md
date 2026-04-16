# PetFirst — Instruções para o Agente

## Sobre o projeto
App mobile React Native com Expo para tutores de pet de primeira viagem.
Estratégia: 100% gratuito no lançamento, monetização via assinatura depois.

## Stack técnica
- React Native 0.81.5 + Expo SDK 54
- @react-navigation v7 (native, native-stack, bottom-tabs)
- react-native-screens 4.16.0
- react-native-safe-area-context 5.6.0
- @react-native-async-storage/async-storage 2.2.0
- @supabase/supabase-js 2.103.3 (banco de dados e autenticação)
- expo-image-picker (foto do pet)
- EAS Build configurado (eas.json)
- JavaScript puro — sem TypeScript
- OpenAI API (assistente IA) — ainda não configurado

## Identidade visual
- Primária:          #E07B5A  (terracota)
- Secundária:        #7BAE8A  (verde-sálvia)
- Fundo:             #FFFDF9  (marfim)
- Fundo alternativo: #FAF6F1  (cards/seções)
- Texto principal:   #4A4540  (quente escuro)
- Texto secundário:  #7A736C
- Texto desabilitado:#B8B0A8
- Acento:            #F5C842  (mel)
- Borda padrão:      #E8E4DF
- Desabilitado:      #D3D1C7

## Padrões de StyleSheet
- NUNCA usar `gap` — usar `marginBottom` entre elementos
- Botão primário padrão:
  ```
  backgroundColor: '#E07B5A', paddingVertical: 18, borderRadius: 100,
  alignItems: 'center', shadowColor: '#E07B5A',
  shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3,
  shadowRadius: 16, elevation: 8
  ```
- Botão desabilitado: `backgroundColor: '#D3D1C7', shadowOpacity: 0`
- Cards: `backgroundColor: '#fff', borderRadius: 16, borderWidth: 2, borderColor: '#E8E4DF'`
- Container principal: `flex: 1, backgroundColor: '#FFFDF9'`
- Padding de tela: `padding: 24, paddingTop: 60`
- Barra de progresso: `height: 6, backgroundColor: '#E8E4DF', borderRadius: 3`
- Preenchimento de progresso: `height: 6, backgroundColor: '#E07B5A', borderRadius: 3`

## Regras de código
- Todo texto da UI em português brasileiro
- Componentes funcionais com hooks
- Sem TypeScript — JavaScript puro
- Sempre testar compatibilidade com Expo Go
- Não usar `gap` no StyleSheet em nenhuma hipótese
- Comentar o código em português quando a lógica não for óbvia
- Não adicionar comentários desnecessários em código evidente

## Estrutura de pastas
/screens      — telas do app (uma por arquivo)
/components   — componentes reutilizáveis
/contexts     — contextos React (PetContext)
/hooks        — hooks customizados (usePetData)
/lib          — integrações externas (supabase.js, database.sql)
/assets       — imagens e ícones

## Estado atual do navegador (App.js)
```
Stack (onboarding):
  Welcome → CadastroEspecie → CadastroNome → MainTabs

MainTabs (bottom tab navigator):
  Home | Saúde | Alimentação | Assistente | Perfil
```
Todas as telas usam `headerShown: false`. O `MainTabs` recebe `petName` e `petEspecie` via `route.params` e repassa como `initialParams` para cada aba.

## Telas já criadas

### Onboarding (Stack Navigator)
- **WelcomeScreen** (`screens/WelcomeScreen.js`) — boas-vindas com lista de features e CTA
- **CadastroEspecieScreen** (`screens/CadastroEspecieScreen.js`) — grid de seleção de espécie (passo 1/3, barra de progresso 33%)
- **CadastroNomeScreen** (`screens/CadastroNomeScreen.js`) — input do nome do pet com preview (passo 2/3, barra de progresso 66%); navega para `MainTabs` passando `petName` e `petEspecie`

### Navegação principal (Bottom Tab Navigator)
- **MainTabs** (`screens/MainTabs.js`) — bottom tab navigator com 5 abas; ícones em emoji, sem pacote externo de ícones
- **HomeScreen** (`screens/HomeScreen.js`) — dashboard com saudação, card de próximo lembrete (mockado), grid de acesso rápido e dica do dia aleatória
- **SaudeScreen** (`screens/SaudeScreen.js`) — carteirinha digital com card do pet, timeline de vacinas (dados do Supabase + cache local), pull-to-refresh, FAB para adicionar, indicadores offline/loading
- **AlimentacaoScreen** (`screens/AlimentacaoScreen.js`) — calculadora de porção por peso (cães/gatos), frequência alimentar, lista de alimentos proibidos e liberados
- **AssistenteScreen** (`screens/AssistenteScreen.js`) — chat com respostas simuladas (sem OpenAI ainda), chips de sugestão rápida, indicador de digitação
- **PerfilScreen** (`screens/PerfilScreen.js`) — foto/nome do pet (com ImagePicker), informações (raça/idade/peso editáveis), estatísticas (vacinas, lembretes, dias juntos), configurações do app

### Telas secundárias (Stack Navigator)
- **AdicionarVacinaScreen** (`screens/AdicionarVacinaScreen.js`) — formulário para registrar nova vacina com tipo, data, veterinário e observações; salva no Supabase com fallback offline; loading states

## EAS Build
Configurado para gerar APK Android. Comandos:
```bash
# APK de preview (instalar direto no celular)
npx eas build --platform android --profile preview

# APK de desenvolvimento
npx eas build --platform android --profile development

# AAB para Play Store
npx eas build --platform android --profile production
```

## Integração Supabase (configurado)
- **lib/supabase.js** — cliente Supabase + funções CRUD para pets, vacinas e lembretes
- **lib/database.sql** — schema SQL para criar as tabelas no Supabase (pets, vaccines, reminders)
- **contexts/PetContext.js** — contexto global do pet com suporte offline
- **hooks/usePetData.js** — hook para dados do pet com Supabase + AsyncStorage fallback

### Credenciais Supabase
- URL: https://fhaiueghkjlikiidvtps.supabase.co
- Key: sb_publishable_hLPMVJtCrcAqGV8YXj1pZw_bjPyBf7Q

### Para configurar o banco
1. Acessar o painel do Supabase
2. Ir em SQL Editor
3. Executar o conteúdo de `lib/database.sql`
4. Habilitar autenticação (opcional: Google OAuth)

## Próximas telas / melhorias pendentes
- Integrar OpenAI API na `AssistenteScreen`
- Implementar autenticação de usuários (login/cadastro)
- Passo 3/3 do cadastro (ex: data de nascimento)
- Criar tela de lembretes com CRUD completo
- Implementar notificações push para lembretes

## Como o agente deve trabalhar

### Antes de criar ou editar
1. Ler os arquivos relevantes antes de qualquer modificação
2. Verificar se a tela/componente já existe para não duplicar
3. Manter consistência visual com o padrão estabelecido

### Ao criar novas telas
1. Seguir os padrões de estilo documentados acima
2. Adicionar a tela no `App.js` com a rota correta
3. Nunca quebrar o fluxo de navegação existente

### Ao encontrar erros
1. Ler o arquivo com erro antes de qualquer ação
2. Diagnosticar a causa raiz
3. Corrigir diretamente no arquivo — não criar arquivos paralelos
4. Verificar se a correção pode impactar outras telas

### Pacotes novos
- Avisar o usuário antes de instalar qualquer pacote
- Confirmar compatibilidade com Expo SDK 54 e Expo Go
- Preferir soluções sem dependências extras quando possível

### Comunicação
- Responder sempre em português brasileiro
- Respostas diretas e objetivas
- Indicar o arquivo e linha ao referenciar código
