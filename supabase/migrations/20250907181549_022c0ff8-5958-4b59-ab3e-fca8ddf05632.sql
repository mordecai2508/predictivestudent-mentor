-- Crear enum para roles de usuario
CREATE TYPE public.app_role AS ENUM ('coordinador_academico', 'docente');

-- Crear enum para estado de riesgo de deserción
CREATE TYPE public.risk_level AS ENUM ('bajo', 'medio', 'alto', 'critico');

-- Crear enum para estado del estudiante
CREATE TYPE public.student_status AS ENUM ('activo', 'inactivo', 'desertor', 'graduado');

-- Tabla de perfiles de usuario
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de roles de usuario
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- Tabla de estudiantes
CREATE TABLE public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_code TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    birth_date DATE,
    gender TEXT,
    address TEXT,
    program TEXT NOT NULL,
    semester INTEGER NOT NULL CHECK (semester > 0),
    enrollment_date DATE NOT NULL,
    status student_status DEFAULT 'activo',
    -- Factores socioeconómicos
    family_income DECIMAL(10,2),
    parents_education_level TEXT,
    work_hours_per_week INTEGER DEFAULT 0,
    has_scholarship BOOLEAN DEFAULT FALSE,
    transportation_type TEXT,
    distance_to_university DECIMAL(5,2),
    family_size INTEGER,
    is_first_generation BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES public.profiles(id)
);

-- Tabla de materias/asignaturas
CREATE TABLE public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    credits INTEGER NOT NULL CHECK (credits > 0),
    semester INTEGER NOT NULL CHECK (semester > 0),
    program TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES public.profiles(id)
);

-- Tabla de calificaciones
CREATE TABLE public.grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
    grade DECIMAL(3,2) NOT NULL CHECK (grade >= 0 AND grade <= 5),
    grade_type TEXT NOT NULL, -- 'parcial1', 'parcial2', 'final', etc.
    academic_period TEXT NOT NULL, -- '2024-1', '2024-2', etc.
    grade_date DATE NOT NULL,
    observations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES public.profiles(id) NOT NULL
);

-- Tabla de asistencias
CREATE TABLE public.attendances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
    attendance_date DATE NOT NULL,
    is_present BOOLEAN NOT NULL,
    is_late BOOLEAN DEFAULT FALSE,
    academic_period TEXT NOT NULL,
    observations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES public.profiles(id) NOT NULL,
    UNIQUE(student_id, subject_id, attendance_date)
);

-- Tabla de predicciones de deserción
CREATE TABLE public.dropout_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    risk_level risk_level NOT NULL,
    probability DECIMAL(5,4) NOT NULL CHECK (probability >= 0 AND probability <= 1),
    factors_analyzed JSONB NOT NULL,
    prediction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    model_version TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de recomendaciones
CREATE TABLE public.recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    prediction_id UUID REFERENCES public.dropout_predictions(id) ON DELETE CASCADE,
    recommendation_type TEXT NOT NULL, -- 'academica', 'psicosocial', 'economica', etc.
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    priority INTEGER NOT NULL CHECK (priority >= 1 AND priority <= 5),
    status TEXT DEFAULT 'pendiente', -- 'pendiente', 'en_proceso', 'completada'
    assigned_to UUID REFERENCES public.profiles(id),
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_students_updated_at
    BEFORE UPDATE ON public.students
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_recommendations_updated_at
    BEFORE UPDATE ON public.recommendations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Función para crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, first_name, last_name, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        NEW.email
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Función de seguridad para verificar roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
        AND role = _role
    )
$$;

-- Función para obtener el rol del usuario actual
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT role
    FROM public.user_roles
    WHERE user_id = auth.uid()
    LIMIT 1
$$;

-- Habilitar RLS en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dropout_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Políticas RLS para user_roles
CREATE POLICY "Users can view their own roles"
    ON public.user_roles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Coordinadores can view all roles"
    ON public.user_roles FOR SELECT
    USING (public.has_role(auth.uid(), 'coordinador_academico'));

CREATE POLICY "Only coordinadores can insert roles"
    ON public.user_roles FOR INSERT
    WITH CHECK (public.has_role(auth.uid(), 'coordinador_academico'));

CREATE POLICY "Only coordinadores can update roles"
    ON public.user_roles FOR UPDATE
    USING (public.has_role(auth.uid(), 'coordinador_academico'));

CREATE POLICY "Only coordinadores can delete roles"
    ON public.user_roles FOR DELETE
    USING (public.has_role(auth.uid(), 'coordinador_academico'));

-- Políticas RLS para students
CREATE POLICY "Authenticated users can view students"
    ON public.students FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Only coordinadores can insert students"
    ON public.students FOR INSERT
    WITH CHECK (public.has_role(auth.uid(), 'coordinador_academico'));

