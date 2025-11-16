-- ============================================================================
-- Enable RLS for _migrations table
-- ============================================================================
-- Безопасность: включаем Row Level Security для таблицы отслеживания миграций

-- Включаем RLS
ALTER TABLE _migrations ENABLE ROW LEVEL SECURITY;

-- Политика: любой может читать список выполненных миграций
-- (это публичная служебная информация, не содержит чувствительных данных)
CREATE POLICY IF NOT EXISTS "Migrations are publicly readable" ON _migrations
  FOR SELECT
  USING (true);

-- Политика: никто не может вставлять/обновлять/удалять через API
-- (это должно делаться только через SQL Editor или service role)
-- По умолчанию без политик INSERT/UPDATE/DELETE запрещены, так что дополнительных политик не нужно

-- Записываем выполнение миграции
INSERT INTO _migrations (name)
VALUES ('003_enable_rls_migrations')
ON CONFLICT (name) DO NOTHING;
