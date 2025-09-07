import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStudents } from '@/hooks/useStudents';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Upload, FileText, Download } from 'lucide-react';

interface StudentImportProps {
  onClose: () => void;
}

const StudentImport: React.FC<StudentImportProps> = ({ onClose }) => {
  const { bulkImportStudents } = useStudents();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const csvTemplate = `student_code,first_name,last_name,email,phone,birth_date,gender,address,program,semester,enrollment_date,status,family_income,parents_education_level,work_hours_per_week,has_scholarship,transportation_type,distance_to_university,family_size,is_first_generation
2024001,Juan,Pérez,juan.perez@email.com,3001234567,1999-05-15,masculino,"Calle 123 #45-67",Ingeniería de Sistemas,3,2024-01-15,activo,2000000,universitario,20,false,publico,15.5,4,false
2024002,María,García,maria.garcia@email.com,3007654321,2000-08-22,femenino,"Carrera 89 #12-34",Administración,2,2024-01-15,activo,1500000,secundaria,0,true,publico,8.2,3,true`;

  const downloadTemplate = () => {
    const blob = new Blob([csvTemplate], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'plantilla_estudiantes.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const parseCSV = (content: string) => {
    const lines = content.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const row: any = {};
      
      headers.forEach((header, index) => {
        const value = values[index] || '';
        
        switch (header) {
          case 'semester':
          case 'work_hours_per_week':
          case 'family_size':
            row[header] = value ? parseInt(value) : undefined;
            break;
          case 'family_income':
          case 'distance_to_university':
            row[header] = value ? parseFloat(value) : undefined;
            break;
          case 'has_scholarship':
          case 'is_first_generation':
            row[header] = value.toLowerCase() === 'true';
            break;
          default:
            row[header] = value || undefined;
        }
      });
      
      data.push(row);
    }
    
    return data;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
    } else {
      toast({
        variant: "destructive",
        title: "Archivo inválido",
        description: "Por favor selecciona un archivo CSV válido",
      });
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "Archivo requerido",
        description: "Por favor selecciona un archivo CSV",
      });
      return;
    }

    setLoading(true);

    try {
      const content = await file.text();
      const studentsData = parseCSV(content);
      
      if (studentsData.length === 0) {
        toast({
          variant: "destructive",
          title: "Archivo vacío",
          description: "El archivo CSV no contiene datos válidos",
        });
        setLoading(false);
        return;
      }

      const result = await bulkImportStudents(studentsData);
      
      if (!result.error) {
        onClose();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al procesar archivo",
        description: "Verifica que el archivo tenga el formato correcto",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onClose}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Importar Estudiantes</h1>
          <p className="text-muted-foreground">Carga masiva de estudiantes desde archivo CSV</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Instrucciones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Instrucciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Formato del archivo:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Archivo en formato CSV (separado por comas)</li>
                <li>Primera fila debe contener los encabezados</li>
                <li>Codificación UTF-8 recomendada</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Campos obligatorios:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>student_code (código único)</li>
                <li>first_name (nombres)</li>
                <li>last_name (apellidos)</li>
                <li>program (programa académico)</li>
                <li>semester (número de semestre)</li>
                <li>enrollment_date (fecha de matrícula)</li>
              </ul>
            </div>

            <Button onClick={downloadTemplate} variant="outline" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Descargar Plantilla
            </Button>
          </CardContent>
        </Card>

        {/* Importar archivo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Cargar Archivo
            </CardTitle>
            <CardDescription>
              Selecciona el archivo CSV con la información de los estudiantes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csv-file">Archivo CSV</Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
            </div>

            {file && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">Archivo seleccionado:</p>
                <p className="text-sm text-muted-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  Tamaño: {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Button 
                onClick={handleImport} 
                disabled={!file || loading}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                {loading ? 'Importando...' : 'Importar Estudiantes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ejemplo de formato */}
      <Card>
        <CardHeader>
          <CardTitle>Ejemplo de Formato CSV</CardTitle>
          <CardDescription>
            Estructura que debe tener tu archivo CSV
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">
            {csvTemplate}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentImport;