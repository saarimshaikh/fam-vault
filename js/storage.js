/**
 * FamVault - Persistence Layer
 * LocalStorage + IndexedDB for real file attachments, backups, and CRUD operations
 */

import { INITIAL_MEMBERS, INITIAL_DOCUMENTS } from './data.js';

const STORAGE_KEYS = {
  MEMBERS: 'famvault_members_v1',
  DOCUMENTS: 'famvault_documents_v1',
  SETTINGS: 'famvault_settings_v1',
};

// IndexedDB configuration for binary attachments (PDFs, Images)
const IDB_NAME = 'FamVaultFilesDB';
const IDB_VERSION = 1;
const IDB_STORE_NAME = 'document_files';

class StorageManager {
  constructor() {
    this.db = null;
    this.initDatabase();
    this.seedDefaultDataIfEmpty();
  }

  // Initialize IndexedDB
  async initDatabase() {
    return new Promise((resolve) => {
      if (!window.indexedDB) {
        console.warn('IndexedDB not supported, falling back to LocalStorage');
        resolve(null);
        return;
      }
      const request = window.indexedDB.open(IDB_NAME, IDB_VERSION);
      request.onerror = (e) => {
        console.error('IndexedDB error:', e);
        resolve(null);
      };
      request.onsuccess = (e) => {
        this.db = e.target.result;
        resolve(this.db);
      };
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(IDB_STORE_NAME)) {
          db.createObjectStore(IDB_STORE_NAME, { keyPath: 'id' });
        }
      };
    });
  }

  seedDefaultDataIfEmpty() {
    if (!localStorage.getItem(STORAGE_KEYS.MEMBERS)) {
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(INITIAL_MEMBERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.DOCUMENTS)) {
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(INITIAL_DOCUMENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({
        theme: 'dark',
        maskConfidential: false,
        emergencyFilterActive: false
      }));
    }
  }

  // ==================== DOCUMENTS CRUD ====================

  getDocuments() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading documents:', e);
      return [];
    }
  }

  getDocumentById(id) {
    const docs = this.getDocuments();
    return docs.find(d => d.id === id) || null;
  }

  saveDocument(docData) {
    const docs = this.getDocuments();
    const now = new Date().toISOString().split('T')[0];

    if (docData.id) {
      // Update
      const index = docs.findIndex(d => d.id === docData.id);
      if (index !== -1) {
        docs[index] = {
          ...docs[index],
          ...docData,
          updatedDate: now
        };
        localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs));
        return docs[index];
      }
    }

    // Create New
    const newDoc = {
      ...docData,
      id: docData.id || `doc-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      createdDate: now,
      updatedDate: now
    };
    docs.unshift(newDoc);
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(docs));
    return newDoc;
  }

  deleteDocument(id) {
    const docs = this.getDocuments();
    const filtered = docs.filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(filtered));
    this.deleteAttachment(id);
    return true;
  }

  // ==================== MEMBERS CRUD ====================

  getMembers() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEMBERS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading members:', e);
      return [];
    }
  }

  getMemberById(id) {
    const members = this.getMembers();
    return members.find(m => m.id === id) || null;
  }

  saveMember(memberData) {
    const members = this.getMembers();
    if (memberData.id) {
      const idx = members.findIndex(m => m.id === memberData.id);
      if (idx !== -1) {
        members[idx] = { ...members[idx], ...memberData };
        localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
        return members[idx];
      }
    }

    const newMember = {
      ...memberData,
      id: memberData.id || `member-${Date.now().toString(36)}`,
    };
    members.push(newMember);
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
    return newMember;
  }

  deleteMember(id) {
    const members = this.getMembers();
    const filtered = members.filter(m => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(filtered));
    return true;
  }

  // ==================== ATTACHMENTS (INDEXEDDB) ====================

  async saveAttachment(docId, fileBlobOrDataUrl, metadata) {
    if (!this.db) {
      await this.initDatabase();
    }
    if (!this.db) {
      // Fallback
      localStorage.setItem(`famvault_file_${docId}`, JSON.stringify({
        id: docId,
        metadata,
        data: fileBlobOrDataUrl
      }));
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        const tx = this.db.transaction([IDB_STORE_NAME], 'readwrite');
        const store = tx.objectStore(IDB_STORE_NAME);
        const record = {
          id: docId,
          metadata,
          data: fileBlobOrDataUrl,
          savedAt: new Date().toISOString()
        };
        const req = store.put(record);
        req.onsuccess = () => resolve(true);
        req.onerror = (e) => reject(e);
      } catch (err) {
        reject(err);
      }
    });
  }

  async getAttachment(docId) {
    if (!this.db) {
      await this.initDatabase();
    }
    if (!this.db) {
      const fallback = localStorage.getItem(`famvault_file_${docId}`);
      return fallback ? JSON.parse(fallback) : null;
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction([IDB_STORE_NAME], 'readonly');
        const store = tx.objectStore(IDB_STORE_NAME);
        const req = store.get(docId);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      } catch (e) {
        resolve(null);
      }
    });
  }

  async deleteAttachment(docId) {
    if (this.db) {
      try {
        const tx = this.db.transaction([IDB_STORE_NAME], 'readwrite');
        tx.objectStore(IDB_STORE_NAME).delete(docId);
      } catch (e) {
        // silent fail
      }
    }
    localStorage.removeItem(`famvault_file_${docId}`);
  }

  // ==================== SETTINGS ====================

  getSettings() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS)) || {
        theme: 'dark',
        maskConfidential: false
      };
    } catch (e) {
      return { theme: 'dark', maskConfidential: false };
    }
  }

  updateSettings(newSettings) {
    const current = this.getSettings();
    const updated = { ...current, ...newSettings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    return updated;
  }

  // ==================== BACKUP & RESTORE ====================

  exportBackup() {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      members: this.getMembers(),
      documents: this.getDocuments(),
      settings: this.getSettings()
    };
    return JSON.stringify(backupData, null, 2);
  }

  importBackup(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.documents || !parsed.members) {
        throw new Error('Invalid FamVault backup file format.');
      }
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(parsed.members));
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(parsed.documents));
      if (parsed.settings) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(parsed.settings));
      }
      return true;
    } catch (err) {
      console.error('Import failed:', err);
      throw err;
    }
  }

  resetToDefault() {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(INITIAL_MEMBERS));
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(INITIAL_DOCUMENTS));
    return true;
  }
}

export const storage = new StorageManager();
