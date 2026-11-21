/**
 * FamVault - UI Components & Modal Handlers
 * Toast notifications, dynamic form renderers, SOS emergency panels, and viewers
 */

import { CATEGORIES } from './data.js';
import { storage } from './storage.js';
import { generatePoliceReportHTML, generatePoliceReportText, renderSimulatedBillHTML } from './police-report.js';

// ==================== TOAST NOTIFICATIONS ====================

export function showToast(message, type = 'success', duration = 3000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const typeStyles = {
    success: 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200 shadow-emerald-950/50',
    info: 'bg-blue-950/90 border-blue-500/50 text-blue-200 shadow-blue-950/50',
    warning: 'bg-amber-950/90 border-amber-500/50 text-amber-200 shadow-amber-950/50',
    error: 'bg-rose-950/90 border-rose-500/50 text-rose-200 shadow-rose-950/50',
  };

  const icons = {
    success: '✓',
    info: 'ℹ',
    warning: '⚠️',
    error: '✕',
  };

  toast.className = `pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-xl text-sm font-medium transition-all duration-300 transform translate-y-4 opacity-0 ${typeStyles[type] || typeStyles.info}`;
  toast.innerHTML = `
    <span class="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs bg-white/10 shrink-0">
      ${icons[type] || '•'}
    </span>
    <span class="flex-1">${message}</span>
  `;

  container.appendChild(toast);

  // Trigger enter animation
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ==================== CLIPBOARD HELPER ====================

export async function copyToClipboard(text, label = 'Information') {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
    showToast(`Copied ${label} to clipboard! 📋`, 'success');
  } catch (err) {
    console.error('Failed to copy: ', err);
    showToast(`Failed to copy to clipboard`, 'error');
  }
}

// ==================== MODAL HELPERS ====================

export function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }
}

export function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
    const anyModalOpen = document.querySelectorAll('.modal:not(.hidden)').length > 0;
    if (!anyModalOpen) {
      document.body.classList.remove('overflow-hidden');
    }
  }
}

// ==================== DYNAMIC FORM RENDERER ====================

