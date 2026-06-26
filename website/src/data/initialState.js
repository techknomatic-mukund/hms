export const reservations = [
  {
    id: 'RES-1042', guest: 'Rajesh Kumar', source: 'OTA', room: 'Deluxe 302',
    rooms: ['Deluxe 302', 'Deluxe 305'], checkIn: '25 Jun', checkOut: '28 Jun',
    checkInIso: '2026-06-25', checkOutIso: '2026-06-28', status: 'Confirmed',
    notes: 'Corporate group — airport pickup at 6 PM. VIP welcome amenity.',
    history: [
      { time: '20 Jun, 10:00', action: 'Created', detail: 'Multi-room booking — 2 rooms' },
      { time: '22 Jun, 14:30', action: 'Modified', detail: 'Added reservation notes' },
    ],
  },
  {
    id: 'RES-1041', guest: 'Sarah Mitchell', source: 'Corporate', room: 'Suite 501',
    rooms: ['Suite 501'], checkIn: '25 Jun', checkOut: '27 Jun',
    checkInIso: '2026-06-25', checkOutIso: '2026-06-27', status: 'Checked In',
    notes: 'Late checkout requested. Extra bed in room.',
    history: [
      { time: '18 Jun, 09:15', action: 'Created', detail: 'Booking confirmed — 1 room' },
      { time: '24 Jun, 11:00', action: 'Room Upgrade', detail: 'Deluxe 305 → Suite 501' },
      { time: '25 Jun, 14:20', action: 'Check-in', detail: 'Guest checked in' },
    ],
  },
  {
    id: 'RES-1040', guest: 'Amit Shah', source: 'Walk-in', room: 'Standard 204',
    rooms: ['Standard 204'], checkIn: '25 Jun', checkOut: '26 Jun',
    checkInIso: '2026-06-25', checkOutIso: '2026-06-26', status: 'Checked In', notes: '',
    history: [{ time: '25 Jun, 08:30', action: 'Created', detail: 'Walk-in booking' }],
  },
  {
    id: 'RES-1039', guest: 'Priya Nair', source: 'Phone', room: 'Deluxe 305',
    rooms: ['Deluxe 305'], checkIn: '26 Jun', checkOut: '29 Jun',
    checkInIso: '2026-06-26', checkOutIso: '2026-06-29', status: 'Confirmed',
    notes: 'Anniversary stay — decorate room with flowers.',
    history: [{ time: '23 Jun, 16:45', action: 'Created', detail: 'Phone booking confirmed' }],
  },
]

export const rooms = [
  { id: 'RM-201', number: '201', type: 'Standard', status: 'Vacant', floor: 2 },
  { id: 'RM-204', number: '204', type: 'Standard', status: 'Occupied', floor: 2 },
  { id: 'RM-302', number: '302', type: 'Deluxe', status: 'Vacant', floor: 3 },
  { id: 'RM-305', number: '305', type: 'Deluxe', status: 'Dirty', floor: 3 },
  { id: 'RM-501', number: '501', type: 'Suite', status: 'Occupied', floor: 5 },
  { id: 'RM-502', number: '502', type: 'Suite', status: 'Ready', floor: 5 },
]

export const housekeepingTasks = [
  { id: 'HK-101', room: 'Standard 204', task: 'Daily cleaning', assignee: 'Sneha Patel', status: 'In Progress', priority: 'Normal' },
  { id: 'HK-102', room: 'Suite 501', task: 'Turndown service', assignee: 'Ravi Menon', status: 'Pending', priority: 'Normal' },
]

export const laundryOrders = [
  { id: 'LD-301', guest: 'Sarah Mitchell', room: '501', items: 'Shirts x3, Trousers x2', service: 'Wash & Iron', status: 'In Progress', amount: '₹850' },
  { id: 'LD-302', guest: 'Amit Shah', room: '204', items: 'Suits x1', service: 'Dry Clean', status: 'Pickup Scheduled', amount: '₹600' },
]

