<template>
  <div class="emergency-container">
    <!-- Floating SOS Button -->
    <button
      :class="['sos-button', { active: sosActive }]"
      @click="toggleSOS"
    >
      {{ sosActive ? 'SOS ACTIU' : 'SOS' }}
    </button>

    <!-- Status Bar -->
    <div v-if="sosActive" class="sos-status">
      <div class="status-content">
        <svg class="status-icon" viewBox="0 0 24 24">
          <path :d="mdiAlert" fill="currentColor" />
        </svg>
        <span class="status-text">EMERGÈNCIA ACTIVADA</span>
        <button class="close-btn" @click="deactivateSOS">
          <svg viewBox="0 0 24 24">
            <path :d="mdiClose" fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="emergency-page">
      <div class="header">
        <h1>Centre d'Emergència</h1>
        <p>Accés ràpid a serveis d'emergència i ajuda</p>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <button class="action-btn call-emergency" @click="callEmergency">
          <svg class="icon" viewBox="0 0 24 24">
            <path :d="mdiPhone" fill="currentColor" />
          </svg>
          <span class="text">Trucar 112</span>
        </button>
        <button class="action-btn call-support" @click="callSupport">
          <svg class="icon" viewBox="0 0 24 24">
            <path :d="mdiHeadset" fill="currentColor" />
          </svg>
          <span class="text">Contactar Suport</span>
        </button>
        <button class="action-btn share-location" @click="shareLocation">
          <svg class="icon" viewBox="0 0 24 24">
            <path :d="mdiMapMarker" fill="currentColor" />
          </svg>
          <span class="text">Compartir Ubicació</span>
        </button>
        <button class="action-btn report-incident" @click="openIncidentForm">
          <svg class="icon" viewBox="0 0 24 24">
            <path :d="mdiAlert" fill="currentColor" />
          </svg>
          <span class="text">Reportar Incident</span>
        </button>
      </div>

      <!-- Current Trip Info -->
      <div v-if="currentTrip" class="current-trip">
        <h2>Viatge Actual</h2>
        <div class="trip-details">
          <div class="detail">
            <span class="label">Conductor:</span>
            <span class="value">{{ currentTrip.driverName }}</span>
          </div>
          <div class="detail">
            <span class="label">Vehicle:</span>
            <span class="value">{{ currentTrip.vehicle }}</span>
          </div>
          <div class="detail">
            <span class="label">Destí:</span>
            <span class="value">{{ currentTrip.destination }}</span>
          </div>
          <div class="detail">
            <span class="label">Hora Estimada:</span>
            <span class="value">{{ currentTrip.eta }}</span>
          </div>
        </div>
      </div>

      <!-- Emergency Contacts -->
      <div class="emergency-contacts">
        <h2>Contactes d'Emergència</h2>
        <div class="contacts-list">
          <a href="tel:061" class="contact-card">
            <svg class="icon" viewBox="0 0 24 24">
              <path :d="mdiAmbulance" fill="currentColor" />
            </svg>
            <div class="contact-info">
              <span class="name">Ambulància</span>
              <span class="number">061</span>
            </div>
          </a>
          <a href="tel:112" class="contact-card">
            <svg class="icon" viewBox="0 0 24 24">
              <path :d="mdiAlert" fill="currentColor" />
            </svg>
            <div class="contact-info">
              <span class="name">Emergències</span>
              <span class="number">112</span>
            </div>
          </a>
          <a href="tel:900123456" class="contact-card">
            <svg class="icon" viewBox="0 0 24 24">
              <path :d="mdiHeadset" fill="currentColor" />
            </svg>
            <div class="contact-info">
              <span class="name">Suport WebRuralGo</span>
              <span class="number">900123456</span>
            </div>
          </a>
          <a href="mailto:emergencia@webruralgo.cat" class="contact-card">
            <svg class="icon" viewBox="0 0 24 24">
              <path :d="mdiEmail" fill="currentColor" />
            </svg>
            <div class="contact-info">
              <span class="name">Correu d'Emergència</span>
              <span class="email">emergencia@webruralgo.cat</span>
            </div>
          </a>
        </div>
      </div>

      <!-- Safety Tips -->
      <div class="safety-tips">
        <h2>Consells de Seguretat</h2>
        <ul class="tips-list">
          <li>Mantén les teves dades personals actualitzades al teu perfil</li>
          <li>Comparteix el teu viatge amb amics o familiars de confiança</li>
          <li>Verifica que el vehicle coincideixi amb la informació del viatge</li>
          <li>Si et sents insegur, activa l'emergència immediatament</li>
          <li>Reporta qualsevol comportament sospitós del conductor</li>
        </ul>
      </div>
    </div>

    <!-- Incident Report Modal -->
    <div v-if="showIncidentForm" class="modal-overlay" @click.self="closeIncidentForm">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Reportar Incident</h2>
          <button class="close-btn" @click="closeIncidentForm">✕</button>
        </div>

        <div class="modal-body">
          <!-- Incident Type -->
          <div class="form-group">
            <label>Tipus d'Incident</label>
            <div class="incident-type-buttons">
              <button
                v-for="type in incidentTypes"
                :key="type"
                :class="['type-btn', { active: incidentData.type === type }]"
                @click="incidentData.type = type"
              >
                {{ type }}
              </button>
            </div>
          </div>

          <!-- Description -->
          <div class="form-group">
            <label>Descripció de l'Incident</label>
            <textarea
              v-model="incidentData.description"
              placeholder="Descriu el que va passar..."
              rows="4"
            ></textarea>
          </div>

          <!-- Severity -->
          <div class="form-group">
            <label>Gravetat</label>
            <div class="severity-buttons">
              <button
                v-for="severity in severityLevels"
                :key="severity.value"
                :class="['severity-btn', { active: incidentData.severity === severity.value }, `severity-${severity.value}`]"
                @click="incidentData.severity = severity.value"
              >
                {{ severity.label }}
              </button>
            </div>
          </div>

          <!-- Photo Upload -->
          <div class="form-group">
            <label>
              <input
                type="checkbox"
                v-model="incidentData.hasPhoto"
              >
              Adjuntar Foto
            </label>
            <div v-if="incidentData.hasPhoto" class="file-input-wrapper">
              <input type="file" accept="image/*" />
            </div>
          </div>

          <!-- Submit -->
          <button class="submit-btn" @click="submitIncident">
            Enviar Informe
          </button>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="modal-overlay" @click="closeSuccessModal">
      <div class="modal-content success">
        <svg class="success-icon" viewBox="0 0 24 24">
          <path :d="mdiCheckCircle" fill="currentColor" />
        </svg>
        <h2>Informe Enviat</h2>
        <p>El teu informe ha estat enviat al nostre equip de seguretat</p>
        <p class="reference">{{ incidentReference }}</p>
        <button class="close-btn" @click="closeSuccessModal">Tancar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTripStore } from '../store/tripStore'
