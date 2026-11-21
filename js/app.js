/**
 * FamVault - Main Reactive Application Controller
 * Handles UI state, document rendering, emergency quick actions, and user interactions
 */

import { CATEGORIES } from './data.js';
import { storage } from './storage.js';
import {
  showToast,
  copyToClipboard,
  openModal,
  closeModal,
  renderCategorySpecificFields,
  openViewDocumentModal,
  openPoliceReportModal,
  handlePreviewDocument,
  handleDownloadDocument
} from './components.js';

class FamVaultApp {
  constructor() {
    this.selectedMemberId = 'all';
    this.selectedCategory = 'all';
    this.searchQuery = '';
    this.isEmergencyOnly = false;
    this.viewMode = 'grid'; // 'grid' | 'table'
    this.currentEditingDocId = null;
    this.uploadedFileData = null;

    this.init();
  }

  init() {
    this.renderAll();
    this.bindEvents();
    this.bindDelegatedClicks();
  }

  renderAll() {
    this.renderStats();
    this.renderFamilyMemberPills();
    this.renderCategoryPills();
    this.renderDocuments();
  }

  // ==================== STATS RENDERER ====================

  renderStats() {
    const docs = storage.getDocuments();
    const members = storage.getMembers();

    const totalDocsEl = document.getElementById('stat-total-docs');
    const totalDevicesEl = document.getElementById('stat-total-devices');
    const totalEmergencyEl = document.getElementById('stat-emergency-critical');
    const totalMembersEl = document.getElementById('stat-total-members');

    if (totalDocsEl) totalDocsEl.textContent = docs.length;
    if (totalDevicesEl) totalDevicesEl.textContent = docs.filter(d => d.category === 'devices').length;
    if (totalEmergencyEl) totalEmergencyEl.textContent = docs.filter(d => d.isEmergencyCritical).length;
    if (totalMembersEl) totalMembersEl.textContent = members.length;
  }

  // ==================== FAMILY MEMBER PILLS ====================

  renderFamilyMemberPills() {
    const container = document.getElementById('family-member-pills');
    if (!container) return;

    const members = storage.getMembers();
    const docs = storage.getDocuments();

    // "All Family" Pill
    let html = `
      <button class="member-pill ${this.selectedMemberId === 'all' ? 'active ring-2 ring-emerald-500 bg-slate-800' : 'bg-slate-900/80 hover:bg-slate-800/80'} px-3.5 py-2 rounded-2xl border border-slate-800 flex items-center gap-2.5 transition-all text-xs font-semibold shrink-0" data-member="all">
        <span class="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-sm font-bold">
          👨‍👩‍👧‍👦
        </span>
        <div class="text-left">
          <div class="text-white font-bold leading-none">All Family</div>
          <div class="text-[10px] text-slate-400 mt-0.5">${docs.length} items</div>
        </div>
      </button>
    `;

    members.forEach(m => {
      const memberDocs = docs.filter(d => d.memberId === m.id);
      const isSelected = this.selectedMemberId === m.id;
      html += `
        <button class="member-pill ${isSelected ? 'active ring-2 ring-emerald-500 bg-slate-800' : 'bg-slate-900/80 hover:bg-slate-800/80'} px-3.5 py-2 rounded-2xl border border-slate-800 flex items-center gap-2.5 transition-all text-xs font-semibold shrink-0" data-member="${m.id}">
          <span class="w-7 h-7 rounded-full bg-gradient-to-br ${m.avatarColor || 'from-indigo-600 to-purple-600'} text-white flex items-center justify-center text-sm shadow-sm">
            ${m.avatarIcon || '👤'}
          </span>
          <div class="text-left">
            <div class="text-white font-bold leading-none">${m.name.split(' ')[0]} <span class="text-slate-400 font-normal">(${m.role})</span></div>
            <div class="text-[10px] text-slate-400 mt-0.5">${memberDocs.length} items</div>
          </div>
        </button>
      `;
    });

    // Add Member Button
    html += `
      <button id="btn-add-member" class="px-3 py-2 rounded-2xl border border-dashed border-slate-700 hover:border-emerald-500/50 bg-slate-900/40 hover:bg-slate-800/60 text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 transition-all text-xs font-medium shrink-0">
        <span class="text-base leading-none">+</span>
        <span>Add Member</span>
      </button>
    `;

    container.innerHTML = html;
  }

