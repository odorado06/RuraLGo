# RURAL-GO VIVA 🌐

Plataforma rural de transport sostenible amb tecnologia de ruta, notificacions, pagaments i activitats comunitàries.

## 🚀 Instal·lació

```bash
# Instal·lar dependències
npm install

# Desenvolupament
npm run dev

# Build
npm run build
```

## 🗺️ Configuració de Google Maps

El mapa necessita una clau API de Google Maps per funcionar correctament.

### Pas 1: Obtenir una clau API

1. Accedeix a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nou projecte o selecciona un existent
3. Activa les següents APIs:
   - Maps JavaScript API
   - Places API
   - Directions API
   - Distance Matrix API

4. Crea una clau API:
   - Vés a "Credencials"
   - Crea una nova clau API
   - (Opcional) Restringeix la clau a dominis específics

### Pas 2: Configurar la clau al projecte

1. Copia el fitxer `.env.example` a `.env`:
```bash
cp .env.example .env
```

2. Edita `.env` i substitueix la clau de demo:
```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSy_TuClauRealAqui_1234567890ABC
```

3. Reinicia el servidor de desenvolupament:
```bash
npm run dev
```

## 📊 Features

### ✅ Completats

- **Autenticació**: Sistema de login/signup amb 3 usuaris de demo
  - `maria@example.com` - Client
  - `joan@example.com` - Conductor
  - `rosa@example.com` - Municipality

- **Pagament**: Sistema de checkout complert amb descomptes
  - Preus dinàmics per tipus de vehicle
  - Codes de descompte (WELCOME10, REGULAR15, VIVA20)
  - Factures automàtiques

- **Notificacions**: Centre de notificacions amb chat en viu
  - Notificacions de viatge, pagament, suport
  - Suport 24/7 simulat
  - Preferències de canals

- **Google Maps**: Seguiment de viatges en temps real
  - Marcadors de recollida i conductor
  - Rutes i distàncies
  - Geocodificació d'adreces

- **Valoracions**: Sistema de 5 estrelles amb comentaris
  - Valoracions mutxes entre clients i conductors
  - Tags de qualitat (puntualitat, seguretat, etc.)
  - Estadístiques de puntuacions

- **Domus Viva**: Recomanacions d'activitats culturals i socials
  - Base de dades d'activitats
  - Busca per tags i dificultats
  - Recomanació del dia

### 🔄 Router & Navegació

- `/` - Home
- `/login` - Login/Signup
- `/profile` - Perfil d'usuari
- `/client` - Dashboard de client
- `/driver` - Dashboard de conductor
- `/plan` - Planificació i analítiques
- `/emergency` - Botó d'emergència
- `/checkout` - Pagament
- `/ratings` - Valoracions
- `/domus-viva` - Activitats culturals

## 📦 Dependències

- **Vue 3**: Framework reactiu
- **Vue Router**: Enrutament
- **Pinia**: Gestió d'estat
- **Vite**: Build tool
- **MDI Icons**: Icones de Material Design (opcional)

## 🎨 Estils

El projecte utilitza un sistema de disseny consistent amb:
- Colors primaris: #4ECDC4 (turquesa), #2c3e50 (gris fosc)
- Components responsive amb mobil-first
- Transicions suaus i animacions

## 👥 Usuaris de Demo

| Email | Password | Rol |
|-------|----------|-----|
| maria@example.com | pass123 | Client |
| joan@example.com | pass123 | Conductor |
| rosa@example.com | pass123 | Municipality |

## 🔐 Seguretat

- La clau de Google Maps es carrega dinàmicament
- Les dades es gestionen localment en Pinia stores
- No hi ha connexió a servidor real (simulada)

## 📝 Notas de Desenvolupament

- Els maps necessiten la clau API configurada per mostrar-se
- Si Google Maps no es carrega, el mapa mostra un SVG fallback
- Els components usen Vue 3 Composition API
- Els imports utilitzen camins relatius (no @/ alias per compatibilitat Vite)

## 🚀 Producció

Per desplegar a producció:

1. Configura les variables d'entorn al teu host
2. Assegura't que la clau de Google Maps estigui restringida per dominis
3. Executa `npm run build` per crear la versió optimitzada

## 📞 Suport

Per a preguntes sobre la integració de Google Maps, consulta la [documentació oficial](https://developers.google.com/maps/documentation)

---

**Versió**: 1.0.0  
**Última actualització**: Desembre 2024
