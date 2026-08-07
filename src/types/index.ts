export type UserRole = 'citizen' | 'officer' | 'admin';

export type ApplicationType =
  | 'learner_license'
  | 'permanent_license'
  | 'license_renewal'
  | 'duplicate_license'
  | 'international_permit'
  | 'new_vehicle_registration'
  | 'ownership_transfer'
  | 'address_change';

export type ApplicationStatus =
  | 'submitted'
  | 'documents_under_review'
  | 'test_scheduled'
  | 'approved'
  | 'rejected'
  | 'certificate_issued';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export type PaymentMethod = 'upi' | 'card' | 'net_banking' | 'wallet';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  aadhaarNumber: string;
  role: UserRole;
  rtoCode?: string; // For officers, e.g. "MH-12 (Pune)"
  rtoName?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface DocumentFile {
  id: string;
  type: 'aadhaar' | 'pan' | 'passport' | 'photo' | 'signature' | 'insurance' | 'puc' | 'address_proof';
  name: string;
  fileUrl: string;
  status: 'pending' | 'verified' | 'rejected';
  rejectionReason?: string;
  uploadedAt: string;
}

export interface PaymentRecord {
  id: string;
  transactionId: string;
  applicationId: string;
  applicantName: string;
  purpose: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  paidAt: string;
  receiptNumber: string;
}

export interface DrivingLicense {
  id: string;
  licenseNumber: string; // e.g. MH12 20240019283
  userId: string;
  holderName: string;
  dob: string;
  bloodGroup: string;
  address: string;
  vehicleClasses: string[]; // e.g. ['MCWG', 'LMV']
  type: 'learner' | 'permanent' | 'international';
  issueDate: string;
  expiryDate: string;
  issuingRTO: string;
  status: 'active' | 'expired' | 'suspended';
  qrCodeValue: string;
  photoUrl?: string;
}

export interface Vehicle {
  id: string;
  registrationNumber: string; // e.g. MH 12 AB 1234
  ownerId: string;
  ownerName: string;
  ownerAddress: string;
  vehicleClass: '2_wheeler' | 'lmv_car' | 'hmv_truck' | 'electric' | 'commercial';
  makerModel: string;
  chassisNumber: string;
  engineNumber: string;
  fuelType: 'Petrol' | 'Diesel' | 'EV' | 'CNG';
  registrationDate: string;
  validUntil: string;
  rtoOffice: string;
  insuranceValidUntil: string;
  pucValidUntil: string;
  status: 'active' | 'transferred' | 'scrapped';
  qrCodeValue: string;
}

export interface DrivingTestSlot {
  id: string;
  applicationId: string;
  applicantName: string;
  testType: 'learner_online' | 'practical_driving';
  scheduledDate: string;
  scheduledTime: string;
  rtoCenter: string;
  status: 'scheduled' | 'passed' | 'failed';
  score?: number;
  examinerNotes?: string;
}

export interface RTOApplication {
  id: string;
  applicationNumber: string; // e.g. RTO2026-98124
  userId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  aadhaarNumber: string;
  type: ApplicationType;
  rtoOffice: string;
  status: ApplicationStatus;
  submittedAt: string;
  updatedAt: string;
  feeAmount: number;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  documents: DocumentFile[];
  testDetails?: DrivingTestSlot;
  officerRemarks?: string;
  assignedOfficerId?: string;
  issuedNumber?: string; // DL or RC number generated upon approval
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  details: string;
  ipAddress: string;
}

export interface Notice {
  id: string;
  recipientId: string;
  recipientName: string;
  title: string;
  message: string;
  category: 'warning' | 'reminder' | 'approval' | 'rejection';
  issuedAt: string;
  isRead: boolean;
}

export interface Grievance {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  subject: string;
  category: 'license_delay' | 'rc_issue' | 'payment_failed' | 'officer_behavior' | 'technical';
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  resolutionText?: string;
}