  // ==================== CATEGORY PILLS ====================

  renderCategoryPills() {
    const container = document.getElementById('category-filter-pills');
    if (!container) return;

    const docs = storage.getDocuments();

    let html = `
      <button class="cat-pill ${this.selectedCategory === 'all' ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'} px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shrink-0" data-category="all">
        <span>✨</span>
        <span>All (${docs.length})</span>
      </button>
    `;

    Object.entries(CATEGORIES).forEach(([key, cat]) => {
      const count = docs.filter(d => d.category === key).length;
      const isSelected = this.selectedCategory === key;
      html += `
        <button class="cat-pill ${isSelected ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20' : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'} px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shrink-0" data-category="${key}">
          <span>${cat.emoji}</span>
          <span>${cat.label} (${count})</span>
        </button>
      `;
    });

    container.innerHTML = html;
  }

  // ==================== DOCUMENTS LIST RENDERER ====================

  renderDocuments() {
    const container = document.getElementById('documents-grid');
    if (!container) return;

    let docs = storage.getDocuments();
    const members = storage.getMembers();

    // 1. Filter by Member
    if (this.selectedMemberId !== 'all') {
      docs = docs.filter(d => d.memberId === this.selectedMemberId);
    }

    // 2. Filter by Category
    if (this.selectedCategory !== 'all') {
      docs = docs.filter(d => d.category === this.selectedCategory);
    }

    // 3. Filter by Emergency Critical toggle
    if (this.isEmergencyOnly) {
      docs = docs.filter(d => d.isEmergencyCritical);
    }

    // 4. Filter by Search Query
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      docs = docs.filter(d => {
        const member = members.find(m => m.id === d.memberId);
        const matchTitle = d.title.toLowerCase().includes(q);
        const matchCategory = d.category.toLowerCase().includes(q);
        const matchMember = member && (member.name.toLowerCase().includes(q) || member.role.toLowerCase().includes(q));
        const matchTags = d.tags && d.tags.some(t => t.toLowerCase().includes(q));
        const matchFields = d.fields && Object.values(d.fields).some(v => String(v).toLowerCase().includes(q));
        return matchTitle || matchCategory || matchMember || matchTags || matchFields;
      });
    }

    // Update Result Counter
    const countEl = document.getElementById('active-filter-count');
    if (countEl) {
      countEl.textContent = `${docs.length} ${docs.length === 1 ? 'document' : 'documents'} found`;
    }

