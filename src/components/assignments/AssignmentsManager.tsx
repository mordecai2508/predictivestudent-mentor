import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useSubjectAssignments } from '@/hooks/useSubjectAssignments';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Trash2, BookOpen } from 'lucide-react';

interface Teacher {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Subject {
  id: string;
  code: string;
  name: string;
  program: string;
}

export const AssignmentsManager = () => {
  const { assignments, loading, addAssignment, deleteAssignment } = useSubjectAssignments();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachersData, setTeachersData] = useState<Record<string, Teacher>>({});
  const [subjectsData, setSubjectsData] = useState<Record<string, Subject>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    teacher_id: '',
    subject_id: '',
    academic_period: '2024-1',
    assigned_date: new Date().toISOString().split('T')[0],
    status: 'activo',
  });

  const fetchTeachers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email')
        .order('first_name');

      if (error) throw error;
      setTeachers(data || []);

      // Create teachers lookup
      const teachersLookup: Record<string, Teacher> = {};
      data?.forEach(teacher => {
        teachersLookup[teacher.id] = teacher;
      });
      setTeachersData(teachersLookup);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('code');

      if (error) throw error;
      setSubjects(data || []);

      // Create subjects lookup
      const subjectsLookup: Record<string, Subject> = {};
      data?.forEach(subject => {
        subjectsLookup[subject.id] = subject;
      });
      setSubjectsData(subjectsLookup);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await addAssignment(formData);
    
    if (!result.error) {
      setIsDialogOpen(false);
      setFormData({
        teacher_id: '',
        subject_id: '',
        academic_period: '2024-1',
        assigned_date: new Date().toISOString().split('T')[0],
        status: 'activo',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta asignación?')) {
      await deleteAssignment(id);
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchSubjects();
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Asignación de Materias
              </CardTitle>
              <CardDescription>
                Administra las asignaciones de docentes a materias
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Asignación
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nueva Asignación</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="teacher">Docente</Label>
                    <Select value={formData.teacher_id} onValueChange={(value) => setFormData(prev => ({ ...prev, teacher_id: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un docente" />
                      </SelectTrigger>
                      <SelectContent>
                        {teachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.first_name} {teacher.last_name} ({teacher.email})
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
                        <SelectItem value="inactivo">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">Crear Asignación</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Cargando asignaciones...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Docente</TableHead>
                  <TableHead>Materia</TableHead>
                  <TableHead>Período</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Asignación</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.map((assignment) => {
                  const teacher = teachersData[assignment.teacher_id];
                  const subject = subjectsData[assignment.subject_id];
                  
                  return (
                    <TableRow key={assignment.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {teacher?.first_name} {teacher?.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {teacher?.email}
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
                      <TableCell>{assignment.academic_period}</TableCell>
                      <TableCell>
                        <Badge variant={assignment.status === 'activo' ? 'default' : 'outline'}>
                          {assignment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(assignment.assigned_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(assignment.id)}
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