-- 1. Create a function to perform vector similarity search for courses
CREATE OR REPLACE FUNCTION match_courses(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  domain_name text,
  title text,
  description text,
  prerequisites text[],
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    courses.id,
    courses.domain_name,
    courses.title,
    courses.description,
    courses.prerequisites,
    1 - (courses.embedding <=> query_embedding) AS similarity
  FROM courses
  WHERE 1 - (courses.embedding <=> query_embedding) > match_threshold
  ORDER BY courses.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- 2. Add an index for faster similarity search using HNSW (Hierarchical Navigable Small World)
CREATE INDEX IF NOT EXISTS courses_embedding_idx 
ON public.courses 
USING hnsw (embedding vector_cosine_ops);