    // Empty state
    if (docs.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-16 text-center border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/30 p-8">
          <div class="w-16 h-16 rounded-2xl bg-slate-800 text-slate-500 mx-auto flex items-center justify-center text-3xl mb-4">
            🔍
          </div>
          <h3 class="text-base font-bold text-white mb-1">No documents match your filter</h3>
          <p class="text-xs text-slate-400 max-w-sm mx-auto mb-5">
            ${this.searchQuery ? `No records found matching "${this.searchQuery}". Try a different keyword or phone IMEI.` : 'No documents have been added under this category yet.'}
          </p>
          <div class="flex items-center justify-center gap-3">
            <button id="btn-reset-filters" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors">
              Clear All Filters
            </button>
            <button id="btn-empty-add-doc" class="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-emerald-500/20">
              + Add First Document
            </button>
          </div>
        </div>
      `;
      return;
    }

    // Render Cards
    container.innerHTML = docs.map(doc => this.renderDocumentCard(doc, members)).join('');
  }

  renderDocumentCard(doc, members) {
    const member = members.find(m => m.id === doc.memberId);
    const cat = CATEGORIES[doc.category] || CATEGORIES.devices;
    const f = doc.fields || {};

    // Determine primary highlight number (IMEI, Reg No, ID No, Policy No)
    let primaryNumber = '';
    let primaryLabel = '';
    let isStolenPhoneCandidate = false;

    if (f.imei1) {
      primaryNumber = f.imei1;
      primaryLabel = 'IMEI 1';
      isStolenPhoneCandidate = true;
    } else if (f.documentNumber || f.aadhaarNumber) {
      primaryNumber = f.documentNumber || f.aadhaarNumber;
      primaryLabel = f.idType || 'ID No';
    } else if (f.regNumber) {
      primaryNumber = f.regNumber;
      primaryLabel = 'Reg Plate';
    } else if (f.tpaMemberId) {
      primaryNumber = f.tpaMemberId;
      primaryLabel = 'TPA ID';
    } else if (f.policyNumber) {
      primaryNumber = f.policyNumber;
      primaryLabel = 'Policy #';
    } else if (f.serialNumber) {
      primaryNumber = f.serialNumber;
      primaryLabel = 'Serial No';
    }

    const fileName = doc.file?.name || 'Invoice Attached';

    return `
      <div class="group relative bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-5 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-950/20 flex flex-col justify-between">
        
        <div>
          <!-- Top Row: Owner Badge & Category -->
          <div class="flex items-center justify-between gap-2 mb-3">
            <!-- Owner Chip -->
            <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300">
              <span class="w-4 h-4 rounded-full flex items-center justify-center text-[10px] bg-gradient-to-br ${member?.avatarColor || 'from-indigo-500 to-purple-600'} text-white">
                ${member?.avatarIcon || '👤'}
              </span>
              <span class="font-medium text-[11px]">${member?.name?.split(' ')[0] || 'Family'} <span class="text-slate-500">(${member?.role || 'Doc'})</span></span>
            </div>

            <!-- Category & Priority -->
            <div class="flex items-center gap-1.5">
              ${doc.isEmergencyCritical ? `
                <span class="px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-[10px] font-bold flex items-center gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>
                  SOS
                </span>
              ` : ''}
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${cat.badgeClass}">
                ${cat.emoji} ${cat.label.split(' ')[0]}
              </span>
            </div>
          </div>

          <!-- Title & Subtitle -->
          <h3 class="text-base font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1 mb-1">
            ${doc.title}
          </h3>
          <p class="text-xs text-slate-400 line-clamp-1 mb-4">
            ${f.model || f.insurer || f.idType || f.retailer || 'Family Record'}
          </p>

          <!-- Primary Identifier Card (1-Click Copy) -->
          ${primaryNumber ? `
            <div class="bg-slate-950/80 border border-slate-800 rounded-xl p-3 mb-4 flex items-center justify-between gap-2">
              <div class="min-w-0">
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">${primaryLabel}</span>
                <span class="font-mono text-sm font-bold text-amber-300 truncate block tracking-wide">${primaryNumber}</span>
              </div>
              <button class="btn-copy shrink-0 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all border border-slate-700" data-copy="${primaryNumber}" data-label="${primaryLabel}">
                <span>📋</span> Copy
              </button>
            </div>
          ` : ''}

          <!-- Tag chips -->
          ${doc.tags && doc.tags.length ? `
            <div class="flex flex-wrap gap-1.5 mb-4">
              ${doc.tags.map(t => `<span class="px-2 py-0.5 rounded bg-slate-800/60 text-slate-400 text-[10px] font-medium border border-slate-800">${t}</span>`).join('')}
            </div>
          ` : ''}
        </div>

        <!-- Card Footer Actions -->
        <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          
          <!-- Attachment info -->
          <div class="flex items-center gap-1.5 text-[11px] text-slate-400 truncate">
            <span class="text-emerald-400 text-xs">📎</span>
            <span class="truncate max-w-[130px]">${fileName}</span>
          </div>

          <!-- Action buttons -->
          <div class="flex items-center gap-1.5 shrink-0">
            ${isStolenPhoneCandidate ? `
              <button class="btn-police-slip p-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 text-red-400 rounded-lg text-xs transition-colors" title="Generate Stolen Phone Police Slip" data-doc-id="${doc.id}">
                🚨 FIR
              </button>
            ` : ''}

            <button class="btn-download-quick p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white rounded-lg text-xs transition-colors" title="Download Document" data-doc-id="${doc.id}" data-filename="${fileName}">
              ⬇️
            </button>

            <button class="btn-view-doc px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/30 text-emerald-400 hover:text-slate-950 font-bold text-xs rounded-lg transition-all" data-doc-id="${doc.id}">
              Open
            </button>
          </div>

        </div>

      </div>
    `;
  }

  // ==================== EVENT BINDINGS ====================

  bindEvents() {
    // Search input
    const searchInput = document.getElementById('global-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderDocuments();
      });
    }

    // Keyboard shortcut for search (Ctrl+K or /)
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && document.activeElement.tagName !== 'INPUT')) {
        e.preventDefault();
        const search = document.getElementById('global-search');
        if (search) search.focus();
      }
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal:not(.hidden)').forEach(m => m.classList.add('hidden'));
        document.body.classList.remove('overflow-hidden');
      }
    });

    // SOS Emergency Filter Toggle
    const btnEmergencyToggle = document.getElementById('btn-emergency-toggle');
    if (btnEmergencyToggle) {
      btnEmergencyToggle.addEventListener('click', () => {
        this.isEmergencyOnly = !this.isEmergencyOnly;
        btnEmergencyToggle.classList.toggle('bg-red-600', this.isEmergencyOnly);
        btnEmergencyToggle.classList.toggle('text-white', this.isEmergencyOnly);
        btnEmergencyToggle.classList.toggle('border-red-500', this.isEmergencyOnly);
        showToast(this.isEmergencyOnly ? 'Emergency SOS Mode Activated! 🚨' : 'Showing all family documents', this.isEmergencyOnly ? 'warning' : 'info');
        this.renderDocuments();
      });
    }

    // New Document Button
    const btnNewDoc = document.getElementById('btn-new-document');
    if (btnNewDoc) {
      btnNewDoc.addEventListener('click', () => {
        this.openDocumentEditor();
      });
    }

    // Modal Close buttons
    document.querySelectorAll('.btn-close-modal').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modalId = e.currentTarget.getAttribute('data-modal');
        if (modalId) closeModal(modalId);
      });
    });

    // Click outside modal to close
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.add('hidden');
          document.body.classList.remove('overflow-hidden');
        }
      });
    });

    // Category Selector in Form
    const formCatSelect = document.getElementById('doc-form-category');
    if (formCatSelect) {
      formCatSelect.addEventListener('change', (e) => {
        renderCategorySpecificFields(e.target.value);
      });
    }

    // File Input in Form (handles drag & drop / file selection)
    const fileInput = document.getElementById('doc-file-input');
    const fileDropArea = document.getElementById('file-drop-zone');
    if (fileInput && fileDropArea) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) this.handleFileSelection(file);
      });

      fileDropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileDropArea.classList.add('border-emerald-500', 'bg-emerald-500/10');
      });

      fileDropArea.addEventListener('dragleave', () => {
        fileDropArea.classList.remove('border-emerald-500', 'bg-emerald-500/10');
      });

      fileDropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileDropArea.classList.remove('border-emerald-500', 'bg-emerald-500/10');
        if (e.dataTransfer.files.length) {
          this.handleFileSelection(e.dataTransfer.files[0]);
        }
      });
    }

    // Document Form Submission (Create or Update)
    const docForm = document.getElementById('document-form');
    if (docForm) {
      docForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleSaveDocumentForm();
      });
    }

    // Member Form Submission
    const memberForm = document.getElementById('member-form');
    if (memberForm) {
      memberForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSaveMemberForm();
      });
    }

    // Backup & Restore
    const btnExport = document.getElementById('btn-export-backup');
    if (btnExport) {
      btnExport.addEventListener('click', () => {
        const json = storage.exportBackup();
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `FamVault_Backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('Family vault backup downloaded! 💾', 'success');
      });
    }

    const fileImportInput = document.getElementById('input-import-backup');
    if (fileImportInput) {
      fileImportInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            storage.importBackup(event.target.result);
            showToast('Backup restored successfully!', 'success');
            this.renderAll();
          } catch (err) {
            showToast('Failed to import backup: ' + err.message, 'error');
          }
        };
        reader.readAsText(file);
      });
    }

    // Reset Demo Data
    const btnResetDemo = document.getElementById('btn-reset-demo');
    if (btnResetDemo) {
      btnResetDemo.addEventListener('click', () => {
        if (confirm('Reset FamVault back to the default family demo records?')) {
          storage.resetToDefault();
          showToast('Vault reset to default demo data', 'info');
          this.renderAll();
        }
      });
    }
  }

  // ==================== DELEGATED CLICKS ====================

  bindDelegatedClicks() {
    document.addEventListener('click', async (e) => {
      // 1. Copy button
      const copyBtn = e.target.closest('.btn-copy');
      if (copyBtn) {
        const text = copyBtn.getAttribute('data-copy');
        const label = copyBtn.getAttribute('data-label') || 'Information';
        if (text) copyToClipboard(text, label);
        return;
      }

      // 2. Member filter pill
      const memberPill = e.target.closest('.member-pill');
      if (memberPill) {
        this.selectedMemberId = memberPill.getAttribute('data-member');
        this.renderFamilyMemberPills();
        this.renderDocuments();
        return;
      }

      // 3. Category filter pill
      const catPill = e.target.closest('.cat-pill');
      if (catPill) {
        this.selectedCategory = catPill.getAttribute('data-category');
        this.renderCategoryPills();
        this.renderDocuments();
        return;
      }

      // 4. Open View Document Modal
      const viewBtn = e.target.closest('.btn-view-doc');
      if (viewBtn) {
        const docId = viewBtn.getAttribute('data-doc-id');
        openViewDocumentModal(docId);
        return;
      }

      // 5. Open Police Report Slip Modal
      const policeBtn = e.target.closest('.btn-police-slip') || e.target.closest('#btn-generate-police-slip');
      if (policeBtn) {
        const docId = policeBtn.getAttribute('data-doc-id');
        openPoliceReportModal(docId);
        return;
      }

      // 6. Download file
      const downloadBtn = e.target.closest('.btn-download-quick') || e.target.closest('#btn-download-file');
      if (downloadBtn) {
        const docId = downloadBtn.getAttribute('data-doc-id');
        const filename = downloadBtn.getAttribute('data-filename') || 'document.pdf';
        handleDownloadDocument(docId, filename);
        return;
      }

      // 7. Preview file
      const previewBtn = e.target.closest('#btn-preview-file');
      if (previewBtn) {
        const docId = previewBtn.getAttribute('data-doc-id');
        handlePreviewDocument(docId);
        return;
      }

      // 8. Edit Document
      const editBtn = e.target.closest('#btn-edit-doc');
      if (editBtn) {
        const docId = editBtn.getAttribute('data-doc-id');
        closeModal('modal-view-document');
        this.openDocumentEditor(docId);
        return;
      }

      // 9. Delete Document
      const deleteBtn = e.target.closest('#btn-delete-doc');
      if (deleteBtn) {
        const docId = deleteBtn.getAttribute('data-doc-id');
        const title = deleteBtn.getAttribute('data-title') || 'this document';
        if (confirm(`Are you sure you want to permanently delete "${title}"?`)) {
          storage.deleteDocument(docId);
          closeModal('modal-view-document');
          showToast(`Deleted ${title}`, 'info');
          this.renderAll();
        }
        return;
      }

      // 10. Share Document
      const shareBtn = e.target.closest('#btn-share-doc');
      if (shareBtn) {
        const docId = shareBtn.getAttribute('data-doc-id');
        const doc = storage.getDocumentById(docId);
        const member = storage.getMemberById(doc?.memberId);
        if (doc) {
          const shareText = `🛡️ [FamVault Shared Record]\nDocument: ${doc.title}\nOwner: ${member?.name || 'Family'}\nCategory: ${doc.category}\n${Object.entries(doc.fields || {}).map(([k, v]) => `${k}: ${v}`).join('\n')}`;
          copyToClipboard(shareText, 'Document summary for sharing');
        }
        return;
      }

      // 11. Add Member Modal
      const addMemberBtn = e.target.closest('#btn-add-member');
      if (addMemberBtn) {
        openModal('modal-add-member');
        return;
      }

      // 12. Quick Emergency Kit Actions (From header SOS drawer)
      const sosActionBtn = e.target.closest('.sos-quick-action');
      if (sosActionBtn) {
        const actionType = sosActionBtn.getAttribute('data-action');
        this.handleSOSQuickAction(actionType);
        return;
      }

      // 13. Reset filters
      const resetFiltersBtn = e.target.closest('#btn-reset-filters');
      if (resetFiltersBtn) {
        this.selectedCategory = 'all';
        this.selectedMemberId = 'all';
        this.searchQuery = '';
        this.isEmergencyOnly = false;
        const search = document.getElementById('global-search');
        if (search) search.value = '';
        this.renderAll();
        return;
      }

      // 14. Add First Document button
      const emptyAddBtn = e.target.closest('#btn-empty-add-doc');
      if (emptyAddBtn) {
        this.openDocumentEditor();
        return;
      }
    });
  }

  // ==================== SOS QUICK ACTIONS ====================

  handleSOSQuickAction(type) {
    if (type === 'stolen_phone') {
      // Find Zayd's phone or first phone with IMEI
      const docs = storage.getDocuments();
      const phoneDoc = docs.find(d => d.id === 'doc-001') || docs.find(d => d.category === 'devices' && d.fields?.imei1);
      if (phoneDoc) {
        openViewDocumentModal(phoneDoc.id);
        showToast("Opened Stolen Phone Emergency Card! IMEI & Police FIR ready.", "warning");
      } else {
        this.selectedCategory = 'devices';
        this.renderCategoryPills();
        this.renderDocuments();
      }
    } else if (type === 'hospital') {
      const docs = storage.getDocuments();
      const medDoc = docs.find(d => d.id === 'doc-004') || docs.find(d => d.category === 'medical');
      if (medDoc) {
        openViewDocumentModal(medDoc.id);
        showToast("Opened Mediclaim & Hospital Admission Card!", "info");
      }
    } else if (type === 'vehicle') {
      const docs = storage.getDocuments();
      const carDoc = docs.find(d => d.id === 'doc-003') || docs.find(d => d.category === 'vehicles');
      if (carDoc) {
        openViewDocumentModal(carDoc.id);
        showToast("Opened Vehicle RC & Roadside Assistance!", "info");
      }
    } else if (type === 'lost_wallet') {
      this.selectedCategory = 'identity';
      this.renderCategoryPills();
      this.renderDocuments();
      showToast("Filtered all National IDs & Passports", "info");
    }
  }

  // ==================== DOCUMENT EDITOR (CREATE / EDIT) ====================

  openDocumentEditor(docId = null) {
    this.currentEditingDocId = docId;
    this.uploadedFileData = null;

    const modalTitle = document.getElementById('modal-doc-form-title');
    const memberSelect = document.getElementById('doc-form-member');
    const titleInput = document.getElementById('doc-form-title');
    const catSelect = document.getElementById('doc-form-category');
    const emergencyCheckbox = document.getElementById('doc-form-emergency');
    const tagsInput = document.getElementById('doc-form-tags');
    const instructionsInput = document.getElementById('doc-form-instructions');
    const fileLabel = document.getElementById('file-upload-status');

    // Populate members dropdown
    const members = storage.getMembers();
    if (memberSelect) {
      memberSelect.innerHTML = members.map(m => `
        <option value="${m.id}">${m.name} (${m.role})</option>
      `).join('');
    }

    if (docId) {
      // EDIT MODE
      const doc = storage.getDocumentById(docId);
      if (!doc) return;

      if (modalTitle) modalTitle.textContent = 'Edit Document Record';
      if (titleInput) titleInput.value = doc.title || '';
      if (memberSelect) memberSelect.value = doc.memberId || members[0]?.id;
      if (catSelect) catSelect.value = doc.category || 'devices';
      if (emergencyCheckbox) emergencyCheckbox.checked = Boolean(doc.isEmergencyCritical);
      if (tagsInput) tagsInput.value = (doc.tags || []).join(', ');
      if (instructionsInput) instructionsInput.value = doc.fields?.emergencyInstructions || '';

      renderCategorySpecificFields(doc.category, doc.fields || {});

      if (fileLabel) {
        fileLabel.innerHTML = doc.file?.name ? `Existing File: <span class="text-emerald-400 font-semibold">${doc.file.name}</span>` : 'Drop or browse new file (optional)';
      }
    } else {
      // CREATE NEW MODE
      if (modalTitle) modalTitle.textContent = 'Add New Document / Device';
      if (titleInput) titleInput.value = '';
      if (catSelect) catSelect.value = this.selectedCategory !== 'all' ? this.selectedCategory : 'devices';
      if (emergencyCheckbox) emergencyCheckbox.checked = false;
      if (tagsInput) tagsInput.value = '';
      if (instructionsInput) instructionsInput.value = '';

      renderCategorySpecificFields(catSelect ? catSelect.value : 'devices');

      if (fileLabel) fileLabel.innerHTML = 'Drop bills, invoices, or ID scans (PDF or Images)';
    }

    openModal('modal-document-form');
  }

  handleFileSelection(file) {
    const statusEl = document.getElementById('file-upload-status');
    const reader = new FileReader();

    reader.onload = (e) => {
      this.uploadedFileData = {
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: `${(file.size / 1024).toFixed(1)} KB`,
        data: e.target.result // Base64 Data URL
      };

      if (statusEl) {
        statusEl.innerHTML = `✓ Ready to save: <strong class="text-emerald-400">${file.name}</strong> (${this.uploadedFileData.size})`;
      }
      showToast(`Attached ${file.name}`, 'info');
    };

    reader.readAsDataURL(file);
  }

  async handleSaveDocumentForm() {
    const titleInput = document.getElementById('doc-form-title');
    const memberSelect = document.getElementById('doc-form-member');
    const catSelect = document.getElementById('doc-form-category');
    const emergencyCheckbox = document.getElementById('doc-form-emergency');
    const tagsInput = document.getElementById('doc-form-tags');
    const instructionsInput = document.getElementById('doc-form-instructions');

    const title = titleInput?.value.trim();
    if (!title) {
      showToast('Please enter a document title', 'warning');
      return;
    }

    const category = catSelect?.value || 'devices';
    const memberId = memberSelect?.value;
    const isEmergencyCritical = emergencyCheckbox ? emergencyCheckbox.checked : false;
    const tags = tagsInput?.value ? tagsInput.value.split(',').map(t => t.trim()).filter(Boolean) : [];
    const emergencyInstructions = instructionsInput?.value.trim() || '';

    // Harvest category-specific fields dynamically
    const fields = { emergencyInstructions };
    document.querySelectorAll('#category-specific-fields input, #category-specific-fields select').forEach(input => {
      const key = input.id.replace('field-', '');
      if (key) {
        fields[key] = input.value.trim();
      }
    });

    const docPayload = {
      id: this.currentEditingDocId || undefined,
      title,
      category,
      memberId,
      isEmergencyCritical,
      tags,
      fields
    };

    // Attach uploaded file if any
    if (this.uploadedFileData) {
      docPayload.file = {
        name: this.uploadedFileData.name,
        type: this.uploadedFileData.type,
        size: this.uploadedFileData.size,
        uploadedAt: new Date().toISOString().split('T')[0]
      };
    } else if (this.currentEditingDocId) {
      const existing = storage.getDocumentById(this.currentEditingDocId);
      if (existing?.file) {
        docPayload.file = existing.file;
      }
    }

    const savedDoc = storage.saveDocument(docPayload);

    // Save actual attachment binary data into IndexedDB
    if (this.uploadedFileData) {
      await storage.saveAttachment(savedDoc.id, this.uploadedFileData.data, {
        name: this.uploadedFileData.name,
        type: this.uploadedFileData.type,
        size: this.uploadedFileData.size
      });
    }

    closeModal('modal-document-form');
    showToast(this.currentEditingDocId ? 'Document record updated! ✨' : 'Document securely added to vault! 🛡️', 'success');
    this.renderAll();
  }

  // ==================== MEMBER FORM HANDLER ====================

  handleSaveMemberForm() {
    const nameInput = document.getElementById('member-name');
    const roleInput = document.getElementById('member-role');
    const phoneInput = document.getElementById('member-phone');
    const bloodGroupInput = document.getElementById('member-blood-group');
    const emojiInput = document.getElementById('member-emoji');

    const name = nameInput?.value.trim();
    const role = roleInput?.value.trim() || 'Family Member';
    const phone = phoneInput?.value.trim() || '';
    const bloodGroup = bloodGroupInput?.value.trim() || 'O+';
    const avatarIcon = emojiInput?.value.trim() || '👤';

    if (!name) {
      showToast('Please enter member name', 'warning');
      return;
    }

    storage.saveMember({
      name,
      role,
      relation: role,
      phone,
      bloodGroup,
      avatarIcon,
      avatarColor: 'from-teal-600 to-emerald-800',
      isEmergencyContact: true
    });

    closeModal('modal-add-member');
    showToast(`Added ${name} to family vault!`, 'success');
    this.renderAll();
  }
}

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.FamVault = new FamVaultApp();
});
