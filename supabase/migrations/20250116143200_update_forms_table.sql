-- Update forms table to use JSONB for questions and settings
ALTER TABLE forms 
  ALTER COLUMN questions TYPE JSONB[] USING ARRAY[questions]::JSONB[],
  ALTER COLUMN settings TYPE JSONB USING settings::JSONB;

-- Add default values
ALTER TABLE forms 
  ALTER COLUMN questions SET DEFAULT '[]'::JSONB[],
  ALTER COLUMN settings SET DEFAULT '{}'::JSONB;

-- Add validation check for questions array
ALTER TABLE forms 
  ADD CONSTRAINT questions_is_array 
  CHECK (jsonb_typeof(questions) = 'array');

-- Create or replace function to validate question structure
CREATE OR REPLACE FUNCTION validate_question() RETURNS trigger AS $$
BEGIN
  IF NOT (
    NEW.questions IS NULL OR 
    (
      jsonb_typeof(NEW.questions) = 'array' AND
      (
        SELECT bool_and(
          jsonb_typeof(elem) = 'object' AND
          elem ? 'id' AND
          elem ? 'type' AND
          elem ? 'title'
        )
        FROM jsonb_array_elements(NEW.questions) elem
      )
    )
  ) THEN
    RAISE EXCEPTION 'Invalid question structure';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for question validation
DROP TRIGGER IF EXISTS validate_question_trigger ON forms;
CREATE TRIGGER validate_question_trigger
  BEFORE INSERT OR UPDATE ON forms
  FOR EACH ROW
  EXECUTE FUNCTION validate_question();
