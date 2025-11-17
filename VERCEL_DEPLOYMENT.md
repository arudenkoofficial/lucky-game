# Развертывание на Vercel / Vercel Deployment Guide

## Быстрый старт / Quick Start

### 1. Подключение проекта к Vercel / Connect Project to Vercel

#### Вариант A: Через веб-интерфейс / Option A: Via Web Interface

1. Перейдите на [vercel.com](https://vercel.com)
2. Нажмите "Add New Project"
3. Импортируйте ваш Git репозиторий
4. Vercel автоматически определит Next.js настройки

#### Вариант B: Через Vercel CLI / Option B: Via Vercel CLI

```bash
# Установите Vercel CLI / Install Vercel CLI
npm i -g vercel

# Войдите в аккаунт / Login to Vercel
vercel login

# Разверните проект / Deploy the project
vercel
```

### 2. Настройка переменных окружения / Environment Variables Setup

В настройках проекта Vercel добавьте следующие переменные:

**Settings → Environment Variables**

| Variable Name | Value | Where to Find |
|---------------|-------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `your-anon-key` | Supabase Dashboard → Settings → API → anon/public |

#### Добавление через CLI / Adding via CLI:

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

### 3. Настройка Supabase для работы с Vercel / Configure Supabase for Vercel

1. Откройте Supabase Dashboard → Authentication → URL Configuration
2. Добавьте ваш Vercel домен в "Site URL":
   - `https://your-project.vercel.app`
3. Добавьте в "Redirect URLs":
   - `https://your-project.vercel.app/auth/callback`
   - `https://your-project-*.vercel.app/auth/callback` (для preview deployments)

### 4. Разверните проект / Deploy

```bash
# Production deployment
vercel --prod

# Preview deployment
vercel
```

## Автоматическое развертывание / Automatic Deployments

Vercel автоматически деплоит:
- **Production**: при пуше в ветку `main` или `master`
- **Preview**: при создании Pull Request или пуше в другие ветки

### Настройка автодеплоя / Configure Auto-Deploy

1. Перейдите в **Settings → Git**
2. Настройте:
   - Production Branch: `main` (или ваша главная ветка)
   - Preview Branches: все ветки или выбранные

## Конфигурация / Configuration

### vercel.json

Файл `vercel.json` содержит основные настройки:

```json
{
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY": "@supabase-publishable-key"
  }
}
```

### Регионы / Regions

По умолчанию используется `iad1` (Washington, D.C., USA).

Другие доступные регионы:
- `sfo1` - San Francisco, USA
- `fra1` - Frankfurt, Germany
- `hnd1` - Tokyo, Japan
- `bom1` - Mumbai, India
- `sin1` - Singapore

Измените `regions` в `vercel.json` при необходимости.

## Проверка развертывания / Verify Deployment

После успешного деплоя:

1. ✅ Откройте URL проекта
2. ✅ Проверьте подключение к Supabase
3. ✅ Протестируйте аутентификацию (если используется)
4. ✅ Проверьте логи: `vercel logs <deployment-url>`

## Мониторинг и логи / Monitoring and Logs

### Просмотр логов / View Logs

```bash
# Real-time logs
vercel logs --follow

# Logs for specific deployment
vercel logs <deployment-url>
```

### Vercel Analytics

Включите аналитику в Settings → Analytics для мониторинга:
- Web Vitals
- Traffic
- Performance metrics

## Troubleshooting

### Проблема: Build fails

**Решение:**
```bash
# Проверьте локально / Test locally
npm run build

# Проверьте переменные окружения / Check environment variables
vercel env ls
```

### Проблема: Supabase connection errors

**Решение:**
1. Проверьте переменные `NEXT_PUBLIC_SUPABASE_URL` и `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
2. Убедитесь что Vercel домен добавлен в Supabase URL Configuration
3. Проверьте RLS policies в Supabase

### Проблема: CORS errors

**Решение:**
В Supabase Dashboard → Authentication → URL Configuration добавьте все Vercel URL'ы.

## Полезные команды / Useful Commands

```bash
# Список deployments
vercel ls

# Удалить deployment
vercel remove <deployment-url>

# Открыть dashboard проекта
vercel dashboard

# Посмотреть информацию о проекте
vercel inspect <deployment-url>

# Алиасы для production
vercel alias <deployment-url> <custom-domain>
```

## Кастомный домен / Custom Domain

1. **Settings → Domains**
2. Добавьте ваш домен
3. Настройте DNS записи согласно инструкциям Vercel
4. Обновите Supabase URL Configuration с новым доменом

## CI/CD Integration

### GitHub Actions пример / GitHub Actions Example

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## Полезные ссылки / Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Supabase + Vercel Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
- [Vercel CLI Reference](https://vercel.com/docs/cli)

## Поддержка / Support

- Vercel Support: https://vercel.com/support
- Supabase Support: https://supabase.com/support
