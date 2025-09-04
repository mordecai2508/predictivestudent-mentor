import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/enhanced-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GraduationCap, Lock, User, AlertCircle } from "lucide-react";

interface LoginProps {
  onLogin: (role: "coordinator" | "teacher") => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulación de autenticación
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (formData.email && formData.password && formData.role) {
        onLogin(formData.role as "coordinator" | "teacher");
      } else {
        setError("Por favor complete todos los campos");
      }
    } catch (err) {
      setError("Error al iniciar sesión. Intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="bg-card p-4 rounded-full w-20 h-20 mx-auto mb-4 shadow-glow">
            <GraduationCap className="h-12 w-12 text-primary mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-primary-foreground mb-2">SEPIA</h1>
          <p className="text-primary-foreground/80 text-lg">
            Sistema de Predicción de Deserción Estudiantil
          </p>
        </div>

        {/* Formulario de login */}
        <Card className="shadow-elevated border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-semibold">Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingrese sus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="role">Tipo de Usuario</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione su rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coordinator">Coordinador Académico</SelectItem>
                    <SelectItem value="teacher">Docente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="usuario@universidad.edu"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                variant="hero" 
                size="lg" 
                className="w-full mt-6"
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "Ingresar al Sistema"}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t text-center">
              <p className="text-sm text-muted-foreground">
                ¿Problemas para acceder?{" "}
                <button className="text-primary hover:underline font-medium">
                  Contactar soporte técnico
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo credentials */}
        <Card className="mt-4 bg-accent/50 border-accent">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium mb-2">Credenciales de Demo:</h3>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p><strong>Coordinador:</strong> coord@universidad.edu / demo123</p>
              <p><strong>Docente:</strong> docente@universidad.edu / demo123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;