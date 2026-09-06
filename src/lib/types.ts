export type Profile = {
  userId: string;
  role: string;
  displayName: string;
  phone: string | null;
  city: string | null;
  bio: string | null;
  languages: string;
  onboarded: boolean;
};

export type Project = {
  id: number;
  ownerId: string;
  name: string;
  city: string;
  address: string | null;
  lat: number | null;
  lng: number | null;
  projectType: string;
  plotSqft: number;
  floors: number;
  budget: number;
  currency: string;
  startDate: string;
  targetDate: string;
  requirements: string | null;
  status: string;
  createdAt: string;
};

export type Phase = {
  id: number;
  projectId: number;
  name: string;
  sortOrder: number;
  startDate: string;
  endDate: string;
  status: string;
  progress: number;
  estimatedCost: number;
};

export type Material = {
  id: number;
  projectId: number;
  phaseId: number | null;
  name: string;
  category: string;
  unit: string;
  qtyNeeded: number;
  qtyOrdered: number;
  qtyReceived: number;
  qtyUsed: number;
  unitPrice: number;
  supplierName: string | null;
  status: string;
};

export type Bill = {
  id: number;
  projectId: number;
  vendor: string;
  amount: number;
  billDate: string;
  category: string;
  notes: string | null;
  paid: boolean;
  ocrText: string | null;
};

export type Payment = {
  id: number;
  projectId: number;
  payee: string;
  amount: number;
  method: string;
  category: string;
  paidAt: string;
  notes: string | null;
};

export type Worker = {
  id: number;
  projectId: number;
  name: string;
  skill: string;
  dailyRate: number;
  phone: string | null;
  status: string;
};

export type Attendance = {
  id: number;
  workerId: number;
  projectId: number;
  workDate: string;
  present: boolean;
  hours: number;
  method: string;
};

export type Payout = {
  id: number;
  workerId: number;
  projectId: number;
  amount: number;
  periodLabel: string | null;
  paidAt: string;
};

export type Photo = {
  id: number;
  projectId: number;
  phaseId: number | null;
  caption: string | null;
  imageUrl: string;
  annotation: string | null;
  createdAt: string;
};

export type Message = {
  id: number;
  projectId: number;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
};

export type Professional = {
  id: number;
  userId: string | null;
  role: string;
  name: string;
  city: string;
  specializations: string;
  rateMin: number;
  rateMax: number;
  rateUnit: string;
  rating: number;
  reviews: number;
  bio: string;
  licenses: string | null;
  languages: string;
  verified: boolean;
  responseHours: number;
  availability: string;
};

export type Supplier = {
  id: number;
  userId: string | null;
  name: string;
  city: string;
  categories: string;
  rating: number;
  reviews: number;
  deliveryDays: number;
  phone: string | null;
  verified: boolean;
  address: string | null;
};

export type Product = {
  id: number;
  supplierId: number;
  name: string;
  category: string;
  unit: string;
  price: number;
  stock: string;
};

export type Quote = {
  id: number;
  projectId: number;
  ownerId: string;
  professionalId: number;
  amount: number | null;
  message: string | null;
  status: string;
  createdAt: string;
  professionalName?: string;
  projectName?: string;
};

export type Hire = {
  id: number;
  projectId: number;
  professionalId: number;
  status: string;
  hiredAt: string;
};

export type Order = {
  id: number;
  projectId: number;
  supplierId: number;
  itemName: string;
  qty: number;
  unitPrice: number;
  status: string;
  createdAt: string;
};

export type Notification = {
  id: number;
  title: string;
  body: string;
  href: string | null;
  read: boolean;
  createdAt: string;
};

export type AiMessage = {
  id: number;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export type ChangeOrder = {
  id: number;
  projectId: number;
  title: string;
  detail: string | null;
  costDelta: number;
  daysDelta: number;
  status: string;
  createdAt: string;
};

export type DailyLog = {
  id: number;
  projectId: number;
  logDate: string;
  weather: string;
  workersCount: number;
  notes: string | null;
  issues: string | null;
};

export type ProjectSnapshot = {
  project: Project;
  phases: Phase[];
  materials: Material[];
  bills: Bill[];
  payments: Payment[];
  workers: Worker[];
  attendance: Attendance[];
  payouts: Payout[];
  photos: Photo[];
  messages: Message[];
  quotes: Quote[];
  hires: (Hire & { professionalName: string; role: string })[];
  orders: Order[];
  changeOrders: ChangeOrder[];
  dailyLogs: DailyLog[];
  progress: number;
  spent: number;
  remaining: number;
  crewPending: number;
  access: "owner" | "hired" | "admin";
  risks: { level: "warn" | "danger" | "info"; title: string; detail: string }[];
};
