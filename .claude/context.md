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
│   ├── globals.css              # Глобальные стили + Tailwind
│   ├── api/                     # API Routes
│   │   └── migrate/             # Database migration endpoint (удалён позже)
│   │       └── route.ts         # Auto-migration API (удалён позже)
│   ├── auth/                    # Маршруты аутентификации
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
│   │   ├── database-status/     # Database status indicator
│   │   │   ├── database-status.tsx
│   │   │   └── index.ts
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
├── lib/                         # (Legacy) Будет перемещено в src/
│   └── migrations/              # Database migration utilities (удалено позже)
│       └── run-migrations.ts    # Migration runner (удалено позже)
│
├── migrations/                  # SQL Database migrations
│   ├── README.md               # Migration documentation
│   ├── 000_migrations_table.sql # Migration tracking table
│   ├── 001_initial_schema.sql  # Initial slot machine schema
│   └── 002_backfill_existing_users.sql # Backfill for existing auth users
│
├── middleware.ts                # Next.js middleware
├── next.config.ts               # Next.js конфигурация
├── tsconfig.json                # TypeScript настройки + FSD path aliases
├── tailwind.config.ts           # Tailwind конфигурация
├── postcss.config.mjs
├── eslint.config.mjs
├── components.json              # shadcn/ui конфигурация (обновлен для src/)
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


### Database Schema & Migrations

#### Database Tables

**user_profiles** - Расширенные профили пользователей:
- `id` (uuid) - Ссылка на auth.users (PK)
- `username` (varchar) - Уникальное имя пользователя
- `coins` (integer) - Виртуальная валюта (начальный: 1000)
- `level` (integer) - Уровень игрока (начальный: 1)
- `created_at` (timestamptz) - Дата создания профиля
- `updated_at` (timestamptz) - Последнее обновление

**symbols** - Элементы игрового барабана (слот-машина):
- `id` (uuid) - UUID primary key
- `code` (varchar) - Код символа (CHERRY, SEVEN, DIAMOND и т.д.)
- `display_name` (varchar) - Отображаемое имя (Вишня, Семёрка, Бриллиант)
- `rarity` (enum) - Редкость: COMMON, RARE, EPIC, LEGENDARY
- `base_value` (integer) - Базовая ценность для расчета наград
- `created_at` (timestamptz) - Дата создания

**Предустановленные символы:**
- CHERRY (Вишня) - COMMON, 10 pts
- LEMON (Лимон) - COMMON, 10 pts
- ORANGE (Апельсин) - COMMON, 15 pts
- PLUM (Слива) - RARE, 25 pts
- BELL (Колокольчик) - RARE, 30 pts
- STAR (Звезда) - EPIC, 50 pts
- SEVEN (Семёрка) - EPIC, 75 pts
- DIAMOND (Бриллиант) - LEGENDARY, 100 pts

**spin_configurations** - Конфигурации желаемых результатов спинов:
- `id` (uuid) - UUID primary key
- `user_id` (uuid) - Ссылка на auth.users
- `desired_combination` (uuid[]) - Массив из 3-5 ID символов (желаемая комбинация)
- `cost` (integer) - Стоимость создания конфигурации
- `status` (enum) - Статус: DRAFT, ACTIVE, USED
- `created_at` (timestamptz) - Дата создания

**spins** - Результаты выполненных спинов:
- `id` (uuid) - UUID primary key
- `user_id` (uuid) - Ссылка на auth.users
- `configuration_id` (uuid) - Ссылка на spin_configurations (nullable)
- `actual_combination` (uuid[]) - Фактическая комбинация символов
- `is_match` (boolean) - Совпала ли с желаемой комбинацией
- `reward` (integer) - Полученная награда
- `executed_at` (timestamptz) - Время выполнения спина