import {
  mdiAlert,
  mdiPhone,
  mdiChat,
  mdiMapMarker,
  mdiClose,
  mdiAmbulance,
  mdiHeadset,
  mdiEmail,
  mdiCheckCircle
} from '@mdi/js'

const tripStore = useTripStore()

// SOS State
const sosActive = ref(false)
const showIncidentForm = ref(false)
const showSuccessModal = ref(false)
const incidentReference = ref('')

// Form Data
const incidentData = ref({
  type: '',
  description: '',
  severity: '',
  hasPhoto: false
})

// Constants
const incidentTypes = [
  'Accidente',
  'Problema Mecánico',
  'Comportamiento Conductor',
  'Problema Ruta',
  'Comportamiento Cliente',
  'Otro'
]

const severityLevels = [
  { value: 'baja', label: 'Baixa' },
  { value: 'media', label: 'Mitjana' },
  { value: 'alta', label: 'Alta' },
  { value: 'critica', label: 'Crítica' }
]

// Computed
const currentTrip = computed(() => {
  return tripStore.currentTrip || {
    driverName: 'Joan García',
    vehicle: 'Renault Scenic - ABC123',
    destination: 'Av. Diagonal, Barcelona',
    eta: '15 min'
  }
})

// Methods
const toggleSOS = () => {
  if (sosActive.value) {
    deactivateSOS()
  } else {
    activateSOS()
  }
}

const activateSOS = () => {
  sosActive.value = true
  alert('🚨 EMERGÈNCIA ACTIVADA - S\'ha notificat als serveis d\'emergència')
}

const deactivateSOS = () => {
  sosActive.value = false
}

const callEmergency = () => {
  if (confirm('Vols trucar a Emergències (112)?')) {
    window.location.href = 'tel:112'
  }
}

const callSupport = () => {
  if (confirm('Vols contactar amb Suport (900123456)?')) {
    window.location.href = 'tel:900123456'
  }
}

const shareLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        const mapsUrl = `https://maps.google.com/?q=${lat},${lng}`
        
        // Crear missatge amb la ubicació
        const locationMessage = `La meva ubicació: ${lat.toFixed(6)}, ${lng.toFixed(6)} - https://maps.google.com/?q=${lat},${lng}`
        
        // Si el navegador suporta Web Share API
        if (navigator.share) {
          navigator.share({
            title: 'La meva Ubicació en WebRuralGo',
            text: locationMessage,
            url: mapsUrl
          }).catch((err) => {
            console.log('Error compartint:', err)
            // Fallback: copiar al porta-retalls i mostrar alerta
            navigator.clipboard.writeText(locationMessage)
            alert(`Ubicació copiada: ${lat.toFixed(6)}, ${lng.toFixed(6)}\n\nEnllaç: ${mapsUrl}`)
          })
        } else {
          // Fallback per a navegadors sense Web Share API
          navigator.clipboard.writeText(locationMessage)
          alert(`Ubicació compartida i copiada:\n${lat.toFixed(6)}, ${lng.toFixed(6)}\n\nPots compartir aquest enllaç:\n${mapsUrl}`)
        }
      },
      (error) => {
        alert('No s\'ha pogut accedir a la teva ubicació. Si us plau, activa els permisos de localització.')
      }
    )
  } else {
    alert('El teu navegador no suporta geolocalització')
  }
}

const openIncidentForm = () => {
  showIncidentForm.value = true
  incidentData.value = {
    type: '',
    description: '',
    severity: '',
    hasPhoto: false
  }
}

const closeIncidentForm = () => {
  showIncidentForm.value = false
}

const submitIncident = () => {
  if (!incidentData.value.type || !incidentData.value.description || !incidentData.value.severity) {
    alert('Si us plau completa tots els camps')
    return
  }

  // Generate incident reference
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let reference = 'INC-'
  for (let i = 0; i < 8; i++) {
    reference += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  incidentReference.value = reference

  // Close form and show success
  showIncidentForm.value = false
  showSuccessModal.value = true

  // In a real app, would send to backend
  console.log('Incident Report:', {
    reference: incidentReference.value,
    ...incidentData.value,
    timestamp: new Date().toISOString()
  })
}

const closeSuccessModal = () => {
  showSuccessModal.value = false
}
</script>

<style scoped>
.emergency-container {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* SOS Button */
.sos-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #e74c3c;
  color: white;
  border: none;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.4);
  z-index: 50;
  transition: all 0.3s ease;
  animation: pulse 2s infinite;
}

.sos-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(231, 76, 60, 0.6);
}

.sos-button.active {
  animation: pulse 0.5s infinite;
  background: #c0392b;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 4px 15px rgba(231, 76, 60, 0.4);
  }
  50% {
    box-shadow: 0 4px 25px rgba(231, 76, 60, 0.8);
  }
}

/* Status Bar */
.sos-status {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #c0392b;
  color: white;
  padding: 15px 20px;
  z-index: 40;
  animation: slideDown 0.3s ease;
}

.status-content {
  display: flex;
  align-items: center;
  gap: 15px;
  max-width: 1200px;
  margin: 0 auto;
}

.status-icon {
  width: 32px;
  height: 32px;
  color: white;
  animation: bounce 1s infinite;
}

.status-text {
  flex: 1;
  font-weight: bold;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}

/* Page */
.emergency-page {
  padding-top: 40px;
  padding-bottom: 40px;
}

.header {
  text-align: center;
  color: white;
  margin-bottom: 40px;
  padding: 20px;
}

.header h1 {
  font-size: 32px;
  margin-bottom: 10px;
}

.header p {
  font-size: 16px;
  opacity: 0.9;
}

/* Quick Actions */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  max-width: 1200px;
  margin: 0 auto 40px;
  padding: 0 20px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  border: none;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.action-btn:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.action-btn .icon {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
}

.action-btn .text {
  font-size: 14px;
  text-align: center;
  color: #2c3e50;
}

.call-emergency {
  border: 3px solid #e74c3c;
  color: #e74c3c;
}

.call-support {
  border: 3px solid #3498db;
  color: #3498db;
}

.share-location {
  border: 3px solid #f39c12;
  color: #f39c12;
}

.report-incident {
  border: 3px solid #9b59b6;
  color: #9b59b6;
}

