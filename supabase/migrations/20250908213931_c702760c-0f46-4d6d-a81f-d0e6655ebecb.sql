-- Add administrator role to the enum
ALTER TYPE app_role ADD VALUE 'administrador';

-- Update RLS policies to include administrator role for all tables

-- Students table - administrators can do everything
DROP POLICY IF EXISTS "Only coordinadores can insert students" ON public.students;
DROP POLICY IF EXISTS "Only coordinadores can update students" ON public.students;
DROP POLICY IF EXISTS "Only coordinadores can delete students" ON public.students;

CREATE POLICY "Coordinadores and admins can insert students" 
ON public.students 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'coordinador_academico'::app_role) OR has_role(auth.uid(), 'administrador'::app_role));

CREATE POLICY "Coordinadores and admins can update students" 
ON public.students 
FOR UPDATE 
USING (has_role(auth.uid(), 'coordinador_academico'::app_role) OR has_role(auth.uid(), 'administrador'::app_role));

CREATE POLICY "Coordinadores and admins can delete students" 
ON public.students 
FOR DELETE 
USING (has_role(auth.uid(), 'coordinador_academico'::app_role) OR has_role(auth.uid(), 'administrador'::app_role));

-- Subjects table - administrators can do everything
DROP POLICY IF EXISTS "Only coordinadores can insert subjects" ON public.subjects;
DROP POLICY IF EXISTS "Only coordinadores can update subjects" ON public.subjects;
DROP POLICY IF EXISTS "Only coordinadores can delete subjects" ON public.subjects;

CREATE POLICY "Coordinadores and admins can insert subjects" 
ON public.subjects 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'coordinador_academico'::app_role) OR has_role(auth.uid(), 'administrador'::app_role));

CREATE POLICY "Coordinadores and admins can update subjects" 
ON public.subjects 
FOR UPDATE 
USING (has_role(auth.uid(), 'coordinador_academico'::app_role) OR has_role(auth.uid(), 'administrador'::app_role));

CREATE POLICY "Coordinadores and admins can delete subjects" 
ON public.subjects 
FOR DELETE 
USING (has_role(auth.uid(), 'coordinador_academico'::app_role) OR has_role(auth.uid(), 'administrador'::app_role));

-- User roles table - administrators can manage roles
DROP POLICY IF EXISTS "Only coordinadores can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only coordinadores can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only coordinadores can delete roles" ON public.user_roles;
DROP POLICY IF EXISTS "Coordinadores can view all roles" ON public.user_roles;

CREATE POLICY "Coordinadores and admins can insert roles" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'coordinador_academico'::app_role) OR has_role(auth.uid(), 'administrador'::app_role));

CREATE POLICY "Coordinadores and admins can update roles" 
ON public.user_roles 
FOR UPDATE 
USING (has_role(auth.uid(), 'coordinador_academico'::app_role) OR has_role(auth.uid(), 'administrador'::app_role));

CREATE POLICY "Coordinadores and admins can delete roles" 
ON public.user_roles 
FOR DELETE 
USING (has_role(auth.uid(), 'coordinador_academico'::app_role) OR has_role(auth.uid(), 'administrador'::app_role));

CREATE POLICY "Coordinadores and admins can view all roles" 
ON public.user_roles 
FOR SELECT 
USING (has_role(auth.uid(), 'coordinador_academico'::app_role) OR has_role(auth.uid(), 'administrador'::app_role));

-- Similar updates for other tables
-- Attendances
DROP POLICY IF EXISTS "Docentes and coordinadores can insert attendances" ON public.attendances;
CREATE POLICY "Users can insert attendances" 
ON public.attendances 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'docente'::app_role) OR has_role(auth.uid(), 'coordinador_academico'::app_role) OR has_role(auth.uid(), 'administrador'::app_role));

DROP POLICY IF EXISTS "Only coordinadores can delete attendances" ON public.attendances;
CREATE POLICY "Coordinadores and admins can delete attendances" 
ON public.attendances 
FOR DELETE 
USING (has_role(auth.uid(), 'coordinador_academico'::app_role) OR has_role(auth.uid(), 'administrador'::app_role));

-- Grades
DROP POLICY IF EXISTS "Docentes and coordinadores can insert grades" ON public.grades;
CREATE POLICY "Users can insert grades" 
ON public.grades 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'docente'::app_role) OR has_role(auth.uid(), 'coordinador_academico'::app_role) OR has_role(auth.uid(), 'administrador'::app_role));

-- Predictions
DROP POLICY IF EXISTS "Only coordinadores can insert predictions" ON public.dropout_predictions;
DROP POLICY IF EXISTS "Only coordinadores can update predictions" ON public.dropout_predictions;
DROP POLICY IF EXISTS "Only coordinadores can delete predictions" ON public.dropout_predictions;

CREATE POLICY "Coordinadores and admins can insert predictions" 
ON public.dropout_predictions 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'coordinador_academico'::app_role) OR has_role(auth.uid(), 'administrador'::app_role));

CREATE POLICY "Coordinadores and admins can update predictions" 
ON public.dropout_predictions 
FOR UPDATE 
USING (has_role(auth.uid(), 'coordinador_academico'::app_role) OR has_role(auth.uid(), 'administrador'::app_role));

CREATE POLICY "Coordinadores and admins can delete predictions" 
ON public.dropout_predictions 
FOR DELETE 
USING (has_role(auth.uid(), 'coordinador_academico'::app_role) OR has_role(auth.uid(), 'administrador'::app_role));

-- Recommendations
DROP POLICY IF EXISTS "Only coordinadores can insert recommendations" ON public.recommendations;
DROP POLICY IF EXISTS "Only coordinadores can delete recommendations" ON public.recommendations;

CREATE POLICY "Coordinadores and admins can insert recommendations" 
ON public.recommendations 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'coordinador_academico'::app_role) OR has_role(auth.uid(), 'administrador'::app_role));

CREATE POLICY "Coordinadores and admins can delete recommendations" 
ON public.recommendations 
FOR DELETE 
USING (has_role(auth.uid(), 'coordinador_academico'::app_role) OR has_role(auth.uid(), 'administrador'::app_role));