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
  { id: 'RM-305', number: '305', type: 'Deluxe', status: 'Vacant', floor: 3 },
  { id: 'RM-501', number: '501', type: 'Suite', status: 'Occupied', floor: 5 },
  { id: 'RM-502', number: '502', type: 'Suite', status: 'Vacant', floor: 5 },
]

export const housekeepingTasks = [
  {
    id: 'HK-101', room: 'Standard 204', task: 'Daily cleaning', assignee: 'Sneha Patel', status: 'In Progress', priority: 'Normal',
    shift: 'Morning', scheduledDate: '2026-06-25', scheduledTime: '09:00',
    cleaningChecklist: 'Bed made, Bathroom cleaned, Floors mopped, Trash emptied',
    amenitiesReplenish: 'Towels, Soap, Toilet paper',
    deepCleanRequired: false, deepCleanType: 'None', deepCleanDate: '',
    inspector: 'HK Supervisor', qualityScore: '9', performanceNote: 'Room ready before 10 AM',
  },
  {
    id: 'HK-102', room: 'Suite 501', task: 'Turndown service', assignee: 'Ravi Menon', status: 'Pending', priority: 'Normal',
    shift: 'Evening', scheduledDate: '2026-06-25', scheduledTime: '18:00',
    cleaningChecklist: 'Bed made, Bathroom cleaned',
    amenitiesReplenish: 'Tea/coffee, Water bottles',
    deepCleanRequired: true, deepCleanType: 'Weekly', deepCleanDate: '2026-06-26',
    inspector: '', qualityScore: '', performanceNote: '',
  },
]

export const laundryOrders = [
  {
    id: 'LD-301', guest: 'Sarah Mitchell', room: '501', items: 'Shirts x3, Trousers x2', service: 'Wash & Iron', status: 'In Progress', amount: '₹850',
    trackingStatus: 'Ironing', pickupTime: '2026-06-25T08:00', deliveryTime: '',
    itemTag: 'TAG-458921', garmentCount: '5', expressService: false, expressDeadline: '',
    inspectionStatus: 'Pending', inspectionNote: '', inspectedBy: '',
    serviceHistory: '25 Jun — Received: Items collected from room 501\n25 Jun — Washing: Sent to wash section',
  },
  {
    id: 'LD-302', guest: 'Amit Shah', room: '204', items: 'Suits x1', service: 'Dry Clean', status: 'Pickup Scheduled', amount: '₹600',
    trackingStatus: 'Received', pickupTime: '', deliveryTime: '',
    itemTag: 'TAG-458930', garmentCount: '1', expressService: true, expressDeadline: '2026-06-25T14:00',
    inspectionStatus: 'Pending', inspectionNote: '', inspectedBy: '',
    serviceHistory: '25 Jun — Received: Express order — 4hr turnaround',
  },
]

export const posOrders = [
  {
    id: 'POS-8821', table: 'T-12', waiter: 'Ravi Menon', items: 'Butter Chicken x1, Paneer Tikka x1', subtotal: 700, taxAmount: 35, amount: '₹735', payment: 'Bill to Deluxe 302', status: 'Served', date: '25 Jun', dateIso: '2026-06-25',
  },
  {
    id: 'POS-8820', table: 'T-05', waiter: 'Anita Verma', items: 'Continental Breakfast x1', subtotal: 680, taxAmount: 34, amount: '₹714', payment: 'Direct - UPI', status: 'Paid', date: '25 Jun', dateIso: '2026-06-25',
  },
]

export const menuItems = [
  { id: 'MENU-1', name: 'Butter Chicken', category: 'Main Course', price: '₹420', tax: 'GST 5%' },
  { id: 'MENU-2', name: 'Paneer Tikka', category: 'Starter', price: '₹280', tax: 'GST 5%' },
  { id: 'MENU-3', name: 'Continental Breakfast', category: 'Breakfast', price: '₹680', tax: 'GST 5%' },
]

export const kitchenOrders = [
  {
    id: 'KIT-401', orderRef: 'POS-8821', dish: 'Butter Chicken', qty: 2, station: 'Main Kitchen', status: 'Cooking',
    queuePriority: 'High', prepStage: 'Cooking', chefName: 'Chef Ravi',
    recipe: 'Standard Butter Chicken', ingredients: 'Chicken, Butter, Cream, Spices',
    trackingStatus: 'Cooking', ingredientsUsed: 'Chicken 0.4kg', consumptionQty: '2 portions',
    performanceScore: '8',
  },
  {
    id: 'KIT-402', orderRef: 'POS-8819', dish: 'Room Service Lunch', qty: 1, station: 'Room Service', status: 'Queued',
    queuePriority: 'Normal', prepStage: 'Not Started', chefName: 'Chef Anita',
    trackingStatus: 'Queued',
  },
]

