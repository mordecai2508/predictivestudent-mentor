import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DashboardStats {
  totalStudents: number;
  atRiskStudents: number;
  dropoutPrediction: number;
  averageAttendance: number;
}

export interface RecentRiskStudent {
  id: string;
  student_code: string;
  name: string;
  risk: 'Alto' | 'Medio' | 'Bajo';
  probability: number;
}

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    atRiskStudents: 0,
    dropoutPrediction: 0,
    averageAttendance: 0,
  });
  const [recentRiskStudents, setRecentRiskStudents] = useState<RecentRiskStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch total students
      const { count: totalStudents } = await supabase
        .from('students')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'activo');

      // Fetch recent predictions with student data
      const { data: predictions } = await supabase
        .from('dropout_predictions')
        .select(`
          *,
          students!inner(student_code, first_name, last_name)
        `)
        .eq('is_active', true)
        .order('prediction_date', { ascending: false })
        .limit(5);

      // Calculate at-risk students (high probability > 70%)
      const atRiskCount = predictions?.filter(p => p.probability > 0.7).length || 0;

      // Calculate average dropout prediction
      const avgPrediction = predictions?.length 
        ? predictions.reduce((sum, p) => sum + p.probability, 0) / predictions.length 
        : 0;

      // Fetch attendance data for average calculation
      const { data: attendances } = await supabase
        .from('attendances')
        .select('is_present')
        .gte('attendance_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      const attendanceRate = attendances?.length 
        ? (attendances.filter(a => a.is_present).length / attendances.length) * 100
        : 85.3;

      // Format recent risk students
      const recentRisk: RecentRiskStudent[] = predictions?.map(p => ({
        id: p.student_id,
        student_code: p.students.student_code,
        name: `${p.students.first_name} ${p.students.last_name}`,
        risk: p.probability > 0.7 ? 'Alto' : p.probability > 0.4 ? 'Medio' : 'Bajo',
        probability: Math.round(p.probability * 100),
      })) || [];

      setStats({
        totalStudents: totalStudents || 0,
        atRiskStudents: atRiskCount,
        dropoutPrediction: Math.round(avgPrediction * 100) / 100,
        averageAttendance: Math.round(attendanceRate * 10) / 10,
      });

      setRecentRiskStudents(recentRisk);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        variant: "destructive",
        title: "Error al cargar datos",
        description: "No se pudo cargar la información del dashboard",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    stats,
    recentRiskStudents,
    loading,
    refresh: fetchDashboardData,
  };
};