CREATE POLICY "Only coordinadores can update students"
    ON public.students FOR UPDATE
    USING (public.has_role(auth.uid(), 'coordinador_academico'));

CREATE POLICY "Only coordinadores can delete students"
    ON public.students FOR DELETE
    USING (public.has_role(auth.uid(), 'coordinador_academico'));

-- Políticas RLS para subjects
CREATE POLICY "Authenticated users can view subjects"
    ON public.subjects FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Only coordinadores can insert subjects"
    ON public.subjects FOR INSERT
    WITH CHECK (public.has_role(auth.uid(), 'coordinador_academico'));

CREATE POLICY "Only coordinadores can update subjects"
    ON public.subjects FOR UPDATE
    USING (public.has_role(auth.uid(), 'coordinador_academico'));

CREATE POLICY "Only coordinadores can delete subjects"
    ON public.subjects FOR DELETE
    USING (public.has_role(auth.uid(), 'coordinador_academico'));

-- Políticas RLS para grades
CREATE POLICY "Authenticated users can view grades"
    ON public.grades FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Docentes and coordinadores can insert grades"
    ON public.grades FOR INSERT
    WITH CHECK (
        public.has_role(auth.uid(), 'docente') OR 
        public.has_role(auth.uid(), 'coordinador_academico')
    );

CREATE POLICY "Users can update grades they created"
    ON public.grades FOR UPDATE
    USING (
        created_by = auth.uid() OR 
        public.has_role(auth.uid(), 'coordinador_academico')
    );

-- Políticas RLS para attendances
CREATE POLICY "Authenticated users can view attendances"
    ON public.attendances FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Docentes and coordinadores can insert attendances"
    ON public.attendances FOR INSERT
    WITH CHECK (
        public.has_role(auth.uid(), 'docente') OR 
        public.has_role(auth.uid(), 'coordinador_academico')
    );

CREATE POLICY "Users can update attendances they created"
    ON public.attendances FOR UPDATE
    USING (
        created_by = auth.uid() OR 
        public.has_role(auth.uid(), 'coordinador_academico')
    );

CREATE POLICY "Only coordinadores can delete attendances"
    ON public.attendances FOR DELETE
    USING (public.has_role(auth.uid(), 'coordinador_academico'));

-- Políticas RLS para dropout_predictions
CREATE POLICY "Authenticated users can view predictions"
    ON public.dropout_predictions FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Only coordinadores can insert predictions"
    ON public.dropout_predictions FOR INSERT
    WITH CHECK (public.has_role(auth.uid(), 'coordinador_academico'));

CREATE POLICY "Only coordinadores can update predictions"
    ON public.dropout_predictions FOR UPDATE
    USING (public.has_role(auth.uid(), 'coordinador_academico'));

CREATE POLICY "Only coordinadores can delete predictions"
    ON public.dropout_predictions FOR DELETE
    USING (public.has_role(auth.uid(), 'coordinador_academico'));

-- Políticas RLS para recommendations
CREATE POLICY "Authenticated users can view recommendations"
    ON public.recommendations FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update assigned recommendations"
    ON public.recommendations FOR UPDATE
    USING (
        assigned_to = auth.uid() OR 
        public.has_role(auth.uid(), 'coordinador_academico')
    );

CREATE POLICY "Only coordinadores can insert recommendations"
    ON public.recommendations FOR INSERT
    WITH CHECK (public.has_role(auth.uid(), 'coordinador_academico'));

CREATE POLICY "Only coordinadores can delete recommendations"
    ON public.recommendations FOR DELETE
    USING (public.has_role(auth.uid(), 'coordinador_academico'));

-- Crear índices para mejorar performance
CREATE INDEX idx_students_student_code ON public.students(student_code);
CREATE INDEX idx_students_program ON public.students(program);
CREATE INDEX idx_students_status ON public.students(status);
CREATE INDEX idx_grades_student_id ON public.grades(student_id);
CREATE INDEX idx_grades_subject_id ON public.grades(subject_id);
CREATE INDEX idx_grades_academic_period ON public.grades(academic_period);
CREATE INDEX idx_attendances_student_id ON public.attendances(student_id);
CREATE INDEX idx_attendances_subject_id ON public.attendances(subject_id);
CREATE INDEX idx_attendances_date ON public.attendances(attendance_date);
CREATE INDEX idx_predictions_student_id ON public.dropout_predictions(student_id);
CREATE INDEX idx_predictions_active ON public.dropout_predictions(is_active);
CREATE INDEX idx_recommendations_student_id ON public.recommendations(student_id);
CREATE INDEX idx_recommendations_status ON public.recommendations(status);