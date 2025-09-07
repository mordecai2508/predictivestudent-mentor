import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, User, GraduationCap, AlertTriangle, TrendingUp, Calendar, Phone, Mail, MapPin } from 'lucide-react';
import { Student } from '@/hooks/useStudents';

interface StudentDetailProps {
  studentId: string;
  onBack: () => void;
}

interface Prediction {
  id: string;
  risk_level: 'bajo' | 'medio' | 'alto' | 'critico';
  probability: number;
  factors_analyzed: any;
  prediction_date: string;
}

const StudentDetail: React.FC<StudentDetailProps> = ({ studentId, onBack }) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStudentData();
  }, [studentId]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      
      // Fetch student data
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('id', studentId)
        .single();

      if (studentError) {
        toast({
          variant: "destructive",
          title: "Error al cargar estudiante",
          description: studentError.message,
        });
        return;
      }

      setStudent(studentData);

      // Fetch latest prediction
      const { data: predictionData, error: predictionError } = await supabase
        .from('dropout_predictions')
        .select('*')
        .eq('student_id', studentId)
        .eq('is_active', true)
        .order('prediction_date', { ascending: false })
        .limit(1)
        .single();

      if (predictionError && predictionError.code !== 'PGRST116') {
        console.error('Error fetching prediction:', predictionError);
      } else if (predictionData) {
        setPrediction(predictionData);
      }

    } catch (error) {
      console.error('Error fetching student data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al cargar los datos del estudiante",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'bajo': return 'bg-green-500';
      case 'medio': return 'bg-yellow-500';
      case 'alto': return 'bg-orange-500';
      case 'critico': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskText = (level: string) => {
    switch (level) {
      case 'bajo': return 'Riesgo Bajo';
      case 'medio': return 'Riesgo Medio';
      case 'alto': return 'Riesgo Alto';
      case 'critico': return 'Riesgo Crítico';
      default: return level;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activo': return 'bg-green-500';
      case 'inactivo': return 'bg-yellow-500';
      case 'desertor': return 'bg-red-500';
      case 'graduado': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'activo': return 'Activo';
      case 'inactivo': return 'Inactivo';
      case 'desertor': return 'Desertor';
      case 'graduado': return 'Graduado';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Estudiante no encontrado</p>
        <Button onClick={onBack} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {student.first_name} {student.last_name}
          </h1>
          <p className="text-muted-foreground">Código: {student.student_code}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Información Personal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Estado:</span>
              <Badge className={`text-white ${getStatusColor(student.status)}`}>
                {getStatusText(student.status)}
              </Badge>
            </div>
            
            {student.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{student.email}</span>
              </div>
            )}
            
            {student.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{student.phone}</span>
              </div>
            )}
            
            {student.birth_date && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  {new Date(student.birth_date).toLocaleDateString()}
                </span>
              </div>
            )}
            
            {student.address && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{student.address}</span>
              </div>
            )}

            {student.gender && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Género:</span>
                <span className="text-sm capitalize">{student.gender}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Información Académica */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Información Académica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Programa:</span>
              <span className="text-sm font-medium">{student.program}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Semestre:</span>
              <span className="text-sm font-medium">{student.semester}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Fecha de Matrícula:</span>
              <span className="text-sm">
                {new Date(student.enrollment_date).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Predicción de Deserción */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Predicción de Deserción
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {prediction ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Nivel de Riesgo:</span>
                  <Badge className={`text-white ${getRiskColor(prediction.risk_level)}`}>
                    {getRiskText(prediction.risk_level)}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Probabilidad:</span>
                  <span className="text-sm font-medium">
                    {(prediction.probability * 100).toFixed(1)}%
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Fecha:</span>
                  <span className="text-sm">
                    {new Date(prediction.prediction_date).toLocaleDateString()}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <TrendingUp className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No hay predicciones disponibles
                </p>
                <Button size="sm" className="mt-2">
                  Generar Predicción
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Factores Socioeconómicos */}
      <Card>
        <CardHeader>
          <CardTitle>Factores Socioeconómicos</CardTitle>
          <CardDescription>
            Información que influye en el análisis de riesgo de deserción
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {student.family_income && (
              <div>
                <span className="text-sm text-muted-foreground">Ingresos Familiares</span>
                <p className="font-medium">
                  ${student.family_income.toLocaleString()} COP
                </p>
              </div>
            )}
            
            {student.parents_education_level && (
              <div>
                <span className="text-sm text-muted-foreground">Educación de Padres</span>
                <p className="font-medium capitalize">{student.parents_education_level}</p>
              </div>
            )}
            
            <div>
              <span className="text-sm text-muted-foreground">Horas de Trabajo</span>
              <p className="font-medium">{student.work_hours_per_week || 0} h/semana</p>
            </div>
            
            <div>
              <span className="text-sm text-muted-foreground">Beca</span>
              <p className="font-medium">{student.has_scholarship ? 'Sí' : 'No'}</p>
            </div>
            
            {student.transportation_type && (
              <div>
                <span className="text-sm text-muted-foreground">Transporte</span>
                <p className="font-medium capitalize">{student.transportation_type}</p>
              </div>
            )}
            
            {student.distance_to_university && (
              <div>
                <span className="text-sm text-muted-foreground">Distancia Universidad</span>
                <p className="font-medium">{student.distance_to_university} km</p>
              </div>
            )}
            
            {student.family_size && (
              <div>
                <span className="text-sm text-muted-foreground">Miembros Familia</span>
                <p className="font-medium">{student.family_size} personas</p>
              </div>
            )}
            
            <div>
              <span className="text-sm text-muted-foreground">Primera Generación</span>
              <p className="font-medium">{student.is_first_generation ? 'Sí' : 'No'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDetail;