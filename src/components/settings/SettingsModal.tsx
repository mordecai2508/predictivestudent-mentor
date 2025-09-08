import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Settings, Shield } from 'lucide-react';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsModal = ({ open, onOpenChange }: SettingsModalProps) => {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
  });

  const [newUserData, setNewUserData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: '',
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Perfil actualizado",
        description: "Tu información ha sido actualizada exitosamente",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el perfil",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create user account
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newUserData.email,
        password: newUserData.password,
        user_metadata: {
          first_name: newUserData.firstName,
          last_name: newUserData.lastName,
        },
      });

      if (authError) throw authError;

      // Assign role
      if (authData.user) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: authData.user.id,
            role: newUserData.role as 'coordinador_academico' | 'docente' | 'administrador',
          });

        if (roleError) throw roleError;
      }

      toast({
        title: "Usuario creado",
        description: `Usuario ${newUserData.firstName} ${newUserData.lastName} creado exitosamente`,
      });

      setNewUserData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        role: '',
      });
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear el usuario",
      });
    } finally {
      setLoading(false);
    }
  };

  const canManageUsers = userRole === 'administrador' || userRole === 'coordinador_academico';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configuración del Sistema
          </DialogTitle>
          <DialogDescription>
            Gestiona tu perfil y configuraciones del sistema
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Mi Perfil</TabsTrigger>
            {canManageUsers && <TabsTrigger value="users">Gestión de Usuarios</TabsTrigger>}
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Información Personal
                </CardTitle>
                <CardDescription>
                  Actualiza tu información personal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nombres</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder="Tus nombres"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Apellidos</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Tus apellidos"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Rol actual</Label>
                    <div className="p-2 bg-muted rounded-md">
                      {userRole === 'administrador' && 'Administrador'}
                      {userRole === 'coordinador_academico' && 'Coordinador Académico'}
                      {userRole === 'docente' && 'Docente'}
                    </div>
                  </div>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Actualizando...' : 'Actualizar Perfil'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {canManageUsers && (
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Crear Nuevo Usuario
                  </CardTitle>
                  <CardDescription>
                    Crea nuevos usuarios para el sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="newFirstName">Nombres</Label>
                        <Input
                          id="newFirstName"
                          value={newUserData.firstName}
                          onChange={(e) => setNewUserData(prev => ({ ...prev, firstName: e.target.value }))}
                          placeholder="Nombres del usuario"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newLastName">Apellidos</Label>
                        <Input
                          id="newLastName"
                          value={newUserData.lastName}
                          onChange={(e) => setNewUserData(prev => ({ ...prev, lastName: e.target.value }))}
                          placeholder="Apellidos del usuario"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newEmail">Email</Label>
                      <Input
                        id="newEmail"
                        type="email"
                        value={newUserData.email}
                        onChange={(e) => setNewUserData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="email@ejemplo.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Contraseña</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newUserData.password}
                        onChange={(e) => setNewUserData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Contraseña temporal"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newRole">Rol</Label>
                      <Select value={newUserData.role} onValueChange={(value) => setNewUserData(prev => ({ ...prev, role: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un rol" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="docente">Docente</SelectItem>
                          <SelectItem value="coordinador_academico">Coordinador Académico</SelectItem>
                          {userRole === 'administrador' && (
                            <SelectItem value="administrador">Administrador</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" disabled={loading || !newUserData.role}>
                      {loading ? 'Creando...' : 'Crear Usuario'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};