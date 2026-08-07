import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  User,
  RTOApplication,
  Vehicle,
  DrivingLicense,
  PaymentRecord,
  AuditLog,
  Notice,
  Grievance,
  DrivingTestSlot
} from './src/types/index.js';

const app = express();
app.use(express.json({ limit: '10mb' }));

const PORT = 3000;

// Initialize Gemini Client server-side
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// In-memory Database Store
let users: User[] = [
  {
    id: 'user-c1',
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@example.com',
    phone: '+91 98765 43210',
    aadhaarNumber: '8392-1029-4812',
    role: 'citizen',
    createdAt: '2026-01-15T10:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  {
    id: 'user-c2',
    name: 'Priya Verma',
    email: 'priya.verma@example.com',
    phone: '+91 91234 56789',
    aadhaarNumber: '9210-3849-1029',
    role: 'citizen',
    createdAt: '2026-02-01T11:30:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
  {
    id: 'user-o1',
    name: 'Inspector Vikram Kulkarni',
    email: 'officer.kulkarni@rto.gov.in',
    phone: '+91 94220 11223',
    aadhaarNumber: '4019-2831-9012',
    role: 'officer',
    rtoCode: 'MH-12',
    rtoName: 'MH-12 (Pune RTO)',
    createdAt: '2025-06-10T09:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  {
    id: 'user-a1',
    name: 'Admin - RTO Central Command',
    email: 'admin.parivahan@rto.gov.in',
    phone: '+91 80000 11111',
    aadhaarNumber: '1111-2222-3333',
    role: 'admin',
    createdAt: '2025-01-01T00:00:00Z',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  },
];

let applications: RTOApplication[] = [
  {
    id: 'app-001',
    applicationNumber: 'RTO2026-88120',
    userId: 'user-c1',
    applicantName: 'Rajesh Sharma',
    applicantEmail: 'rajesh.sharma@example.com',
    applicantPhone: '+91 98765 43210',
    aadhaarNumber: '8392-1029-4812',
    type: 'permanent_license',
    rtoOffice: 'MH-12 (Pune RTO)',
    status: 'test_scheduled',
    submittedAt: '2026-08-01T09:30:00Z',
    updatedAt: '2026-08-05T14:20:00Z',
    feeAmount: 1100,
    paymentStatus: 'completed',
    paymentId: 'PAY-2026-90812',
    documents: [
      {
        id: 'doc-1',
        type: 'aadhaar',
        name: 'Aadhaar_Card_Rajesh.pdf',
        fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600',
        status: 'verified',
        uploadedAt: '2026-08-01T09:35:00Z',
      },
      {
        id: 'doc-2',
        type: 'photo',
        name: 'Passport_Photo_Rajesh.jpg',
        fileUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600',
        status: 'verified',
        uploadedAt: '2026-08-01T09:36:00Z',
      },
      {
        id: 'doc-3',
        type: 'signature',
        name: 'Signature_Rajesh.jpg',
        fileUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600',
        status: 'verified',
        uploadedAt: '2026-08-01T09:37:00Z',
      },
    ],
    testDetails: {
      id: 'test-1',
      applicationId: 'app-001',
      applicantName: 'Rajesh Sharma',
      testType: 'practical_driving',
      scheduledDate: '2026-08-10',
      scheduledTime: '10:30 AM',
      rtoCenter: 'MH-12 Pune Ground 2',
      status: 'scheduled',
    },
    assignedOfficerId: 'user-o1',
    officerRemarks: 'All documents verified successfully. Practical driving track test scheduled.',
  },
  {
    id: 'app-002',
    applicationNumber: 'RTO2026-94102',
    userId: 'user-c2',
    applicantName: 'Priya Verma',
    applicantEmail: 'priya.verma@example.com',
    applicantPhone: '+91 91234 56789',
    aadhaarNumber: '9210-3849-1029',
    type: 'new_vehicle_registration',
    rtoOffice: 'MH-12 (Pune RTO)',
    status: 'documents_under_review',
    submittedAt: '2026-08-06T11:15:00Z',
    updatedAt: '2026-08-06T11:15:00Z',
    feeAmount: 3200,
    paymentStatus: 'completed',
    paymentId: 'PAY-2026-91204',
    documents: [
      {
        id: 'doc-101',
        type: 'insurance',
        name: 'HDFC_Ergo_Insurance_Policy.pdf',
        fileUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600',
        status: 'pending',
        uploadedAt: '2026-08-06T11:16:00Z',
      },
      {
        id: 'doc-102',
        type: 'puc',
        name: 'Pollution_Certificate.pdf',
        fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600',
        status: 'pending',
        uploadedAt: '2026-08-06T11:17:00Z',
      },
    ],
    officerRemarks: 'Awaiting officer document verification.',
  },
  {
    id: 'app-003',
    applicationNumber: 'RTO2026-55410',
    userId: 'user-c1',
    applicantName: 'Rajesh Sharma',
    applicantEmail: 'rajesh.sharma@example.com',
    applicantPhone: '+91 98765 43210',
    aadhaarNumber: '8392-1029-4812',
    type: 'learner_license',
    rtoOffice: 'MH-12 (Pune RTO)',
    status: 'certificate_issued',
    submittedAt: '2026-07-01T10:00:00Z',
    updatedAt: '2026-07-02T16:00:00Z',
    feeAmount: 500,
    paymentStatus: 'completed',
    paymentId: 'PAY-2026-10293',
    documents: [],
    issuedNumber: 'LL-MH12-2026-004921',
    officerRemarks: 'Online computer test passed with 18/20. Provisional Learner License issued.',
  },
];

let vehicles: Vehicle[] = [
  {
    id: 'veh-1',
    registrationNumber: 'MH 12 AB 9988',
    ownerId: 'user-c1',
    ownerName: 'Rajesh Sharma',
    ownerAddress: 'Flat 402, Sunshine Heights, Baner Road, Pune - 411045',
    vehicleClass: 'lmv_car',
    makerModel: 'Tata Nexon EV Max',
    chassisNumber: 'MAT612093M8A10294',
    engineNumber: 'ENG88102948',
    fuelType: 'EV',
    registrationDate: '2024-03-15',
    validUntil: '2039-03-14',
    rtoOffice: 'MH-12 (Pune RTO)',
    insuranceValidUntil: '2027-03-14',
    pucValidUntil: '2027-03-14',
    status: 'active',
    qrCodeValue: 'RTO-RC-MH12AB9988-RAJESH-SHARMA',
  },
  {
    id: 'veh-2',
    registrationNumber: 'MH 12 CR 4512',
    ownerId: 'user-c2',
    ownerName: 'Priya Verma',
    ownerAddress: 'Plot 12, Green Park Society, Kothrud, Pune - 411038',
    vehicleClass: '2_wheeler',
    makerModel: 'Honda Activa 6G',
    chassisNumber: 'ME4JK081293019284',
    engineNumber: 'ENG55019284',
    fuelType: 'Petrol',
    registrationDate: '2023-09-10',
    validUntil: '2038-09-09',
    rtoOffice: 'MH-12 (Pune RTO)',
    insuranceValidUntil: '2026-09-09',
    pucValidUntil: '2026-12-15',
    status: 'active',
    qrCodeValue: 'RTO-RC-MH12CR4512-PRIYA-VERMA',
  },
];

let licenses: DrivingLicense[] = [
  {
    id: 'dl-1',
    licenseNumber: 'MH12 20240098124',
    userId: 'user-c1',
    holderName: 'Rajesh Sharma',
    dob: '1992-06-18',
    bloodGroup: 'O+',
    address: 'Flat 402, Sunshine Heights, Baner Road, Pune - 411045',
    vehicleClasses: ['MCWG', 'LMV'],
    type: 'permanent',
    issueDate: '2024-01-10',
    expiryDate: '2044-01-09',
    issuingRTO: 'MH-12 (Pune RTO)',
    status: 'active',
    qrCodeValue: 'RTO-DL-MH1220240098124-RAJESH-SHARMA',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
  },
];

let payments: PaymentRecord[] = [
  {
    id: 'pay-1',
    transactionId: 'TXN-9018241029',
    applicationId: 'app-001',
    applicantName: 'Rajesh Sharma',
    purpose: 'Permanent Driving License & Road Test Fee',
    amount: 1100,
    paymentMethod: 'upi',
    status: 'completed',
    paidAt: '2026-08-01T09:32:00Z',
    receiptNumber: 'REC-MH12-2026-8801',
  },
  {
    id: 'pay-2',
    transactionId: 'TXN-9018241088',
    applicationId: 'app-002',
    applicantName: 'Priya Verma',
    purpose: 'New Vehicle Smart Card Registration Fee & Road Tax',
    amount: 3200,
    paymentMethod: 'card',
    status: 'completed',
    paidAt: '2026-08-06T11:15:00Z',
    receiptNumber: 'REC-MH12-2026-9102',
  },
];

let auditLogs: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: new Date().toISOString(),
    actorName: 'Inspector Vikram Kulkarni',
    actorRole: 'officer',
    action: 'TEST_SCHEDULED',
    details: 'Scheduled practical driving test for Application RTO2026-88120 (Rajesh Sharma)',
    ipAddress: '192.168.1.45',
  },
  {
    id: 'log-2',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    actorName: 'Priya Verma',
    actorRole: 'citizen',
    action: 'APPLICATION_SUBMITTED',
    details: 'Submitted New Vehicle Registration request (RTO2026-94102)',
    ipAddress: '10.0.4.12',
  },
];

