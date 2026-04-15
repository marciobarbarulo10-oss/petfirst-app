# PetFirst

![Status](https://img.shields.io/badge/status-MVP%20em%20desenvolvimento-brightgreen)
![Expo SDK](https://img.shields.io/badge/Expo%20SDK-54-blue)
![React Native](https://img.shields.io/badge/React%20Native-0.81.5-61dafb)
![License](https://img.shields.io/badge/license-MIT-green)

## Sobre o Projeto

**PetFirst** é um aplicativo mobile para tutores de pet de primeira viagem. O app oferece ferramentas essenciais para cuidar do seu novo companheiro: carteirinha de vacinação, calculadora de alimentação, assistente com IA e muito mais.

Estratégia: 100% gratuito no lançamento, monetização via assinatura posteriormente.

## Stack Técnica

- **React Native** 0.81.5
- **Expo SDK** 54
- **React Navigation** v7 (native, native-stack, bottom-tabs)
- **AsyncStorage** para persistência local
- **JavaScript puro** (sem TypeScript)
- **Supabase** (em breve) - banco de dados e autenticação
- **OpenAI API** (em breve) - assistente com IA

## Como Rodar Localmente

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Expo Go instalado no celular (iOS/Android)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/marciobarbarulo10-oss/petfirst-app.git

# Entre na pasta
cd petfirst-app

# Instale as dependências
npm install

# Inicie o projeto
npx expo start
```

Escaneie o QR Code com o Expo Go (Android) ou a câmera do iPhone (iOS).

## Estrutura de Pastas

```
petfirst/
├── screens/           # Telas do app
│   ├── WelcomeScreen.js
│   ├── CadastroEspecieScreen.js
│   ├── CadastroNomeScreen.js
│   ├── MainTabs.js
│   ├── HomeScreen.js
│   ├── SaudeScreen.js
│   ├── AlimentacaoScreen.js
│   ├── AssistenteScreen.js
│   └── PerfilScreen.js
├── components/        # Componentes reutilizáveis
├── assets/            # Imagens e ícones
├── App.js             # Ponto de entrada
├── CLAUDE.md          # Instruções para o agente IA
└── package.json
```

## Screenshots

| Onboarding | Home | Saúde | Alimentação |
|------------|------|-------|-------------|
| ![Onboarding](https://via.placeholder.com/200x400?text=Onboarding) | ![Home](https://via.placeholder.com/200x400?text=Home) | ![Saude](https://via.placeholder.com/200x400?text=Saude) | ![Alimentacao](https://via.placeholder.com/200x400?text=Alimentacao) |

| Assistente | Perfil |
|------------|--------|
| ![Assistente](https://via.placeholder.com/200x400?text=Assistente) | ![Perfil](https://via.placeholder.com/200x400?text=Perfil) |

## Site Oficial

Acesse o site do projeto: **[petfirst-site.vercel.app](https://petfirst-site.vercel.app)**

## Funcionalidades

- [x] Onboarding completo (3 passos)
- [x] Dashboard com saudação personalizada
- [x] Carteirinha digital de vacinação
- [x] Calculadora de porção alimentar
- [x] Assistente virtual (chat simulado)
- [x] Perfil do pet editável
- [ ] Integração com OpenAI
- [ ] Persistência com Supabase
- [ ] Notificações de lembretes

## Identidade Visual

| Cor | Hex | Uso |
|-----|-----|-----|
| Terracota | `#E07B5A` | Primária |
| Verde-sálvia | `#7BAE8A` | Secundária |
| Marfim | `#FFFDF9` | Fundo |
| Mel | `#F5C842` | Acento |

## Fundador

**Marcio Augusto Barbarulo Beraldo**

- GitHub: [@marciobarbarulo10-oss](https://github.com/marciobarbarulo10-oss)
- Email: marciobarbarulo10@gmail.com

---

Feito com amor para tutores de primeira viagem.
