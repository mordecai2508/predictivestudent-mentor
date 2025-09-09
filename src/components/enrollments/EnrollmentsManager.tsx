import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useEnrollments } from '@/hooks/useEnrollments';
import { useStudents } from '@/hooks/useStudents';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Trash2, Users } from 'lucide-react';

interface Subject {
  id: string;
  code: string;
  name: string;
  program: string;
}

interface Student {
  id: string;
  student_code: string;
  first_name: string;
  last_name: string;
}

interface SubjectInfo {
  id: string;
  code: string;
  name: string;
}

export const EnrollmentsManager = () => {
  const { enrollments, loading, addEnrollment, deleteEnrollment } = useEnrollments();
  const { students } = useStudents();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [studentsData, setStudentsData] = useState<Record<string, Student>>({});
  const [subjectsData, setSubjectsData] = useState<Record<string, SubjectInfo>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    student_id: '',
    subject_id: '',
    academic_period: '2024-1',
    enrollment_date: new Date().toISOString().split('T')[0],
    status: 'activo',
  });

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('code');

      if (error) throw error;
      setSubjects(data || []);

      // Create subjects lookup
      const subjectsLookup: Record<string, SubjectInfo> = {};
      data?.forEach(subject => {
        subjectsLookup[subject.id] = {
          id: subject.id,
          code: subject.code,
          name: subject.name,
        };
      });
      setSubjectsData(subjectsLookup);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const createStudentsLookup = () => {
    const studentsLookup: Record<string, Student> = {};
    students.forEach(student => {
      studentsLookup[student.id] = {
        id: student.id,
        student_code: student.student_code,
        first_name: student.first_name,
        last_name: student.last_name,
      };
    });
    setStudentsData(studentsLookup);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await addEnrollment(formData);
    
    if (!result.error) {
      setIsDialogOpen(false);
      setFormData({
        student_id: '',
        subject_id: '',
        academic_period: '2024-1',
        enrollment_date: new Date().toISOString().split('T')[0],
        status: 'activo',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta inscripción?')) {
      await deleteEnrollment(id);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    createStudentsLookup();
  }, [students]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Gestión de Inscripciones
              </CardTitle>
              <CardDescription>
                Administra las inscripciones de estudiantes a materias
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Inscripción
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nueva Inscripción</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="student">Estudiante</Label>
                    <Select value={formData.student_id} onValueChange={(value) => setFormData(prev => ({ ...prev, student_id: value }))}>
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Materia</Label>
                    <Select value={formData.subject_id} onValueChange={(value) => setFormData(prev => ({ ...prev, subject_id: value }))}>
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
                    <Label htmlFor="period">Período Académico</Label>
                    <Input
                      id="period"
                      value={formData.academic_period}
                      onChange={(e) => setFormData(prev => ({ ...prev, academic_period: e.target.value }))}
                      placeholder="2024-1"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Estado</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="activo">Activo</SelectItem>
                        <SelectItem value="retirado">Retirado</SelectItem>
                        <SelectItem value="completado">Completado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">Crear Inscripción</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Cargando inscripciones...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estudiante</TableHead>
                  <TableHead>Materia</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Inscripción</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {enrollments.map((enrollment) => {
                  const student = studentsData[enrollment.student_id];
                  const subject = subjectsData[enrollment.subject_id];
                  
                  return (
                    <TableRow key={enrollment.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {student?.first_name} {student?.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {student?.student_code}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{subject?.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {subject?.code}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{enrollment.academic_period}</TableCell>
                      <TableCell>
                        <Badge variant={
                          enrollment.status === 'activo' ? 'default' :
                          enrollment.status === 'completado' ? 'secondary' : 'outline'
                        }>
                          {enrollment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(enrollment.enrollment_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(enrollment.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};