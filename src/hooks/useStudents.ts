import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Student {
  id: string;
  student_code: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  gender?: string;
  address?: string;
  program: string;
  semester: number;
  enrollment_date: string;
  status: 'activo' | 'inactivo' | 'desertor' | 'graduado';
  family_income?: number;
  parents_education_level?: string;
  work_hours_per_week?: number;
  has_scholarship?: boolean;
  transportation_type?: string;
  distance_to_university?: number;
  family_size?: number;
  is_first_generation?: boolean;
  created_at: string;
  updated_at: string;
}

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error al cargar estudiantes",
          description: error.message,
        });
        return;
      }

      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        variant: "destructive",
        title: "Error al cargar estudiantes",
        description: "Ocurrió un error inesperado",
      });
    } finally {
      setLoading(false);
    }
  };

  const addStudent = async (student: Omit<Student, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .insert([student])
        .select()
        .single();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error al agregar estudiante",
          description: error.message,
        });
        return { error };
      }

      setStudents(prev => [data, ...prev]);
      toast({
        title: "Estudiante agregado",
        description: `${student.first_name} ${student.last_name} ha sido agregado exitosamente`,
      });

      return { data };
    } catch (error) {
      console.error('Error adding student:', error);
      return { error };
    }
  };

  const updateStudent = async (id: string, updates: Partial<Student>) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error al actualizar estudiante",
          description: error.message,
        });
        return { error };
      }

      setStudents(prev => prev.map(s => s.id === id ? data : s));
      toast({
        title: "Estudiante actualizado",
        description: "Los datos han sido actualizados exitosamente",
      });

      return { data };
    } catch (error) {
      console.error('Error updating student:', error);
      return { error };
    }
  };

  const deleteStudent = async (id: string) => {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error al eliminar estudiante",
          description: error.message,
        });
        return { error };
      }

      setStudents(prev => prev.filter(s => s.id !== id));
      toast({
        title: "Estudiante eliminado",
        description: "El estudiante ha sido eliminado exitosamente",
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting student:', error);
      return { error };
    }
  };

  const bulkImportStudents = async (studentsData: Omit<Student, 'id' | 'created_at' | 'updated_at'>[]) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .insert(studentsData)
        .select();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error en importación masiva",
          description: error.message,
        });
        return { error };
      }

      setStudents(prev => [...(data || []), ...prev]);
      toast({
        title: "Importación exitosa",
        description: `${data?.length || 0} estudiantes importados correctamente`,
      });

      return { data };
    } catch (error) {
      console.error('Error bulk importing students:', error);
      return { error };
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return {
    students,
    loading,
    fetchStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    bulkImportStudents,
  };
};