export const posOrders = [
  { id: 'POS-8821', table: 'T-12', items: 'Butter Chicken, Naan x2', amount: '₹1,240', payment: 'Bill to Room 302', status: 'Served' },
  { id: 'POS-8820', table: 'T-05', items: 'Continental Breakfast', amount: '₹680', payment: 'Direct - UPI', status: 'Paid' },
]

export const menuItems = [
  { id: 'MENU-1', name: 'Butter Chicken', category: 'Main Course', price: '₹420', tax: 'GST 5%' },
  { id: 'MENU-2', name: 'Paneer Tikka', category: 'Starter', price: '₹280', tax: 'GST 5%' },
  { id: 'MENU-3', name: 'Continental Breakfast', category: 'Breakfast', price: '₹680', tax: 'GST 5%' },
]

export const kitchenOrders = [
  { id: 'KIT-401', orderRef: 'POS-8821', dish: 'Butter Chicken', qty: 2, station: 'Main Kitchen', status: 'Cooking' },
  { id: 'KIT-402', orderRef: 'POS-8819', dish: 'Room Service Lunch', qty: 1, station: 'Room Service', status: 'Queued' },
]

export const inventoryItems = [
  { id: 'INV-101', name: 'Basmati Rice', category: 'Food', stock: 45, unit: 'kg', reorder: 20, status: 'OK' },
  { id: 'INV-102', name: 'Bath Towels', category: 'Linen', stock: 12, unit: 'pcs', reorder: 30, status: 'Low Stock' },
  { id: 'INV-103', name: 'Cleaning Solution', category: 'Housekeeping', stock: 8, unit: 'L', reorder: 10, status: 'Low Stock' },
]

export const purchaseOrders = [
  { id: 'PO-201', vendor: 'Fresh Foods Pvt Ltd', items: 'Vegetables, Dairy', amount: '₹42,000', status: 'Pending Approval' },
  { id: 'PO-202', vendor: 'Linen Supply Co', items: 'Towels, Bedsheets', amount: '₹28,500', status: 'Approved' },
]

export const employees = [
  { id: 'EMP-101', name: 'Anita Verma', dept: 'Front Office', attendance: 'Present', leave: '0 pending' },
  { id: 'EMP-102', name: 'Ravi Menon', dept: 'F&B', attendance: 'Present', leave: '1 pending' },
  { id: 'EMP-103', name: 'Sneha Patel', dept: 'Housekeeping', attendance: 'On Leave', leave: 'Approved' },
]

export const leaveRequests = [
  { id: 'LV-01', name: 'Ravi Menon', detail: 'Casual Leave — 27-28 Jun', status: 'pending' },
]

export const crmCustomers = [
  {
    id: 'CRM-01', name: 'Sarah Mitchell', email: 'sarah@corp.com', loyalty: 'Gold', visits: 12, lastStay: '25 Jun',
    birthday: '28 Jun', anniversary: '14 Feb',
    preferences: ['Late checkout', 'Non-smoking', 'High floor', 'Extra pillows'],
    specialRequests: 'Champagne & fruit basket on arrival',
    previousStays: [
      { dates: '1–5 Jun', room: 'Suite 502', nights: 4 },
      { dates: '12–15 May', room: 'Deluxe 302', nights: 3 },
    ],
  },
  {
    id: 'CRM-02', name: 'Rajesh Kumar', email: 'rajesh@email.com', loyalty: 'Silver', visits: 5, lastStay: '10 May',
    birthday: '12 Aug', anniversary: '30 Jun',
    preferences: ['Airport pickup', 'Corporate billing', 'Twin beds'],
    specialRequests: 'VIP welcome amenity for corporate guests',
    previousStays: [{ dates: '8–10 May', room: 'Deluxe 305', nights: 2 }],
  },
  {
    id: 'CRM-03', name: 'John Williams', email: 'john@travel.com', loyalty: 'Platinum', visits: 28, lastStay: '1 Jun',
    birthday: '2 Jul', anniversary: '18 Nov',
    preferences: ['Early check-in', 'Quiet room', 'Newspaper delivery'],
    specialRequests: 'Allergic to feather pillows',
    previousStays: [
      { dates: '28 May–1 Jun', room: 'Suite 501', nights: 4 },
      { dates: '10–14 Apr', room: 'Suite 502', nights: 4 },
    ],
  },
  {
    id: 'CRM-04', name: 'Amit Shah', email: 'amit@email.com', loyalty: 'Bronze', visits: 2, lastStay: '25 Jun',
    birthday: '5 Sep', anniversary: '',
    preferences: ['Gym access', 'Vegetarian meals'],
    specialRequests: '',
    previousStays: [{ dates: '15 Mar', room: 'Standard 201', nights: 1 }],
  },
]

