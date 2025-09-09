import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, Users, CheckCircle } from 'lucide-react';

interface Student {
  id: string;
  student_code: string;
  first_name: string;
  last_name: string;
  program: string;
}

interface Subject {
  id: string;
  code: string;
  name: string;
  program: string;
}

interface AttendanceRecord {
  student_id: string;
  is_present: boolean;
  is_late: boolean;
  observations: string;
}

export const AttendanceManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [academicPeriod, setAcademicPeriod] = useState('2024-1');
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, AttendanceRecord>>({});

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('code');

      if (error) throw error;
      setSubjects(data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchStudentsBySubject = async (subjectId: string) => {
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

      if (studentIds.length === 0) {
        setStudents([]);
        setAttendanceRecords({});
        return;
      }

      // Get student details
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('id, student_code, first_name, last_name, program')
        .in('id', studentIds);

      if (studentError) throw studentError;

      const studentsData = studentData || [];
      setStudents(studentsData);

      // Initialize attendance records
      const initialRecords: Record<string, AttendanceRecord> = {};
      studentsData.forEach(student => {
        initialRecords[student.id] = {
          student_id: student.id,
          is_present: false,
          is_late: false,
          observations: '',
        };
      });
      setAttendanceRecords(initialRecords);
    } catch (error) {
      console.error('Error fetching students by subject:', error);
    }
  };

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubject(subjectId);
    if (subjectId) {
      fetchStudentsBySubject(subjectId);
    }
  };

  const updateAttendanceRecord = (studentId: string, field: keyof AttendanceRecord, value: any) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      },
    }));
  };

  const handleSubmitAttendance = async () => {
    if (!selectedSubject || !user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Debes seleccionar una materia",
      });
      return;
    }

    const recordsToSubmit = Object.values(attendanceRecords).map(record => ({
      ...record,
      subject_id: selectedSubject,
      attendance_date: attendanceDate,
      academic_period: academicPeriod,
      created_by: user.id,
    }));

    setLoading(true);
    try {
      const { error } = await supabase
        .from('attendances')
        .insert(recordsToSubmit);

      if (error) throw error;

      toast({
        title: "Asistencia registrada",
        description: `Se registró la asistencia de ${recordsToSubmit.length} estudiantes`,
      });

      // Reset form
      setSelectedSubject('');
      setStudents([]);
      setAttendanceRecords({});
    } catch (error) {
      console.error('Error submitting attendance:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo registrar la asistencia",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAllPresent = () => {
    const updatedRecords = { ...attendanceRecords };
    Object.keys(updatedRecords).forEach(studentId => {
      updatedRecords[studentId].is_present = true;
    });
    setAttendanceRecords(updatedRecords);
  };

  const markAllAbsent = () => {
    const updatedRecords = { ...attendanceRecords };
    Object.keys(updatedRecords).forEach(studentId => {
      updatedRecords[studentId].is_present = false;
      updatedRecords[studentId].is_late = false;
    });
    setAttendanceRecords(updatedRecords);
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const presentCount = Object.values(attendanceRecords).filter(r => r.is_present).length;
  const absentCount = students.length - presentCount;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Registro de Asistencia
          </CardTitle>
          <CardDescription>
            Registra la asistencia de los estudiantes por materia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Materia</Label>
              <Select value={selectedSubject} onValueChange={handleSubjectChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una materia" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.code} - {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="period">Período Académico</Label>
              <Input
                id="period"
                value={academicPeriod}
                onChange={(e) => setAcademicPeriod(e.target.value)}
                placeholder="2024-1"
              />
            </div>
          </div>

          {students.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="text-green-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Presentes: {presentCount}
                  </Badge>
                  <Badge variant="outline" className="text-red-600">
                    Ausentes: {absentCount}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={markAllPresent}>
                    Marcar Todos Presentes
                  </Button>
                  <Button size="sm" variant="outline" onClick={markAllAbsent}>
                    Marcar Todos Ausentes
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Lista de Estudiantes
                </h3>
                
                <div className="space-y-3">
                  {students.map((student) => {
                    const record = attendanceRecords[student.id];
                    return (
                      <div key={student.id} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">
                            {student.first_name} {student.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Código: {student.student_code}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`present-${student.id}`}
                              checked={record?.is_present || false}
                              onCheckedChange={(checked) => 
                                updateAttendanceRecord(student.id, 'is_present', checked)
                              }
                            />
                            <Label htmlFor={`present-${student.id}`}>Presente</Label>
                          </div>
                          
                          {record?.is_present && (
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`late-${student.id}`}
                                checked={record?.is_late || false}
                                onCheckedChange={(checked) => 
                                  updateAttendanceRecord(student.id, 'is_late', checked)
                                }
                              />
                              <Label htmlFor={`late-${student.id}`}>Llegada Tardía</Label>
                            </div>
                          )}
                          
                          <div className="w-48">
                            <Textarea
                              placeholder="Observaciones"
                              value={record?.observations || ''}
                              onChange={(e) => 
                                updateAttendanceRecord(student.id, 'observations', e.target.value)
                              }
                              className="h-16"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSubmitAttendance} disabled={loading}>
                  {loading ? 'Guardando...' : 'Guardar Asistencia'}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};