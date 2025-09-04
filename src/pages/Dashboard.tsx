import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  BookOpen, 
  Upload,
  Search,
  BarChart3,
  GraduationCap,
  Target
} from "lucide-react";

const Dashboard = () => {
  const [userRole] = useState<"coordinator" | "teacher">("coordinator");

  // Datos simulados para demostración
  const dashboardData = {
    totalStudents: 1247,
    atRiskStudents: 89,
    dropoutPrediction: 7.1,
    averageAttendance: 85.3,
    recentPredictions: [
      { id: "001", name: "Ana García", risk: "Alto", probability: 85 },
      { id: "002", name: "Carlos López", risk: "Medio", probability: 65 },
      { id: "003", name: "María Rodríguez", risk: "Bajo", probability: 25 },
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      {/* Header */}
      <header className="bg-card border-b shadow-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">SEPIA</h1>
                <p className="text-sm text-muted-foreground">Sistema de Predicción de Deserción Estudiantil</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-sm">
                {userRole === "coordinator" ? "Coordinador Académico" : "Docente"}
              </Badge>
              <Button variant="outline" size="sm">Cerrar Sesión</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card hover:shadow-elevated transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.totalStudents.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% desde el semestre anterior</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elevated transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En Riesgo</CardTitle>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{dashboardData.atRiskStudents}</div>
              <p className="text-xs text-muted-foreground">Requieren intervención inmediata</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elevated transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Predicción General</CardTitle>
              <TrendingUp className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.dropoutPrediction}%</div>
              <p className="text-xs text-muted-foreground">Tasa de deserción proyectada</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elevated transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Asistencia Promedio</CardTitle>
              <BookOpen className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.averageAttendance}%</div>
              <p className="text-xs text-muted-foreground">En todas las materias</p>
            </CardContent>
          </Card>
        </div>

        {/* Contenido principal con tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="predictions">Predicciones</TabsTrigger>
            <TabsTrigger value="data">Gestión de Datos</TabsTrigger>
            <TabsTrigger value="reports">Reportes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Estudiantes Recientes en Riesgo
                  </CardTitle>
                  <CardDescription>
                    Predicciones más recientes del sistema de IA
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {dashboardData.recentPredictions.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">ID: {student.id}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <Badge 
                          variant={student.risk === "Alto" ? "destructive" : student.risk === "Medio" ? "secondary" : "outline"}
                          className="text-xs"
                        >
                          {student.risk} Riesgo
                        </Badge>
                        <div className="text-sm font-medium">{student.probability}%</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Distribución de Riesgos
                  </CardTitle>
                  <CardDescription>
                    Clasificación actual de estudiantes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Riesgo Alto</span>
                        <span>89 estudiantes</span>
                      </div>
                      <Progress value={7.1} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Riesgo Medio</span>
                        <span>156 estudiantes</span>
                      </div>
                      <Progress value={12.5} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Riesgo Bajo</span>
                        <span>1,002 estudiantes</span>
                      </div>
                      <Progress value={80.4} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Consulta Individual de Estudiante</CardTitle>
                <CardDescription>
                  Buscar y analizar la predicción de deserción de un estudiante específico
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input 
                      type="text" 
                      placeholder="Buscar por ID, nombre o documento..."
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    />
                  </div>
                  <Button variant="academic" className="px-6">
                    <Search className="h-4 w-4 mr-2" />
                    Buscar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userRole === "coordinator" && (
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle>Carga Masiva de Estudiantes</CardTitle>
                    <CardDescription>
                      Importar datos de estudiantes desde archivo CSV
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="academic" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Cargar Archivo CSV
                    </Button>
                  </CardContent>
                </Card>
              )}

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>
                    {userRole === "coordinator" ? "Gestión de Calificaciones" : "Cargar Calificaciones"}
                  </CardTitle>
                  <CardDescription>
                    Administrar las calificaciones de los estudiantes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="secondary" className="w-full">
                    Gestionar Calificaciones
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>
                    {userRole === "coordinator" ? "Gestión de Asistencias" : "Cargar Asistencias"}
                  </CardTitle>
                  <CardDescription>
                    Administrar el registro de asistencias
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="secondary" className="w-full">
                    Gestionar Asistencias
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Generación de Reportes</CardTitle>
                <CardDescription>
                  Exportar análisis y estadísticas del sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                    <div className="font-medium">Reporte de Deserción</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Análisis completo de predicciones
                    </div>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
                    <div className="font-medium">Estadísticas por Programa</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Métricas agrupadas por carrera
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;