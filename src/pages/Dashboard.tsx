import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, TrendingUp, AlertTriangle, BookOpen, Calendar, GraduationCap, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import RiskDistributionChart from '@/components/charts/RiskDistributionChart';
import StudentsManager from '@/components/students/StudentsManager';

const Dashboard = () => {
  const { user, userRole, signOut, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

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
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">SEPIA Dashboard</h1>
                <p className="text-muted-foreground">
                  {userRole === 'coordinador_academico' ? 'Coordinador Académico' : 'Docente'} - {user?.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Configuración
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>

          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-border/50 bg-background/95 backdrop-blur-sm shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.totalStudents.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+12% desde el semestre anterior</p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-background/95 backdrop-blur-sm shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">En Riesgo</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{dashboardData.atRiskStudents}</div>
                <p className="text-xs text-muted-foreground">Requieren intervención inmediata</p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-background/95 backdrop-blur-sm shadow-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Predicción General</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.dropoutPrediction}%</div>
                <p className="text-xs text-muted-foreground">Tasa de deserción proyectada</p>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-background/95 backdrop-blur-sm shadow-xl">
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
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="students">Estudiantes</TabsTrigger>
            <TabsTrigger value="predictions">Predicciones</TabsTrigger>
            {userRole === 'docente' && <TabsTrigger value="grades">Calificaciones</TabsTrigger>}
            <TabsTrigger value="reports">Reportes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-border/50 bg-background/95 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle>Estudiantes Recientes en Riesgo</CardTitle>
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

              <Card className="border-border/50 bg-background/95 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle>Distribución de Riesgos</CardTitle>
                  <CardDescription>
                    Visualización de la clasificación de riesgos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RiskDistributionChart />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <StudentsManager />
          </TabsContent>

          <TabsContent value="predictions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Predicciones de Deserción</CardTitle>
                <CardDescription>
                  Análisis predictivo y recomendaciones automáticas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    {userRole === 'coordinador_academico' 
                      ? 'Genera predicciones automáticas para identificar estudiantes en riesgo'
                      : 'Consulta las predicciones generadas por el coordinador académico'
                    }
                  </p>
                  {userRole === 'coordinador_academico' && (
                    <Button className="mt-4">
                      Generar Predicciones
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {userRole === 'docente' && (
            <TabsContent value="grades" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gestión de Calificaciones</CardTitle>
                  <CardDescription>
                    Registra y administra las calificaciones de tus estudiantes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Carga las calificaciones de tus materias y registra la asistencia
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Button variant="outline">
                        Cargar Calificaciones
                      </Button>
                      <Button variant="outline">
                        Registrar Asistencia
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="reports" className="space-y-6">
            <Card>
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
      </div>
    </div>
  );
};

export default Dashboard;