/**
 * FamVault - Emergency Police Report & Stolen Device Slip Generator
 * Generates an official, printable "Stolen / Lost Mobile Device Intimation Slip"
 * for immediate submission to police stations or online FIR portals.
 */

export function generatePoliceReportHTML(doc, member) {
  const f = doc.fields || {};
  const currentDate = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Generate SVG barcode representation for IMEI 1
  const imei1Barcode = generateBarcodeSVG(f.imei1 || '358291048291048');
  const imei2Barcode = f.imei2 ? generateBarcodeSVG(f.imei2) : '';

  return `
    <div id="police-report-printable" class="bg-white text-slate-900 p-8 rounded-xl shadow-2xl max-w-3xl mx-auto border border-slate-300 print:border-none print:shadow-none print:p-0 font-sans">
      
      <!-- Report Header -->
      <div class="border-b-2 border-slate-900 pb-5 mb-6 text-center relative">
        <div class="inline-flex items-center justify-center gap-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold tracking-wider uppercase mb-2">
          <span class="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
          Emergency Property Loss Intimation
        </div>
        <h1 class="text-2xl font-black tracking-tight text-slate-950 uppercase">
          Declaration of Stolen / Lost Mobile Device
        </h1>
        <p class="text-xs text-slate-600 mt-1">
          For submission to Police Station / Cyber Crime Cell / CEIR (Central Equipment Identity Register) Portal
        </p>
        <div class="flex justify-between items-center text-xs text-slate-500 mt-3 pt-3 border-t border-slate-200">
          <span>Generated via <strong>FamVault</strong> Family Archive</span>
          <span>Date: <strong>${currentDate}</strong> | Time: <strong>${currentTime}</strong></span>
          <span class="font-mono text-red-600 font-bold">URGENT ACTION</span>
        </div>
      </div>

      <!-- Critical Notice -->
      <div class="bg-amber-50 border-l-4 border-amber-500 p-3 mb-6 rounded-r text-xs text-amber-900 flex items-start gap-2">
        <span class="text-base">⚠️</span>
        <div>
          <strong>Notice for Law Enforcement Officer:</strong> All device identifiers (IMEI 1, IMEI 2, Serial No.) below match the original manufacturer purchase invoice. The original tax invoice is attached on page 2.
        </div>
      </div>

      <!-- Grid: Owner & Device Specs -->
      <div class="grid grid-cols-2 gap-6 mb-6">
        
        <!-- Complainant / Owner Info -->
        <div class="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <h2 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <span>👤</span> Complainant / Device Owner
          </h2>
          <table class="w-full text-xs">
            <tbody class="divide-y divide-slate-200">
              <tr>
                <td class="py-1.5 text-slate-500 font-medium">Full Name:</td>
                <td class="py-1.5 font-bold text-slate-900 text-right">${member ? member.name : 'Device Owner'}</td>
              </tr>
              <tr>
                <td class="py-1.5 text-slate-500 font-medium">Family Role:</td>
                <td class="py-1.5 font-semibold text-slate-800 text-right">${member ? member.role + ' (' + member.relation + ')' : 'Self'}</td>
              </tr>
              <tr>
                <td class="py-1.5 text-slate-500 font-medium">Contact Phone:</td>
                <td class="py-1.5 font-mono font-bold text-blue-700 text-right">${member ? member.phone : 'Handy via Family'}</td>
              </tr>
              <tr>
                <td class="py-1.5 text-slate-500 font-medium">Email:</td>
                <td class="py-1.5 font-mono text-slate-700 text-right">${member ? member.email : 'N/A'}</td>
              </tr>
              <tr>
                <td class="py-1.5 text-slate-500 font-medium">Emergency Contact:</td>
                <td class="py-1.5 font-bold text-slate-800 text-right">Ahmed Shaikh (Father)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- SIM & Carrier Info -->
        <div class="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <h2 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <span>📡</span> SIM & Network Carrier Details
          </h2>
          <table class="w-full text-xs">
            <tbody class="divide-y divide-slate-200">
              <tr>
                <td class="py-1.5 text-slate-500 font-medium">Carrier:</td>
                <td class="py-1.5 font-bold text-slate-900 text-right">${f.carrier || 'Not specified'}</td>
              </tr>
              <tr>
                <td class="py-1.5 text-slate-500 font-medium">SIM Lock Helpline:</td>
                <td class="py-1.5 font-mono font-bold text-red-600 text-right">${f.carrierHelpline || '198 / Operator Helpline'}</td>
              </tr>
              <tr>
                <td class="py-1.5 text-slate-500 font-medium">Warranty Expiry:</td>
                <td class="py-1.5 text-slate-800 text-right font-medium">${f.warrantyExpiry || 'Active'}</td>
              </tr>
              <tr>
                <td class="py-1.5 text-slate-500 font-medium">Find My / Cloud:</td>
                <td class="py-1.5 font-bold text-emerald-700 text-right">Active (Marked Lost)</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- High-Priority Device Identity Block with Barcodes -->
      <div class="border-2 border-slate-900 rounded-lg p-5 mb-6 bg-slate-950 text-white">
        <div class="flex items-center justify-between mb-4">
          <div>
            <span class="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Device Hardware Verification</span>
            <h3 class="text-lg font-bold text-white">${f.brand || ''} ${f.model || doc.title}</h3>
          </div>
          <span class="px-2.5 py-1 bg-red-600 text-white rounded text-[11px] font-bold uppercase tracking-wide">
            STOLEN / LOST
          </span>
        </div>

        <!-- IMEI 1 Primary -->
        <div class="bg-slate-900 p-4 rounded border border-slate-800 mb-3">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
            <div>
              <span class="text-[11px] uppercase font-bold text-slate-400">Primary Identifier: IMEI 1</span>
              <div class="text-xl sm:text-2xl font-mono font-black text-amber-300 tracking-wider">
                ${f.imei1 || '358291048291048'}
              </div>
            </div>
            <div class="hidden sm:block">
              ${imei1Barcode}
            </div>
          </div>
          <p class="text-[10px] text-slate-400">Essential 15-digit number required for Police FIR & CEIR Portal Blacklisting.</p>
        </div>

        <!-- IMEI 2 & Serial Number -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="bg-slate-900 p-3 rounded border border-slate-800">
            <span class="text-[10px] uppercase font-bold text-slate-400">Secondary IMEI 2 (eSIM):</span>
            <div class="font-mono text-base font-bold text-slate-200">
              ${f.imei2 || 'Not Applicable'}
            </div>
            ${imei2Barcode ? `<div class="mt-1">${imei2Barcode}</div>` : ''}
          </div>
          <div class="bg-slate-900 p-3 rounded border border-slate-800">
            <span class="text-[10px] uppercase font-bold text-slate-400">Hardware Serial Number:</span>
            <div class="font-mono text-base font-bold text-emerald-400">
              ${f.serialNumber || 'N/A'}
            </div>
          </div>
        </div>

      </div>

      <!-- Purchase Invoice Proof -->
      <div class="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
        <h2 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between">
          <span class="flex items-center gap-1.5"><span>🧾</span> Purchase & Ownership Proof</span>
          <span class="text-emerald-700 text-[11px] font-semibold">✓ Verified Tax Invoice Attached</span>
        </h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
          <div>
            <span class="text-slate-500 block">Purchase Date</span>
            <strong class="text-slate-900">${f.purchaseDate || 'N/A'}</strong>
          </div>
          <div>
            <span class="text-slate-500 block">Invoice Number</span>
            <strong class="font-mono text-slate-900">${f.invoiceNumber || 'INV-2024-88419'}</strong>
          </div>
          <div>
            <span class="text-slate-500 block">Retailer / Store</span>
            <strong class="text-slate-900">${f.retailer || 'Authorized Store'}</strong>
          </div>
          <div>
            <span class="text-slate-500 block">Purchase Price</span>
            <strong class="text-slate-900">${f.purchasePrice || '₹1,34,900'}</strong>
          </div>
        </div>
      </div>

      <!-- Incident Details (Fillable / Editable for Police Desk) -->
      <div class="border border-slate-200 rounded-lg p-4 mb-6">
        <h2 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
          <span>📍</span> Incident Narrative & Particulars
        </h2>
        <div class="grid grid-cols-2 gap-4 text-xs mb-3">
          <div>
            <span class="text-slate-500 block mb-1 font-medium">Estimated Date & Time of Incident:</span>
            <div class="border border-dashed border-slate-300 p-2 rounded bg-slate-50 text-slate-800 font-mono">
              ${currentDate} at approx. ${currentTime}
            </div>
          </div>
          <div>
            <span class="text-slate-500 block mb-1 font-medium">Location of Incident / Police Jurisdiction:</span>
            <div class="border border-dashed border-slate-300 p-2 rounded bg-slate-50 text-slate-800">
              [Specify Station / Location Name, e.g., Lokhandwala Market / Andheri Metro]
            </div>
          </div>
        </div>
        <div>
          <span class="text-slate-500 block mb-1 font-medium text-xs">Brief Description:</span>
          <div class="border border-dashed border-slate-300 p-2.5 rounded bg-slate-50 text-slate-700 text-xs leading-relaxed">
            I am reporting the theft/loss of my personal mobile phone specified above. The device contains sensitive personal data, banking apps, and communication records. I request the registration of this complaint, blocking of the IMEI numbers on the CEIR portal, and necessary assistance in tracing the stolen device.
          </div>
        </div>
      </div>

      <!-- Declaration and Signatures -->
      <div class="grid grid-cols-2 gap-6 pt-4 border-t-2 border-slate-200 text-xs">
        <div>
          <p class="text-slate-500 mb-8 leading-snug">
            I hereby declare that the particulars furnished above are true and correct to the best of my knowledge, and the device belongs to me.
          </p>
          <div class="border-t border-slate-400 pt-2 text-slate-800 font-bold">
            Signature of Complainant / Owner
          </div>
        </div>
        <div class="text-right">
          <div class="inline-block border border-dashed border-slate-300 p-3 rounded text-center w-48 mb-2">
            <span class="text-[10px] uppercase text-slate-400 block mb-6">Police Station Receiving Stamp</span>
            <span class="text-[11px] text-slate-500 font-mono">Date / GD Number</span>
          </div>
        </div>
      </div>

    </div>
  `;
}