let notices: Notice[] = [
  {
    id: 'not-1',
    recipientId: 'user-c1',
    recipientName: 'Rajesh Sharma',
    title: 'Driving Test Scheduled',
    message: 'Your driving test for permanent DL has been scheduled on 10-Aug-2026 at MH-12 Pune Ground 2.',
    category: 'reminder',
    issuedAt: new Date(Date.now() - 7200000).toISOString(),
    isRead: false,
  },
];

let grievances: Grievance[] = [
  {
    id: 'griev-1',
    ticketId: 'GRV-2026-1029',
    userId: 'user-c1',
    userName: 'Rajesh Sharma',
    subject: 'Delay in physical Smart Card delivery',
    category: 'rc_issue',
    description: 'My digital RC is available online but I haven to receive physical speed post delivery.',
    status: 'in_progress',
    createdAt: '2026-08-03T10:00:00Z',
    resolutionText: 'Speed post tracking code initialized. Dispatch scheduled within 2 business days.',
  },
];

// Helper: Add Audit Log
function logAction(actorName: string, actorRole: any, action: string, details: string, ip: string = '127.0.0.1') {
  auditLogs.unshift({
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    actorName,
    actorRole,
    action,
    details,
    ipAddress: ip,
  });
}

// REST APIs
// 1. Auth endpoints
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { role, email } = req.body;
  let user = users.find((u) => u.role === role);
  if (email) {
    const matched = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (matched) user = matched;
  }
  if (!user) {
    user = users[0];
  }
  logAction(user.name, user.role, 'USER_LOGIN', `Logged in successfully as ${user.role}`);
  res.json({ token: `mock-jwt-token-${user.id}`, user });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, phone, aadhaarNumber, role } = req.body;
  const newUser: User = {
    id: `user-${Date.now()}`,
    name,
    email,
    phone,
    aadhaarNumber,
    role: role || 'citizen',
    createdAt: new Date().toISOString(),
    avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`,
  };
  users.push(newUser);
  logAction(newUser.name, newUser.role, 'USER_REGISTER', 'Created a new citizen account');
  res.json({ token: `mock-jwt-token-${newUser.id}`, user: newUser });
});

// 2. Applications API
app.get('/api/applications', (req: Request, res: Response) => {
  const { userId, role, rtoOffice } = req.query;
  let filtered = [...applications];
  if (role === 'citizen' && userId) {
    filtered = filtered.filter((a) => a.userId === userId);
  } else if (role === 'officer' && rtoOffice) {
    filtered = filtered.filter((a) => a.rtoOffice.includes(rtoOffice as string) || true);
  }
  res.json(filtered);
});

app.post('/api/applications', (req: Request, res: Response) => {
  const body = req.body;
  const appNumber = `RTO2026-${Math.floor(10000 + Math.random() * 90000)}`;
  const newApp: RTOApplication = {
    id: `app-${Date.now()}`,
    applicationNumber: appNumber,
    userId: body.userId,
    applicantName: body.applicantName,
    applicantEmail: body.applicantEmail,
    applicantPhone: body.applicantPhone,
    aadhaarNumber: body.aadhaarNumber,
    type: body.type,
    rtoOffice: body.rtoOffice || 'MH-12 (Pune RTO)',
    status: 'submitted',
    submittedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    feeAmount: body.feeAmount || 1000,
    paymentStatus: 'pending',
    documents: body.documents || [],
    officerRemarks: 'Submitted and awaiting fee payment / verification.',
  };
  applications.unshift(newApp);
  logAction(body.applicantName, 'citizen', 'SUBMIT_APPLICATION', `Submitted application ${appNumber} for ${body.type}`);
  res.json(newApp);
});

app.patch('/api/applications/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, officerRemarks, officerName, issuedNumber, testDetails } = req.body;

  const appItem = applications.find((a) => a.id === id);
  if (!appItem) {
    res.status(404).json({ error: 'Application not found' });
    return;
  }

  appItem.status = status;
  appItem.updatedAt = new Date().toISOString();
  if (officerRemarks) appItem.officerRemarks = officerRemarks;
  if (issuedNumber) appItem.issuedNumber = issuedNumber;
  if (testDetails) appItem.testDetails = testDetails;

  // Auto-generate license or vehicle if approved/issued
  if (status === 'certificate_issued' || status === 'approved') {
    if (appItem.type.includes('license') || appItem.type.includes('learner') || appItem.type.includes('permit')) {
      const isLearner = appItem.type === 'learner_license';
      const licenseNo = issuedNumber || (isLearner ? `LL-MH12-2026-${Math.floor(100000 + Math.random() * 900000)}` : `MH12 2026${Math.floor(1000000 + Math.random() * 9000000)}`);
      appItem.issuedNumber = licenseNo;

      const newDL: DrivingLicense = {
        id: `dl-${Date.now()}`,
        licenseNumber: licenseNo,
        userId: appItem.userId,
        holderName: appItem.applicantName,
        dob: '1995-04-12',
        bloodGroup: 'B+',
        address: 'Pune Maharashtra',
        vehicleClasses: isLearner ? ['LMV (Learner)'] : ['MCWG', 'LMV'],
        type: isLearner ? 'learner' : 'permanent',
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: isLearner ? '2027-02-01' : '2046-02-01',
        issuingRTO: appItem.rtoOffice,
        status: 'active',
        qrCodeValue: `RTO-DL-${licenseNo}-${appItem.applicantName}`,
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
      };
      licenses.unshift(newDL);
    } else if (appItem.type.includes('vehicle') || appItem.type.includes('transfer')) {
      const regNo = issuedNumber || `MH 12 FK ${Math.floor(1000 + Math.random() * 9000)}`;
      appItem.issuedNumber = regNo;

      const newVeh: Vehicle = {
        id: `veh-${Date.now()}`,
        registrationNumber: regNo,
        ownerId: appItem.userId,
        ownerName: appItem.applicantName,
        ownerAddress: 'Pune, Maharashtra',
        vehicleClass: 'lmv_car',
        makerModel: 'Mahindra XUV700 AX7',
        chassisNumber: `MA39102${Math.floor(100000 + Math.random() * 900000)}`,
        engineNumber: `ENG9021${Math.floor(10000 + Math.random() * 90000)}`,
        fuelType: 'Petrol',
        registrationDate: new Date().toISOString().split('T')[0],
        validUntil: '2041-08-01',
        rtoOffice: appItem.rtoOffice,
        insuranceValidUntil: '2027-08-01',
        pucValidUntil: '2027-08-01',
        status: 'active',
        qrCodeValue: `RTO-RC-${regNo}-${appItem.applicantName}`,
      };
      vehicles.unshift(newVeh);
    }
  }

  logAction(officerName || 'RTO Officer', 'officer', 'UPDATE_APP_STATUS', `Updated App ${appItem.applicationNumber} to ${status}`);
  res.json(appItem);
});

// Document verification update
app.patch('/api/applications/:appId/documents/:docId', (req: Request, res: Response) => {
  const { appId, docId } = req.params;
  const { status, rejectionReason } = req.body;

  const appItem = applications.find((a) => a.id === appId);
  if (!appItem) {
    res.status(404).json({ error: 'Application not found' });
    return;
  }

  const doc = appItem.documents.find((d) => d.id === docId);
  if (doc) {
    doc.status = status;
    if (rejectionReason) doc.rejectionReason = rejectionReason;
  }

  res.json(appItem);
});

// 3. Vehicles API
app.get('/api/vehicles', (req: Request, res: Response) => {
  const { query, ownerId } = req.query;
  let list = [...vehicles];
  if (ownerId) {
    list = list.filter((v) => v.ownerId === ownerId);
  }
  if (query) {
    const q = (query as string).toLowerCase().trim();
    list = list.filter(
      (v) =>
        v.registrationNumber.toLowerCase().includes(q) ||
        v.ownerName.toLowerCase().includes(q) ||
        v.chassisNumber.toLowerCase().includes(q)
    );
  }
  res.json(list);
});

// 4. Licenses API
app.get('/api/licenses', (req: Request, res: Response) => {
  const { query, userId } = req.query;
  let list = [...licenses];
  if (userId) {
    list = list.filter((l) => l.userId === userId);
  }
  if (query) {
    const q = (query as string).toLowerCase().trim();
    list = list.filter(
      (l) =>
        l.licenseNumber.toLowerCase().includes(q) ||
        l.holderName.toLowerCase().includes(q)
    );
  }
  res.json(list);
});

// 5. Payments API
app.get('/api/payments', (req: Request, res: Response) => {
  res.json(payments);
});

app.post('/api/payments', (req: Request, res: Response) => {
  const { applicationId, amount, purpose, applicantName, paymentMethod } = req.body;
  const txnId = `TXN-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
  const receiptNo = `REC-MH12-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const record: PaymentRecord = {
    id: `pay-${Date.now()}`,
    transactionId: txnId,
    applicationId,
    applicantName,
    purpose,
    amount,
    paymentMethod,
    status: 'completed',
    paidAt: new Date().toISOString(),
    receiptNumber: receiptNo,
  };

  payments.unshift(record);

  // Update application payment status
  const appItem = applications.find((a) => a.id === applicationId);
  if (appItem) {
    appItem.paymentStatus = 'completed';
    appItem.paymentId = record.id;
    if (appItem.status === 'submitted') {
      appItem.status = 'documents_under_review';
    }
  }

  logAction(applicantName, 'citizen', 'PAYMENT_SUCCESS', `Paid ₹${amount} for ${purpose} via ${paymentMethod.toUpperCase()}`);
  res.json(record);
});

// 6. Universal Search API (Vehicle / DL / Application / Aadhaar / Mobile)
app.get('/api/search', (req: Request, res: Response) => {
  const q = ((req.query.q as string) || '').trim().toLowerCase();
  if (!q) {
    res.json({ vehicles: [], licenses: [], applications: [] });
    return;
  }

  const matchedVehicles = vehicles.filter(
    (v) =>
      v.registrationNumber.toLowerCase().includes(q) ||
      v.ownerName.toLowerCase().includes(q) ||
      v.chassisNumber.toLowerCase().includes(q)
  );

  const matchedLicenses = licenses.filter(
    (l) =>
      l.licenseNumber.toLowerCase().includes(q) ||
      l.holderName.toLowerCase().includes(q)
  );

  const matchedApps = applications.filter(
    (a) =>
      a.applicationNumber.toLowerCase().includes(q) ||
      a.applicantName.toLowerCase().includes(q) ||
      a.aadhaarNumber.includes(q) ||
      a.applicantPhone.includes(q)
  );

  res.json({
    vehicles: matchedVehicles,
    licenses: matchedLicenses,
    applications: matchedApps,
  });
});

// 7. Audit Logs API
app.get('/api/admin/logs', (req: Request, res: Response) => {
  res.json(auditLogs);
});

// 8. Admin Users API
app.get('/api/admin/users', (req: Request, res: Response) => {
  res.json(users);
});

// 9. Admin Dashboard Stats API
app.get('/api/admin/stats', (req: Request, res: Response) => {
  const totalRevenue = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingApps = applications.filter((a) => a.status !== 'approved' && a.status !== 'rejected' && a.status !== 'certificate_issued').length;
  const approvedApps = applications.filter((a) => a.status === 'approved' || a.status === 'certificate_issued').length;

  res.json({
    totalUsers: users.filter((u) => u.role === 'citizen').length,
    totalOfficers: users.filter((u) => u.role === 'officer').length,
    totalVehicles: vehicles.length,
    totalLicenses: licenses.length,
    totalApplications: applications.length,
    pendingApplications: pendingApps,
    approvedApplications: approvedApps,
    totalRevenue,
    monthlyStats: [
      { month: 'Mar 2026', registrations: 120, licenses: 95, revenue: 185000 },
      { month: 'Apr 2026', registrations: 145, licenses: 110, revenue: 210000 },
      { month: 'May 2026', registrations: 160, licenses: 135, revenue: 245000 },
      { month: 'Jun 2026', registrations: 180, licenses: 150, revenue: 290000 },
      { month: 'Jul 2026', registrations: 210, licenses: 175, revenue: 340000 },
      { month: 'Aug 2026', registrations: 240, licenses: 190, revenue: 380000 },
    ],
    vehicleCategoryBreakdown: [
      { name: '2-Wheeler (Motorcycle/Scooter)', count: 1450 },
      { name: 'LMV (Cars & SUV)', count: 980 },
      { name: 'Electric Vehicles (EV)', count: 420 },
      { name: 'Commercial (HMV/Buses)', count: 210 },
    ],
  });
});

// 10. Grievances API
app.get('/api/grievances', (req: Request, res: Response) => {
  res.json(grievances);
});

app.post('/api/grievances', (req: Request, res: Response) => {
  const { userId, userName, subject, category, description } = req.body;
  const newG: Grievance = {
    id: `griev-${Date.now()}`,
    ticketId: `GRV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    userId,
    userName,
    subject,
    category,
    description,
    status: 'open',
    createdAt: new Date().toISOString(),
  };
  grievances.unshift(newG);
  logAction(userName, 'citizen', 'FILE_GRIEVANCE', `Filed grievance ticket ${newG.ticketId}`);
  res.json(newG);
});

