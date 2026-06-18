# 🏠 Home Manager

Aplicación web para gestionar proyectos de reformas del hogar. Organiza espacios, tareas y presupuestos de forma intuitiva con un sistema Kanban.

🔗 **[Ver demo en vivo](https://myhomemanager.netlify.app/)**

> **Proyecto desarrollado para gestionar de forma organizada la reforma de mi vivienda.** Las soluciones existentes eran demasiado complejas o genéricas, así que creé una herramienta simple pero potente que permite organizar tareas por espacios, visualizar el progreso de forma clara y tener todo centralizado en un solo lugar.

## ✨ Features

### Gestión de Proyectos
- Crea y organiza múltiples proyectos de reforma
- Define presupuestos y haz seguimiento
- Visualiza estadísticas y progreso en tiempo real

### Organización por Espacios
- Divide cada proyecto en espacios (cocina, baño, salón, etc.)
- Personaliza con nombres e iconos
- Vista individual por espacio o general del proyecto completo

### Sistema Kanban
- Visualiza tareas en 3 columnas: Pendiente, En Proceso, Completada
- Gestiona prioridades: Baja, Media, Alta, Urgente
- CRUD completo: crea, edita y elimina tareas

### Vista Flexible
- **Vista General**: Todas las tareas del proyecto en un Kanban unificado
- **Vista por Espacio**: Enfócate en las tareas de un espacio específico
- Selección de espacio al crear tareas desde la vista general

### Autenticación y Seguridad
- Sistema de usuarios con Supabase
- Cada usuario solo accede a sus propios proyectos
- Row Level Security (RLS) activado

## 🛠️ Tech Stack

![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-FFD859?style=for-the-badge&logo=pinia&logoColor=black)

**Frontend:**
- Vue 3 (Composition API)
- TypeScript
- Vite
- Vue Router
- Pinia (State management)
- TailwindCSS

**Backend:**
- Supabase (PostgreSQL + Authentication + Real-time)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm o yarn
- Cuenta en Supabase

### Installation

1. Clonar el repositorio
```bash
git clone https://github.com/osangr/home-manager.git
cd home-manager
```

2. Instalar dependencias
```bash
npm install
```

3. Configurar variables de entorno

Crea un archivo `.env` en la raíz:
```env
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_KEY=tu_supabase_anon_key
```

4. Ejecutar en desarrollo
```bash
npm run dev
```

5. Abrir en el navegador
```
http://localhost:5173
```

## 📦 Build
```bash
npm run build
npm run preview
```

## 🗄️ Database Schema

### Projects
- Información del proyecto, presupuesto y fechas

### Spaces
- Espacios dentro de cada proyecto con nombre e icono

### Tasks
- Tareas con estado, prioridad y descripción
- Organizadas por espacio

## 📄 Licencia

MIT

---

⭐ Si te gusta el proyecto, dale una estrella!