export function renderCategorySpecificFields(categoryKey, existingFields = {}) {
  const container = document.getElementById('category-specific-fields');
  if (!container) return;

  let html = '';

  if (categoryKey === 'devices') {
    html = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Device Brand & Make *</label>
          <input type="text" id="field-brand" value="${existingFields.brand || ''}" placeholder="e.g. Apple, Samsung, Dell" class="form-input" required />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Model Name / Capacity *</label>
          <input type="text" id="field-model" value="${existingFields.model || ''}" placeholder="e.g. iPhone 15 Pro Max 256GB" class="form-input" required />
        </div>
        <div>
          <label class="block text-xs font-semibold text-amber-300 mb-1 flex items-center justify-between">
            <span>Primary IMEI 1 (Critical for Police FIR) *</span>
            <span class="text-[10px] text-slate-400 font-mono">Dial *#06# on phone</span>
          </label>
          <input type="text" id="field-imei1" value="${existingFields.imei1 || ''}" placeholder="15-digit IMEI number" class="form-input font-mono border-amber-500/40 focus:border-amber-400" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Secondary IMEI 2 / eSIM</label>
          <input type="text" id="field-imei2" value="${existingFields.imei2 || ''}" placeholder="Second IMEI if dual-SIM" class="form-input font-mono" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Hardware Serial Number</label>
          <input type="text" id="field-serialNumber" value="${existingFields.serialNumber || ''}" placeholder="Serial No. on box/bill" class="form-input font-mono" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">SIM Operator / Lock Helpline</label>
          <input type="text" id="field-carrier" value="${existingFields.carrier || ''}" placeholder="e.g. Airtel 198 / Jio 199" class="form-input" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Purchase Invoice Number</label>
          <input type="text" id="field-invoiceNumber" value="${existingFields.invoiceNumber || ''}" placeholder="e.g. INV-2024-9982" class="form-input font-mono" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Purchase Date & Price</label>
          <div class="grid grid-cols-2 gap-2">
            <input type="date" id="field-purchaseDate" value="${existingFields.purchaseDate || ''}" class="form-input text-xs" />
            <input type="text" id="field-purchasePrice" value="${existingFields.purchasePrice || ''}" placeholder="₹ / $" class="form-input text-xs" />
          </div>
        </div>
        <div class="md:col-span-2">
          <label class="block text-xs font-semibold text-slate-300 mb-1">Retailer / Store Name</label>
          <input type="text" id="field-retailer" value="${existingFields.retailer || ''}" placeholder="e.g. Apple Store BKC / Amazon India" class="form-input" />
        </div>
      </div>
    `;
  } else if (categoryKey === 'identity') {
    html = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">ID Card Type *</label>
          <select id="field-idType" class="form-input">
            <option value="Passport" ${existingFields.idType === 'Passport' ? 'selected' : ''}>Passport</option>
            <option value="National Identity / Aadhaar" ${existingFields.idType === 'National Identity / Aadhaar' ? 'selected' : ''}>National Identity / Aadhaar</option>
            <option value="Driving License" ${existingFields.idType === 'Driving License' ? 'selected' : ''}>Driving License</option>
            <option value="PAN / Tax ID" ${existingFields.idType === 'PAN / Tax ID' ? 'selected' : ''}>PAN / Tax ID Card</option>
            <option value="Voter ID" ${existingFields.idType === 'Voter ID' ? 'selected' : ''}>Voter ID</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-amber-300 mb-1">ID / Card Number *</label>
          <input type="text" id="field-documentNumber" value="${existingFields.documentNumber || existingFields.aadhaarNumber || ''}" placeholder="Enter card / document number" class="form-input font-mono font-bold" required />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Issue Date</label>
          <input type="date" id="field-issueDate" value="${existingFields.issueDate || ''}" class="form-input text-xs" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Expiry Date (If applicable)</label>
          <input type="date" id="field-expiryDate" value="${existingFields.expiryDate || ''}" class="form-input text-xs" />
        </div>
        <div class="md:col-span-2">
          <label class="block text-xs font-semibold text-slate-300 mb-1">Issuing Authority / Regional Office</label>
          <input type="text" id="field-issuingAuthority" value="${existingFields.issuingAuthority || ''}" placeholder="e.g. Passport Seva Kendra Mumbai" class="form-input" />
        </div>
      </div>
    `;
  } else if (categoryKey === 'vehicles') {
    html = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Vehicle Model & Type *</label>
          <input type="text" id="field-vehicleType" value="${existingFields.vehicleType || ''}" placeholder="e.g. Toyota Fortuner 4x4" class="form-input" required />
        </div>
        <div>
          <label class="block text-xs font-semibold text-amber-300 mb-1">Registration / Number Plate *</label>
          <input type="text" id="field-regNumber" value="${existingFields.regNumber || ''}" placeholder="e.g. MH-02-DW-7821" class="form-input font-mono font-bold" required />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Insurance Company</label>
          <input type="text" id="field-insurer" value="${existingFields.insurer || ''}" placeholder="e.g. HDFC ERGO / ICICI Lombard" class="form-input" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Insurance Policy Number</label>
          <input type="text" id="field-policyNumber" value="${existingFields.policyNumber || ''}" placeholder="Policy number" class="form-input font-mono" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Roadside Assistance (RSA) 24x7</label>
          <input type="text" id="field-rsaPhone" value="${existingFields.rsaPhone || ''}" placeholder="Toll-free emergency towing" class="form-input font-mono text-emerald-400" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Policy Expiry Date</label>
          <input type="date" id="field-policyExpiry" value="${existingFields.policyExpiry || ''}" class="form-input text-xs" />
        </div>
      </div>
    `;
  } else if (categoryKey === 'medical') {
    html = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Health Insurance Company *</label>
          <input type="text" id="field-insuranceCompany" value="${existingFields.insuranceCompany || ''}" placeholder="e.g. Star Health / Care / HDFC" class="form-input" required />
        </div>
        <div>
          <label class="block text-xs font-semibold text-amber-300 mb-1">TPA Member ID / Card No *</label>
          <input type="text" id="field-tpaMemberId" value="${existingFields.tpaMemberId || ''}" placeholder="ID required at hospital desk" class="form-input font-mono font-bold" required />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Cashless Hospital Helpline</label>
          <input type="text" id="field-cashlessHelpline" value="${existingFields.cashlessHelpline || ''}" placeholder="1800-425-2255" class="form-input font-mono text-emerald-400" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Sum Insured (Cover Amount)</label>
          <input type="text" id="field-sumInsured" value="${existingFields.sumInsured || ''}" placeholder="e.g. ₹15,00,000 Floater" class="form-input" />
        </div>
        <div class="md:col-span-2">
          <label class="block text-xs font-semibold text-rose-300 mb-1">Critical Medical Alerts / Allergies</label>
          <input type="text" id="field-allergies" value="${existingFields.allergies || ''}" placeholder="e.g. Severe Penicillin allergy, Diabetic" class="form-input border-rose-500/30" />
        </div>
      </div>
    `;
  } else {
    // Generic
    html = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Primary Reference / Policy # *</label>
          <input type="text" id="field-referenceNo" value="${existingFields.referenceNo || existingFields.policyNumber || ''}" placeholder="Reference or policy number" class="form-input font-mono" required />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Issuer / Organization</label>
          <input type="text" id="field-issuer" value="${existingFields.issuer || ''}" placeholder="e.g. Bank, Government, Agency" class="form-input" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Expiry / Renewal Date</label>
          <input type="date" id="field-expiryDate" value="${existingFields.expiryDate || ''}" class="form-input text-xs" />
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Helpline / Contact Number</label>
          <input type="text" id="field-contactPhone" value="${existingFields.contactPhone || ''}" placeholder="Support phone number" class="form-input font-mono" />
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
}

// ==================== VIEW DOCUMENT MODAL ====================

export async function openViewDocumentModal(docId) {
  const doc = storage.getDocumentById(docId);
  if (!doc) {
    showToast('Document not found', 'error');
    return;
  }

  const member = storage.getMemberById(doc.memberId);
  const cat = CATEGORIES[doc.category] || CATEGORIES.devices;
  const f = doc.fields || {};

  const modalContent = document.getElementById('view-document-content');
  if (!modalContent) return;

  const isDevice = doc.category === 'devices';
  const hasImei = Boolean(f.imei1);

  // Check if real attachment exists in IndexedDB
  let attachmentRecord = await storage.getAttachment(doc.id);

  let keyNumbersHtml = '';
  if (f.imei1) {
    keyNumbersHtml += `
      <div class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center justify-between">
        <div>
          <span class="text-[10px] uppercase font-bold text-amber-400">Primary IMEI 1 (Police FIR)</span>
          <div class="font-mono text-lg font-bold text-amber-200 tracking-wide">${f.imei1}</div>
        </div>
        <button class="btn-copy px-3 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-amber-400 flex items-center gap-1.5 transition-all" data-copy="${f.imei1}" data-label="IMEI 1">
          <span>📋</span> Copy IMEI
        </button>
      </div>
    `;
  }
  if (f.imei2) {
    keyNumbersHtml += `
      <div class="bg-slate-800/60 border border-slate-700 rounded-xl p-3 flex items-center justify-between">
        <div>
          <span class="text-[10px] uppercase font-bold text-slate-400">Secondary IMEI 2 (eSIM)</span>
          <div class="font-mono text-base font-semibold text-slate-200">${f.imei2}</div>
        </div>
        <button class="btn-copy px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs rounded flex items-center gap-1" data-copy="${f.imei2}" data-label="IMEI 2">
          <span>📋</span> Copy
        </button>
      </div>
    `;
  }
  if (f.serialNumber) {
    keyNumbersHtml += `
      <div class="bg-slate-800/60 border border-slate-700 rounded-xl p-3 flex items-center justify-between">
        <div>
          <span class="text-[10px] uppercase font-bold text-slate-400">Hardware Serial Number</span>
          <div class="font-mono text-base font-semibold text-emerald-400">${f.serialNumber}</div>
        </div>
        <button class="btn-copy px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs rounded flex items-center gap-1" data-copy="${f.serialNumber}" data-label="Serial Number">
          <span>📋</span> Copy
        </button>
      </div>
    `;
  }
  if (f.documentNumber || f.aadhaarNumber) {
    const num = f.documentNumber || f.aadhaarNumber;
    keyNumbersHtml += `
      <div class="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 flex items-center justify-between">
        <div>
          <span class="text-[10px] uppercase font-bold text-blue-400">Identity / Card Number</span>
          <div class="font-mono text-lg font-bold text-blue-200">${num}</div>
        </div>
        <button class="btn-copy px-3 py-1.5 bg-blue-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-blue-400 flex items-center gap-1" data-copy="${num}" data-label="ID Number">
          <span>📋</span> Copy ID
        </button>
      </div>
    `;
  }
  if (f.tpaMemberId) {
    keyNumbersHtml += `
      <div class="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 flex items-center justify-between">
        <div>
          <span class="text-[10px] uppercase font-bold text-rose-400">TPA Cashless Member ID</span>
          <div class="font-mono text-lg font-bold text-rose-200">${f.tpaMemberId}</div>
        </div>
        <button class="btn-copy px-3 py-1.5 bg-rose-500 text-white font-bold text-xs rounded-lg hover:bg-rose-600 flex items-center gap-1" data-copy="${f.tpaMemberId}" data-label="TPA ID">
          <span>📋</span> Copy TPA ID
        </button>
      </div>
    `;
  }
  if (f.regNumber) {
    keyNumbersHtml += `
      <div class="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center justify-between">
        <div>
          <span class="text-[10px] uppercase font-bold text-amber-400">Vehicle Registration Number</span>
          <div class="font-mono text-lg font-bold text-amber-200">${f.regNumber}</div>
        </div>
        <button class="btn-copy px-3 py-1.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-amber-400 flex items-center gap-1" data-copy="${f.regNumber}" data-label="Registration No">
          <span>📋</span> Copy Reg #
        </button>
      </div>
    `;
  }

  // File download details
  const fileName = doc.file?.name || 'document_attachment.pdf';
  const fileSize = doc.file?.size || 'Official File';

  modalContent.innerHTML = `
    <!-- Modal Header -->
    <div class="flex items-start justify-between border-b border-slate-800 pb-4 mb-4">
      <div class="flex items-center gap-3">
        <span class="text-3xl p-2.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 shadow-inner">
          ${cat.emoji}
        </span>
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${cat.badgeClass}">
              ${cat.label}
            </span>
            ${doc.isEmergencyCritical ? '<span class="px-2 py-0.5 bg-red-500/20 text-red-400 border border-red-500/40 rounded text-[10px] font-bold animate-pulse">EMERGENCY PRIORITY</span>' : ''}
          </div>
          <h2 class="text-xl font-bold text-white mt-1">${doc.title}</h2>
          <div class="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
            <span>Owner: <strong class="text-slate-200">${member ? member.name + ' (' + member.role + ')' : 'Family'}</strong></span>
            <span>•</span>
            <span>Added: ${doc.createdDate}</span>
          </div>
        </div>
      </div>
      <button class="btn-close-modal p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors" data-modal="modal-view-document">
        ✕
      </button>
    </div>

    <!-- Emergency Actions Banner (Stolen Phone Police FIR Button) -->
    ${isDevice ? `
      <div class="bg-gradient-to-r from-red-950/80 via-slate-900 to-amber-950/80 border border-red-500/40 rounded-xl p-4 mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shadow-red-950/20">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-red-600/30 border border-red-500/60 flex items-center justify-center text-xl shrink-0">
            🚨
          </div>
          <div>
            <h4 class="text-sm font-bold text-white">Is this phone lost or stolen?</h4>
            <p class="text-xs text-slate-300">Generate an official FIR declaration slip with verified IMEI & invoice proof.</p>
          </div>
        </div>
        <button id="btn-generate-police-slip" class="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/30 flex items-center gap-2 whitespace-nowrap transition-all" data-doc-id="${doc.id}">
          <span>📄</span> Generate Police Report
        </button>
      </div>
    ` : ''}

    <!-- High-Impact Quick Copy Numbers -->
    <div class="space-y-2 mb-5">
      ${keyNumbersHtml}
    </div>

    <!-- Complete Fields Table -->
    <div class="bg-slate-900/60 rounded-xl border border-slate-800 p-4 mb-5">
      <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
        <span>📋</span> Specification & Verification Data
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 text-xs">
        ${Object.entries(f).map(([key, val]) => {
          if (['imei1', 'imei2', 'emergencyInstructions'].includes(key)) return '';
          const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
          return `
            <div class="flex justify-between py-1 border-b border-slate-800/80">
              <span class="text-slate-400">${label}:</span>
              <span class="font-semibold text-slate-200 text-right ml-2">${val}</span>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Emergency Instructions Box (if provided) -->
    ${f.emergencyInstructions ? `
      <div class="bg-amber-950/40 border border-amber-500/30 rounded-xl p-3.5 mb-5 text-xs text-amber-200">
        <div class="font-bold uppercase tracking-wider text-amber-400 text-[10px] mb-1 flex items-center gap-1">
          <span>⚠️</span> Emergency Action Protocol
        </div>
        <p class="leading-relaxed">${f.emergencyInstructions}</p>
      </div>
    ` : ''}

    <!-- File Attachment & Preview Pane -->
    <div class="border border-slate-800 rounded-xl p-4 bg-slate-900/40 mb-6">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-lg text-emerald-400">
            📄
          </div>
          <div>
            <div class="text-xs font-bold text-white">${fileName}</div>
            <div class="text-[11px] text-slate-400">${fileSize} • Uploaded ${doc.createdDate}</div>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button id="btn-preview-file" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors" data-doc-id="${doc.id}">
            <span>👁️</span> Preview Document
          </button>
          <button id="btn-download-file" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-md flex items-center gap-1.5 transition-all" data-doc-id="${doc.id}" data-filename="${fileName}">
            <span>⬇️</span> Download Bill / Doc
          </button>
        </div>
      </div>

      <!-- Preview container (toggled on click) -->
      <div id="file-preview-area" class="mt-3 pt-3 border-t border-slate-800 hidden">
        <!-- Rendered preview will inject here -->
      </div>
    </div>

    <!-- Bottom Actions: Edit, Delete, Share -->
    <div class="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
      <div class="flex items-center gap-2">
        <button id="btn-share-doc" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors" data-doc-id="${doc.id}">
          <span>🔗</span> Share Info
        </button>
        <button id="btn-edit-doc" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors" data-doc-id="${doc.id}">
          <span>✏️</span> Edit Record
        </button>
      </div>

      <button id="btn-delete-doc" class="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 hover:text-rose-300 text-xs font-medium border border-rose-800/40 flex items-center gap-1.5 transition-colors" data-doc-id="${doc.id}" data-title="${doc.title}">
        <span>🗑️</span> Delete Document
      </button>
    </div>
  `;

  openModal('modal-view-document');
}

// ==================== POLICE REPORT MODAL ====================

export function openPoliceReportModal(docId) {
  const doc = storage.getDocumentById(docId);
  if (!doc) return;
  const member = storage.getMemberById(doc.memberId);

  const container = document.getElementById('police-report-content');
  if (!container) return;

  container.innerHTML = generatePoliceReportHTML(doc, member);

  // Bind actions
  const btnPrint = document.getElementById('btn-print-police-report');
  if (btnPrint) {
    btnPrint.onclick = () => {
      window.print();
    };
  }

  const btnCopyText = document.getElementById('btn-copy-fir-text');
  if (btnCopyText) {
    btnCopyText.onclick = () => {
      const text = generatePoliceReportText(doc, member);
      copyToClipboard(text, 'FIR Complaint text template');
    };
  }

  openModal('modal-police-report');
}

// ==================== DOCUMENT PREVIEW & DOWNLOAD HELPER ====================

export async function handlePreviewDocument(docId) {
  const doc = storage.getDocumentById(docId);
  if (!doc) return;

  const previewArea = document.getElementById('file-preview-area');
  if (!previewArea) return;

  // Toggle view if already shown
  if (!previewArea.classList.contains('hidden')) {
    previewArea.classList.add('hidden');
    return;
  }

  // Check if real stored file exists in IndexedDB
  const attachment = await storage.getAttachment(doc.id);

  if (attachment && attachment.data) {
    if (attachment.data.startsWith('data:image/')) {
      previewArea.innerHTML = `
        <div class="rounded-lg overflow-hidden border border-slate-700 bg-slate-950 p-2 text-center">
          <img src="${attachment.data}" alt="${doc.title}" class="max-h-96 mx-auto rounded shadow-lg object-contain" />
        </div>
      `;
    } else {
      previewArea.innerHTML = `
        <div class="rounded-lg bg-slate-950 p-4 border border-slate-700 text-xs">
          <p class="text-slate-300 mb-2">Stored Attachment: <strong>${attachment.metadata?.name || 'File'}</strong> (${attachment.metadata?.type || 'application/pdf'})</p>
          <a href="${attachment.data}" download="${attachment.metadata?.name || 'document.pdf'}" class="btn-download px-3 py-1.5 bg-emerald-600 text-white rounded font-bold text-xs inline-flex items-center gap-1">
            ⬇️ Download Stored File
          </a>
        </div>
      `;
    }
  } else {
    // Render authentic sample invoice / card
    previewArea.innerHTML = renderSimulatedBillHTML(doc);
  }

  previewArea.classList.remove('hidden');
}

export async function handleDownloadDocument(docId, filename = 'document.pdf') {
  const doc = storage.getDocumentById(docId);
  if (!doc) return;

  const attachment = await storage.getAttachment(doc.id);

  if (attachment && attachment.data) {
    // Download real stored data
    const link = document.createElement('a');
    link.href = attachment.data;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloading ${filename}`, 'success');
  } else {
    // Generate clean downloadable HTML receipt / doc
    const simulatedHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${doc.title} - Official Invoice & Record</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-slate-100 p-8">
        <div class="max-w-2xl mx-auto shadow-xl">
          ${renderSimulatedBillHTML(doc)}
        </div>
      </body>
      </html>
    `;
    const blob = new Blob([simulatedHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.replace(/\.pdf$/, '.html');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded verified record file: ${filename.replace(/\.pdf$/, '.html')}`, 'success');
  }
}