export const inventoryItems = [
  {
    id: 'INV-101', name: 'Basmati Rice', category: 'Food', stock: 45, unit: 'kg', status: 'OK',
    skuCode: 'RICE-BAS-01', storageLocation: 'Main Store — Shelf A2', itemDescription: 'Premium long-grain basmati',
  },
  {
    id: 'INV-102', name: 'Bath Towels', category: 'Linen', stock: 12, unit: 'pcs', status: 'Low Stock',
    skuCode: 'LIN-TOW-01', storageLocation: 'Linen Room', itemDescription: 'White cotton bath towels',
  },
  {
    id: 'INV-103', name: 'Cleaning Solution', category: 'Housekeeping', stock: 8, unit: 'L', status: 'Low Stock',
    skuCode: 'HK-CLN-01', storageLocation: 'HK Store', itemDescription: 'Multi-surface cleaning concentrate',
  },
]

export const purchaseOrders = [
  {
    id: 'PO-201', vendor: 'Fresh Foods Pvt Ltd', items: 'Vegetables, Dairy', amount: '₹42,000', status: 'Pending Approval',
    requestRef: 'PR-201', requestedBy: 'Chef Ravi', approvalStatus: 'Pending', department: 'Kitchen',
    quote1Vendor: 'Fresh Foods Pvt Ltd', quote1Amount: '42000', quote2Vendor: 'Metro Foods', quote2Amount: '44500',
    selectedQuote: '1', grnNumber: '', inspectionStatus: 'Pending', paymentStatus: 'Pending',
    syncToInventory: true, reportTag: 'Standard',
  },
  {
    id: 'PO-202', vendor: 'Linen Supply Co', items: 'Towels, Bedsheets', amount: '₹28,500', status: 'Approved',
    requestRef: 'PR-202', requestedBy: 'HK Supervisor', approvalStatus: 'Level 2 Approved', department: 'Housekeeping',
    grnNumber: 'GRN-202', grnDate: '2026-06-24', inspectionStatus: 'Passed', paymentStatus: 'Processing',
    replenishmentTrigger: true, reorderQty: '50', syncToInventory: true, stockUpdated: true, inventorySku: 'INV-102',
    reportTag: 'Low Stock Replenishment',
  },
]

export const employees = [
  {
    id: 'EMP-101', name: 'Anita Verma', dept: 'Front Office', attendance: 'Present', leave: '0 pending',
    email: 'anita@hotel.com', shift: 'Morning', leaveBalance: '12', salary: '35000',
    systemRole: 'Staff', assignedPermissions: 'View, Create, Update', performanceRating: '4',
  },
  {
    id: 'EMP-102', name: 'Ravi Menon', dept: 'F&B', attendance: 'Present', leave: '1 pending',
    email: 'ravi@hotel.com', shift: 'Evening', leaveBalance: '10', salary: '32000',
    systemRole: 'Supervisor', performanceRating: '5',
  },
  {
    id: 'EMP-103', name: 'Sneha Patel', dept: 'Housekeeping', attendance: 'On Leave', leave: 'Approved',
    email: 'sneha@hotel.com', shift: 'Morning', leaveBalance: '8', salary: '28000',
    systemRole: 'Staff',
  },
]

export const leaveRequests = [
  { id: 'LV-01', name: 'Ravi Menon', detail: 'Casual Leave — 27-28 Jun', status: 'pending' },
]

