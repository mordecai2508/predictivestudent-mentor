import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { GraduationCap, Plus, FileText } from 'lucide-react';

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

interface Grade {
  id: string;
  student_id: string;
  subject_id: string;
  grade: number;
  grade_type: string;
  grade_date: string;
  observations?: string;
  students: {
    student_code: string;
    first_name: string;
    last_name: string;
  };
}

export const GradesManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  
  const [formData, setFormData] = useState({
    grade: '',
    gradeType: '',
    gradeDate: new Date().toISOString().split('T')[0],
    academicPeriod: '2024-1',
    observations: '',
  });

  const gradeTypes = [
    'Parcial 1',
    'Parcial 2',
    'Parcial 3',
    'Final',
    'Quiz',
    'Taller',
    'Proyecto',
    'Exposición',
    'Participación'
  ];

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

  const fetchStudents = async (program?: string) => {
    try {
      let query = supabase
        .from('students')
        .select('id, student_code, first_name, last_name, program')
        .eq('status', 'activo')
        .order('student_code');

      if (program) {
        query = query.eq('program', program);
      }

      const { data, error } = await query;

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchGrades = async () => {
    if (!selectedSubject) return;

    try {
      const { data, error } = await supabase
        .from('grades')
        .select(`
          *,
          students!inner(student_code, first_name, last_name)
        `)
        .eq('subject_id', selectedSubject)
        .order('grade_date', { ascending: false });

      if (error) throw error;
      setGrades(data || []);
    } catch (error) {
      console.error('Error fetching grades:', error);
    }
  };

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubject(subjectId);
    const subject = subjects.find(s => s.id === subjectId);
    if (subject) {
      fetchStudents(subject.program);
      fetchGrades();
    }
  };

  const handleSubmitGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSubject || !selectedStudent || !user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Debes completar todos los campos obligatorios",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('grades')
        .insert([{
          student_id: selectedStudent,
          subject_id: selectedSubject,
          grade: parseFloat(formData.grade),
          grade_type: formData.gradeType,
          grade_date: formData.gradeDate,
          academic_period: formData.academicPeriod,
          observations: formData.observations,
          created_by: user.id,
        }]);

      if (error) throw error;

      toast({
        title: "Calificación registrada",
        description: "La calificación ha sido registrada exitosamente",
      });

      // Reset form
      setFormData({
        grade: '',
        gradeType: '',
        gradeDate: new Date().toISOString().split('T')[0],
        academicPeriod: '2024-1',
        observations: '',
      });
      setSelectedStudent('');
      fetchGrades();
    } catch (error) {
      console.error('Error submitting grade:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo registrar la calificación",
      });
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 4.0) return 'text-green-600';
    if (grade >= 3.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeBadgeVariant = (grade: number) => {
    if (grade >= 4.0) return 'default';
    if (grade >= 3.0) return 'secondary';
    return 'destructive';
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      fetchGrades();
    }
  }, [selectedSubject]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Registro de Calificaciones
          </CardTitle>
          <CardDescription>
            Registra y administra las calificaciones de los estudiantes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitGrade} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="student">Estudiante</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un estudiante" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.student_code} - {student.first_name} {student.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="grade">Calificación (0.0 - 5.0)</Label>
                <Input
                  id="grade"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.grade}
                  onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
                  placeholder="4.5"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gradeType">Tipo de Evaluación</Label>
                <Select value={formData.gradeType} onValueChange={(value) => setFormData(prev => ({ ...prev, gradeType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {gradeTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gradeDate">Fecha</Label>
                <Input
                  id="gradeDate"
                  type="date"
                  value={formData.gradeDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, gradeDate: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observations">Observaciones</Label>
              <Textarea
                id="observations"
                value={formData.observations}
                onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
                placeholder="Observaciones adicionales sobre la evaluación"
              />
            </div>

            <Button type="submit" disabled={loading}>
              <Plus className="w-4 h-4 mr-2" />
              {loading ? 'Registrando...' : 'Registrar Calificación'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {selectedSubject && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Calificaciones Registradas
            </CardTitle>
            <CardDescription>
              Historial de calificaciones para la materia seleccionada
            </CardDescription>
          </CardHeader>
          <CardContent>
            {grades.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No hay calificaciones registradas</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estudiante</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Calificación</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Observaciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grades.map((grade) => (
                    <TableRow key={grade.id}>
                      <TableCell className="font-medium">
                        {grade.students.first_name} {grade.students.last_name}
                      </TableCell>
                      <TableCell>{grade.students.student_code}</TableCell>
                      <TableCell>
                        <Badge variant={getGradeBadgeVariant(grade.grade)} className={getGradeColor(grade.grade)}>
                          {grade.grade.toFixed(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{grade.grade_type}</TableCell>
                      <TableCell>{new Date(grade.grade_date).toLocaleDateString()}</TableCell>
                      <TableCell>{grade.observations || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};