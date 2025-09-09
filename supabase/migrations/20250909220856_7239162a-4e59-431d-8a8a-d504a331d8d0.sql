-- Create enrollments table for student-subject relationships
CREATE TABLE public.enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  subject_id UUID NOT NULL,
  academic_period TEXT NOT NULL,
  enrollment_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'activo' CHECK (status IN ('activo', 'retirado', 'completado')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID,
  UNIQUE(student_id, subject_id, academic_period)
);

-- Create subject assignments table for teacher-subject relationships
CREATE TABLE public.subject_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL,
  subject_id UUID NOT NULL,
  academic_period TEXT NOT NULL,
  assigned_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'activo' CHECK (status IN ('activo', 'inactivo')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID,
  UNIQUE(teacher_id, subject_id, academic_period)
);

-- Enable RLS on both tables
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subject_assignments ENABLE ROW LEVEL SECURITY;

-- RLS policies for enrollments
CREATE POLICY "Authenticated users can view enrollments" 
ON public.enrollments 
FOR SELECT 
USING (true);

CREATE POLICY "Coordinadores and admins can insert enrollments" 
ON public.enrollments 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'coordinador_academico'::app_role) OR has_role(auth.uid(), 'administrador'::app_role));

CREATE POLICY "Coordinadores and admins can update enrollments" 
ON public.enrollments 
FOR UPDATE 
USING (has_role(auth.uid(), 'coordinador_academico'::app_role) OR has_role(auth.uid(), 'administrador'::app_role));

CREATE POLICY "Coordinadores and admins can delete enrollments" 
ON public.enrollments 
FOR DELETE 
USING (has_role(auth.uid(), 'coordinador_academico'::app_role) OR has_role(auth.uid(), 'administrador'::app_role));

-- RLS policies for subject_assignments
CREATE POLICY "Authenticated users can view assignments" 
ON public.subject_assignments 
FOR SELECT 
USING (true);

CREATE POLICY "Coordinadores and admins can insert assignments" 
ON public.subject_assignments 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'coordinador_academico'::app_role) OR has_role(auth.uid(), 'administrador'::app_role));

CREATE POLICY "Coordinadores and admins can update assignments" 
ON public.subject_assignments 
FOR UPDATE 
USING (has_role(auth.uid(), 'coordinador_academico'::app_role) OR has_role(auth.uid(), 'administrador'::app_role));

CREATE POLICY "Coordinadores and admins can delete assignments" 
ON public.subject_assignments 
FOR DELETE 
USING (has_role(auth.uid(), 'coordinador_academico'::app_role) OR has_role(auth.uid(), 'administrador'::app_role));