export const crmOffers = [
  {
    id: 'OFF-01', code: 'SUMMER25', title: 'Summer Stay Special', discount: '25%',
    type: 'Seasonal Package', validFrom: '1 Jun', validTo: '31 Aug',
    validFromIso: '2026-06-01', validToIso: '2026-08-31', status: 'Active', uses: 42,
  },
  {
    id: 'OFF-02', code: 'WELCOME10', title: 'New Guest Welcome', discount: '10%',
    type: 'Discount Coupon', validFrom: '1 Jan', validTo: '31 Dec',
    validFromIso: '2026-01-01', validToIso: '2026-12-31', status: 'Active', uses: 128,
  },
  {
    id: 'OFF-03', code: 'SPA500', title: 'Spa Combo Deal', discount: '₹500 off',
    type: 'Service Offer', validFrom: '1 Jun', validTo: '30 Jun',
    validFromIso: '2026-06-01', validToIso: '2026-06-30', status: 'Active', uses: 18,
  },
  {
    id: 'OFF-04', code: 'CORP15', title: 'Corporate Rate', discount: '15%',
    type: 'Corporate Deal', validFrom: '1 Apr', validTo: '31 Mar',
    validFromIso: '2026-04-01', validToIso: '2027-03-31', status: 'Active', uses: 67,
  },
]

export const crmReferrals = [
  {
    id: 'REF-01', referrer: 'Sarah Mitchell', referrerId: 'CRM-01',
    referredGuest: 'Emily Chen', referredEmail: 'emily@corp.com',
    date: '15 Jun', reward: '500 Loyalty Points', status: 'Rewarded',
  },
  {
    id: 'REF-02', referrer: 'John Williams', referrerId: 'CRM-03',
    referredGuest: 'Pending signup', referredEmail: 'mike@corp.com',
    date: '22 Jun', reward: '10% Discount Coupon', status: 'Pending',
  },
  {
    id: 'REF-03', referrer: 'Rajesh Kumar', referrerId: 'CRM-02',
    referredGuest: 'Priya Nair', referredEmail: 'priya@email.com',
    date: '20 Jun', reward: 'Complimentary Breakfast', status: 'Booked',
  },
]

export const crmSupportTickets = [
  {
    id: 'TKT-01', guest: 'Rajesh Kumar', email: 'rajesh@email.com',
    subject: 'Billing discrepancy on corporate invoice', department: 'Finance',
    priority: 'High', status: 'Open', created: '24 Jun, 09:00',
    description: 'Invoice shows incorrect room rate for corporate booking.',
  },
  {
    id: 'TKT-02', guest: 'Meera Desai', email: 'meera@email.com',
    subject: 'AC not cooling properly in room', department: 'Maintenance',
    priority: 'Urgent', status: 'In Progress', created: '24 Jun, 14:30',
    description: 'Guest reported AC issue — maintenance assigned.',
  },
  {
    id: 'TKT-03', guest: 'John Williams', email: 'john@travel.com',
    subject: 'Late checkout request for Suite 501', department: 'Front Office',
    priority: 'Normal', status: 'Resolved', created: '23 Jun, 11:00',
    description: 'Approved late checkout until 2 PM.',
  },
]

