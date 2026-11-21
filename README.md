# 🛡️ FamVault — Instant Family Emergency Document & Device Archive

> **A modern, eye-catching, family-first emergency vault designed for critical moments** (e.g., stolen phone police reports, lost wallets, traffic stops, and hospital admissions).

---

## 💡 The Pain Point & Solution

### The Real-World Scenario:
> *"My brother's phone is stolen and he needs to report it to the police right now. The police officer asks for the purchase invoice and 15-digit IMEI number. Neither is handy. Calling family members leads to frantic searches through cupboards or WhatsApp chats, and if someone is busy, critical hours are lost."*

### How FamVault Solves It:
1. **Immediate Access in 5 Seconds**: Any family member can open FamVault on their phone or laptop.
2. **1-Click Copy**: 15-digit IMEI 1, IMEI 2 (eSIM), and Serial Number can be copied with a single tap.
3. **Downloadable Tax Invoice**: The official purchase bill (PDF/Image) is permanently stored and downloadable directly at the police station.
4. **Auto-Generated Police FIR Slip**: A formal, printable *"Lost / Stolen Mobile Device Declaration"* is pre-filled with the complainant's name, phone specs, IMEI barcode, invoice number, and signature box. You can hand it straight to the officer or copy the text for online cybercrime portals.

---

## ✨ Features & Improvisations

### 1. 🚨 Crisis Rapid-Action Response Kits
- **📱 Phone Stolen / Lost Kit**: Instant access to IMEI 1, IMEI 2, carrier SIM block helpline (e.g., 198), purchase bill download, and Police FIR generator.
- **🏥 Hospital Admission Kit**: Star Health Mediclaim policy number, TPA Member ID, emergency cashless helpline, blood group, and allergy alerts.
- **🚗 Traffic Stop / Vehicle Breakdown**: Fortuner/Vehicle RC, insurance policy, chassis/engine numbers, and 24x7 Roadside Assistance (RSA) towing number.
- **🪪 Lost Wallet / Travel Kit**: Passports, National IDs (Aadhaar, DL, Voter ID) ready for rapid verification.

### 2. 👥 Family Profiles & Switcher
- View all documents or filter by specific family members:
  - 🧔 Dad (Ahmed Shaikh)
  - 👩 Mom (Fatima Shaikh)
  - 👦 Brother (Zayd Shaikh)
  - 🧑 Self (Saarim Shaikh)
  - 👧 Sister (Aanya Shaikh)
- Add new members with custom avatars, relationship tags, emergency phone numbers, and blood groups.

### 3. 📂 Complete CRUD Operations
- **Create**: Add new documents or devices with category-specific smart fields (Device, Identity, Vehicle, Medical, Legal).
- **Read**: View in a modern glassmorphic card grid or detailed inspection drawer.
- **Update**: Edit any existing record, update serial numbers, or modify notes.
- **Delete**: Safe deletion with confirmation modal.
- **File Uploads**: Drag & drop real PDFs, photos, or documents. Uploaded files are stored in browser IndexedDB/LocalStorage.

### 4. 📋 Instant 1-Click Copy & Verification
- High-visibility chips for IMEI numbers, passport numbers, policy IDs, and registration plates with tactile feedback and toast notifications.

### 5. 🖨️ Official Printable Police Report & Digital Invoices
- Generate a formal printable declaration ready for submission to the local police station or CEIR portal.
- Full `@media print` CSS optimization for crisp black-and-white printing.

### 6. 💾 Offline-First & Data Backup
- Works completely offline in any modern web browser.
- 1-click **Export Backup (JSON)** and **Import Backup** for total family data sovereignty.

---

## 🚀 Quick Start

### Option 1: 1-Click Windows Launcher
Double-click `start.bat`. It will start the local server and open your default browser automatically.

### Option 2: Python Command Line
```bash
python server.py
```
Then visit: [http://localhost:5173](http://localhost:5173)

### Option 3: Direct Browser Launch
You can also open `index.html` directly in Google Chrome, Microsoft Edge, or Safari!

---

## 🛠️ Tech Stack & Architecture
- **HTML5 & Modern ES Modules**: Modular architecture with separation of concerns (`app.js`, `storage.js`, `components.js`, `police-report.js`, `data.js`).
- **Tailwind CSS**: Modern cyber-safe dark vault aesthetic with glassmorphism, glowing ambient gradients, and crisp responsive layout.
- **IndexedDB + LocalStorage**: Zero-latency client-side persistence that stores both document metadata and real binary file attachments.
