# Lucky Game - AI Context Documentation

> Документация для быстрого сбора контекста AI-агентами

## 📋 Project Overview

**Lucky Game** - современное веб-приложение на базе Next.js 15+ с системой аутентификации через Supabase, организованное по **FSD (Feature-Sliced Design)** архитектуре.

### Ключевые возможности:
- Полная система аутентификации (регистрация, вход, восстановление пароля)
- Защищенные маршруты с middleware
- Dark/Light режимы
- Адаптивный дизайн с Tailwind CSS
- Готовая UI-библиотека на базе shadcn/ui
- **FSD архитектура** для масштабируемости

---

## 🛠 Tech Stack

### Core Framework
- **Next.js** (latest) - React framework с App Router (v13+)
- **React** (^19.0.0) - UI библиотека
- **TypeScript** (^5) - Строгая типизация

### Backend & Auth
- **Supabase** (`@supabase/supabase-js`, `@supabase/ssr`) - Backend-as-a-Service с аутентификацией
  - Server-side и browser-side клиенты
  - Cookie-based сессии (не localStorage)
  - Middleware для защиты маршрутов

### Styling
- **Tailwind CSS** (^3.4.1) - Utility-first CSS framework
- **PostCSS** (^8) + **Autoprefixer** (^10.4.20)
- **next-themes** (^0.4.6) - Переключение темы (dark/light)
- **tailwindcss-animate** (^1.0.7) - Анимации

### UI Components
- **shadcn/ui** - Копируемые компоненты на базе Radix UI
- **Radix UI** - Примитивы для доступных компонентов:
  - `@radix-ui/react-checkbox`
  - `@radix-ui/react-dropdown-menu`
  - `@radix-ui/react-label`
  - `@radix-ui/react-slot`
- **lucide-react** (^0.511.0) - Иконки

### Utilities
- **clsx** (^2.1.1) - Утилита для classnames
- **tailwind-merge** (^3.3.0) - Слияние Tailwind классов
- **class-variance-authority** (^0.7.1) - Варианты стилей для компонентов

### Development
- **ESLint** (^9) + **eslint-config-next** - Линтинг
- **Turbopack** - Быстрый dev сервер (используется в `npm run dev`)

---

## 🏗 Architecture

### Directory Structure (FSD Architecture)

```
/Users/aleksei/lucky-game/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Корневой layout
│   ├── page.tsx                 # Главная страница
│   ├── globals.css              # Глобальные стили
│   ├── auth/                    # Auth routes
│   │   ├── login/page.tsx
│   │   ├── sign-up/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   ├── update-password/page.tsx
│   │   ├── sign-up-success/page.tsx
│   │   ├── error/page.tsx
│   │   └── confirm/route.ts
│   └── protected/               # Protected routes
│       ├── layout.tsx
│       └── page.tsx
│
├── src/                          # FSD ARCHITECTURE
│   ├── shared/                  # Переиспользуемый код
│   │   ├── ui/                  # UI компоненты (shadcn/ui)
│   │   │   ├── button/
│   │   │   ├── card/
│   │   │   ├── input/
│   │   │   ├── label/
│   │   │   ├── checkbox/
│   │   │   ├── dropdown-menu/
│   │   │   ├── badge/
│   │   │   └── index.ts
│   │   ├── api/                 # API клиенты
│   │   │   └── supabase/
│   │   │       ├── client.ts
│   │   │       ├── server.ts
│   │   │       ├── middleware.ts
│   │   │       └── index.ts
│   │   ├── lib/                 # Утилиты
│   │   │   ├── utils.ts
│   │   │   └── index.ts
│   │   ├── icons/               # Иконки/логотипы
│   │   │   ├── next-logo.tsx
│   │   │   ├── supabase-logo.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── features/                # Пользовательские взаимодействия
│   │   ├── auth/                # Аутентификация
│   │   │   ├── login-form/
│   │   │   ├── sign-up-form/
│   │   │   ├── forgot-password-form/
│   │   │   ├── update-password-form/
│   │   │   ├── auth-button/
│   │   │   ├── logout-button/
│   │   │   └── index.ts
│   │   ├── theme/               # Темизация
│   │   │   ├── theme-switcher/
│   │   │   └── index.ts
│   │   ├── deploy/              # Деплой
│   │   │   ├── deploy-button/
│   │   │   └── index.ts
│   │   ├── config/              # Конфигурация
│   │   │   ├── env-var-warning/
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── widgets/                 # Композитные UI блоки
│   │   ├── hero/
│   │   ├── code-block/
│   │   ├── tutorial/
│   │   │   ├── tutorial-step/
│   │   │   ├── connect-supabase-steps/
│   │   │   ├── sign-up-user-steps/
│   │   │   ├── fetch-data-steps/
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── entities/                # Бизнес-сущности (пока не используется)
│   │
│   └── views/                   # Композиции страниц (зарезервировано для будущего)
│
├── middleware.ts                # Next.js middleware
├── next.config.ts
├── tsconfig.json                # С FSD path aliases
├── tailwind.config.ts
├── components.json              # Обновлен для src/
└── package.json
```

