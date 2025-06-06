/*
  # Add foreign key constraints for nuclei_vulnerabilities table

  1. Foreign Key Constraints
    - Add foreign key constraint for `assigned_to` column referencing `profiles.id`
    - Add foreign key constraint for `assigned_by` column referencing `profiles.id`
    - Set appropriate ON DELETE and ON UPDATE actions

  2. Security
    - No changes to RLS policies needed as this only adds referential integrity

  This migration ensures that Supabase can properly join nuclei_vulnerabilities with profiles
  for user assignment queries.
*/

-- Add foreign key constraint for assigned_to column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'nuclei_vulnerabilities_assigned_to_fkey'
    AND table_name = 'nuclei_vulnerabilities'
  ) THEN
    ALTER TABLE nuclei_vulnerabilities 
    ADD CONSTRAINT nuclei_vulnerabilities_assigned_to_fkey 
    FOREIGN KEY (assigned_to) 
    REFERENCES profiles(id) 
    ON DELETE SET NULL 
    ON UPDATE CASCADE;
  END IF;
END $$;

-- Add foreign key constraint for assigned_by column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'nuclei_vulnerabilities_assigned_by_fkey'
    AND table_name = 'nuclei_vulnerabilities'
  ) THEN
    ALTER TABLE nuclei_vulnerabilities 
    ADD CONSTRAINT nuclei_vulnerabilities_assigned_by_fkey 
    FOREIGN KEY (assigned_by) 
    REFERENCES profiles(id) 
    ON DELETE SET NULL 
    ON UPDATE CASCADE;
  END IF;
END $$;