export const crmCampaigns = [
  {
    id: 'CMP-01', guest: 'Sarah Mitchell', customerId: 'CRM-01',
    type: 'Birthday', eventDate: '28 Jun', offer: 'Complimentary cake + 15% room discount',
    status: 'Scheduled', channel: 'Email',
  },
  {
    id: 'CMP-02', guest: 'Rajesh Kumar', customerId: 'CRM-02',
    type: 'Anniversary', eventDate: '30 Jun', offer: 'Romantic dinner package — 20% off',
    status: 'Scheduled', channel: 'SMS',
  },
  {
    id: 'CMP-03', guest: 'John Williams', customerId: 'CRM-03',
    type: 'Birthday', eventDate: '2 Jul', offer: 'Suite upgrade voucher on next stay',
    status: 'Pending', channel: 'Email',
  },
]

export const customerInteractions = [
  { id: 'INT-01', customer: 'Sarah Mitchell', type: 'Booking', detail: 'Reservation RES-1041 — Suite 501 (25–27 Jun)', date: '18 Jun, 09:15', channel: 'Corporate' },
  { id: 'INT-02', customer: 'Sarah Mitchell', type: 'Email', detail: 'Sent pre-arrival welcome email with VIP amenities', date: '23 Jun, 10:00', channel: 'Email' },
  { id: 'INT-03', customer: 'Sarah Mitchell', type: 'Service Request', detail: 'Extra bed requested — routed to Housekeeping', date: '25 Jun, 14:30', channel: 'Front Office' },
  { id: 'INT-04', customer: 'Rajesh Kumar', type: 'Call', detail: 'Phone inquiry about airport pickup for group booking', date: '20 Jun, 16:45', channel: 'Phone' },
  { id: 'INT-05', customer: 'John Williams', type: 'Feedback', detail: '5-star rating — "Excellent service at front desk!"', date: '24 Jun, 08:30', channel: 'QR Code' },
  { id: 'INT-06', customer: 'John Williams', type: 'Complaint', detail: 'Support ticket TKT-03 — Late checkout resolved', date: '23 Jun, 11:30', channel: 'Front Office' },
]

export const guestFolios = [
  {
    id: 'FOL-101', reservationId: 'RES-1041', guest: 'Sarah Mitchell', room: 'Suite 501', status: 'Open',
    charges: [
      { id: 'FC-1', date: '25 Jun', category: 'Room', description: 'Suite 501 — Night 1', amount: 12000, tax: 600 },
      { id: 'FC-2', date: '25 Jun', category: 'Restaurant', description: 'Room service dinner', amount: 1240, tax: 62 },
      { id: 'FC-3', date: '25 Jun', category: 'Spa', description: 'Aromatherapy massage', amount: 3500, tax: 175 },
      { id: 'FC-4', date: '25 Jun', category: 'Laundry', description: 'Wash & Iron', amount: 850, tax: 43 },
    ],
    payments: [
      { id: 'FP-1', date: '25 Jun', method: 'Credit Card', type: 'Advance', amount: 5000 },
      { id: 'FP-2', date: '25 Jun', method: 'UPI', type: 'Partial', amount: 3000 },
    ],
  },
  {
    id: 'FOL-102', reservationId: 'RES-1040', guest: 'Amit Shah', room: 'Standard 204', status: 'Open',
    charges: [
      { id: 'FC-5', date: '25 Jun', category: 'Room', description: 'Standard 204 — Night 1', amount: 4500, tax: 225 },
      { id: 'FC-6', date: '25 Jun', category: 'Laundry', description: 'Dry Clean — Suit', amount: 600, tax: 30 },
      { id: 'FC-7', date: '25 Jun', category: 'Add-on', description: 'Gym — Personal Trainer', amount: 1200, tax: 60 },
    ],
    payments: [{ id: 'FP-3', date: '25 Jun', method: 'Cash', type: 'Advance', amount: 2000 }],
  },
]

