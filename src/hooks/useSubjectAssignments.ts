import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SubjectAssignment {
  id: string;
  teacher_id: string;
  subject_id: string;
  academic_period: string;
  assigned_date: string;
  status: string;
  created_at: string;
  created_by?: string;
}

export const useSubjectAssignments = () => {
  const [assignments, setAssignments] = useState<SubjectAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('subject_assignments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error al cargar asignaciones",
          description: error.message,
        });
        return;
      }

      setAssignments(data || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const addAssignment = async (assignment: Omit<SubjectAssignment, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('subject_assignments')
        .insert([assignment])
        .select()
        .single();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error al agregar asignación",
          description: error.message,
        });
        return { error };
      }

      setAssignments(prev => [data, ...prev]);
      toast({
        title: "Asignación agregada",
        description: "La asignación ha sido agregada exitosamente",
      });

      return { data };
    } catch (error) {
      console.error('Error adding assignment:', error);
      return { error };
    }
  };

  const deleteAssignment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('subject_assignments')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          variant: "destructive",
          title: "Error al eliminar asignación",
          description: error.message,
        });
        return { error };
      }

      setAssignments(prev => prev.filter(a => a.id !== id));
      toast({
        title: "Asignación eliminada",
        description: "La asignación ha sido eliminada exitosamente",
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting assignment:', error);
      return { error };
    }
  };

  const getSubjectsByTeacher = async (teacherId: string, academicPeriod: string) => {
    try {
      // Get assigned subject IDs
      const { data: assignmentData, error: assignmentError } = await supabase
        .from('subject_assignments')
        .select('subject_id')
        .eq('teacher_id', teacherId)
        .eq('academic_period', academicPeriod)
        .eq('status', 'activo');

      if (assignmentError) throw assignmentError;

      const subjectIds = assignmentData?.map(a => a.subject_id) || [];

      if (subjectIds.length === 0) return [];

      // Get subject details
      const { data: subjectData, error: subjectError } = await supabase
        .from('subjects')
        .select('id, code, name, program')
        .in('id', subjectIds);

      if (subjectError) throw subjectError;

      return subjectData || [];
    } catch (error) {
      console.error('Error fetching subjects by teacher:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  return {
    assignments,
    loading,
    fetchAssignments,
    addAssignment,
    deleteAssignment,
    getSubjectsByTeacher,
  };
};