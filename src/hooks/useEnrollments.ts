import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Enrollment {
  id: string;
  student_id: string;
  subject_id: string;
  academic_period: string;
  enrollment_date: string;
  status: string;
  created_at: string;
  created_by?: string;
}

export const useEnrollments = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('enrollments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error al cargar inscripciones",
          description: error.message,
        });
        return;
      }

      setEnrollments(data || []);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    } finally {
      setLoading(false);
    }
  };

  const addEnrollment = async (enrollment: Omit<Enrollment, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .insert([enrollment])
        .select()
        .single();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error al agregar inscripción",
          description: error.message,
        });
        return { error };
      }

      setEnrollments(prev => [data, ...prev]);
      toast({
        title: "Inscripción agregada",
        description: "La inscripción ha sido agregada exitosamente",
      });

      return { data };
    } catch (error) {
      console.error('Error adding enrollment:', error);
      return { error };
    }
  };

  const deleteEnrollment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('enrollments')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error al eliminar inscripción",
          description: error.message,
        });
        return { error };
      }

      setEnrollments(prev => prev.filter(e => e.id !== id));
      toast({
        title: "Inscripción eliminada",
        description: "La inscripción ha sido eliminada exitosamente",
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting enrollment:', error);
      return { error };
    }
  };

  const getStudentsBySubject = async (subjectId: string, academicPeriod: string) => {
    try {
      // Get enrolled student IDs
      const { data: enrollmentData, error: enrollmentError } = await supabase
        .from('enrollments')
        .select('student_id')
        .eq('subject_id', subjectId)
        .eq('academic_period', academicPeriod)
        .eq('status', 'activo');

      if (enrollmentError) throw enrollmentError;

      const studentIds = enrollmentData?.map(e => e.student_id) || [];

      if (studentIds.length === 0) return [];

      // Get student details
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('id, student_code, first_name, last_name, program')
        .in('id', studentIds);

      if (studentError) throw studentError;

      return studentData || [];
    } catch (error) {
      console.error('Error fetching students by subject:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  return {
    enrollments,
    loading,
    fetchEnrollments,
    addEnrollment,
    deleteEnrollment,
    getStudentsBySubject,
  };
};