export const guestDeposits = [
  {
    id: 'DEP-101', guest: 'Sarah Mitchell', reservationId: 'RES-1041', room: 'Suite 501',
    type: 'Security Deposit', amount: 5000, received: 5000, refunded: 0, balance: 0, status: 'Held', date: '25 Jun',
  },
  {
    id: 'DEP-102', guest: 'Amit Shah', reservationId: 'RES-1040', room: 'Standard 204',
    type: 'Advance Payment', amount: 2000, received: 2000, refunded: 0, balance: 0, status: 'Applied', date: '25 Jun',
  },
  {
    id: 'DEP-103', guest: 'Rajesh Kumar', reservationId: 'RES-1042', room: 'Deluxe 302',
    type: 'Advance Payment', amount: 10000, received: 5000, refunded: 0, balance: 5000, status: 'Partial', date: '20 Jun',
  },
]

export const guestRequests = [
  {
    id: 'GR-101', guest: 'Sarah Mitchell', room: 'Suite 501', requestType: 'Extra Bed',
    department: 'Housekeeping', status: 'In Progress', priority: 'Normal',
    notes: 'King size extra bed requested', created: '25 Jun, 14:30',
  },
  {
    id: 'GR-102', guest: 'Rajesh Kumar', room: 'Deluxe 302', requestType: 'Airport Pickup',
    department: 'Front Office', status: 'Scheduled', priority: 'High',
    notes: 'Flight AI-204 at 6 PM — Innova required', created: '20 Jun, 10:00',
  },
  {
    id: 'GR-103', guest: 'Amit Shah', room: 'Standard 204', requestType: 'Wake-up Call',
    department: 'Front Office', status: 'Completed', priority: 'Normal',
    notes: '6:00 AM wake-up call', created: '25 Jun, 21:00',
  },
  {
    id: 'GR-104', guest: 'Sarah Mitchell', room: 'Suite 501', requestType: 'Maintenance',
    department: 'Maintenance', status: 'Open', priority: 'Medium',
    notes: 'AC remote not working', created: '25 Jun, 18:15',
  },
]

export const fnbEvents = [
  { id: 'EVT-201', name: 'Corporate Dinner - TCS', type: 'Banquet', date: '28 Jun', guests: 80, status: 'Confirmed' },
  { id: 'EVT-202', name: 'Wedding Reception', type: 'Event', date: '30 Jun', guests: 200, status: 'Planning' },
]

export const addonServices = [
  { id: 'ADD-501', service: 'Spa - Aromatherapy', guest: 'Sarah Mitchell', room: '501', time: '3:00 PM', amount: '₹3,500', status: 'Booked' },
  { id: 'ADD-502', service: 'Gym - Personal Trainer', guest: 'Amit Shah', room: '204', time: '6:00 AM', amount: '₹1,200', status: 'Completed' },
]

export const feedbackEntries = [
  { id: 'FB-501', guest: 'John Williams', rating: 5, channel: 'QR Code', comment: 'Excellent service at front desk!', date: '24 Jun' },
  { id: 'FB-502', guest: 'Meera Desai', rating: 4, channel: 'QR Code', comment: 'Food was great, room cleaning could improve.', date: '24 Jun' },
]

export const maintenanceTickets = [
  { id: 'WO-601', asset: 'AC Unit — Room 305', complaint: 'Not cooling properly', priority: 'High', status: 'Open', assignee: 'Maintenance Team' },
  { id: 'WO-602', asset: 'Elevator B', complaint: 'Unusual noise', priority: 'Medium', status: 'In Progress', assignee: 'Karan Singh' },
]

export const transactions = [
  { id: 'TXN-301', type: 'Revenue', category: 'Room', description: 'Room revenue — Jun 24', amount: '₹82,000', date: '24 Jun' },
  { id: 'TXN-302', type: 'Expense', category: 'Utilities', description: 'Electricity bill', amount: '₹18,500', date: '23 Jun' },
]

export const systemUsers = [
  { id: 'USR-01', name: 'Anita Verma', email: 'reception@demo.com', role: 'Receptionist', status: 'Active' },
  { id: 'USR-02', name: 'System Admin', email: 'admin@demo.com', role: 'Administrator', status: 'Active' },
]

