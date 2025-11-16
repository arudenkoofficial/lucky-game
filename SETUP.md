# Руководство по запуску проекта Lucky Game

## Первый запуск проекта

### Шаг 1: Клонирование и установка зависимостей

```bash
# Клонируйте репозиторий
git clone <repository-url>
cd lucky-game

# Установите зависимости
npm install
```

### Шаг 2: Создание проекта в Supabase

1. Перейдите на [https://supabase.com](https://supabase.com)
2. Войдите или создайте аккаунт
3. Нажмите **"New Project"**
4. Заполните форму:
   - **Name**: lucky-game (или любое имя)
   - **Database Password**: создайте надежный пароль и сохраните его
   - **Region**: выберите ближайший регион
5. Нажмите **"Create new project"**
6. Дождитесь завершения создания проекта (~2 минуты)

### Шаг 3: Получение API ключей

1. В dashboard Supabase откройте ваш проект
2. Перейдите в **Settings** → **API**
3. Найдите и скопируйте:
   - **Project URL** (например: `https://xxxxx.supabase.co`)
   - **anon public** ключ (или **publishable** key)

### Шаг 4: Настройка переменных окружения

```bash
# Создайте файл .env.local из примера
cp .env.example .env.local

# Откройте файл .env.local в редакторе
nano .env.local
# или
code .env.local
```

Заполните файл вашими данными:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-or-publishable-key
```

**ВАЖНО**: Замените `your-project-id` и `your-anon-or-publishable-key` на реальные значения из Supabase Dashboard.

### Шаг 5: Инициализация базы данных

Теперь нужно выполнить миграции базы данных. См. раздел **"Работа с миграциями"** ниже.

### Шаг 6: Запуск приложения

```bash
# Запустите development сервер
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

### Шаг 7: Проверка работоспособности

1. На главной странице должен отображаться зеленый индикатор **"Database Ready"**
2. Если индикатор красный или желтый - проверьте выполнение миграций (Шаг 5)
3. Попробуйте зарегистрироваться через **Sign Up**
4. Проверьте, что создался профиль пользователя с 1000 монет

---

## Работа с миграциями

### Что такое миграции?

Миграции - это SQL скрипты, которые создают таблицы и настраивают базу данных. В проекте используются следующие таблицы:

- `user_profiles` - профили пользователей (username, coins, level)
- `symbols` - символы слот-машины (вишня, семёрка, бриллиант и т.д.)
- `spin_configurations` - конфигурации желаемых результатов
- `spins` - результаты выполненных спинов
- `game_sessions` - игровые сессии
- `_migrations` - служебная таблица для отслеживания миграций

### Способ 1: Просмотр SQL через CLI (Рекомендуется)

Этот способ показывает все SQL команды, которые нужно выполнить:

```bash
npm run db:init
```

Вы увидите вывод SQL скриптов. Скопируйте весь вывод и:

1. Откройте [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql/new)
2. Вставьте скопированный SQL
3. Нажмите **RUN** или нажмите `Cmd/Ctrl + Enter`
4. Дождитесь выполнения (должно показать "Success")

**Важно:**
- Если у вас УЖЕ есть зарегистрированные пользователи, обязательно выполните миграцию `002_backfill_existing_users.sql` - она создаст профили для всех существующих пользователей.
- Рекомендуется выполнить `003_enable_rls_migrations.sql` для включения Row Level Security на таблице миграций (устраняет предупреждение безопасности).

### Способ 2: Ручное выполнение миграций

Если нужно больше контроля, выполните миграции вручную:

1. Откройте [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql/new)

2. **Первая миграция** - создание таблицы отслеживания:
   - Откройте файл `migrations/000_migrations_table.sql`
   - Скопируйте содержимое
   - Вставьте в SQL Editor
   - Нажмите **RUN**

3. **Вторая миграция** - основная схема игры:
   - Откройте файл `migrations/001_initial_schema.sql`
   - Скопируйте содержимое
   - Вставьте в SQL Editor
   - Нажмите **RUN**

4. **Третья миграция** (опционально - только если есть существующие пользователи):
   - Откройте файл `migrations/002_backfill_existing_users.sql`
   - Скопируйте содержимое
   - Вставьте в SQL Editor
   - Нажмите **RUN**

5. **Четвертая миграция** (рекомендуется для безопасности):
   - Откройте файл `migrations/003_enable_rls_migrations.sql`
   - Скопируйте содержимое
   - Вставьте в SQL Editor
   - Нажмите **RUN**
   - Это устранит предупреждение "Data is publicly accessible via API as RLS is disabled"

### Способ 3: Проверка статуса миграций

Чтобы проверить, какие миграции уже выполнены:

```bash
npm run db:migrate
```

Этот скрипт покажет:
- Статус подключения к Supabase
- Список доступных миграций
- Инструкции по выполнению

### Проверка результата

После выполнения миграций:

1. Откройте **Table Editor** в Supabase Dashboard
2. Вы должны увидеть таблицы: `user_profiles`, `symbols`, `spin_configurations`, `spins`, `game_sessions`, `_migrations`
3. В таблице `symbols` должно быть 8 предустановленных символов (CHERRY, LEMON, ORANGE, PLUM, BELL, STAR, SEVEN, DIAMOND)

### Устранение проблем

**"Missing environment variables"**
- Проверьте файл `.env.local`
- Убедитесь, что `NEXT_PUBLIC_SUPABASE_URL` и `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` заполнены
- Перезапустите `npm run dev`

**"Table already exists"**
- Это нормально! Миграции идемпотентны (используют `IF NOT EXISTS`)
- Можно выполнять повторно без проблем

**"Permission denied"**
- Проверьте, что вы вошли в правильный проект Supabase
- Убедитесь, что используете правильный `NEXT_PUBLIC_SUPABASE_URL`

**"Syntax error in SQL"**
- Убедитесь, что скопировали весь SQL полностью
- Проверьте, что не было добавлено лишних символов при копировании

---

## Создание новой миграции

Когда нужно добавить новые таблицы или изменить схему:

### Шаг 1: Создайте файл миграции

```bash
# Формат имени: XXX_description.sql
# Где XXX - следующий номер по порядку
touch migrations/002_add_new_feature.sql
```

### Шаг 2: Напишите SQL

```sql
-- migrations/002_add_new_feature.sql

-- Всегда используйте IF NOT EXISTS для идемпотентности
CREATE TABLE IF NOT EXISTS my_new_table (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Всегда включайте Row Level Security
ALTER TABLE my_new_table ENABLE ROW LEVEL SECURITY;

-- Создайте политики доступа
CREATE POLICY "Users can view own records" ON my_new_table
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own records" ON my_new_table
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### Шаг 3: Выполните миграцию

```bash
# Просмотрите SQL
npm run db:init

# Скопируйте и выполните в Supabase SQL Editor
```

### Best Practices для миграций

✅ **Делайте:**
- Используйте `IF NOT EXISTS` для идемпотентности
- Всегда включайте RLS (`ENABLE ROW LEVEL SECURITY`)
- Создавайте политики доступа для новых таблиц
- Документируйте SQL комментариями
- Тестируйте на dev базе перед production
- Используйте транзакции для связанных изменений

❌ **Не делайте:**
- Не изменяйте уже выполненные миграции
- Не удаляйте файлы миграций из папки `migrations/`
- Не выполняйте `DROP TABLE` без крайней необходимости
- Не храните service_role ключ в коде приложения

---

## Интеграция с Supabase Auth

### Как это работает

Проект полностью интегрирован с системой аутентификации Supabase:

1. **Связь с auth.users**
   - Таблица `user_profiles` связана с встроенной таблицей `auth.users` через внешний ключ
   - `id` в `user_profiles` = `id` в `auth.users`
   - При удалении пользователя из Auth, профиль удаляется автоматически (`ON DELETE CASCADE`)

2. **Автоматическое создание профиля**
   - При регистрации нового пользователя через Supabase Auth срабатывает триггер
   - Триггер `on_auth_user_created` автоматически создаёт запись в `user_profiles`
   - Новый пользователь получает: 1000 монет, уровень 1

3. **Row Level Security (RLS)**
   - Все политики доступа используют `auth.uid()` - ID текущего аутентифицированного пользователя
   - Пользователи видят только свои данные (спины, конфигурации, сессии)
   - Профили пользователей видны всем (для leaderboard), но редактировать можно только свой

### Существующие пользователи

**Важно:** Если у вас уже есть зарегистрированные пользователи в `auth.users`:

1. Триггер работает только для **новых** регистраций
2. Для существующих пользователей профили не создадутся автоматически
3. **Решение:** Выполните миграцию `002_backfill_existing_users.sql`

Эта миграция:
- Найдёт всех пользователей в `auth.users` без профиля
- Создаст для них профили с 1000 монет и уровнем 1
- Безопасна для повторного выполнения (использует `ON CONFLICT DO NOTHING`)

### Пример: Что происходит при регистрации

```
1. Пользователь заполняет форму Sign Up
   ↓
2. Supabase Auth создаёт запись в auth.users
   ↓
3. Триггер on_auth_user_created срабатывает
   ↓
4. Создаётся запись в user_profiles:
   - id: (тот же UUID из auth.users)
   - username: null (заполнится позже)
   - coins: 1000
   - level: 1
   ↓
5. Пользователь может начать играть
```

### Проверка интеграции

После выполнения миграций и регистрации тестового пользователя:

```sql
-- В Supabase SQL Editor выполните:
SELECT
  au.id,
  au.email,
  up.username,
  up.coins,
  up.level,
  up.created_at
FROM auth.users au
LEFT JOIN user_profiles up ON au.id = up.id;
```

Вы должны увидеть:
- Все пользователи из `auth.users`
- Для каждого есть соответствующий профиль в `user_profiles`
- У новых пользователей 1000 монет и level 1

---

## Архитектура базы данных

### Entity Relationships

```
User (auth.users)
  ├─ user_profiles (1:1) - профиль с coins, level
  ├─ spin_configurations (1:M) - желаемые комбинации
  ├─ spins (1:M) - результаты спинов
  └─ game_sessions (1:M) - игровые сессии

Symbol - символы слот-машины
  ├─ используется в spin_configurations.desired_combination
  └─ используется в spins.actual_combination

SpinConfiguration (1) ──> Spin (1)
GameSession (1) ──> Spins (M)
```

### Игровой процесс

1. **Регистрация**: Автоматически создается профиль с 1000 монет, уровень 1
2. **Создание конфигурации**: Игрок тратит монеты на создание желаемой комбинации символов
3. **Выполнение спина**: Система генерирует фактическую комбинацию
4. **Сравнение**: Проверяется совпадение с желаемой комбинацией
5. **Награда**: При совпадении игрок получает награду на основе ценности символов
6. **Обновление профиля**: Монеты и уровень обновляются
7. **Статистика**: Спины группируются в сессии для аналитики

---

## Дополнительные ресурсы

- **Документация по миграциям**: `migrations/README.md`
- **AI документация проекта**: `.claude/context.md`
- **Основной README**: `README.md`
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs

---

*Последнее обновление: 2025-11-16*
