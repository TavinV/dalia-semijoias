# 🌸 Dália Semijoias - E-commerce MERN  

### 📌 Projeto de E-commerce  

O **Dália Semijoias** é um e-commerce desenvolvido em **MERN stack** para gerenciamento e venda de semijoias.  

🔗 Acesse a aplicação em: https://dalia-semijoias.vercel.app

O sistema oferece:  
- Catálogo online de produtos  
- Upload de imagens com **Cloudinary**  
- Controle de estoque e cadastro de itens  
- Sistema de autenticação e autorização com **JWT**  
- Carrinho de compras integrado ao **WhatsApp** para finalização de pedidos  
- Painel de administração para gerenciamento de produtos e clientes  

---

## 🚀 Tecnologias Utilizadas  

### **Backend (API - Node/Express)**  
- **Express** — Criação da API REST  
- **MongoDB + Mongoose** — Banco de dados e modelagem  
- **JWT** — Autenticação baseada em tokens  
- **Joi** — Validação de dados  
- **Multer + Cloudinary** — Upload e armazenamento de imagens  
- **Bcrypt** — Criptografia de senhas  
- **Cors, dotenv** — Utilitários de configuração e segurança  

### **Frontend (React)**  
- **React.js** — Interface do usuário  
- **React Router DOM** — Navegação entre páginas  
- **Axios** — Consumo da API REST  
- **Context API / Hooks** — Gerenciamento de estado  
- **Componentização** para UI, Layout e Navegação  
- **Integração com WhatsApp** para pedidos  

---

## 📂 Estrutura do Projeto  

```
dalia-semijoias/
├── client/                 # Aplicação frontend (React)
│   ├── public/             # Arquivos estáticos
│   └── src/                
│       ├── api/            # Chamadas para API
│       ├── components/     # Componentes reutilizáveis
│       │   ├── layout/     
│       │   ├── modules/    
│       │   ├── navigation/ 
│       │   └── ui/         
│       ├── context/        # Context API
│       ├── hooks/          # Hooks customizados
│       ├── pages/          # Páginas principais
│       └── utils/          # Funções utilitárias
│
└── server/                 # Aplicação backend (Node.js/Express)
    ├── uploads/            # Uploads temporários
    └── v1/                 
        ├── controllers/    # Controladores de rotas
        ├── errors/         # Tratamento de erros
        ├── middlewares/    # Middlewares de autenticação, logs, etc.
        ├── models/         # Modelos do MongoDB
        ├── routes/         # Definição de rotas
        ├── services/       # Lógica de negócio
        ├── utils/          # Funções auxiliares
        └── validation/     # Esquemas de validação (Joi)
```

---

## ⚙️ Configuração do Ambiente  

### **Backend**  
Crie um arquivo `.env` dentro de `server/` com base nos exemplos:  

```env
# Porta
PORT=5000

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dalia

# JWT
JWT_SECRET=your_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### **Frontend**  
Crie um arquivo `.env` dentro de `client/`:  

```env
VITE_API_URL=http://localhost:5000
VITE_WHATSAPP_NUMBER=5599999999999
```

---

## 📌 Instalação e Uso  

### 1. Clone o repositório  
```bash
git clone https://github.com/tavinv/dalia-semijoias.git
```

### 2. Instale dependências do backend  
```bash
cd dalia-semijoias/server
npm install
npm run dev
```

### 3. Instale dependências do frontend  
```bash
cd ../client
npm install
npm run dev
```

### 4. Acesse no navegador  
- API: **http://localhost:5000**  
- Frontend: **http://localhost:5173**  

---

## 🛒 Fluxo do E-commerce  

1. Usuário acessa o catálogo e escolhe produtos  
2. Adiciona ao carrinho  
3. No checkout, é redirecionado para o **WhatsApp**, com a lista de produtos e valores  
4. O pedido é enviado diretamente para a loja  

---

## 📜 Funcionalidades Futuras  

- Dashboard para relatórios de vendas  
- Integração com meios de pagamento online  
- Sistema de cupons de desconto  
- Controle de categorias e coleções  

---

## 📞 Contato  

Dúvidas ou suporte?  
📧 **otavioviniciusads@gmail.com**  