/**
 * Generate formatted text template ready to paste into online police complaint portals
 */
export function generatePoliceReportText(doc, member) {
  const f = doc.fields || {};
  return `=== STOLEN / LOST MOBILE PHONE COMPLAINT DETAILS ===
Generated via FamVault

1. COMPLAINANT DETAILS:
Name: ${member ? member.name : 'Device Owner'}
Role: ${member ? member.role : 'Self'}
Contact Phone: ${member ? member.phone : ''}
Email: ${member ? member.email : ''}
Emergency Family Contact: Ahmed Shaikh (+91 98201 12345)

2. DEVICE PARTICULARS:
Make & Model: ${f.brand || ''} ${f.model || doc.title}
IMEI 1: ${f.imei1 || 'N/A'}
IMEI 2: ${f.imei2 || 'N/A'}
Hardware Serial No: ${f.serialNumber || 'N/A'}
SIM Number / Operator: ${f.carrier || 'Airtel'} (SIM Lock: ${f.carrierHelpline || '198'})

3. PURCHASE PROOF:
Invoice No: ${f.invoiceNumber || 'INV-2024-88419'}
Purchase Date: ${f.purchaseDate || 'N/A'}
Retailer: ${f.retailer || 'Authorized Store'}
Purchase Price: ${f.purchasePrice || 'N/A'}
Original Tax Invoice Attached: Yes (PDF attached)

4. CEIR / POLICE ACTION REQUESTED:
- Blacklist IMEI 1 (${f.imei1}) and IMEI 2 (${f.imei2}) immediately on CEIR portal.
- Issue Non-Cognizable (NC) / FIR report number.
==================================================`;
}