### Routing Structure

#### Публичные маршруты:
- `/` - Главная страница (landing/tutorial)
- `/auth/login` - Вход
- `/auth/sign-up` - Регистрация
- `/auth/forgot-password` - Восстановление пароля
- `/auth/update-password` - Обновление пароля
- `/auth/sign-up-success` - Успешная регистрация
- `/auth/error` - Ошибка аутентификации
- `/auth/confirm` - Email подтверждение (API route)

#### Защищенные маршруты:
- `/protected/*` - Требуют авторизации
  - Перенаправление на `/auth/login` при отсутствии сессии

### Authentication System

#### Supabase Clients

**Server-side** (`lib/supabase/server.ts`):
```typescript
createServerClient() // Для Server Components и API routes
// Управляет cookies для серверной авторизации
```

**Browser-side** (`lib/supabase/client.ts`):
```typescript
createBrowserClient() // Для Client Components
```

**Middleware** (`lib/supabase/middleware.ts`):
```typescript
updateSession() // Проверяет сессию, обновляет cookies
// Вызывается в middleware.ts на каждом запросе
```

#### Session Management
- Сессии хранятся в **cookies** (не localStorage)
- Middleware проверяет сессию на каждом запросе
- Важно: клиенты создаются **per-request** (не глобально) для Fluid Compute support

#### Environment Variables
Обязательно требуются:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

### Theme System

- **Dark mode**: class-based (добавляет `.dark` к `<html>`)
- **next-themes**: автоматическое определение системной темы
- **CSS Variables**: семантические цвета (HSL формат)
  - `--primary`, `--secondary`, `--accent`, `--destructive` и т.д.
  - Light/dark варианты в `app/globals.css`

### Component Patterns

**Server Components** (по умолчанию):
- Весь app/ использует Server Components
- Нет директивы `"use client"`

**Client Components** (интерактивные):
- Формы с `"use client"` директивой
- Theme switcher
- Interactive UI (buttons с onClick и т.д.)

---

## 📝 Coding Conventions

### File Naming

**Components**:
- Файлы: `kebab-case.tsx` (например: `auth-button.tsx`)
- Component name: `PascalCase` (например: `AuthButton`)

**Directories**:
- `lowercase` (например: `app`, `components`, `lib`)

**Extensions**:
- `.tsx` - Компоненты с JSX
- `.ts` - Утилиты без JSX
- `.mjs` - ES modules конфигурации (ESLint, PostCSS)

### Import Patterns (FSD)

**FSD Path Aliases**:
```typescript
// Shared layer
import { Button } from "@/shared/ui/button"
import { cn } from "@/shared/lib/utils"
import { createServerClient } from "@/shared/api/supabase"

// Features layer
import { LoginForm, AuthButton } from "@/features/auth"
import { ThemeSwitcher } from "@/features/theme"

// Widgets layer
import { Hero } from "@/widgets/hero"
import { ConnectSupabaseSteps } from "@/widgets/tutorial"
```

**Правила импорта**:
- Используйте **barrel exports** (index.ts) для импорта из слоев
- **Избегайте** относительных путей (`../../../`)
- Импортируйте из слоя целиком: `@/features/auth`, не из подпапок

**Конфигурация** (tsconfig.json):
```json
{
  "paths": {
    "@/*": ["./*"],
    "@/shared/*": ["./src/shared/*"],
    "@/features/*": ["./src/features/*"],
    "@/widgets/*": ["./src/widgets/*"],
    "@/views/*": ["./src/views/*"],
    "@/entities/*": ["./src/entities/*"]
  }
}
```

### TypeScript Patterns

**Строгий режим**:
- `strict: true` включен
- Всегда типизируйте props
- Используйте `Metadata` для страниц

**Примеры**:
```typescript
// Metadata для страниц
import type { Metadata } from "next"
export const metadata: Metadata = { title: "..." }

// Props типизация
interface ButtonProps {
  variant?: "default" | "destructive"
  children: React.ReactNode
}
```

### Component Structure

**Стандартный порядок**:
1. Imports
2. Type definitions
3. Component function
4. Export

**Пример**:
```typescript
import { cn } from "@/lib/utils"

interface CardProps {
  className?: string
  children: React.ReactNode
}

export function Card({ className, children }: CardProps) {
  return <div className={cn("rounded-lg", className)}>{children}</div>
}
```

### Styling Conventions