**game_sessions** - Игровые сессии (группировка спинов):
- `id` (uuid) - UUID primary key
- `user_id` (uuid) - Ссылка на auth.users
- `spins_count` (integer) - Количество спинов в сессии
- `total_reward` (integer) - Общая награда за сессию
- `started_at` (timestamptz) - Начало сессии
- `ended_at` (timestamptz) - Окончание сессии (nullable)

**_migrations** - Служебная таблица для отслеживания миграций:
- `id` (serial) - Auto-incrementing ID
- `name` (varchar) - Имя файла миграции
- `executed_at` (timestamptz) - Время выполнения

#### Enumerations

- **symbol_rarity**: COMMON, RARE, EPIC, LEGENDARY
- **configuration_status**: DRAFT, ACTIVE, USED

#### Indexes

Для оптимизации запросов:
- `idx_spins_user_id` - Спины по пользователю
- `idx_spins_executed_at` - Спины по времени выполнения (DESC)
- `idx_game_sessions_user_id` - Сессии по пользователю
- `idx_game_sessions_started_at` - Сессии по времени начала (DESC)

#### Database Views

**spin_results_view** - Результаты спинов с данными пользователя

**user_stats_view** - Агрегированная статистика пользователей:
- Всего спинов
- Успешных спинов (совпадений)
- Всего наград
- Лучшая награда

#### Row Level Security (RLS)

Все таблицы защищены RLS политиками:

**user_profiles**:
- SELECT: Публичный доступ (все профили видимы)
- UPDATE: Только свой профиль
- INSERT: Только свой профиль

**symbols**:
- SELECT: Публичный доступ (все символы видимы)

**spin_configurations**:
- SELECT: Только свои конфигурации
- INSERT: Только свои конфигурации
- UPDATE: Только свои конфигурации

**spins**:
- SELECT: Только свои спины
- INSERT: Только свои спины

**game_sessions**:
- SELECT: Только свои сессии
- INSERT: Только свои сессии
- UPDATE: Только свои сессии

#### Entity Relationships

```
User (auth.users)
  ├─ user_profiles (1:1)
  ├─ spin_configurations (1:M)
  ├─ spins (1:M)
  └─ game_sessions (1:M)

Symbol
  └─ Used in spin_configurations.desired_combination (M:M)
  └─ Used in spins.actual_combination (M:M)

SpinConfiguration (1) ──> Spin (1)
GameSession (1) ──> Spins (M)
```

#### Game Flow

1. **Регистрация**: Авто-создание профиля с 1000 монет, уровень 1
2. **Создание конфигурации**: Пользователь тратит монеты на создание желаемой комбинации символов
3. **Выполнение спина**: Система генерирует фактическую комбинацию, сравнивает с желаемой
4. **Расчет награды**: При совпадении пользователь получает награду на основе ценности символов
5. **Обновление профиля**: Монеты и уровень обновляются по результатам
6. **Отслеживание сессии**: Спины группируются в сессии для аналитики

#### Automatic Features

**Триггеры и функции**:

`handle_new_user()` - Автоматическое создание профиля пользователя при регистрации:
- Создает запись в `user_profiles`
- Устанавливает начальные монеты: 1000
- Устанавливает начальный уровень: 1

**Триггер**: `on_auth_user_created` на таблице `auth.users`

`handle_updated_at()` - Автоматическое обновление временной метки:
- Обновляет `updated_at` в `user_profiles` при любых изменениях

**Триггер**: `on_user_profile_updated` на таблице `user_profiles`

#### Migration System

**Структура миграций**:
- Миграции в папке `migrations/`
- Именование: `XXX_description.sql` (например, `001_initial_schema.sql`)
- Выполняются в алфавитном порядке
- Отслеживание в таблице `_migrations`

**Способ выполнения**:
- Скопируйте SQL из `migrations/`
- Вставьте в [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql/new)
- Выполните миграции по порядку (000, 001, и т.д.)

**Важно**:
- Миграции идемпотентны (`IF NOT EXISTS`)
- Уже выполненные миграции пропускаются
- Детальная документация в `migrations/README.md`

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

### Инициализация базы данных

