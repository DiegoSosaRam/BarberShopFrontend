# 🔄 Migración: De localStorage al Backend

## ✅ Cambios Implementados

### **1. Nuevo Servicio de Autenticación**

**Archivo:** `src/app/services/auth.service.ts` ✨ NUEVO

Este servicio reemplaza completamente el uso de `localStorage` para autenticación:

- ✅ **Login** - Autentica usuarios contra el backend
- ✅ **Register** - Registra nuevos usuarios en PostgreSQL
- ✅ **Logout** - Cierra sesión (solo en memoria)
- ✅ **CurrentUser** - Usuario actual usando `BehaviorSubject`
- ✅ **Roles** - Verificación de roles (CLIENTE, BARBERO, ADMIN)

**Características:**
- ❌ **NO usa localStorage** - Todo en memoria
- ✅ Sesión se pierde al refrescar la página (comportamiento esperado)
- ✅ Datos de usuario vienen directamente de PostgreSQL

---

### **2. UserService Actualizado**

**Archivo:** `src/app/services/user.service.ts` ✏️ MODIFICADO

Ahora es un **wrapper** sobre `AuthService` para mantener compatibilidad:

**Métodos eliminados:**
- ❌ `getAllUsers()` - Ya no se usa
- ❌ `authenticateUser()` - Usa `AuthService.login()`
- ❌ `registerUser()` - Usa `AuthService.register()`
- ❌ `setCurrentUser()` - Usa `AuthService` internamente
- ❌ `emailExists()` - Usa `AuthService.emailExists()`
- ❌ `saveUsers()` / `initializeDefaultUsers()` - Ya no se necesita

**Métodos mantenidos (delegados a AuthService):**
- ✅ `getCurrentUser()` - Retorna usuario actual
- ✅ `currentUser$` - Observable del usuario
- ✅ `logout()` - Cierra sesión
- ✅ `isLoggedIn()` - Verifica si hay sesión

---

### **3. Páginas Actualizadas**

#### **Login Page** ✏️ MODIFICADO
- Usa `AuthService.login()` en lugar de `UserService.authenticateUser()`
- Llama al backend para autenticar
- Ya no guarda nada en localStorage
- Redirige según el rol: CLIENTE → /services, BARBERO → /custom-services, ADMIN → /admin

#### **Register Page** ✏️ MODIFICADO
- Usa `AuthService.register()` en lugar de `UserService.registerUser()`
- Crea perfil en PostgreSQL con rol CLIENTE
- Ya no guarda nada en localStorage
- Login automático después del registro

#### **Reservar Page** ✏️ MODIFICADO
- Eliminado manejo de `reserva_pendiente` en localStorage
- Usuario viene de memoria (AuthService)
- Métodos `saveReservationState()` y `restoreReservationState()` vacíos

---

## ⚠️ **IMPORTANTE: Falta Agregar Campo Password**

### **Problema Actual**

El modelo `Profile` en Django **NO tiene campo `password`**, por lo que:
- ❌ No se puede validar contraseñas
- ❌ Login solo verifica que el email exista
- ⚠️ Cualquiera puede hacer login con solo el email

### **Solución: Agregar Campo Password a Profile**

#### **Paso 1: Modificar el Modelo**

Edita `backend/barbershop/models.py`:

```python
from django.contrib.auth.hashers import make_password, check_password

class Profile(models.Model):
    id_profile = models.AutoField(primary_key=True)
    role = models.ForeignKey(Role, on_delete=models.CASCADE, db_column="role_code")
    full_name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)  # ✨ NUEVO CAMPO
    phone = models.CharField(max_length=20, null=True, blank=True)
    avatar_url = models.URLField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = "profiles"
    
    def set_password(self, raw_password):
        """Hashear contraseña antes de guardar"""
        self.password = make_password(raw_password)
    
    def check_password(self, raw_password):
        """Verificar contraseña"""
        return check_password(raw_password, self.password)
    
    def __str__(self):
        return self.full_name
```

#### **Paso 2: Crear Migración**

```powershell
cd backend
python manage.py makemigrations
python manage.py migrate
```

#### **Paso 3: Actualizar Serializer**

Edita `backend/barbershop/serializers.py`:

```python
class ProfileSerializer(serializers.ModelSerializer):
    role_code = serializers.CharField(source='role.role_code', read_only=True)
    password = serializers.CharField(write_only=True, required=False)  # ✨ NUEVO
    
    class Meta:
        model = Profile
        fields = [
            'id_profile', 'role_code', 'full_name', 'email', 
            'password',  # ✨ NUEVO
            'phone', 'avatar_url', 'is_active', 'created_at'
        ]
        extra_kwargs = {
            'password': {'write_only': True}  # No retornar en GET
        }
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        profile = Profile(**validated_data)
        
        if password:
            profile.set_password(password)  # Hashear contraseña
        
        profile.save()
        return profile
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if password:
            instance.set_password(password)  # Actualizar contraseña
        
        instance.save()
        return instance
```

#### **Paso 4: Crear Endpoint de Login**

Edita `backend/barbershop/views.py`:

```python
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    
    @action(detail=False, methods=['post'])
    def login(self, request):
        """Endpoint de autenticación"""
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response(
                {'error': 'Email y contraseña son requeridos'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            profile = Profile.objects.get(email=email)
            
            if not profile.is_active:
                return Response(
                    {'error': 'Usuario inactivo'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            if not profile.check_password(password):
                return Response(
                    {'error': 'Credenciales incorrectas'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            serializer = self.get_serializer(profile)
            return Response({
                'user': serializer.data,
                'message': 'Login exitoso'
            })
            
        except Profile.DoesNotExist:
            return Response(
                {'error': 'Usuario no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
```