**Tailwind Classes**:
```typescript
// Используйте cn() для условных классов
className={cn(
  "base classes",
  condition && "conditional classes",
  className // props для переопределения
)}
```

**CSS Variables**:
- Семантические цвета через CSS переменные
- `bg-primary`, `text-foreground` вместо конкретных цветов

---

## 🚀 Development Guide

### Запуск проекта

```bash
# Development (с Turbopack)
npm run dev

# Production build
npm run build
npm start

# Linting
npm run lint
```

### Добавление новой страницы

**1. Публичная страница**:
```typescript
// app/new-page/page.tsx
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "New Page",
}

export default function NewPage() {
  return <div>New Page Content</div>
}
```

**2. Защищенная страница**:
```typescript
// app/protected/new-feature/page.tsx
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function NewFeaturePage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return <div>Protected Content</div>
}
```

### Добавление компонента

**1. UI компонент (shadcn/ui)**:
```bash
# Используйте CLI для добавления готовых компонентов
npx shadcn@latest add [component-name]
# Например: npx shadcn@latest add dialog
```

**2. Custom компонент**:
```typescript
// components/my-component.tsx
"use client" // если нужна интерактивность

import { Button } from "@/components/ui/button"

export function MyComponent() {
  return <Button>Click me</Button>
}
```

**3. Размещение**:
- UI примитивы → `components/ui/`
- Feature компоненты → `components/`
- Page-specific → рядом с `page.tsx` или в `components/`

### Работа с Supabase

**Server Component**:
```typescript
import { createServerClient } from "@/lib/supabase/server"

export default async function Page() {
  const supabase = await createServerClient()
  const { data } = await supabase.from("table").select()
  return <div>{/* render data */}</div>
}
```

**Client Component**:
```typescript
"use client"
import { createBrowserClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"

export function MyComponent() {
  const supabase = createBrowserClient()
  // использование в useEffect, event handlers и т.д.
}
```

**API Route**:
```typescript
// app/api/data/route.ts
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createServerClient()
  const { data } = await supabase.from("table").select()
  return Response.json(data)
}
```

### Добавление защищенного маршрута

**Автоматическая защита**:
- Все маршруты в `app/protected/*` защищены middleware
- Middleware проверяет сессию автоматически

**Ручная защита**:
```typescript
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function ProtectedPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return <div>Protected content</div>
}
```

### Использование shadcn/ui

**Просмотр доступных компонентов**:
```bash
npx shadcn@latest add
```

**Установка компонента**:
```bash
npx shadcn@latest add button
npx shadcn@latest add card
```

**Использование**:
```typescript
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

<Button variant="default">Click me</Button>
<Card>
  <CardHeader>Title</CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

**Кастомизация**:
- Компоненты копируются в проект → можно свободно редактировать
- Стили через Tailwind в `tailwind.config.ts`

### Настройка темы

**Добавление цвета**:
```css
/* app/globals.css */
:root {
  --my-color: 200 50% 50%; /* HSL без 'hsl()' */
}

.dark {
  --my-color: 200 60% 40%;
}
```

**tailwind.config.ts**:
```typescript
theme: {
  extend: {
    colors: {
      myColor: "hsl(var(--my-color))",
    }
  }
}
```

---

## 🔍 Quick Reference

### Важные файлы

| Файл | Назначение |
|------|-----------|
| `middleware.ts` | Проверка сессий на каждом запросе |
| `app/layout.tsx` | Корневой layout с ThemeProvider |
| `lib/utils.ts` | Helper функции (`cn`, `hasEnvVars`) |
| `lib/supabase/server.ts` | Server-side Supabase клиент |
| `lib/supabase/client.ts` | Browser Supabase клиент |
| `tailwind.config.ts` | Конфигурация темы и цветов |
| `components.json` | shadcn/ui настройки |

### Полезные команды

```bash
# Development
npm run dev          # Запуск с Turbopack

# Build
npm run build        # Production build
npm start            # Запуск production

# Linting
npm run lint         # ESLint проверка

# shadcn/ui
npx shadcn@latest add [component]  # Добавить UI компонент
```

### Переменные окружения

```bash
# .env.local (создайте файл)
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

---

## 💡 Best Practices

1. **Server Components по умолчанию** - используйте `"use client"` только когда нужно
2. **Path alias** - всегда `@/` вместо относительных путей
3. **Типизация** - типизируйте все props и функции
4. **cn() utility** - для условных Tailwind классов
5. **Supabase клиенты** - создавайте per-request, не глобально
6. **shadcn/ui** - используйте готовые компоненты вместо создания с нуля
7. **CSS Variables** - для семантических цветов вместо hardcoded значений

---

## 📚 Additional Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Radix UI Docs](https://www.radix-ui.com/primitives/docs)

---

*Последнее обновление: 2025-11-16*
