# shadcn/ui с Feature-Sliced Design

## Обзор

Этот проект использует [shadcn/ui](https://ui.shadcn.com/) вместе с архитектурой [Feature-Sliced Design (FSD)](https://feature-sliced.design/). Все UI компоненты находятся в слое `shared` в соответствии с принципами FSD.

## Структура проекта

```
src/
├── shared/
│   ├── ui/              # UI компоненты shadcn/ui
│   │   ├── button/
│   │   ├── card/
│   │   ├── input/
│   │   ├── label/
│   │   ├── checkbox/
│   │   ├── badge/
│   │   ├── dropdown-menu/
│   │   └── index.ts     # Экспорты всех UI компонентов
│   ├── lib/             # Утилиты
│   │   └── utils.ts     # cn() и другие хелперы
│   └── hooks/           # Переиспользуемые хуки
├── features/            # Бизнес-фичи
├── widgets/             # Комплексные UI блоки
└── entities/            # Бизнес-сущности
```

## Конфигурация

### components.json

Конфигурация shadcn/ui находится в корне проекта:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/src/shared/ui",
    "utils": "@/src/shared/lib/utils",
    "ui": "@/src/shared/ui",
    "lib": "@/src/shared/lib",
    "hooks": "@/src/shared/hooks"
  },
  "iconLibrary": "lucide"
}
```

### tsconfig.json

Пути импорта настроены для FSD:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@/shared/*": ["./src/shared/*"],
      "@/features/*": ["./src/features/*"],
      "@/widgets/*": ["./src/widgets/*"],
      "@/entities/*": ["./src/entities/*"]
    }
  }
}
```

## Использование

### Добавление новых компонентов

Для добавления компонентов shadcn/ui используйте CLI:

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
```

Компоненты автоматически будут добавлены в `src/shared/ui/`.

### Импорт компонентов

#### В слое shared

```tsx
// Прямой импорт (внутри shared)
import { Button } from "./ui/button";
```

#### В features, widgets, entities

```tsx
// Через алиас (из других слоев)
import { Button, Card, Input } from "@/shared/ui";
```

#### С использованием утилит

```tsx
import { Button } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";

export function MyComponent() {
  return (
    <Button className={cn("custom-class", "another-class")}>
      Click me
    </Button>
  );
}
```

## Принципы FSD при работе с UI компонентами

### 1. UI компоненты в shared

Все базовые UI компоненты shadcn/ui размещаются в `src/shared/ui/`. Это переиспользуемые компоненты без бизнес-логики.

```
src/shared/ui/
├── button/
│   ├── button.tsx
│   └── index.ts
└── index.ts  # Экспортирует все компоненты
```

### 2. Композиция в features

Бизнес-логика и композиция компонентов выполняется в слое `features`:

```tsx
// src/features/auth/login-form/login-form.tsx
import { Button, Input, Label } from "@/shared/ui";

export function LoginForm() {
  return (
    <form>
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" />
      <Button type="submit">Войти</Button>
    </form>
  );
}
```

### 3. Сложные блоки в widgets

Комплексные UI блоки, объединяющие несколько features:

```tsx
// src/widgets/auth-modal/auth-modal.tsx
import { Card } from "@/shared/ui";
import { LoginForm } from "@/features/auth/login-form";
import { SignUpForm } from "@/features/auth/sign-up-form";

export function AuthModal() {
  return (
    <Card>
      <LoginForm />
      <SignUpForm />
    </Card>
  );
}
```

## Стилизация

### Tailwind CSS

Проект использует Tailwind CSS с CSS переменными для темизации:

```tsx
<Button className="bg-primary text-primary-foreground">
  Primary Button
</Button>
```

### Темная тема

Поддержка темной темы реализована через `next-themes`:

```tsx
import { ThemeSwitcher } from "@/features/theme/theme-switcher";

export function Header() {
  return (
    <header>
      <ThemeSwitcher />
    </header>
  );
}
```

## Доступные компоненты

Текущий список установленных компонентов:

- `button` - Кнопки различных вариантов
- `card` - Карточки для группировки контента
- `input` - Поля ввода
- `label` - Лейблы для форм
- `checkbox` - Чекбоксы
- `badge` - Бейджи для меток
- `dropdown-menu` - Выпадающие меню

## Добавление кастомных компонентов

При создании кастомных компонентов следуйте структуре shadcn/ui:

```tsx
// src/shared/ui/custom-button/custom-button.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const customButtonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "default-styles",
        custom: "custom-styles",
      },
    },
  }
);

export interface CustomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof customButtonVariants> {}

const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <button
        className={cn(customButtonVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
CustomButton.displayName = "CustomButton";

export { CustomButton, customButtonVariants };
```

## Полезные команды

```bash
# Добавить компонент
npx shadcn@latest add [component-name]

# Добавить несколько компонентов
npx shadcn@latest add button card input label

# Обновить все компоненты
npx shadcn@latest update

# Посмотреть доступные компоненты
npx shadcn@latest add
```

## Ресурсы

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