#### **Paso 5: Actualizar AuthService**

Edita `src/app/services/auth.service.ts`:

```typescript
/**
 * Login - Autenticar usuario por email y password
 */
login(email: string, password: string): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(`${this.apiUrl}/usuarios/login/`, {
    email,
    password
  }).pipe(
    tap(response => {
      // Guardar usuario en memoria
      this.currentUserId = response.user.id_profile;
      this.currentUserSubject.next(response.user);
    }),
    catchError(error => {
      console.error('Error en login:', error);
      let errorMessage = 'Email o contraseña incorrectos';
      
      if (error.status === 404) {
        errorMessage = 'Usuario no encontrado';
      } else if (error.status === 403) {
        errorMessage = 'Usuario inactivo';
      }
      
      return throwError(() => new Error(errorMessage));
    })
  );
}

/**
 * Register - Registrar nuevo usuario
 */
register(userData: RegisterRequest): Observable<AuthUser> {
  const profileData = {
    full_name: userData.full_name,
    email: userData.email,
    password: userData.password,  // ✨ Ahora se envía
    phone: userData.phone,
    role_code: userData.role_code || 'CLIENTE',
    is_active: true
  };

  return this.http.post<AuthUser>(`${this.apiUrl}/usuarios/`, profileData).pipe(
    // ... resto del código
  );
}
```

---

## 🔐 **Actualizar Script de Seeding**

Edita `backend/scripts/seed_barbershop.py`:

```python
def seed_profiles(cliente_role):
    """Crea un perfil de cliente de prueba."""
    print("Creando/verificando perfil de cliente 'Carlos Test'...")
    
    cliente, created = Profile.objects.get_or_create(
        full_name="Carlos Test",
        defaults={
            "role": cliente_role,
            "email": "carlos@test.com",  # ✨ NUEVO
            "phone": "951-555-0000",
            "avatar_url": "URL",
            "is_active": True
        }
    )
    
    # ✨ NUEVO: Establecer contraseña
    if created:
        cliente.set_password("123456")
        cliente.save()
        print(f"Perfil CREADO: {cliente.full_name} (ID: {cliente.id_profile})")
    else:
        print(f"Perfil OBTENIDO: {cliente.full_name} (ID: {cliente.id_profile})")
    
    print("--- Perfiles listos.")
```

---

## 📊 **Resumen de Cambios**

### **Frontend (Angular/Ionic)**
| Archivo | Estado | Cambio |
|---------|--------|--------|
| `auth.service.ts` | ✨ NUEVO | Manejo de autenticación con backend |
| `user.service.ts` | ✏️ MODIFICADO | Wrapper sobre AuthService |
| `login.page.ts` | ✏️ MODIFICADO | Usa AuthService, elimina localStorage |
| `register.page.ts` | ✏️ MODIFICADO | Usa AuthService, elimina localStorage |
| `reservar.page.ts` | ✏️ MODIFICADO | Elimina manejo de reserva_pendiente |

### **Backend (Django)**
| Archivo | Estado | Cambio Necesario |
|---------|--------|------------------|
| `models.py` | ⚠️ PENDIENTE | Agregar campo `password` |
| `serializers.py` | ⚠️ PENDIENTE | Manejar password (write_only) |
| `views.py` | ⚠️ PENDIENTE | Crear endpoint `/login/` |
| `seed_barbershop.py` | ⚠️ PENDIENTE | Agregar passwords a perfiles |

---

## ✅ **Checklist de Implementación**

- [x] Crear `auth.service.ts`
- [x] Actualizar `user.service.ts`
- [x] Actualizar `login.page.ts`
- [x] Actualizar `register.page.ts`
- [x] Actualizar `reservar.page.ts`
- [ ] Agregar campo `password` a modelo `Profile`
- [ ] Crear migración de Django
- [ ] Actualizar `ProfileSerializer`
- [ ] Crear endpoint `/usuarios/login/`
- [ ] Actualizar script de seeding
- [ ] Probar login con backend
- [ ] Probar registro con backend

---

## 🚀 **Cómo Probar (Después de Agregar Password)**

1. **Ejecutar migraciones:**
   ```powershell
   cd backend
   python manage.py makemigrations
   python manage.py migrate
   ```

2. **Crear usuario de prueba:**
   ```python
   python manage.py shell
   
   from barbershop.models import Profile, Role
   
   cliente_role = Role.objects.get(role_code='CLIENTE')
   profile = Profile.objects.create(
       role=cliente_role,
       full_name="Juan Pérez",
       email="juan@test.com",
       phone="555-0001",
       is_active=True
   )
   profile.set_password("123456")
   profile.save()
   ```

3. **Probar login desde el frontend:**
   - Email: `juan@test.com`
   - Password: `123456`

---

## 🎯 **Próximos Pasos**

1. ✅ **Implementar campo password** (sigue las instrucciones arriba)
2. ✅ **Probar autenticación**
3. ✅ **Agregar JWT tokens** (opcional, para sesiones persistentes)
4. ✅ **Implementar refresh de sesión**
5. ✅ **Agregar guards de autenticación en rutas**

---

**¡Ya no se usa localStorage! Todo viene del backend PostgreSQL! 🎉**
