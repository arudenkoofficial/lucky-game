# PostgreSQL Migration Guidelines

Руководство по написанию идемпотентных SQL-миграций для PostgreSQL/Supabase.

## Оглавление

- [Общие принципы](#общие-принципы)
- [Идемпотентность](#идемпотентность)
- [Таблицы](#таблицы)
- [Типы данных и ENUM](#типы-данных-и-enum)
- [Политики Row Level Security (RLS)](#политики-row-level-security-rls)
- [Индексы](#индексы)
- [Триггеры](#триггеры)
- [Функции](#функции)
- [Представления (Views)](#представления-views)
- [Частые ошибки](#частые-ошибки)
- [Примеры](#примеры)

## Общие принципы

### 1. Все миграции должны быть идемпотентными

Идемпотентная миграция может быть запущена несколько раз без ошибок и с одинаковым результатом.

### 2. Используйте транзакции для сложных операций

```sql
BEGIN;
  -- Ваши SQL-команды
COMMIT;
```

### 3. Добавляйте комментарии

Поясняйте назначение каждой секции миграции.

### 4. Следите за порядком создания объектов

- Сначала типы (ENUMs)
- Затем таблицы
- Потом индексы
- Затем функции и триггеры
- В конце политики RLS

## Идемпотентность

### Команды с встроенной поддержкой IF NOT EXISTS

PostgreSQL поддерживает `IF NOT EXISTS` для:

```sql
-- ✅ Поддерживается
CREATE TABLE IF NOT EXISTS table_name (...);
CREATE INDEX IF NOT EXISTS index_name ON table_name(...);
CREATE SCHEMA IF NOT EXISTS schema_name;
CREATE EXTENSION IF NOT EXISTS extension_name;
```

### Команды БЕЗ поддержки IF NOT EXISTS

PostgreSQL **НЕ** поддерживает `IF NOT EXISTS` для:

```sql
-- ❌ ОШИБКА: синтаксическая ошибка
CREATE POLICY IF NOT EXISTS policy_name ON table_name ...;
CREATE TRIGGER IF NOT EXISTS trigger_name ...;
CREATE TYPE IF NOT EXISTS enum_name AS ENUM (...);
```

## Таблицы

### Создание таблиц

✅ **Правильно:**

```sql
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username varchar(50) UNIQUE,
  coins integer DEFAULT 1000,
  created_at timestamptz DEFAULT now()
);
```

### Изменение таблиц

Для добавления колонок используйте условную логику:

```sql
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles'
    AND column_name = 'new_column'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN new_column varchar(100);
  END IF;
END $$;
```

## Типы данных и ENUM

### Создание ENUM

❌ **Неправильно:**

```sql
CREATE TYPE symbol_rarity AS ENUM ('COMMON', 'RARE', 'EPIC');
```

✅ **Правильно (идемпотентно):**

```sql
DO $$ BEGIN
  CREATE TYPE symbol_rarity AS ENUM ('COMMON', 'RARE', 'EPIC', 'LEGENDARY');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
```

### Добавление значения в существующий ENUM

```sql
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumtypid = 'symbol_rarity'::regtype
    AND enumlabel = 'MYTHIC'
  ) THEN
    ALTER TYPE symbol_rarity ADD VALUE 'MYTHIC';
  END IF;
END $$;
```

## Политики Row Level Security (RLS)

### ❌ НЕПРАВИЛЬНО: IF NOT EXISTS не работает для политик

```sql
-- ❌ ОШИБКА: syntax error at or near "NOT"
CREATE POLICY IF NOT EXISTS "Users can view own data"
  ON table_name FOR SELECT
  USING (auth.uid() = user_id);
```

### ✅ ПРАВИЛЬНО: Используйте DO блоки с обработкой исключений

```sql
-- ✅ Идемпотентное создание политики
DO $$ BEGIN
  CREATE POLICY "Users can view own data"
    ON table_name
    FOR SELECT
    USING (auth.uid() = user_id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
```

### Полный пример с RLS

```sql
-- 1. Включить RLS (идемпотентно)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 2. Создать политику SELECT
DO $$ BEGIN
  CREATE POLICY "Public profiles are viewable"
    ON user_profiles
    FOR SELECT
    USING (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 3. Создать политику UPDATE
DO $$ BEGIN
  CREATE POLICY "Users can update own profile"
    ON user_profiles
    FOR UPDATE
    USING (auth.uid() = id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 4. Создать политику INSERT
DO $$ BEGIN
  CREATE POLICY "Users can insert own profile"
    ON user_profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 5. Создать политику DELETE
DO $$ BEGIN
  CREATE POLICY "Users can delete own profile"
    ON user_profiles
    FOR DELETE
    USING (auth.uid() = id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
```

### Удаление и пересоздание политики

Если нужно изменить существующую политику:

```sql
DO $$ BEGIN
  -- Удалить старую политику (если существует)
  DROP POLICY IF EXISTS "Old policy name" ON table_name;

  -- Создать новую политику
  CREATE POLICY "New policy name"
    ON table_name
    FOR SELECT
    USING (new_condition);
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;
```

## Индексы

### Создание индексов

✅ **Правильно (имеет IF NOT EXISTS):**

```sql
CREATE INDEX IF NOT EXISTS idx_spins_user_id
  ON spins(user_id);

CREATE INDEX IF NOT EXISTS idx_spins_executed_at
  ON spins(executed_at DESC);

-- Частичный индекс
CREATE INDEX IF NOT EXISTS idx_active_configurations
  ON spin_configurations(user_id)
  WHERE status = 'ACTIVE';

-- Составной индекс
CREATE INDEX IF NOT EXISTS idx_user_date
  ON spins(user_id, executed_at DESC);
```

## Триггеры

### ❌ НЕПРАВИЛЬНО: IF NOT EXISTS не работает для триггеров

```sql
-- ❌ ОШИБКА
CREATE TRIGGER IF NOT EXISTS on_auth_user_created ...
```

### ✅ ПРАВИЛЬНО: Проверка существования в DO блоке

```sql
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;
```

### Альтернатива: DROP + CREATE

```sql
-- Удалить, если существует, и создать заново
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

## Функции

### Создание/обновление функций

Используйте `CREATE OR REPLACE` (идемпотентно):

```sql
-- ✅ Идемпотентно - можно запускать несколько раз
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, coins, level)
  VALUES (NEW.id, 1000, 1)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Удаление функций

```sql
DROP FUNCTION IF EXISTS function_name(arg_types);
```

## Представления (Views)

### Создание представлений

Используйте `CREATE OR REPLACE` (идемпотентно):

```sql
-- ✅ Идемпотентно
CREATE OR REPLACE VIEW user_stats_view AS
SELECT
  up.id,
  up.username,
  COUNT(s.id) as total_spins,
  SUM(s.reward) as total_rewards
FROM user_profiles up
LEFT JOIN spins s ON up.id = s.user_id
GROUP BY up.id, up.username;
```

## Частые ошибки

### 1. Использование IF NOT EXISTS для политик

```sql
-- ❌ ОШИБКА
CREATE POLICY IF NOT EXISTS "policy_name" ON table_name ...;

-- ✅ ПРАВИЛЬНО
DO $$ BEGIN
  CREATE POLICY "policy_name" ON table_name ...;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
```

### 2. Использование IF NOT EXISTS для триггеров

```sql
-- ❌ ОШИБКА
CREATE TRIGGER IF NOT EXISTS trigger_name ...;

-- ✅ ПРАВИЛЬНО
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_name'
  ) THEN
    CREATE TRIGGER trigger_name ...;
  END IF;
END $$;
```

### 3. Использование IF NOT EXISTS для ENUM

```sql
-- ❌ ОШИБКА
CREATE TYPE status AS ENUM IF NOT EXISTS ('ACTIVE', 'INACTIVE');

-- ✅ ПРАВИЛЬНО
DO $$ BEGIN
  CREATE TYPE status AS ENUM ('ACTIVE', 'INACTIVE');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
```

### 4. Забыли ON CONFLICT для INSERT

```sql
-- ❌ Не идемпотентно
INSERT INTO symbols (code, display_name, rarity, base_value)
VALUES ('CHERRY', 'Вишня', 'COMMON', 10);

-- ✅ Идемпотентно
INSERT INTO symbols (code, display_name, rarity, base_value)
VALUES ('CHERRY', 'Вишня', 'COMMON', 10)
ON CONFLICT (code) DO NOTHING;

-- ✅ Или с обновлением
INSERT INTO symbols (code, display_name, rarity, base_value)
VALUES ('CHERRY', 'Вишня', 'COMMON', 10)
ON CONFLICT (code) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  rarity = EXCLUDED.rarity,
  base_value = EXCLUDED.base_value;
```

## Примеры

### Полная идемпотентная миграция

```sql
-- ============================================================================
-- Пример идемпотентной миграции
-- ============================================================================

-- 1. Создание ENUM
DO $$ BEGIN
  CREATE TYPE user_status AS ENUM ('ACTIVE', 'SUSPENDED', 'BANNED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 2. Создание таблицы
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email varchar(255) UNIQUE NOT NULL,
  status user_status DEFAULT 'ACTIVE',
  created_at timestamptz DEFAULT now()
);

-- 3. Создание индекса
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- 4. Включение RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 5. Создание политик
DO $$ BEGIN
  CREATE POLICY "Users can view all"
    ON users FOR SELECT
    USING (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update own"
    ON users FOR UPDATE
    USING (auth.uid() = id);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 6. Создание функции
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Создание триггера
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'set_updated_at'
  ) THEN
    CREATE TRIGGER set_updated_at
      BEFORE UPDATE ON users
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

-- 8. Вставка начальных данных
INSERT INTO users (email, status)
VALUES
  ('admin@example.com', 'ACTIVE'),
  ('user@example.com', 'ACTIVE')
ON CONFLICT (email) DO NOTHING;
```

## Проверка корректности синтаксиса

Перед запуском миграции в production:

1. Тестируйте на локальной БД
2. Запускайте миграцию дважды, чтобы убедиться в идемпотентности
3. Проверяйте, что никакие объекты не дублируются
4. Используйте `EXPLAIN` для проверки производительности запросов

## Полезные запросы для отладки

### Проверка существования политики

```sql
SELECT * FROM pg_policies
WHERE tablename = 'your_table_name';
```

### Проверка существования триггера

```sql
SELECT * FROM pg_trigger
WHERE tgname = 'your_trigger_name';
```

### Проверка существования индекса

```sql
SELECT * FROM pg_indexes
WHERE tablename = 'your_table_name';
```

### Проверка существования типа ENUM

```sql
SELECT * FROM pg_type
WHERE typname = 'your_enum_name';
```

### Просмотр значений ENUM

```sql
SELECT enumlabel FROM pg_enum
WHERE enumtypid = 'your_enum_name'::regtype;
```

## Дополнительные ресурсы

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL DO Statement](https://www.postgresql.org/docs/current/sql-do.html)
- [PostgreSQL Exception Handling](https://www.postgresql.org/docs/current/plpgsql-control-structures.html#PLPGSQL-ERROR-TRAPPING)

## Контрольный список для миграций

- [ ] Миграция идемпотентна (можно запустить несколько раз)
- [ ] Используется правильный синтаксис для каждого типа объекта
- [ ] Политики RLS обернуты в DO блоки с обработкой исключений
- [ ] Триггеры проверяются на существование перед созданием
- [ ] ENUM типы создаются с обработкой исключений
- [ ] INSERT использует ON CONFLICT для идемпотентности
- [ ] Функции используют CREATE OR REPLACE
- [ ] Views используют CREATE OR REPLACE
- [ ] Добавлены комментарии к сложным секциям
- [ ] Миграция протестирована на dev окружении
- [ ] Миграция запущена дважды для проверки идемпотентности