/* Current Trip */
.current-trip {
  max-width: 1200px;
  margin: 40px auto;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.current-trip h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 20px;
}

.trip-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.detail {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.detail .label {
  color: #7f8c8d;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.detail .value {
  color: #2c3e50;
  font-size: 16px;
  font-weight: 500;
}

/* Emergency Contacts */
.emergency-contacts {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
}

.emergency-contacts h2 {
  color: white;
  margin-bottom: 20px;
  font-size: 20px;
}

.contacts-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.contact-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.contact-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.contact-card .icon {
  width: 40px;
  height: 40px;
  color: #667eea;
  flex-shrink: 0;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.contact-card .name {
  color: #2c3e50;
  font-weight: 600;
  font-size: 14px;
}

.contact-card .number,
.contact-card .email {
  color: #7f8c8d;
  font-size: 12px;
}

/* Safety Tips */
.safety-tips {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
}

.safety-tips h2 {
  color: white;
  margin-bottom: 20px;
  font-size: 20px;
}

.tips-list {
  background: white;
  border-radius: 12px;
  padding: 30px;
  list-style: none;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.tips-list li {
  padding: 12px 0;
  color: #2c3e50;
  border-bottom: 1px solid #ecf0f1;
  display: flex;
  align-items: center;
  gap: 15px;
}

.tips-list li:last-child {
  border-bottom: none;
}

.tips-list li::before {
  content: '✓';
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #27ae60;
  color: white;
  border-radius: 50%;
  font-weight: bold;
  flex-shrink: 0;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #ecf0f1;
}

.modal-header h2 {
  color: #2c3e50;
  font-size: 20px;
  margin: 0;
}

.modal-body {
  padding: 20px;
}

/* Form Groups */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 14px;
}

textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #bdc3c7;
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
}

/* Incident Type Buttons */
.incident-type-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.type-btn {
  padding: 12px;
  background: #ecf0f1;
  border: 2px solid #bdc3c7;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 12px;
  text-align: center;
  color: #2c3e50;
}

.type-btn:hover {
  border-color: #9b59b6;
}

.type-btn.active {
  background: #9b59b6;
  color: white;
  border-color: #9b59b6;
}

/* Severity Buttons */
.severity-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.severity-btn {
  padding: 12px;
  border: 2px solid #bdc3c7;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 12px;
  text-align: center;
}

.severity-btn.active {
  color: white;
  border-width: 2px;
}

.severity-baja {
  color: #27ae60;
}

.severity-baja.active {
  background: #27ae60;
  border-color: #27ae60;
}

.severity-media {
  color: #f39c12;
}

.severity-media.active {
  background: #f39c12;
  border-color: #f39c12;
}

.severity-alta {
  color: #e74c3c;
}

.severity-alta.active {
  background: #e74c3c;
  border-color: #e74c3c;
}

.severity-critica {
  color: #c0392b;
}

.severity-critica.active {
  background: #c0392b;
  border-color: #c0392b;
}

/* File Input */
.file-input-wrapper {
  margin-top: 10px;
}

input[type="file"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #bdc3c7;
  border-radius: 8px;
}

/* Submit Button */
.submit-btn {
  width: 100%;
  padding: 14px;
  background: #9b59b6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;
}

.submit-btn:hover {
  background: #8e44ad;
  transform: translateY(-2px);
}

/* Success Modal */
.modal-content.success {
  text-align: center;
  padding: 40px 20px;
}

.success-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  color: #27ae60;
  animation: scaleIn 0.3s ease;
}

.modal-content.success h2 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.modal-content.success p {
  color: #7f8c8d;
  margin-bottom: 10px;
}

.reference {
  background: #ecf0f1;
  padding: 10px;
  border-radius: 8px;
  font-family: monospace;
  font-weight: 600;
  color: #2c3e50;
  margin: 20px 0;
}

.modal-content.success .close-btn {
  width: 100%;
  padding: 12px;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 20px;
}

.modal-content.success .close-btn:hover {
  background: #229954;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .quick-actions {
    grid-template-columns: repeat(2, 1fr);
  }

  .incident-type-buttons {
    grid-template-columns: 1fr;
  }

  .severity-buttons {
    grid-template-columns: repeat(2, 1fr);
  }

  .sos-button {
    width: 70px;
    height: 70px;
    font-size: 14px;
    bottom: 20px;
    right: 20px;
  }

  .header h1 {
    font-size: 24px;
  }
}
</style>
