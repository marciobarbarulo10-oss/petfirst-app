# PetFirst — Instruções para o Agente

## Sobre o projeto
App mobile React Native com Expo para tutores de pet de primeira viagem.
Estratégia: 100% gratuito no lançamento, monetização via assinatura depois.

## Stack técnica
- React Native + Expo SDK 51
- @react-navigation/native-stack v6
- JavaScript puro — sem TypeScript
- Supabase (banco de dados e autenticação) — ainda não configurado
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
/assets       — imagens e ícones

## Estado atual do navegador (App.js)
```
Welcome → CadastroEspecie → CadastroNome
```
Todas as telas usam `headerShown: false`.

## Telas já criadas
- **WelcomeScreen** (`screens/WelcomeScreen.js`) — tela de boas-vindas com lista de features e botão CTA
- **CadastroEspecieScreen** (`screens/CadastroEspecieScreen.js`) — grid de seleção de espécie (passo 1/3)
- **CadastroNomeScreen** (`screens/CadastroNomeScreen.js`) — input do nome do pet com preview (passo 2/3)

## Próximas telas a criar
- **HomeScreen** — dashboard principal com perfil do pet cadastrado
- **SaudeScreen** — carteirinha digital de vacinas
- **AssistenteScreen** — chat com IA (requer OpenAI API)

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
- Confirmar compatibilidade com Expo SDK 51 e Expo Go
- Preferir soluções sem dependências extras quando possível

### Comunicação
- Responder sempre em português brasileiro
- Respostas diretas e objetivas
- Indicar o arquivo e linha ao referenciar código
