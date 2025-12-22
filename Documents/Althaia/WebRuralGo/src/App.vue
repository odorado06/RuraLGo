<template>
  <div class="layout">
    <!-- Terms Modal - must be accepted before viewing anything -->
    <TermsAndConditionsModal 
      v-if="showTermsModal" 
      :show-terms="showTermsModal"
      @accept="handleAcceptTerms"
      @reject="handleRejectTerms"
    />

    <!-- Main App Content - only visible if terms are accepted -->
    <template v-if="!showTermsModal">
      <header class="app-header">
        <div class="header-left">
        <router-link to="/" class="logo">
          <svg class="logo-icon" viewBox="0 0 24 24">
            <path :d="mdiEarth" fill="currentColor" />
          </svg>
          RURAL-GO VIVA
        </router-link>
      </div>

      <nav class="header-nav" v-if="isAuthenticated">
        <router-link to="/">Inici</router-link>
        <router-link to="/services">
          <svg class="nav-icon" viewBox="0 0 24 24">
            <path :d="mdiTarget" fill="currentColor" />
          </svg>
          Serveis
        </router-link>
        <router-link v-if="userRole === 'client'" to="/planification">
          <svg class="nav-icon" viewBox="0 0 24 24">
            <path :d="mdiPhone" fill="currentColor" />
          </svg>
          Panel Client
        </router-link>
        <router-link v-if="userRole === 'client'" to="/my-trips">
          <svg class="nav-icon" viewBox="0 0 24 24">
            <path :d="mdiListBox" fill="currentColor" />
          </svg>
          Els meus viatges
        </router-link>
        <router-link v-if="userRole === 'driver'" to="/driver-dashboard">
          <svg class="nav-icon" viewBox="0 0 24 24">
            <path :d="mdiCar" fill="currentColor" />
          </svg>
          Panel Conductor
        </router-link>
        <router-link v-if="userRole === 'admin'" to="/admin/registrations">
          <svg class="nav-icon" viewBox="0 0 24 24">
            <path :d="mdiCog" fill="currentColor" />
          </svg>
          Gestionar Registres
        </router-link>
        <router-link to="/emergency">
          <svg class="nav-icon" viewBox="0 0 24 24">
            <path :d="mdiAlert" fill="currentColor" />
          </svg>
          Emergències
        </router-link>
        <router-link v-if="userRole === 'driver'" to="/history">
          <svg class="nav-icon" viewBox="0 0 24 24">
            <path :d="mdiClockOutline" fill="currentColor" />
          </svg>
          Historial
        </router-link>
        <router-link to="/ratings">
          <svg class="nav-icon" viewBox="0 0 24 24">
            <path :d="mdiStar" fill="currentColor" />
          </svg>
          Valoracions
        </router-link>
        <router-link to="/domus-viva">
          <svg class="nav-icon" viewBox="0 0 24 24">
            <path :d="mdiTheater" fill="currentColor" />
          </svg>
          Domus Viva
        </router-link>
      </nav>

      <nav class="header-nav" v-else>
        <router-link to="/">Inici</router-link>
      </nav>

      <div class="header-right">
        <div v-if="isAuthenticated" class="user-menu">
          <span class="user-name">{{ currentUser?.name }}</span>
          <router-link to="/profile" class="btn btn-small btn-primary">
            <svg class="btn-icon" viewBox="0 0 24 24">
              <path :d="mdiCog" fill="currentColor" />
            </svg>
            Perfil
          </router-link>
          <button @click="logout" class="btn btn-small btn-secondary">
            <svg class="btn-icon" viewBox="0 0 24 24">
              <path :d="mdiLogout" fill="currentColor" />
            </svg>
            Logout
          </button>
        </div>
        <div v-else class="auth-links">
          <router-link to="/login" class="btn btn-primary">
            <svg class="btn-icon" viewBox="0 0 24 24">
              <path :d="mdiLock" fill="currentColor" />
            </svg>
            Accés
          </router-link>
        </div>
      </div>
      </header>

      <main class="main-content">
        <router-view />
      </main>

      <!-- Footer Component -->
      <Footer />

      <!-- Notification Center Component -->
      <NotificationCenter v-if="isAuthenticated" />
    </template>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from './store/authStore';
