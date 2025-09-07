import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, TrendingUp, Shield, Users, BarChart3, Brain } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center shadow-2xl">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Sistema <span className="text-primary">SEPIA</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Sistema de Predicción de Deserción Estudiantil con Inteligencia Artificial
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/auth">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Acceder al Sistema
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Conocer Más
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="relative overflow-hidden border-border/50 bg-background/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Predicción con IA</CardTitle>
              <CardDescription>
                Algoritmos avanzados que analizan múltiples factores para predecir el riesgo de deserción estudiantil
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="relative overflow-hidden border-border/50 bg-background/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary/80 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Análisis Detallado</CardTitle>
              <CardDescription>
                Visualizaciones claras y reportes comprensivos para tomar decisiones informadas
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="relative overflow-hidden border-border/50 bg-background/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Intervención Temprana</CardTitle>
              <CardDescription>
                Recomendaciones automáticas para prevenir la deserción y mejorar la retención estudiantil
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="relative overflow-hidden border-border/50 bg-background/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Gestión de Estudiantes</CardTitle>
              <CardDescription>
                Administración completa de información estudiantil, calificaciones y asistencias
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="relative overflow-hidden border-border/50 bg-background/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Acceso Seguro</CardTitle>
              <CardDescription>
                Sistema de roles con acceso controlado para coordinadores académicos y docentes
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="relative overflow-hidden border-border/50 bg-background/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <CardTitle>Reportes Avanzados</CardTitle>
              <CardDescription>
                Generación automática de reportes y estadísticas para el seguimiento institucional
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;