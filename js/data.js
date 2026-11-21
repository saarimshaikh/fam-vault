/**
 * FamVault - Initial Mock & Seed Data
 * Tailored for real-life family emergency scenarios (e.g. stolen phone, police verification, hospital admission)
 */

export const INITIAL_MEMBERS = [
  {
    id: 'member-1',
    name: 'Ahmed Shaikh',
    role: 'Dad',
    relation: 'Father',
    phone: '+91 98201 12345',
    email: 'ahmed.shaikh@fammail.com',
    bloodGroup: 'O+',
    avatarColor: 'from-blue-600 to-indigo-700',
    avatarIcon: '🧔',
    isEmergencyContact: true,
  },
  {
    id: 'member-2',
    name: 'Fatima Shaikh',
    role: 'Mom',
    relation: 'Mother',
    phone: '+91 98201 54321',
    email: 'fatima.shaikh@fammail.com',
    bloodGroup: 'B+',
    avatarColor: 'from-pink-500 to-rose-700',
    avatarIcon: '👩',
    isEmergencyContact: true,
  },
  {
    id: 'member-3',
    name: 'Zayd Shaikh',
    role: 'Brother',
    relation: 'Brother',
    phone: '+91 98334 67890',
    email: 'zayd.shaikh@gmail.com',
    bloodGroup: 'A+',
    avatarColor: 'from-emerald-500 to-teal-700',
    avatarIcon: '👦',
    isEmergencyContact: false,
  },
  {
    id: 'member-4',
    name: 'Saarim Shaikh',
    role: 'Self',
    relation: 'You',
    phone: '+91 98190 99881',
    email: 'saarim@fammail.com',
    bloodGroup: 'O+',
    avatarColor: 'from-amber-500 to-orange-700',
    avatarIcon: '🧑',
    isEmergencyContact: true,
  },
  {
    id: 'member-5',
    name: 'Aanya Shaikh',
    role: 'Sister',
    relation: 'Sister',
    phone: '+91 98210 33445',
    email: 'aanya.shaikh@gmail.com',
    bloodGroup: 'A+',
    avatarColor: 'from-purple-500 to-violet-700',
    avatarIcon: '👧',
    isEmergencyContact: false,
  }
];

export const CATEGORIES = {
  devices: {
    id: 'devices',
    label: 'Phones & Devices',
    icon: 'smartphone',
    emoji: '📱',
    badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    description: 'Phones, laptops, smartwatches, IMEI & bills for police/warranty',
    primaryFieldLabel: 'IMEI 1 / Serial No',
    emergencyType: 'stolen_device'
  },
  identity: {
    id: 'identity',
    label: 'IDs & Passports',
    icon: 'id-card',
    emoji: '🪪',
    badgeClass: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    description: 'National IDs, Passports, Driving Licenses, Voter IDs',
    primaryFieldLabel: 'ID / Card Number',
    emergencyType: 'lost_wallet'
  },
  vehicles: {
    id: 'vehicles',
    label: 'Vehicles & RC',
    icon: 'car',
    emoji: '🚗',
    badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    description: 'Car & Bike RC, Driving License, PUC, Roadside Assistance',
    primaryFieldLabel: 'Reg / Policy No',
    emergencyType: 'roadside'
  },
  medical: {
    id: 'medical',
    label: 'Health & Medical',
    icon: 'activity',
    emoji: '🏥',
    badgeClass: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    description: 'Health Insurance, TPA Cards, Prescriptions, Blood Groups',
    primaryFieldLabel: 'TPA / Policy ID',
    emergencyType: 'hospital'
  },
  insurance: {
    id: 'insurance',
    label: 'Insurance & Policies',
    icon: 'shield-check',
    emoji: '🛡️',
    badgeClass: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    description: 'Term Life, Home, Gadget Cover, Travel Insurance',
    primaryFieldLabel: 'Policy Number',
    emergencyType: 'insurance_claim'
  },
  property: {
    id: 'property',
    label: 'Legal & Property',
    icon: 'file-text',
    emoji: '📑',
    badgeClass: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    description: 'Rent Agreements, Property Deeds, Bank Details',
    primaryFieldLabel: 'Doc Reference',
    emergencyType: 'general'
  }
};

