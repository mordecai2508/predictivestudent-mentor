import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, BookOpen, Edit, Trash2 } from 'lucide-react';

interface Subject {
  id: string;
  code: string;
  name: string;
  program: string;
  semester: number;
  credits: number;
  created_at: string;
}

export const SubjectsManager = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    program: '',
    semester: 1,
    credits: 1,
  });
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('program', { ascending: true })
        .order('semester', { ascending: true });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error al cargar materias",
          description: error.message,
        });
        return;
      }

      setSubjects(data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast({
        variant: "destructive",
        title: "Error al cargar materias",
        description: "Ocurrió un error inesperado",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingSubject) {
        // Update existing subject
        const { error } = await supabase
          .from('subjects')
          .update({
            code: formData.code,
            name: formData.name,
            program: formData.program,
            semester: formData.semester,
            credits: formData.credits,
          })
          .eq('id', editingSubject.id);

        if (error) throw error;

        toast({
          title: "Materia actualizada",
          description: "La materia ha sido actualizada exitosamente",
        });
      } else {
        // Create new subject
        const { error } = await supabase
          .from('subjects')
          .insert([{
            code: formData.code,
            name: formData.name,
            program: formData.program,
            semester: formData.semester,
            credits: formData.credits,
          }]);

        if (error) throw error;

        toast({
          title: "Materia creada",
          description: "La materia ha sido creada exitosamente",
        });
      }

      setFormData({
        code: '',
        name: '',
        program: '',
        semester: 1,
        credits: 1,
      });
      setEditingSubject(null);
      setDialogOpen(false);
      fetchSubjects();
    } catch (error) {
      console.error('Error saving subject:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar la materia",
      });
    }
  };

  const handleEdit = (subject: Subject) => {
    setFormData({
      code: subject.code,
      name: subject.name,
      program: subject.program,
      semester: subject.semester,
      credits: subject.credits,
    });
    setEditingSubject(subject);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta materia?')) return;

    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Materia eliminada",
        description: "La materia ha sido eliminada exitosamente",
      });

      fetchSubjects();
    } catch (error) {
      console.error('Error deleting subject:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar la materia",
      });
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Materias</h2>
          <p className="text-muted-foreground">Administra las materias del programa académico</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Materia
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingSubject ? 'Editar Materia' : 'Nueva Materia'}
              </DialogTitle>
              <DialogDescription>
                {editingSubject ? 'Modifica los datos de la materia' : 'Crea una nueva materia para el programa'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Código</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="MAT101"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="credits">Créditos</Label>
                  <Input
                    id="credits"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.credits}
                    onChange={(e) => setFormData(prev => ({ ...prev, credits: parseInt(e.target.value) }))}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la Materia</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Matemáticas I"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="program">Programa</Label>
                <Input
                  id="program"
                  value={formData.program}
                  onChange={(e) => setFormData(prev => ({ ...prev, program: e.target.value }))}
                  placeholder="Ingeniería de Sistemas"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester">Semestre</Label>
                <Input
                  id="semester"
                  type="number"
                  min="1"
                  max="12"
                  value={formData.semester}
                  onChange={(e) => setFormData(prev => ({ ...prev, semester: parseInt(e.target.value) }))}
                  required
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingSubject ? 'Actualizar' : 'Crear'} Materia
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setDialogOpen(false);
                    setEditingSubject(null);
                    setFormData({
                      code: '',
                      name: '',
                      program: '',
                      semester: 1,
                      credits: 1,
                    });
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Materias Registradas
          </CardTitle>
          <CardDescription>
            Lista de todas las materias del programa académico
          </CardDescription>
        </CardHeader>
        <CardContent>
          {subjects.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No hay materias registradas</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Programa</TableHead>
                  <TableHead>Semestre</TableHead>
                  <TableHead>Créditos</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subjects.map((subject) => (
                  <TableRow key={subject.id}>
                    <TableCell className="font-medium">{subject.code}</TableCell>
                    <TableCell>{subject.name}</TableCell>
                    <TableCell>{subject.program}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {subject.semester}° Semestre
                      </Badge>
                    </TableCell>
                    <TableCell>{subject.credits}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(subject)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(subject.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};