export const crmCustomers = [
  {
    id: 'CRM-01', name: 'Sarah Mitchell', email: 'sarah@corp.com', loyalty: 'Gold', visits: 12, lastStay: '25 Jun',
    interactionHistory: '24 Jun — Email: Confirmed suite upgrade\n10 Jun — Call: Corporate billing setup',
    lastInteractionType: 'Email', offerType: '10% Off Stay', couponCode: 'GOLD10', offerExpiry: '2026-12-31',
    referralCode: 'SARAH-REF', referredBy: '', referralStatus: 'Active',
    supportSubject: '', supportPriority: 'Medium', supportStatus: 'Closed',
    birthday: '1988-03-15', anniversary: '2012-06-20', campaignOptIn: true, campaignType: 'Both',
  },
  {
    id: 'CRM-02', name: 'Rajesh Kumar', email: 'rajesh@email.com', loyalty: 'Silver', visits: 5, lastStay: '10 May',
    interactionHistory: '20 Jun — WhatsApp: Multi-room group booking inquiry',
    lastInteractionType: 'WhatsApp', offerType: 'Free Breakfast', couponCode: 'SILVER-BF', offerExpiry: '2026-09-30',
    referralCode: 'RAJESH-REF', referredBy: 'John Williams', referralStatus: 'Completed',
    supportSubject: 'Late checkout request', supportPriority: 'Low', supportStatus: 'Resolved',
    birthday: '1990-11-08', anniversary: '', campaignOptIn: true, campaignType: 'Birthday Offer',
  },
  {
    id: 'CRM-03', name: 'John Williams', email: 'john@travel.com', loyalty: 'Platinum', visits: 28, lastStay: '1 Jun',
    interactionHistory: '24 Jun — Feedback: 5-star front desk rating\n1 Jun — Walk-in: Extended stay by 2 nights',
    lastInteractionType: 'Feedback', offerType: 'Room Upgrade', couponCode: 'PLAT-UPG', offerExpiry: '2027-01-31',
    referralCode: 'JOHN-REF', referredBy: '', referralStatus: 'Active',
    supportSubject: 'Spa booking reschedule', supportPriority: 'Medium', supportStatus: 'In Progress',
    birthday: '1975-07-22', anniversary: '2005-12-10', campaignOptIn: true, campaignType: 'Both',
  },
]

export const fnbEvents = [
  {
    id: 'EVT-201', name: 'Corporate Dinner - TCS', type: 'Banquet', date: '28 Jun', dateIso: '2026-06-28', guests: 80, status: 'Confirmed',
    inquirySource: 'Corporate', contactPerson: 'Mr. Sharma', quotedAmount: '450000', quotationStatus: 'Accepted',
    venue: 'Grand Ballroom', hallSetup: 'Banquet rounds', staffAssigned: 'Ravi Menon',
    balance: 300000, balanceStatus: 'Partial',
  },
  {
    id: 'EVT-202', name: 'Wedding Reception', type: 'Wedding', date: '30 Jun', dateIso: '2026-06-30', guests: 200, status: 'Planning',
    inquirySource: 'Walk-in', contactPerson: 'Priya Nair', quotedAmount: '1200000', quotationStatus: 'Sent',
    venue: 'Garden Lawn', balance: 1200000, balanceStatus: 'Pending',
  },
]

export const addonServices = [
  { id: 'ADD-501', service: 'Spa - Aromatherapy', guest: 'Sarah Mitchell', room: 'Suite 501', time: '3:00 PM', amount: '₹3,500', status: 'Booked', date: '25 Jun', dateIso: '2026-06-25' },
  { id: 'ADD-502', service: 'Gym - Personal Trainer', guest: 'Amit Shah', room: 'Standard 204', time: '6:00 AM', amount: '₹1,200', status: 'Completed', date: '24 Jun', dateIso: '2026-06-24' },
]

export const feedbackEntries = [
  { id: 'FB-501', guest: 'John Williams', rating: 5, channel: 'QR Code', comment: 'Excellent service at front desk!', date: '24 Jun' },
  { id: 'FB-502', guest: 'Meera Desai', rating: 4, channel: 'QR Code', comment: 'Food was great, room cleaning could improve.', date: '24 Jun' },
]

export const maintenanceTickets = [
  {
    id: 'WO-601', room: 'Deluxe 305', asset: 'AC Unit — Deluxe 305', complaint: 'Not cooling properly', priority: 'High', status: 'Open', assignee: 'Maintenance Team',
    maintenanceType: 'Corrective', scheduledDate: '2026-06-26', scheduledTime: '10:00',
    assetHistory: '20 Jun — Preventive: Filter cleaned\n10 May — Corrective: Gas refill',
    spareParts: 'AC filter x1', partsCost: '450', technicianPhone: '+91 98765 43210',
    trackingStatus: 'Assigned', laborCost: '800', totalCost: '1250', costCategory: 'HVAC',
  },
  {
    id: 'WO-602', room: 'Common Area', asset: 'Elevator B', complaint: 'Unusual noise', priority: 'Medium', status: 'In Progress', assignee: 'Karan Singh',
    maintenanceType: 'Inspection', scheduledDate: '2026-06-25', scheduledTime: '14:00',
    assetHistory: '1 Jun — Inspection: Annual safety check passed',
    spareParts: '', partsCost: '', technicianPhone: '+91 98765 43211',
    trackingStatus: 'On Site', laborCost: '1200', totalCost: '1200', costCategory: 'Elevator',
  },
]