// 11. AI Assistant Chatbot (Gemini API) Endpoint
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    if (!aiClient) {
      // Fallback response if GEMINI_API_KEY is not configured yet
      res.json({
        reply: `Hello! I am **RTO Sahayak AI**. Here is official info for your query:

1. **Learner License**: Required age 18 (16 for gearless 50cc). Fee: ₹500. Needs Aadhaar, Age proof & Photo.
2. **Permanent License**: Apply 30 days after Learner License issue. Fee: ₹1100. Practical road test mandatory.
3. **Vehicle RC Registration**: Requires Dealer Form 21, Roadworthiness Form 22, Insurance & PUC. Fee: ₹3200 + Road Tax.
4. **Ownership Transfer**: Submit Form 29 & 30 along with NOC from seller RTO.

How else can I assist your e-Governance request today?`,
      });
      return;
    }

    const systemPrompt = `You are "RTO Sahayak AI", an official intelligent virtual assistant for the Indian RTO (Regional Transport Office) e-Governance Portal.
You assist citizens, officers, and vehicle owners with concise, accurate, and professional information regarding:
- Learner License (LL) & Permanent Driving License (DL) rules, eligibility, fee structure, and document requirements.
- Vehicle Registration Certificate (RC), Ownership Transfer (Form 29/30), NOC issuance, and Address Change.
- Online fee payment guidance, slot booking for driving test, and application status tracking.
- Motor Vehicle Act guidelines, PUC rules, traffic rules, speed limits, and fine structures.
- Polite, official government tone with structured bullet points and markdown. Keep answers helpful and clear.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: message,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'I apologize, I could not process that query right now. Please try again or check the RTO Portal FAQs.';
    res.json({ reply });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      error: 'Failed to generate AI response',
      details: error.message,
      reply: 'RTO Sahayak AI is currently offline. Please refer to our FAQ section or contact helpline 1800-110-022.',
    });
  }
});

// Vite Middleware Integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RTO Portal Express server listening on http://localhost:${PORT}`);
  });
}

startServer();