import TermsAndConditionsModal from './components/TermsAndConditionsModal.vue';
import NotificationCenter from './components/NotificationCenter.vue';
import Footer from './components/Footer.vue';
import {
  mdiTarget,
  mdiPhone,
  mdiListBox,
  mdiCar,
  mdiAlert,
  mdiClockOutline,
  mdiStar,
  mdiTheater,
  mdiCog,
  mdiLogout,
  mdiLock,
  mdiEarth
} from '@mdi/js';

const router = useRouter();
const authStore = useAuthStore();

// Control de términos y condiciones
const showTermsModal = ref(localStorage.getItem('termsAndConditionsAccepted') !== 'true');

const handleAcceptTerms = () => {
  showTermsModal.value = false;
};

const handleRejectTerms = () => {
  // Si rechaza, mantener el modal visible y redirigir
  showTermsModal.value = true;
  // Opcional: redirigir a una página externa
  // window.location.href = 'https://www.example.com';
};

const isAuthenticated = computed(() => authStore.isLoggedIn);
const currentUser = computed(() => authStore.getUser);
const userRole = computed(() => authStore.getUserRole);

const logout = () => {
  authStore.logout();
  router.push('/');
};
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: white;
}

/* HEADER STYLES */
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
  border-bottom: 1px solid #e9ecef;
  padding: 16px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  flex-wrap: wrap;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 40px;
}

.logo {
  font-size: 22px;
  font-weight: 800;
  color: #2E7D6E;
  text-decoration: none;
  transition: var(--transition);
  padding: 8px 0;
  display: flex;
  align-items: center;
  gap: 10px;
  letter-spacing: -0.5px;
}

.logo-icon {
  width: 28px;
  height: 28px;
  color: #2E7D6E;
}

.logo:hover {
  color: #1a4a42;
  opacity: 0.9;
}

.nav-icon {
  width: 18px;
  height: 18px;
  margin-right: 4px;
}

.btn-icon {
  width: 16px;
  height: 16px;
}

.icon {
  font-size: 16px;
  margin-right: 4px;
}

.header-nav {
  display: flex;
  gap: 0;
  flex: 1;
  justify-content: center;
}

.header-nav a {
  color: #1a1a1a;
  text-decoration: none;
  padding: 8px 16px;
  border-bottom: 3px solid transparent;
  transition: var(--transition);
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 6px;
}

.header-nav a:hover {
  color: #2E7D6E;
  border-bottom-color: #2E7D6E;
}

.header-nav a.router-link-active {
  color: #2E7D6E;
  border-bottom-color: #2E7D6E;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-name {
  font-size: 14px;
  color: #1a1a1a;
  white-space: nowrap;
  font-weight: 500;
}

.auth-links {
  display: flex;
  gap: 10px;
  align-items: center;
}

.btn-small {
  padding: 8px 16px;
  font-size: 13px;
}

/* MAIN CONTENT */
.main-content {
  flex: 1;
  background: white;
  width: 100%;
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .app-header {
    padding: 14px 30px;
    gap: 20px;
  }

  .header-left {
    gap: 20px;
  }

  .header-nav {
    gap: 0;
  }

  .header-nav a {
    padding: 8px 12px;
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    gap: 12px;
    padding: 12px 16px;
    align-items: flex-start;
  }

  .header-left {
    width: 100%;
    justify-content: space-between;
  }

  .header-nav {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 5px;
  }

  .header-nav a {
    padding: 6px 10px;
    font-size: 12px;
  }

  .header-right {
    width: 100%;
    justify-content: space-between;
    margin-top: 8px;
  }

  .user-name {
    font-size: 12px;
  }

  .btn-small {
    padding: 6px 12px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .app-header {
    padding: 10px 12px;
  }

  .logo {
    font-size: 18px;
  }

  .header-nav a {
    padding: 6px 8px;
    font-size: 11px;
  }
}
</style>

