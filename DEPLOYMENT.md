# Guia de Deploy - Citadel Project Business

## 1️⃣ Deploy no Netlify (Rápido - 10 minutos)

### Passo 1: Preparar repositório Git
```bash
cd C:\Users\danie\OneDrive\Documentos\GitHub\citadel-website
git add netlify.toml .env.example
git commit -m "feat: add Netlify configuration for production deployment"
git push origin main
```

### Passo 2: Conectar ao Netlify
1. Acesse https://app.netlify.com
2. Clique em "New site from Git"
3. Conecte sua conta GitHub
4. Selecione o repositório: `citadel-website`
5. Configurar:
   - **Build command:** `echo "Static site - no build required"`
   - **Publish directory:** `/` (raiz do projeto)
   - **Branch to deploy:** `main`

### Passo 3: Configurar domínio
1. Em Netlify, vá para **Site settings → Domain management**
2. Clique em **Add custom domain**
3. Digite: `citadelproject.com.br`
4. Siga as instruções para apontar o domínio:
   - **Registrador:** GoDaddy, Registro.br, etc.
   - **Update DNS records** para apontar para Netlify

#### DNS Records (exemplo):
```
Type: CNAME
Name: www
Value: citadel-website.netlify.app

Type: A (for root domain)
Name: @
Value: 75.2.60.5 (variável conforme Netlify)
```

### Passo 4: Configurar HTTPS (automático)
Netlify ativa HTTPS automaticamente com Let's Encrypt.

### Passo 5: Testar
- Acesse: https://citadelproject.com.br
- Verifique se o site carrega corretamente
- Teste responsive (mobile, tablet, desktop)
- Verifique console do navegador (F12) para erros

---

## 2️⃣ Backend Node.js + Database (Parallel)

### Requisitos
- Node.js 18+ instalado
- Account no Render.com (free) ou Heroku
- Account no Supabase (PostgreSQL gratuito)

### Passo 1: Criar novo repositório backend
```bash
mkdir citadel-backend
cd citadel-backend

# Inicializar Git
git init
git branch -M main

# Inicializar Node.js
npm init -y
```

### Passo 2: Instalar dependências
```bash
npm install express cors dotenv node-postgres pg @google-cloud/storage axios resend
npm install -D nodemon concurrently
```

### Passo 3: Estrutura de pasta
```
citadel-backend/
├── src/
│   ├── server.js
│   ├── config.js
│   ├── db.js
│   ├── routes/
│   │   ├── leads.js
│   │   ├── contact.js
│   │   └── webhooks.js
│   ├── controllers/
│   │   ├── leadController.js
│   │   └── contactController.js
│   ├── services/
│   │   ├── emailService.js
│   │   ├── googleDriveService.js
│   │   └── superAgentesService.js
│   └── middleware/
│       └── errorHandler.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

### Passo 4: Criar servidor Express básico

**src/server.js:**
```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/leads', require('./routes/leads'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/webhooks', require('./routes/webhooks'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Citadel Backend running on port ${PORT}`);
});
```

### Passo 5: Deploy no Render
1. Acesse https://render.com
2. Crie nova **Web Service**
3. Conecte repositório GitHub (`citadel-backend`)
4. Configurar:
   - **Build command:** `npm install`
   - **Start command:** `node src/server.js`
   - **Environment:** NODE_VERSION=20, PNPM_VERSION=9
5. Adicionar **Environment variables** (.env):
   - `DATABASE_URL` (Supabase)
   - `RESEND_API_KEY` (resend.com)
   - `GOOGLE_DRIVE_KEY` (JSON credential)
   - etc.

6. Deploy automático ativado no push para `main`

---

## 3️⃣ Database PostgreSQL (Supabase)

### Passo 1: Criar Supabase project
1. Acesse https://supabase.com
2. Crie um novo projeto
3. Copie `DATABASE_URL`

### Passo 2: Criar tabelas
```sql
-- Leads table
CREATE TABLE leads (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  company VARCHAR(255),
  phone VARCHAR(20),
  service_interest VARCHAR(100),
  lead_quality INTEGER DEFAULT 0,
  source VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Contacts table
CREATE TABLE contacts (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  phone VARCHAR(20),
  message TEXT,
  status VARCHAR(50) DEFAULT 'new',
  assigned_to VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
```

---

## 4️⃣ Integrar Frontend com Backend

### Modificar app.js
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Contact form
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = {
    name: document.getElementById('nome').value,
    company: document.getElementById('empresa').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('telefone').value,
    message: document.getElementById('mensagem').value
  };

  try {
    const response = await fetch(`${API_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (response.ok) {
      showSuccessMessage('Mensagem enviada com sucesso!');
      contactForm.reset();
    } else {
      showErrorMessage('Erro ao enviar. Tente novamente.');
    }
  } catch (error) {
    console.error('Error:', error);
    showErrorMessage('Erro de conexão com o servidor.');
  }
});

// Similar para materialsForm
```

---

## 5️⃣ Monitoramento & Logs

### Verificar status
- **Netlify:** https://app.netlify.com/sites/citadel-website
- **Backend (Render):** https://dashboard.render.com
- **Database (Supabase):** https://app.supabase.com

### Logs
```bash
# Render logs (via terminal)
render logs

# Local development
npm run dev  # com nodemon
```

---

## ✅ Checklist Final

- [ ] Netlify deployment ativo (https://citadelproject.com.br)
- [ ] HTTPS funcionando (cadeado verde)
- [ ] Backend rodando (https://citadel-backend.onrender.com/health)
- [ ] Database criado e acessível
- [ ] Formulários enviando dados
- [ ] Google Drive API configurada
- [ ] Analytics rastreando eventos
- [ ] Email de confirmação funcionando

---

## 🆘 Troubleshooting

**"DNS not resolving"**
- Aguarde 24-48h após apontar domínio
- Verifique registros DNS: https://dnschecker.org

**"Database connection error"**
- Verifique DATABASE_URL no .env
- Teste conexão: `psql <DATABASE_URL>`

**"CORS error on form submission"**
- Verifique CORS no Express: `cors()` deve estar ativado
- Whitelist: `cors({ origin: ['https://citadelproject.com.br'] })`

**"Forms not sending"**
- Verifique console (F12) para erros
- Teste API manualmente: `curl -X POST http://localhost:3000/api/contact`

---

## 📞 Suporte

Para dúvidas sobre:
- **Netlify:** https://docs.netlify.com
- **Render:** https://docs.render.com
- **Supabase:** https://supabase.com/docs
- **Express:** https://expressjs.com