export const transactions = [
  {
    id: 'TXN-301', type: 'Revenue', category: 'Room', description: 'Room revenue — Jun 24', amount: '₹82,000', date: '24 Jun', dateIso: '2026-06-24',
    invoiceNumber: 'INV-301', paymentStatus: 'Completed', gstRate: '18', accountCode: '4100-ROOM',
    sourceModule: 'Front Office', reportPeriod: 'Monthly',
  },
  {
    id: 'TXN-302', type: 'Expense', category: 'Utilities', description: 'Electricity bill', amount: '₹18,500', date: '23 Jun', dateIso: '2026-06-23',
    expenseType: 'Utilities', expenseBucket: 'Miscellaneous', vendor: 'State Electricity Board', paymentStatus: 'Pending', gstRate: '18',
    sourceModule: 'Finance',
  },
  {
    id: 'TXN-303', type: 'Revenue', category: 'Room', description: 'Room charges — Suite 501', amount: '₹28,500', date: '25 Jun', dateIso: '2026-06-25',
    invoiceNumber: 'INV-303', paymentStatus: 'Completed', gstRate: '18', sourceModule: 'Front Office',
  },
  {
    id: 'TXN-304', type: 'Revenue', category: 'F&B', description: 'Restaurant & banquet sales', amount: '₹42,000', date: '25 Jun', dateIso: '2026-06-25',
    paymentStatus: 'Completed', sourceModule: 'POS',
  },
  {
    id: 'TXN-305', type: 'Revenue', category: 'Add-on', description: 'Spa & gym bookings', amount: '₹12,500', date: '25 Jun', dateIso: '2026-06-25',
    paymentStatus: 'Completed', sourceModule: 'Add-ons',
  },
  {
    id: 'TXN-306', type: 'Expense', category: 'Payroll', description: 'Daily staff payroll accrual', amount: '₹32,000', date: '25 Jun', dateIso: '2026-06-25',
    expenseBucket: 'Staff Salary', paymentStatus: 'Pending', sourceModule: 'HRMS',
  },
  {
    id: 'TXN-307', type: 'Expense', category: 'Kitchen', description: 'Kitchen inventory purchase', amount: '₹8,200', date: '25 Jun', dateIso: '2026-06-25',
    expenseBucket: 'Kitchen Inventory', paymentStatus: 'Completed', sourceModule: 'Inventory',
  },
  {
    id: 'TXN-308', type: 'Expense', category: 'Housekeeping', description: 'Linen & cleaning supplies', amount: '₹4,800', date: '25 Jun', dateIso: '2026-06-25',
    expenseBucket: 'Housekeeping Inventory', paymentStatus: 'Completed', sourceModule: 'Inventory',
  },
  {
    id: 'TXN-309', type: 'Expense', category: 'Operations', description: 'Misc operational costs', amount: '₹2,500', date: '25 Jun', dateIso: '2026-06-25',
    expenseBucket: 'Miscellaneous', paymentStatus: 'Pending', sourceModule: 'Finance',
  },
]

export const systemUsers = [
  {
    id: 'USR-01', name: 'Anita Verma', email: 'reception@demo.com', role: 'Receptionist', status: 'Active',
    accessLevel: 'Standard', moduleAccess: 'Front Office, POS, Reservations',
    assignedPermissions: 'View, Create, Update, Export', authMethod: 'Email/Password', mfaEnabled: false,
  },
  {
    id: 'USR-02', name: 'System Admin', email: 'admin@demo.com', role: 'Administrator', status: 'Active',
    accessLevel: 'Full Access', moduleAccess: 'Front Office, Housekeeping, POS, Finance, HRMS, CRM, Admin, Reports',
    assignedPermissions: 'View, Create, Update, Delete, Approve, Export', authMethod: 'Email/Password', mfaEnabled: true,
    passwordPolicy: 'Enterprise',
  },
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

export const financeRevenueSummary = [
  { label: 'Room Revenue', value: '₹82L', type: 'revenue' },
  { label: 'F&B Revenue', value: '₹28L', type: 'revenue' },
  { label: 'Add-on Revenue', value: '₹14L', type: 'revenue' },
]

export const financeExpenseSummary = [
  { label: 'Staff Salary', value: '₹32L', type: 'expense' },
  { label: 'Kitchen Inventory', value: '₹8L', type: 'expense' },
  { label: 'Housekeeping Inventory', value: '₹5L', type: 'expense' },
  { label: 'Miscellaneous', value: '₹3L', type: 'expense' },
]