**Первый запуск проекта**:

1. **Настройте переменные окружения**:
   ```bash
   cp .env.example .env.local
   # Заполните NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
   ```

2. **Выполните миграции**:
   - Откройте файлы в `migrations/` folder
   - Скопируйте SQL в Supabase SQL Editor
   - Выполните миграции по порядку (000, 001, и т.д.)

3. **Проверьте создание таблиц**:
   - Откройте Supabase Dashboard > Table Editor
   - Должны быть видны: `user_profiles`, `symbols`, `spin_configurations`, `spins`, `game_sessions`, `_migrations`

**Индикатор статуса БД**:
- Компонент `<DatabaseStatus />` на главной странице
- Автоматически проверяет наличие таблиц
- Показывает инструкции по инициализации при необходимости

### Создание новой миграции

1. **Создайте файл миграции**:
   ```bash
   # Формат: XXX_description.sql
   touch migrations/002_add_feature.sql
   ```

2. **Напишите SQL**:
   ```sql
   -- migrations/002_add_feature.sql
   CREATE TABLE IF NOT EXISTS my_new_table (
     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
     name text NOT NULL,
     created_at timestamptz DEFAULT now()
   );

   ALTER TABLE my_new_table ENABLE ROW LEVEL SECURITY;

   CREATE POLICY "policy_name" ON my_new_table
     FOR SELECT
     USING (true);
   ```

3. **Выполните миграцию**:
   - Скопируйте SQL из файла миграции
   - Вставьте в Supabase SQL Editor
   - Выполните

**Best practices для миграций**:
- Используйте `IF NOT EXISTS` для идемпотентности
- Всегда включайте RLS (`ENABLE ROW LEVEL SECURITY`)
- Создавайте политики доступа для новых таблиц
- Документируйте SQL комментариями
- Тестируйте на dev базе перед production

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
| `components/database-status.tsx` | UI индикатор статуса БД |
| `migrations/001_initial_schema.sql` | Основная схема БД |
| `migrations/README.md` | Документация по миграциям |
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

# Опционально: для автоматических миграций (development only)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Где найти ключи:**
- Project Settings > API в Supabase Dashboard
- `NEXT_PUBLIC_SUPABASE_URL` - Project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` - anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` - service_role key (держите в секрете!)

---

## 💡 Best Practices

1. **Server Components по умолчанию** - используйте `"use client"` только когда нужно
2. **Path alias** - всегда `@/` вместо относительных путей
3. **Типизация** - типизируйте все props и функции
4. **cn() utility** - для условных Tailwind классов
5. **Supabase клиенты** - создавайте per-request, не глобально
6. **shadcn/ui** - используйте готовые компоненты вместо создания с нуля
7. **CSS Variables** - для семантических цветов вместо hardcoded значений
8. **Database Migrations** - всегда используйте `IF NOT EXISTS` для идемпотентности
9. **Row Level Security** - включайте RLS для всех новых таблиц
10. **Service Role Key** - храните в `.env.local`, НИКОГДА не коммитьте в git

---

## 📚 Additional Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Radix UI Docs](https://www.radix-ui.com/primitives/docs)

---

## 📝 Changelog

### 2025-11-16 - Database & Migrations (Updated)
- Добавлена система автоматической инициализации БД
- SQL миграции для слот-машины: `user_profiles`, `symbols`, `spin_configurations`, `spins`, `game_sessions`
- API endpoint `/api/migrate` для автоматических миграций
- CLI скрипты: `db:init`, `db:migrate`
- Компонент `<DatabaseStatus />` для отображения статуса БД
- Row Level Security (RLS) политики для всех таблиц
- Автоматическое создание профиля пользователя при регистрации (1000 монет, уровень 1)
- Предустановленные символы слот-машины (8 символов: от CHERRY до DIAMOND)
- Database views для статистики пользователей
- Enumerations для symbol_rarity и configuration_status

---

*Последнее обновление: 2025-11-16*
