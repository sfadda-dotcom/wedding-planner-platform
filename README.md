
# 💒 Wedding Planner Platform

Una piattaforma moderna e completa per la pianificazione di matrimoni, sviluppata con Next.js, TypeScript e Tailwind CSS.

## ✨ Caratteristiche Principali

- 🎯 **Pianificazione Completa**: Budget planner, timeline, gestione fornitori
- 🤖 **AI Assistant**: Assistente intelligente per consigli personalizzati
- 🔍 **Ricerca Fornitori**: Database completo di fornitori reali e verificati
- 💰 **Budget Tracker**: Monitoraggio spese in tempo reale
- 📱 **Design Responsivo**: Ottimizzato per dispositivi mobile e desktop
- 🔐 **Autenticazione Sicura**: Sistema di login/registrazione con NextAuth
- 🎨 **UI Moderna**: Interfaccia elegante con Shadcn/UI components

## 🛠️ Tecnologie Utilizzate

- **Framework**: Next.js 14 (App Router)
- **Linguaggio**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/UI, Radix UI
- **Database**: PostgreSQL con Prisma ORM
- **Autenticazione**: NextAuth.js
- **Deployment**: Vercel/Netlify compatible
- **Package Manager**: Yarn

## 🚀 Installazione e Setup

```bash
# Clona il repository
git clone https://github.com/YOUR_USERNAME/wedding-planner-platform.git
cd wedding-planner-platform

# Installa le dipendenze
cd app
yarn install

# Configura le variabili d'ambiente
cp .env.example .env.local
# Modifica .env.local con le tue configurazioni

# Esegui le migrazioni del database
yarn prisma generate
yarn prisma db push

# Avvia il server di sviluppo
yarn dev
```

## 📝 Variabili d'Ambiente

Crea un file `.env.local` nella directory `app/` con:

```env
DATABASE_URL="your-database-url"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
```

## 📁 Struttura del Progetto

```
wedding-planner-platform/
├── app/
│   ├── app/                 # App Router pages
│   ├── components/         # React components
│   ├── lib/               # Utility functions
│   ├── hooks/             # Custom React hooks
│   ├── prisma/            # Database schema
│   └── public/            # Static assets
├── README.md
└── .gitignore
```

## 🎯 Funzionalità Implementate

### Core Features
- [x] Landing page responsive
- [x] Sistema di autenticazione completo
- [x] Dashboard utente personalizzata
- [x] Budget planner interattivo
- [x] Timeline management
- [x] Ricerca e filtri fornitori avanzati

### AI Features  
- [x] AI Assistant per consigli personalizzati
- [x] Raccomandazioni automatiche fornitori
- [x] Analisi budget intelligente

### Database
- [x] Fornitori reali integrati
- [x] Categorie multiple (venue, catering, photography, etc.)
- [x] Filtri per budget, location, guests

## 🔧 Scripts Disponibili

```bash
yarn dev          # Sviluppo
yarn build        # Build produzione
yarn start        # Avvia build produzione  
yarn lint         # ESLint check
yarn prisma generate  # Genera Prisma client
```

## 📱 Responsive Design

La piattaforma è completamente ottimizzata per:
- 📱 Mobile (320px+)
- 📟 Tablet (768px+) 
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1440px+)

## 🌍 Supporto Globale

Piattaforma progettata per uso mondiale con:
- Supporto valute multiple
- Ricerca geografica globale
- Fornitori internazionali
- Localizzazione ready

## 🤝 Contribuire

1. Fork del progetto
2. Crea un branch per la feature (`git checkout -b feature/AmazingFeature`)
3. Commit delle modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📄 Licenza

Questo progetto è distribuito sotto licenza MIT. Vedi il file `LICENSE` per maggiori dettagli.

## 📞 Supporto

Per domande o supporto, contatta:
- Email: support@weddingplanner.com
- Issues: [GitHub Issues](https://github.com/YOUR_USERNAME/wedding-planner-platform/issues)

---

**Sviluppato con ❤️ per rendere speciale ogni matrimonio** 💑