export const activityLog = [
  { id: 'LOG-1', time: '09:15', action: 'Check-in', module: 'Front Office', detail: 'Sarah Mitchell → Suite 501' },
  { id: 'LOG-2', time: '09:10', action: 'Sync', module: 'Housekeeping', detail: 'Room 501 status → Occupied' },
  { id: 'LOG-3', time: '09:10', action: 'Folio', module: 'Finance', detail: 'Guest folio opened — ₹8,500' },
]

// Re-export dashboard helpers from mockData
export const dashboardStats = [
  { label: 'Occupancy Rate', value: '78%', change: '+5%', trend: 'up' },
  { label: 'Today Check-ins', value: '24', change: '6 pending', trend: 'neutral' },
  { label: 'Today Check-outs', value: '18', change: '2 late', trend: 'neutral' },
  { label: 'Revenue Today', value: '₹4.2L', change: '+12%', trend: 'up' },
  { label: 'POS Sales', value: '₹86K', change: '+8%', trend: 'up' },
  { label: 'Active Guests', value: '142', change: '12 in-house', trend: 'neutral' },
]

export const guestLifecycle = [
  { step: 'Reservation', status: 'done', detail: 'Customer Portal, OTA, Corporate, Walk-in' },
  { step: 'Check-In', status: 'done', detail: 'Registration card & guest profile' },
  { step: 'Room Stay', status: 'active', detail: 'Room charges & folio tracking' },
  { step: 'Consume Services', status: 'pending', detail: 'Restaurant, Spa, Laundry, Gym' },
  { step: 'Billing', status: 'pending', detail: 'GST, tax-inclusive/exclusive' },
  { step: 'Check-Out', status: 'pending', detail: 'Final settlement & invoice' },
]

export const bookingSourcePerformance = [
  { source: 'OTA', bookings: 145, revenue: '₹28.5L', share: '32%' },
  { source: 'Corporate', bookings: 98, revenue: '₹22.1L', share: '25%' },
  { source: 'Customer Portal', bookings: 64, revenue: '₹11.2L', share: '13%' },
  { source: 'Walk-in', bookings: 76, revenue: '₹12.8L', share: '14%' },
]

export const reportCategories = {
  'Front Office': ["Today's Arrival", "Today's Departure", 'Occupancy', 'Vacant Rooms', 'No Show', 'Reservation Reports'],
  Restaurant: ['Daily Sales', 'Food Sales', 'Waiter Performance', 'Item-wise Sales'],
  Inventory: ['Current Stock', 'Low Stock', 'Vendor Performance'],
  Finance: ['Revenue', 'P&L', 'Cash Flow', 'GST'],
  HR: ['Attendance', 'Payroll', 'Leave'],
  CRM: ['Customer History', 'Loyalty', 'Complaints'],
}

export const implementationPhases = [
  { phase: 'Phase 1', title: 'Demo & Gap Analysis', items: ['Demo ERP + Customer Portal', 'Compare vs current process', 'Identify customizations'] },
  { phase: 'Phase 2', title: 'Configure & Test', items: ['Configure all modules', 'Import legacy data', 'UAT'] },
  { phase: 'Phase 3', title: 'Go-Live', items: ['Parallel run', 'Validate reports', 'Production rollout'] },
]

export const futureIntegrations = [
  { name: 'OTA / Channel Manager', status: 'Future', phase: 'Post Phase 1' },
  { name: 'Passport Scanner', status: 'Planned', phase: 'Auto-fill registration' },
  { name: 'Power BI', status: 'Future', phase: 'Analytics' },
  { name: 'IoT Smart Rooms', status: 'Future', phase: 'Enhancement' },
]

export const deploymentInfo = {
  architecture: 'Centralized database — Cloud + local cache (hybrid)',
  benefits: ['One database for all departments', 'Auto-sync across modules', 'Offline POS & Front Office', 'Real-time reports'],
}

export const financeSummary = [
  { label: 'Room Revenue', value: '₹82L', type: 'revenue' },
  { label: 'F&B Revenue', value: '₹28L', type: 'revenue' },
  { label: 'Add-on Revenue', value: '₹14L', type: 'revenue' },
]
