import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useStudents } from '@/hooks/useStudents';
import { ArrowLeft, Save, User } from 'lucide-react';

interface StudentFormProps {
  onClose: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ onClose }) => {
  const { addStudent } = useStudents();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    student_code: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    birth_date: '',
    gender: '',
    address: '',
    program: '',
    semester: 1,
    enrollment_date: '',
    status: 'activo' as const,
    family_income: '',
    parents_education_level: '',
    work_hours_per_week: 0,
    has_scholarship: false,
    transportation_type: '',
    distance_to_university: '',
    family_size: '',
    is_first_generation: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const studentData = {
      ...formData,
      family_income: formData.family_income ? parseFloat(formData.family_income) : undefined,
      distance_to_university: formData.distance_to_university ? parseFloat(formData.distance_to_university) : undefined,
      family_size: formData.family_size ? parseInt(formData.family_size) : undefined,
    };

    const result = await addStudent(studentData);
    
    if (!result.error) {
      onClose();
    }
    
    setLoading(false);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onClose}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Nuevo Estudiante</h1>
          <p className="text-muted-foreground">Registra un nuevo estudiante en el sistema</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Personal */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="student_code">Código Estudiantil *</Label>
              <Input
                id="student_code"
                value={formData.student_code}
                onChange={(e) => handleInputChange('student_code', e.target.value)}
                placeholder="Ej: 2024001"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                  <SelectItem value="desertor">Desertor</SelectItem>
                  <SelectItem value="graduado">Graduado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="first_name">Nombres *</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Apellidos *</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birth_date">Fecha de Nacimiento</Label>
              <Input
                id="birth_date"
                type="date"
                value={formData.birth_date}
                onChange={(e) => handleInputChange('birth_date', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Género</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="femenino">Femenino</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Dirección</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Información Académica */}
        <Card>
          <CardHeader>
            <CardTitle>Información Académica</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="program">Programa Académico *</Label>
              <Input
                id="program"
                value={formData.program}
                onChange={(e) => handleInputChange('program', e.target.value)}
                placeholder="Ej: Ingeniería de Sistemas"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="semester">Semestre *</Label>
              <Input
                id="semester"
                type="number"
                min="1"
                max="12"
                value={formData.semester}
                onChange={(e) => handleInputChange('semester', parseInt(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="enrollment_date">Fecha de Matrícula *</Label>
              <Input
                id="enrollment_date"
                type="date"
                value={formData.enrollment_date}
                onChange={(e) => handleInputChange('enrollment_date', e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Factores Socioeconómicos */}
        <Card>
          <CardHeader>
            <CardTitle>Factores Socioeconómicos</CardTitle>
            <CardDescription>
              Esta información ayuda a generar predicciones más precisas
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="family_income">Ingresos Familiares (COP)</Label>
              <Input
                id="family_income"
                type="number"
                value={formData.family_income}
                onChange={(e) => handleInputChange('family_income', e.target.value)}
                placeholder="Ej: 2000000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="parents_education_level">Nivel Educativo de los Padres</Label>
              <Select value={formData.parents_education_level} onValueChange={(value) => handleInputChange('parents_education_level', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primaria">Primaria</SelectItem>
                  <SelectItem value="secundaria">Secundaria</SelectItem>
                  <SelectItem value="tecnico">Técnico</SelectItem>
                  <SelectItem value="universitario">Universitario</SelectItem>
                  <SelectItem value="posgrado">Posgrado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="work_hours_per_week">Horas de Trabajo por Semana</Label>
              <Input
                id="work_hours_per_week"
                type="number"
                min="0"
                max="168"
                value={formData.work_hours_per_week}
                onChange={(e) => handleInputChange('work_hours_per_week', parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="transportation_type">Tipo de Transporte</Label>
              <Select value={formData.transportation_type} onValueChange={(value) => handleInputChange('transportation_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="publico">Transporte Público</SelectItem>
                  <SelectItem value="privado">Vehículo Privado</SelectItem>
                  <SelectItem value="caminando">Caminando</SelectItem>
                  <SelectItem value="bicicleta">Bicicleta</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="distance_to_university">Distancia a la Universidad (km)</Label>
              <Input
                id="distance_to_university"
                type="number"
                step="0.1"
                value={formData.distance_to_university}
                onChange={(e) => handleInputChange('distance_to_university', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="family_size">Número de Miembros de la Familia</Label>
              <Input
                id="family_size"
                type="number"
                min="1"
                value={formData.family_size}
                onChange={(e) => handleInputChange('family_size', e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="has_scholarship"
                checked={formData.has_scholarship}
                onCheckedChange={(checked) => handleInputChange('has_scholarship', checked)}
              />
              <Label htmlFor="has_scholarship">Tiene Beca</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_first_generation"
                checked={formData.is_first_generation}
                onCheckedChange={(checked) => handleInputChange('is_first_generation', checked)}
              />
              <Label htmlFor="is_first_generation">Primera Generación Universitaria</Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Guardando...' : 'Guardar Estudiante'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;