import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useStudents } from '@/hooks/useStudents';
import { useAuth } from '@/contexts/AuthContext';
import { Upload, Search, Plus, FileText, Users, Eye } from 'lucide-react';
import StudentForm from './StudentForm';
import StudentImport from './StudentImport';
import StudentDetail from './StudentDetail';

const StudentsManager = () => {
  const { students, loading } = useStudents();
  const { userRole } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  const filteredStudents = students.filter(student =>
    student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.student_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.program.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  if (selectedStudent) {
    return (
      <StudentDetail 
        studentId={selectedStudent} 
        onBack={() => setSelectedStudent(null)} 
      />
    );
  }

  if (showForm) {
    return <StudentForm onClose={() => setShowForm(false)} />;
  }

  if (showImport) {
    return <StudentImport onClose={() => setShowImport(false)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Estudiantes</h1>
          <p className="text-muted-foreground">Administra la información de los estudiantes</p>
        </div>
        
        {userRole === 'coordinador_academico' && (
          <div className="flex gap-2">
            <Button onClick={() => setShowImport(true)} variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Importar CSV
            </Button>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Estudiante
            </Button>
          </div>
        )}
      </div>

      {/* Search and Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="md:col-span-2">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar estudiantes por nombre, código o programa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <div>
                <p className="text-2xl font-bold">{students.length}</p>
                <p className="text-xs text-muted-foreground">Total Estudiantes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{students.filter(s => s.status === 'activo').length}</p>
                <p className="text-xs text-muted-foreground">Estudiantes Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Estudiantes</CardTitle>
          <CardDescription>
            {filteredStudents.length} estudiantes encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No se encontraron estudiantes</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">
                        {student.first_name} {student.last_name}
                      </h3>
                      <Badge variant="outline" className={`text-white ${getStatusColor(student.status)}`}>
                        {getStatusText(student.status)}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <span>Código: {student.student_code}</span>
                      <span>Programa: {student.program}</span>
                      <span>Semestre: {student.semester}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedStudent(student.id)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Detalle
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentsManager;