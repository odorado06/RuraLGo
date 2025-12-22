<template>
  <div class="admin-panel">
    <h1>Panel d'Administració - Sol·licituds de Registre</h1>

    <div class="admin-tabs">
      <button 
        @click="activeTab = 'pending'" 
        :class="['tab-btn', { active: activeTab === 'pending' }]"
      >
        Sol·licituds Pendents ({{ pendingRequests.length }})
      </button>
      <button 
        @click="activeTab = 'approved'" 
        :class="['tab-btn', { active: activeTab === 'approved' }]"
      >
        Usuaris Aprovats ({{ approvedUsers.length }})
      </button>
      <button 
        @click="activeTab = 'emails'" 
        :class="['tab-btn', { active: activeTab === 'emails' }]"
      >
        Registre de Correus
      </button>
    </div>

    <!-- Solicitudes Pendientes -->
    <div v-if="activeTab === 'pending'" class="tab-content">
      <h2>Sol·licituds Pendents de Revisió</h2>
      
      <div v-if="pendingRequests.length === 0" class="empty-state">
        <p>No hi ha sol·licituds pendents</p>
      </div>

      <div v-else class="requests-grid">
        <div v-for="request in pendingRequests" :key="request.id" class="request-card">
          <div class="request-header">
            <h3>{{ request.name }}</h3>
            <span class="badge badge-pending">{{ request.userType === 'client' ? 'Client' : 'Conductor' }}</span>
          </div>

          <div class="request-details">
            <p><strong>Correu:</strong> {{ request.email }}</p>
            <p><strong>Telèfon:</strong> {{ request.phone }}</p>
            <p><strong>DNI:</strong> {{ request.dni }}</p>
            
            <template v-if="request.userType === 'driver'">
              <p><strong>Carnet:</strong> {{ request.licenseNumber }}</p>
              <p><strong>Vehicle:</strong> {{ request.vehicleType }}</p>
              <p><strong>Pòlissa:</strong> {{ request.insurance }}</p>
            </template>

            <p v-if="request.comments"><strong>Comentaris:</strong> {{ request.comments }}</p>
            <p class="request-date">Sol·licitud enviada: {{ formatDate(request.createdAt) }}</p>
          </div>

          <div class="request-actions">
            <button 
              @click="openDetailDialog(request)" 
              class="btn btn-info"
            >
              Veure Detalls
            </button>
            <button 
              @click="openApproveDialog(request)" 
              class="btn btn-success"
            >
              ✓ Aprovar
            </button>
            <button 
              @click="openRejectDialog(request)" 
              class="btn btn-danger"
            >
              ✗ Rebutjar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Usuarios Aprobados -->
    <div v-if="activeTab === 'approved'" class="tab-content">
      <h2>Usuaris Aprovats</h2>

      <div v-if="approvedUsers.length === 0" class="empty-state">
        <p>No hi ha usuaris aprovats encara</p>
      </div>

      <div v-else class="users-grid">
        <div v-for="user in approvedUsers" :key="user.id" class="user-card">
          <div class="user-header">
            <h3>{{ user.name }}</h3>
            <span class="badge badge-approved">Aprovat</span>
          </div>

          <div class="user-details">
            <p><strong>Correu:</strong> {{ user.email }}</p>
            <p><strong>Tipus:</strong> {{ user.userType === 'client' ? 'Client' : 'Conductor' }}</p>
            <p><strong>Telèfon:</strong> {{ user.phone }}</p>
            <p><strong>Contrasenya provisional:</strong> <code>{{ user.temporaryPassword }}</code></p>
            <p class="user-date">Aprovat: {{ formatDate(user.reviewedAt) }}</p>
          </div>

          <div class="user-actions">
            <button @click="copyPassword(user.temporaryPassword)" class="btn btn-small">
              Copiar Contrasenya
            </button>
            <button @click="resendEmail(user, 'approved')" class="btn btn-small">
              Reenvia Correu
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Log de Emails -->
    <div v-if="activeTab === 'emails'" class="tab-content">
      <h2>Registre de Correus Enviats</h2>

      <div v-if="emailLog.length === 0" class="empty-state">
        <p>No hi ha correus registrats</p>
      </div>

      <div v-else class="emails-table">
        <table>
          <thead>
            <tr>
              <th>Destinatari</th>
              <th>Assumpte</th>
              <th>Estat</th>
              <th>Data</th>
              <th>Acció</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="email in emailLog" :key="email.id">
              <td>{{ email.to }}</td>
              <td>{{ email.subject }}</td>
              <td>
                <span :class="['badge', email.status === 'approved' ? 'badge-approved' : 'badge-rejected']">
                  {{ email.status === 'approved' ? 'Aprovat' : 'Rebutjat' }}
                </span>
              </td>
              <td>{{ formatDate(email.sentAt) }}</td>
              <td>
                <button @click="viewEmailContent(email)" class="btn btn-small">
                  Veure
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Dialog para ver todos los detalles -->
    <div v-if="showDetailDialog && selectedRequest" class="dialog-overlay" @click.self="showDetailDialog = false">
      <div class="dialog detail-dialog">
        <h3>Detalls Complets de la Sol·licitud</h3>
        <div class="detail-content">
          <!-- Información básica -->
          <section class="detail-section">
            <h4>📋 Informació Bàsica</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <label>Nom Complet:</label>
                <p>{{ selectedRequest.name }}</p>
              </div>
              <div class="detail-item">
                <label>Tipus d'Usuari:</label>
                <p>{{ selectedRequest.userType === 'client' ? 'Client' : 'Conductor' }}</p>
              </div>
              <div class="detail-item">
                <label>Correu Electrònic:</label>
                <p>{{ selectedRequest.email }}</p>
              </div>
              <div class="detail-item">
                <label>Telèfon:</label>
                <p>{{ selectedRequest.phone }}</p>
              </div>
              <div class="detail-item">
                <label>DNI/NIF:</label>
                <p>{{ selectedRequest.dni }}</p>
              </div>
              <div class="detail-item">
                <label>Data de Naixement:</label>
                <p>{{ selectedRequest.birthDate }}</p>
              </div>
            </div>
          </section>

          <!-- Información de dirección -->
          <section class="detail-section">
            <h4>🏠 Adreça</h4>
            <div class="detail-grid">
              <div class="detail-item full-width">
                <label>Adreça Completa:</label>
                <p>{{ selectedRequest.address }}</p>
              </div>
              <div class="detail-item">
                <label>Codi Postal:</label>
                <p>{{ selectedRequest.postalCode }}</p>
              </div>
              <div class="detail-item">
                <label>Ciutat:</label>
                <p>{{ selectedRequest.city }}</p>
              </div>
            </div>
          </section>

          <!-- Información de salud -->
          <section class="detail-section">
            <h4>Informació Sanitària</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <label>Targeta Sanitària:</label>
                <p>{{ selectedRequest.healthCard }}</p>
              </div>
              <div class="detail-item">
                <label>Contacte d'Emergència:</label>
                <p>{{ selectedRequest.emergencyContact }}</p>
              </div>
              <div class="detail-item">
                <label>Telèfon Emergència:</label>
                <p>{{ selectedRequest.emergencyPhone }}</p>
              </div>
            </div>
          </section>

          <!-- Información de conductor (si aplica) -->
          <section v-if="selectedRequest.userType === 'driver'" class="detail-section">
            <h4>Informació del Conductor</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <label>Número de Carnet:</label>
                <p>{{ selectedRequest.licenseNumber }}</p>
              </div>
              <div class="detail-item">
                <label>Data d'Expiració:</label>
                <p>{{ selectedRequest.licenseExpiry }}</p>
              </div>
            </div>
          </section>

          <!-- Comentarios -->
          <section v-if="selectedRequest.comments" class="detail-section">
            <h4>Comentaris Addicionals</h4>
            <div class="comment-box">
              {{ selectedRequest.comments }}
            </div>
          </section>

          <!-- Metadata -->
          <section class="detail-section metadata">
            <h4>Metadades</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <label>ID Sol·licitud:</label>
                <p><code>{{ selectedRequest.id }}</code></p>
              </div>
              <div class="detail-item">
                <label>Data Sol·licitud:</label>
                <p>{{ formatDate(selectedRequest.createdAt) }}</p>
              </div>
            </div>
          </section>
        </div>

        <div class="dialog-actions">
          <button @click="showDetailDialog = false" class="btn btn-secondary">Tancar</button>
          <button @click="openApproveDialog(selectedRequest); showDetailDialog = false" class="btn btn-success">
            ✓ Aprovar
          </button>
          <button @click="openRejectDialog(selectedRequest); showDetailDialog = false" class="btn btn-danger">
            ✗ Rebutjar
          </button>
        </div>
      </div>
    </div>

    <!-- Dialog para aprobar -->
    <div v-if="showApproveDialog && selectedRequest" class="dialog-overlay" @click.self="showApproveDialog = false">
      <div class="dialog">
        <h3>Aprovar Sol·licitud</h3>
        <p>¿Estàs segur de que vols aprovar la sol·licitud de <strong>{{ selectedRequest.name }}</strong>?</p>
        <p class="info">S'enviarà un correu amb una contrasenya provisional.</p>
        <div class="dialog-actions">
          <button @click="showApproveDialog = false" class="btn btn-secondary">Cancelar</button>
          <button @click="approveRequest(selectedRequest)" class="btn btn-success">Aprovar</button>
        </div>
      </div>
    </div>

    <!-- Dialog para rechazar -->
    <div v-if="showRejectDialog && selectedRequest" class="dialog-overlay" @click.self="showRejectDialog = false">
      <div class="dialog">
        <h3>Rebutjar Sol·licitud</h3>
        <p>¿Per què vols rebutjar la sol·licitud de <strong>{{ selectedRequest.name }}</strong>?</p>
        <textarea 
          v-model="rejectionReason" 
          placeholder="Motiu del rebuig..."
          rows="4"
        ></textarea>
        <div class="dialog-actions">
          <button @click="showRejectDialog = false" class="btn btn-secondary">Cancelar</button>
          <button @click="rejectRequest(selectedRequest)" class="btn btn-danger">Rebutjar</button>
        </div>
      </div>
    </div>

    <!-- Dialog para ver email -->
    <div v-if="showEmailDialog && selectedEmail" class="dialog-overlay" @click.self="showEmailDialog = false">
      <div class="dialog email-dialog">
        <h3>{{ selectedEmail.subject }}</h3>
        <p><strong>Per a:</strong> {{ selectedEmail.to }}</p>
        <div class="email-body">
          {{ selectedEmail.body }}
        </div>
        <div class="dialog-actions">
          <button @click="showEmailDialog = false" class="btn btn-secondary">Tancar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRegistrationStore } from '../store/registrationStore';

const registrationStore = useRegistrationStore();

const activeTab = ref('pending');
const showApproveDialog = ref(false);
const showRejectDialog = ref(false);
const showEmailDialog = ref(false);
const showDetailDialog = ref(false);
const selectedRequest = ref(null);
const selectedEmail = ref(null);
const rejectionReason = ref('');

const pendingRequests = computed(() => registrationStore.getPendingRequests);
const approvedUsers = computed(() => registrationStore.getApprovedUsers);
const emailLog = computed(() => registrationStore.getEmailLog());

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const openApproveDialog = (request) => {
  selectedRequest.value = request;
  showApproveDialog.value = true;
};

const openDetailDialog = (request) => {
  selectedRequest.value = request;
  showDetailDialog.value = true;
};

const openRejectDialog = (request) => {
  selectedRequest.value = request;
  rejectionReason.value = '';
  showRejectDialog.value = true;
};

const approveRequest = (request) => {
  registrationStore.approveRequest(request.id);
  showApproveDialog.value = false;
  selectedRequest.value = null;
};

const rejectRequest = (request) => {
  if (!rejectionReason.value.trim()) {
    alert('Si us plau, proporciona un motiu per al rebuig');
    return;
  }
  registrationStore.rejectRequest(request.id, rejectionReason.value);
  showRejectDialog.value = false;
  selectedRequest.value = null;
  rejectionReason.value = '';
};

const copyPassword = (password) => {
  navigator.clipboard.writeText(password);
  alert('Contrasenya copiada al porta-retalls');
};

const resendEmail = (user, status) => {
  alert(`Correu reenviats a ${user.email}`);
};

const viewEmailContent = (email) => {
  selectedEmail.value = email;
  showEmailDialog.value = true;
};

onMounted(() => {
  registrationStore.loadFromLocalStorage();
});
</script>

<style scoped>
.admin-panel {
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: #2E7D6E;
  margin-bottom: 30px;
}

h2 {
  color: #1a1a1a;
  margin-bottom: 20px;
  font-size: 20px;
}

.admin-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 2px solid #e9ecef;
}

.tab-btn {
  background: none;
  border: none;
  padding: 12px 20px;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-weight: 600;
  color: #666;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  color: #2E7D6E;
}

.tab-btn.active {
  color: #2E7D6E;
  border-bottom-color: #2E7D6E;
}

.tab-content {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #999;
}

.requests-grid, .users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.request-card, .user-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.request-card:hover, .user-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  border-color: #2E7D6E;
}

.request-header, .user-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e9ecef;
}

.request-header h3, .user-header h3 {
  margin: 0;
  color: #1a1a1a;
  font-size: 16px;
  font-weight: 700;
}

.badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.badge-pending {
  background: #fff3cd;
  color: #856404;
}

.badge-approved {
  background: #d4edda;
  color: #155724;
}

.badge-rejected {
  background: #f8d7da;
  color: #721c24;
}

.request-details, .user-details {
  margin-bottom: 15px;
  font-size: 13px;
}

.request-details p, .user-details p {
  margin: 8px 0;
  color: #333;
  font-weight: 500;
}

.request-date, .user-date {
  font-size: 12px;
  color: #666;
  font-style: italic;
  margin-top: 12px;
}

code {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
}

.request-actions, .user-actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  transition: all 0.3s ease;
}

.btn-success {
  background: #27ae60;
  color: white;
}

.btn-success:hover {
  background: #229954;
}

.btn-danger {
  background: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background: #c0392b;
}

.btn-secondary {
  background: #e9ecef;
  color: #1a1a1a;
}

.btn-secondary:hover {
  background: #dee2e6;
}

.btn-small {
  padding: 6px 12px;
  font-size: 12px;
}

.btn-info {
  background: #17a2b8;
  color: white;
}

.btn-info:hover {
  background: #138496;
}

/* Tabla de emails */
.emails-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

th {
  background: #f5f5f5;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid #e9ecef;
}

td {
  padding: 12px;
  border-bottom: 1px solid #e9ecef;
}

/* Dialogs */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog {
  background: white;
  border-radius: 8px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.detail-dialog {
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 30px;
}

.detail-content {
  margin: 20px 0;
}

.detail-section {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e9ecef;
}

.detail-section:last-of-type {
  border-bottom: none;
}

.detail-section h4 {
  margin: 0 0 15px 0;
  color: #2E7D6E;
  font-size: 15px;
  font-weight: 600;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.detail-item {
  display: flex;
  flex-direction: column;
}

.detail-item.full-width {
  grid-column: 1 / -1;
}

.detail-item label {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 13px;
  margin-bottom: 5px;
}

.detail-item p {
  color: #666;
  margin: 0;
  font-size: 14px;
}

.detail-item code {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: monospace;
  font-size: 12px;
}

.comment-box {
  background: #f9f9f9;
  padding: 12px;
  border-radius: 4px;
  border-left: 3px solid #2E7D6E;
  color: #666;
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.5;
}

.dialog h3 {
  margin: 0 0 15px 0;
  color: #1a1a1a;
}

.dialog p {
  color: #666;
  margin: 10px 0;
}

.dialog .info {
  background: #e7f3ff;
  padding: 10px;
  border-radius: 4px;
  border-left: 3px solid #2196F3;
  font-size: 13px;
}

.dialog textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  font-family: inherit;
  font-size: 13px;
  margin: 15px 0;
  resize: vertical;
}

.dialog textarea:focus {
  outline: none;
  border-color: #2E7D6E;
  box-shadow: 0 0 0 4px rgba(46, 125, 110, 0.1);
}

.dialog-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

.dialog-actions .btn {
  padding: 10px 20px;
  flex: 1;
}

.email-dialog {
  max-width: 700px;
}

.email-body {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  margin: 15px 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 13px;
  line-height: 1.6;
  color: #333;
}

/* Responsive */
@media (max-width: 768px) {
  .admin-panel {
    padding: 20px;
  }

  .requests-grid, .users-grid {
    grid-template-columns: 1fr;
  }

  .admin-tabs {
    flex-wrap: wrap;
  }

  .dialog {
    padding: 20px;
  }

  table {
    font-size: 13px;
  }

  th, td {
    padding: 8px;
  }
}
</style>