export const INITIAL_DOCUMENTS = [
  {
    id: 'doc-001',
    title: "Zayd's iPhone 15 Pro Max",
    category: 'devices',
    memberId: 'member-3', // Zayd
    priority: 'high',
    isEmergencyCritical: true,
    createdDate: '2024-10-16',
    updatedDate: '2024-10-16',
    fields: {
      brand: 'Apple',
      model: 'iPhone 15 Pro Max (256 GB - Natural Titanium)',
      imei1: '358291048291048',
      imei2: '358291048291049',
      serialNumber: 'F17XQ93K0D',
      carrier: 'Airtel (SIM: 8991000984920194)',
      carrierHelpline: '198 / +91 98100 12345 (Airtel SIM Block)',
      purchaseDate: '2024-10-15',
      purchasePrice: '₹1,34,900',
      retailer: 'Apple Store BKC, Mumbai',
      invoiceNumber: 'INV-APL-BKC-2024-88419',
      warrantyExpiry: '2025-10-14 (AppleCare+ Active)',
      emergencyInstructions: '🚨 IF STOLEN/LOST: 1) Call Airtel on 198 to block SIM immediately. 2) Visit icloud.com/find & enable Lost Mode. 3) Go to nearest Police Station with IMEI 1 & Purchase Bill. Tap "Generate Police Report" above for pre-filled FIR slip.'
    },
    tags: ['Phone', 'Stolen Priority', 'Bill Attached', 'AppleCare'],
    file: {
      name: 'iPhone15ProMax_Official_Invoice_AppleStore.pdf',
      type: 'application/pdf',
      size: '342 KB',
      uploadedAt: '2024-10-16',
      // High-fidelity simulated bill preview
      isSampleBill: true,
      sampleBillType: 'apple_invoice'
    }
  },
  {
    id: 'doc-002',
    title: "Saarim's MacBook Pro M3 Pro",
    category: 'devices',
    memberId: 'member-4', // Saarim
    priority: 'normal',
    isEmergencyCritical: true,
    createdDate: '2024-03-12',
    updatedDate: '2024-03-12',
    fields: {
      brand: 'Apple',
      model: 'MacBook Pro 14-inch (M3 Pro, 18GB RAM, 512GB SSD)',
      serialNumber: 'C02K9872MD6R',
      purchaseDate: '2024-03-10',
      purchasePrice: '₹1,99,900',
      retailer: 'Reliance Digital Online',
      invoiceNumber: 'RD-INV-2024-99014',
      warrantyExpiry: '2025-03-09',
      emergencyInstructions: 'Find My Mac enabled via Apple ID: saarim@fammail.com. File theft complaint with Serial No.'
    },
    tags: ['Laptop', 'Work Machine', 'Bill Available'],
    file: {
      name: 'MacBookPro_M3_Tax_Invoice.pdf',
      type: 'application/pdf',
      size: '280 KB',
      uploadedAt: '2024-03-12',
      isSampleBill: true,
      sampleBillType: 'laptop_invoice'
    }
  },
  {
    id: 'doc-003',
    title: "Family Toyota Fortuner - Comprehensive Insurance & RC",
    category: 'vehicles',
    memberId: 'member-1', // Dad
    priority: 'high',
    isEmergencyCritical: true,
    createdDate: '2024-08-15',
    updatedDate: '2024-08-15',
    fields: {
      vehicleType: 'Car (Toyota Fortuner 4x4 AT)',
      regNumber: 'MH-02-DW-7821',
      chassisNumber: 'MBJ11FE500918231',
      engineNumber: '2GDFTV98214',
      insurer: 'HDFC ERGO General Insurance',
      policyNumber: '2311-2098-4491-0000',
      rsaPhone: '1800-226-226 (Toll-Free 24x7 Roadside Assistance)',
      claimHelpline: '022-6234-6234',
      policyExpiry: '2026-08-14',
      emergencyInstructions: 'In case of breakdown or accident: Call RSA toll-free immediately. Do not move car before clicking pictures for claim survey.'
    },
    tags: ['Car RC', 'Insurance', 'Roadside Assistance', 'Family Vehicle'],
    file: {
      name: 'Toyota_Fortuner_Insurance_Policy_2024_2026.pdf',
      type: 'application/pdf',
      size: '512 KB',
      uploadedAt: '2024-08-15',
      isSampleBill: true,
      sampleBillType: 'vehicle_policy'
    }
  },
  {
    id: 'doc-004',
    title: "Mom's Star Health Comprehensive Mediclaim Card",
    category: 'medical',
    memberId: 'member-2', // Mom
    priority: 'high',
    isEmergencyCritical: true,
    createdDate: '2024-01-10',
    updatedDate: '2024-01-10',
    fields: {
      policyHolder: 'Fatima Shaikh (and Family)',
      insuranceCompany: 'Star Health & Allied Insurance',
      policyNumber: 'SH-FAM-99214018-02',
      tpaMemberId: 'STAR-TPA-FAT-0294',
      cashlessHelpline: '1800-425-2255 / 1800-102-4477',
      sumInsured: '₹15,00,000 (Floater)',
      bloodGroup: 'B+',
      allergies: 'Penicillin allergy (Alert doctor during admission)',
      emHospitalList: 'Lilavati Hospital (Bandra), Fortis Hospital (Mulund), Hinduja Healthcare',
      emergencyInstructions: 'For Cashless Admission: Show TPA Card ID & Fatima’s ID at Emergency Hospital Admission Desk within 24 hours.'
    },
    tags: ['Health Card', 'Cashless Hospital', 'Floater 15L', 'Urgent'],
    file: {
      name: 'StarHealth_Family_Mediclaim_Card.pdf',
      type: 'application/pdf',
      size: '410 KB',
      uploadedAt: '2024-01-10',
      isSampleBill: true,
      sampleBillType: 'health_card'
    }
  },
  {
    id: 'doc-005',
    title: "Zayd's International Passport",
    category: 'identity',
    memberId: 'member-3', // Zayd
    priority: 'normal',
    isEmergencyCritical: true,
    createdDate: '2023-05-10',
    updatedDate: '2023-05-10',
    fields: {
      idType: 'Passport',
      documentNumber: 'V8491028',
      surname: 'SHAIKH',
      givenName: 'ZAYD AHMED',
      placeOfBirth: 'Mumbai, India',
      issueDate: '2022-04-12',
      expiryDate: '2032-04-11',
      issuingAuthority: 'Regional Passport Office Mumbai',
      emergencyInstructions: 'Keep digital copy handy for international travel, visa applications, and lost passport consular reporting.'
    },
    tags: ['Passport', 'Travel Doc', 'Valid till 2032'],
    file: {
      name: 'Zayd_Passport_First_Last_Page.pdf',
      type: 'application/pdf',
      size: '620 KB',
      uploadedAt: '2023-05-10',
      isSampleBill: true,
      sampleBillType: 'passport_scan'
    }
  },
  {
    id: 'doc-006',
    title: "Dad's Aadhaar & Pan Card (National ID)",
    category: 'identity',
    memberId: 'member-1', // Dad
    priority: 'normal',
    isEmergencyCritical: false,
    createdDate: '2023-01-15',
    updatedDate: '2023-01-15',
    fields: {
      idType: 'Aadhaar & PAN Card',
      aadhaarNumber: '7829 4410 9921',
      panNumber: 'ABCPS9812M',
      fullName: 'Ahmed Mohammed Shaikh',
      dateOfBirth: '1968-07-22',
      registeredMobile: '+91 98201 12345 (Receives OTP)'
    },
    tags: ['National ID', 'Aadhaar', 'PAN Card', 'Tax ID'],
    file: {
      name: 'Ahmed_Shaikh_Aadhaar_PAN_Combined.pdf',
      type: 'application/pdf',
      size: '480 KB',
      uploadedAt: '2023-01-15',
      isSampleBill: true,
      sampleBillType: 'id_card'
    }
  },
  {
    id: 'doc-007',
    title: "Mom's Samsung Galaxy S24 Ultra",
    category: 'devices',
    memberId: 'member-2', // Mom
    priority: 'normal',
    isEmergencyCritical: true,
    createdDate: '2024-02-05',
    updatedDate: '2024-02-05',
    fields: {
      brand: 'Samsung',
      model: 'Galaxy S24 Ultra 5G (Titanium Gray 512GB)',
      imei1: '359102837461920',
      imei2: '359102837461921',
      serialNumber: 'R58W10XYZ88',
      carrier: 'Jio 5G',
      carrierHelpline: '199 / 1800-889-9999 (Jio Block SIM)',
      purchaseDate: '2024-02-01',
      purchasePrice: '₹1,29,999',
      retailer: 'Samsung Smart Plaza',
      invoiceNumber: 'SSP-MUM-2024-1102',
      warrantyExpiry: '2025-01-31'
    },
    tags: ['Phone', 'Samsung', '5G', 'Bill Attached'],
    file: {
      name: 'Samsung_S24Ultra_Invoice_SmartPlaza.pdf',
      type: 'application/pdf',
      size: '295 KB',
      uploadedAt: '2024-02-05',
      isSampleBill: true,
      sampleBillType: 'samsung_invoice'
    }
  },
  {
    id: 'doc-008',
    title: "Family Residence - Registered Lease & Society NOC",
    category: 'property',
    memberId: 'member-1', // Dad
    priority: 'low',
    isEmergencyCritical: false,
    createdDate: '2023-11-01',
    updatedDate: '2023-11-01',
    fields: {
      docType: 'Lease Deed & Society Certificate',
      propertyAddress: 'Apt 802, Palm Crest Heights, Lokhandwala Complex, Andheri West, Mumbai 400053',
      registrationNumber: 'BND-4/10928/2023',
      societySecretaryContact: '+91 98200 44556 (Mr. Verma)'
    },
    tags: ['Address Proof', 'Rental Deed', 'Society NOC'],
    file: {
      name: 'PalmCrest_Lease_Agreement_Registered.pdf',
      type: 'application/pdf',
      size: '1.2 MB',
      uploadedAt: '2023-11-01',
      isSampleBill: true,
      sampleBillType: 'lease_agreement'
    }
  }
];
