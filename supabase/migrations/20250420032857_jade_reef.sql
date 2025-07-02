-- Cria o bucket de armazenamento se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'avatars'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('avatars', 'avatars', true);
  END IF;
END $$;

-- Cria política para permitir que usuários autenticados façam upload de arquivos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can upload their own avatar'
  ) THEN
    CREATE POLICY "Users can upload their own avatar"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
      bucket_id = 'avatars' AND
      POSITION('avatars/' in name) = 1 AND
      POSITION(auth.uid()::text in SUBSTRING(name from 9)) = 1
    );
  END IF;
END $$;

-- Cria política para permitir que usuários autenticados atualizem seus próprios arquivos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own avatar'
  ) THEN
    CREATE POLICY "Users can update their own avatar"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (
      bucket_id = 'avatars' AND
      POSITION('avatars/' in name) = 1 AND
      POSITION(auth.uid()::text in SUBSTRING(name from 9)) = 1
    );
  END IF;
END $$;

-- Cria política para permitir que usuários autenticados excluam seus próprios arquivos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own avatar'
  ) THEN
    CREATE POLICY "Users can delete their own avatar"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
      bucket_id = 'avatars' AND
      POSITION('avatars/' in name) = 1 AND
      POSITION(auth.uid()::text in SUBSTRING(name from 9)) = 1
    );
  END IF;
END $$;

-- Cria política para permitir acesso público de leitura a todos os arquivos
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Public read access'
  ) THEN
    CREATE POLICY "Public read access"
    ON storage.objects
    FOR SELECT
    TO public
    USING (bucket_id = 'avatars');
  END IF;
END $$;