/**
 * Helper to generate a realistic SVG barcode for IMEI
 */
function generateBarcodeSVG(code) {
  // Generate visual bar widths based on digits
  const bars = [];
  const digits = String(code).replace(/\D/g, '');
  let x = 0;

  bars.push(`<rect x="${x}" y="0" width="2" height="28" fill="#facc15" />`);
  x += 3;

  for (let i = 0; i < digits.length; i++) {
    const digit = parseInt(digits[i], 10);
    const width = (digit % 3) + 1;
    const space = ((digit * 2) % 3) + 1;
    bars.push(`<rect x="${x}" y="0" width="${width}" height="28" fill="#facc15" />`);
    x += width + space;
  }

  bars.push(`<rect x="${x}" y="0" width="2" height="28" fill="#facc15" />`);
  x += 3;

  return `
    <svg width="${x}" height="28" viewBox="0 0 ${x} 28" class="inline-block opacity-90">
      ${bars.join('')}
    </svg>
  `;
}

/**
 * Render visual simulated bill / document for demo records
 */
export function renderSimulatedBillHTML(doc) {
  const f = doc.fields || {};
  const docType = doc.file?.sampleBillType || 'generic';

  if (docType === 'apple_invoice') {
    return `
      <div class="bg-white text-slate-800 p-6 rounded-lg border border-slate-200 font-sans text-xs">
        <div class="flex justify-between items-start border-b border-slate-200 pb-4 mb-4">
          <div>
            <div class="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
              <span></span> Apple India Private Limited
            </div>
            <p class="text-[11px] text-slate-500">Official Retail Store • Bandra Kurla Complex, Mumbai</p>
            <p class="text-[10px] text-slate-400">GSTIN: 27AABCA1234F1Z8</p>
          </div>
          <div class="text-right">
            <span class="text-xs font-bold px-2 py-0.5 bg-slate-100 rounded text-slate-700 uppercase">Original Tax Invoice</span>
            <div class="font-mono font-bold text-slate-900 text-sm mt-1">${f.invoiceNumber || 'INV-APL-BKC-2024-88419'}</div>
            <div class="text-slate-500 text-[11px]">Date: ${f.purchaseDate || '15-Oct-2024'}</div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-4 p-3 bg-slate-50 rounded">
          <div>
            <span class="text-[10px] font-bold uppercase text-slate-400 block">Billed To (Customer):</span>
            <strong class="text-slate-900 text-sm">Zayd Ahmed Shaikh</strong>
            <p class="text-slate-600 text-[11px]">Lokhandwala Complex, Andheri West, Mumbai</p>
            <p class="text-slate-600 text-[11px]">Phone: +91 98334 67890</p>
          </div>
          <div class="text-right">
            <span class="text-[10px] font-bold uppercase text-slate-400 block">Payment Method:</span>
            <span class="font-semibold text-slate-800">HDFC Credit Card (Ending in 4091)</span>
            <p class="text-emerald-700 font-bold mt-1">Status: Paid in Full</p>
          </div>
        </div>

        <table class="w-full mb-4 border border-slate-200 text-left">
          <thead class="bg-slate-100 text-slate-600 text-[11px] uppercase">
            <tr>
              <th class="p-2">Description</th>
              <th class="p-2">Serial / IMEI Details</th>
              <th class="p-2 text-right">Qty</th>
              <th class="p-2 text-right">Price</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr>
              <td class="p-2 font-semibold text-slate-900">
                ${f.model || 'iPhone 15 Pro Max 256GB Natural Titanium'}
                <span class="block text-[10px] text-slate-500 font-normal">Model: A3106 • Part No: MU773HN/A</span>
              </td>
              <td class="p-2 font-mono text-[11px]">
                <div>IMEI 1: <strong>${f.imei1 || '358291048291048'}</strong></div>
                <div>IMEI 2: ${f.imei2 || '358291048291049'}</div>
                <div>Serial: ${f.serialNumber || 'F17XQ93K0D'}</div>
              </td>
              <td class="p-2 text-right">1</td>
              <td class="p-2 text-right font-bold">${f.purchasePrice || '₹1,34,900'}</td>
            </tr>
            <tr>
              <td class="p-2 font-semibold text-slate-900">
                AppleCare+ Protection Plan for iPhone (2 Years)
              </td>
              <td class="p-2 text-slate-500 text-[11px]">Includes accidental damage protection</td>
              <td class="p-2 text-right">1</td>
              <td class="p-2 text-right font-bold">Included</td>
            </tr>
          </tbody>
        </table>

        <div class="flex justify-between items-center pt-2 border-t border-slate-200">
          <div class="text-[10px] text-slate-400">
            This is a computer-generated tax invoice. No signature is required.
          </div>
          <div class="text-right">
            <span class="text-slate-500 text-xs">Total Amount Paid:</span>
            <span class="text-lg font-bold text-slate-950 ml-2">${f.purchasePrice || '₹1,34,900'}</span>
          </div>
        </div>
      </div>
    `;
  }

  if (docType === 'health_card') {
    return `
      <div class="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-6 rounded-xl shadow-lg border border-blue-700/50">
        <div class="flex justify-between items-start mb-4 border-b border-blue-800 pb-3">
          <div>
            <div class="text-lg font-bold text-blue-200 flex items-center gap-2">
              <span>⭐</span> STAR HEALTH & ALLIED INSURANCE
            </div>
            <p class="text-[10px] text-blue-300">Cashless Health Insurance Card • Family Floater</p>
          </div>
          <span class="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-[10px] font-bold uppercase">
            Active Policy
          </span>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span class="text-[10px] uppercase text-blue-300 block">Primary Insured</span>
            <div class="text-base font-bold text-white">${f.policyHolder || 'Fatima Shaikh'}</div>
            <div class="text-xs text-blue-200 mt-1">Blood Group: <strong class="text-rose-300 font-bold">${f.bloodGroup || 'B+'}</strong></div>
          </div>
          <div>
            <span class="text-[10px] uppercase text-blue-300 block">TPA Member ID</span>
            <div class="text-base font-mono font-bold text-amber-300">${f.tpaMemberId || 'STAR-TPA-FAT-0294'}</div>
            <div class="text-xs text-blue-200 mt-1">Policy: <span class="font-mono">${f.policyNumber || 'SH-FAM-99214018-02'}</span></div>
          </div>
        </div>

        <div class="bg-blue-950/80 p-3 rounded border border-blue-800/80 mb-3 text-xs">
          <div class="flex justify-between">
            <span class="text-blue-300">Sum Insured:</span>
            <strong class="text-emerald-300">${f.sumInsured || '₹15,00,000'}</strong>
          </div>
          <div class="flex justify-between mt-1">
            <span class="text-blue-300">Cashless Emergency Helpline:</span>
            <strong class="font-mono text-amber-300">${f.cashlessHelpline || '1800-425-2255'}</strong>
          </div>
        </div>

        <p class="text-[10px] text-blue-300/80">
          ⚠️ ${f.allergies || 'Penicillin allergy noted'}. Present this digital card at network hospital admission counter for instant cashless approval.
        </p>
      </div>
    `;
  }

  // Fallback generic viewer
  return `
    <div class="bg-slate-900 p-6 rounded-lg border border-slate-800 text-slate-300 text-xs font-mono">
      <div class="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
        <span class="text-emerald-400 font-bold uppercase text-xs">Archived Document Record</span>
        <span class="text-slate-500">${doc.createdDate}</span>
      </div>
      <div class="space-y-2">
        <div><strong>Title:</strong> ${doc.title}</div>
        <div><strong>Category:</strong> ${doc.category}</div>
        ${Object.entries(f).map(([k, v]) => `<div><span class="text-slate-400">${k}:</span> <span class="text-white">${v}</span></div>`).join('')}
      </div>
    </div>
  `;
}
