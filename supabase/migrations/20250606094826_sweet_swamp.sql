/*
  # Add foreign key constraints for nuclei_vulnerabilities

  1. Foreign Key Constraints
    - Add foreign key constraint from `assigned_to` to `profiles(id)`
    - Add foreign key constraint from `assigned_by` to `profiles(id)`
  
  2. Security
    - These constraints ensure data integrity
    - Prevent orphaned references to non-existent users
*/

-- Add foreign key constraint for assigned_to column
ALTER TABLE public.nuclei_vulnerabilities
ADD CONSTRAINT fk_nuclei_vulnerabilities_assigned_to
FOREIGN KEY (assigned_to) REFERENCES public.profiles(id);

-- Add foreign key constraint for assigned_by column  
ALTER TABLE public.nuclei_vulnerabilities
ADD CONSTRAINT fk_nuclei_vulnerabilities_assigned_by
FOREIGN KEY (assigned_by) REFERENCES public.profiles(id);