export const modules = [
  { id: 'dashboard', path: '/', label: 'Dashboard', icon: '📊' },
  { id: 'front-office', path: '/front-office', label: 'Front Office (PMS)', icon: '🏨' },
  { id: 'pos', path: '/pos', label: 'Point of Sale', icon: '🍽️' },
  { id: 'finance', path: '/finance', label: 'Finance', icon: '💰' },
  { id: 'hrms', path: '/hrms', label: 'HRMS', icon: '👥' },
  { id: 'fnb', path: '/fnb', label: 'F&B', icon: '🥂' },
  { id: 'addons', path: '/addons', label: 'Add-on Services', icon: '💆' },
  { id: 'feedback', path: '/feedback', label: 'Customer Feedback', icon: '⭐' },
  { id: 'reports', path: '/reports', label: 'Reports', icon: '📈' },
]

export const dashboardStats = [
  { label: 'Occupancy Rate', value: '78%', change: '+5%', trend: 'up' },
  { label: 'Today Check-ins', value: '24', change: '6 pending', trend: 'neutral' },
  { label: 'Today Check-outs', value: '18', change: '2 late', trend: 'neutral' },
  { label: 'Revenue Today', value: '₹4.2L', change: '+12%', trend: 'up' },
  { label: 'POS Sales', value: '₹86K', change: '+8%', trend: 'up' },
  { label: 'Active Guests', value: '142', change: '12 in-house', trend: 'neutral' },
]

export const guestLifecycle = [
  { step: 'Reservation', status: 'done', detail: 'Walk-in, OTA, Corporate, Phone, Email' },
  { step: 'Check-In', status: 'done', detail: 'Registration card & guest profile' },
  { step: 'Room Stay', status: 'active', detail: 'Room charges & folio tracking' },
  { step: 'Consume Services', status: 'pending', detail: 'Restaurant, Spa, Laundry, Gym' },
  { step: 'Billing', status: 'pending', detail: 'GST, tax-inclusive/exclusive' },
  { step: 'Check-Out', status: 'pending', detail: 'Final settlement & invoice' },
]

export const reservations = [
  { id: 'RES-1042', guest: 'Rajesh Kumar', source: 'OTA', room: 'Deluxe 302', checkIn: '25 Jun', checkOut: '28 Jun', status: 'Confirmed' },
  { id: 'RES-1041', guest: 'Sarah Mitchell', source: 'Corporate', room: 'Suite 501', checkIn: '25 Jun', checkOut: '27 Jun', status: 'Checked In' },
  { id: 'RES-1040', guest: 'Amit Shah', source: 'Walk-in', room: 'Standard 204', checkIn: '25 Jun', checkOut: '26 Jun', status: 'Checked In' },
  { id: 'RES-1039', guest: 'Priya Nair', source: 'Phone', room: 'Deluxe 305', checkIn: '26 Jun', checkOut: '29 Jun', status: 'Confirmed' },
  { id: 'RES-1038', guest: 'John Williams', source: 'Travel Agent', room: 'Suite 502', checkIn: '26 Jun', checkOut: '30 Jun', status: 'Confirmed' },
  { id: 'RES-1037', guest: 'Meera Desai', source: 'Email', room: 'Standard 201', checkIn: '24 Jun', checkOut: '25 Jun', status: 'Checked Out' },
]

export const bookingSourcePerformance = [
  { source: 'OTA', bookings: 145, revenue: '₹28.5L', share: '32%' },
  { source: 'Corporate', bookings: 98, revenue: '₹22.1L', share: '25%' },
  { source: 'Walk-in', bookings: 76, revenue: '₹12.8L', share: '14%' },
  { source: 'Travel Agent', bookings: 54, revenue: '₹9.4L', share: '11%' },
  { source: 'Phone', bookings: 48, revenue: '₹8.2L', share: '9%' },
  { source: 'Email', bookings: 32, revenue: '₹5.6L', share: '6%' },
]

export const posOrders = [
  { id: 'POS-8821', table: 'T-12', items: 'Butter Chicken, Naan x2', amount: '₹1,240', payment: 'Bill to Room 302', status: 'Served' },
  { id: 'POS-8820', table: 'T-05', items: 'Continental Breakfast', amount: '₹680', payment: 'Direct - UPI', status: 'Paid' },
  { id: 'POS-8819', table: 'Room 501', items: 'Room Service - Lunch', amount: '₹2,150', payment: 'Bill to Room 501', status: 'Preparing' },
  { id: 'POS-8818', table: 'T-08', items: 'Coffee, Pastries x3', amount: '₹520', payment: 'Direct - Card', status: 'Paid' },
]

export const menuItems = [
  { name: 'Butter Chicken', category: 'Main Course', price: '₹420', tax: 'GST 5%' },
  { name: 'Paneer Tikka', category: 'Starter', price: '₹280', tax: 'GST 5%' },
  { name: 'Continental Breakfast', category: 'Breakfast', price: '₹680', tax: 'GST 5%' },
  { name: 'Fresh Lime Soda', category: 'Beverage', price: '₹120', tax: 'GST 5%' },
]

export const financeSummary = [
  { label: 'Total Revenue (MTD)', value: '₹1.24 Cr', type: 'revenue' },
  { label: 'Total Expenses (MTD)', value: '₹68.5L', type: 'expense' },
  { label: 'Net P&L (MTD)', value: '₹55.5L', type: 'profit' },
  { label: 'Room Revenue', value: '₹82L', type: 'revenue' },
  { label: 'F&B Revenue', value: '₹28L', type: 'revenue' },
  { label: 'Add-on Revenue', value: '₹14L', type: 'revenue' },
]

export const employees = [
  { id: 'EMP-101', name: 'Anita Verma', dept: 'Front Office', attendance: 'Present', leave: '0 pending' },
  { id: 'EMP-102', name: 'Ravi Menon', dept: 'F&B', attendance: 'Present', leave: '1 pending' },
  { id: 'EMP-103', name: 'Sneha Patel', dept: 'Housekeeping', attendance: 'On Leave', leave: 'Approved' },
  { id: 'EMP-104', name: 'Karan Singh', dept: 'Finance', attendance: 'Present', leave: '0 pending' },
]

export const fnbEvents = [
  { id: 'EVT-201', name: 'Corporate Dinner - TCS', type: 'Banquet', date: '28 Jun', guests: 80, status: 'Confirmed' },
  { id: 'EVT-202', name: 'Wedding Reception', type: 'Event', date: '30 Jun', guests: 200, status: 'Planning' },
  { id: 'EVT-203', name: 'Board Meeting Lunch', type: 'Conference', date: '26 Jun', guests: 25, status: 'In Progress' },
]

export const addonServices = [
  { service: 'Spa - Aromatherapy', guest: 'Sarah Mitchell', room: '501', time: '3:00 PM', amount: '₹3,500', status: 'Booked' },
  { service: 'Gym - Personal Trainer', guest: 'Amit Shah', room: '204', time: '6:00 AM', amount: '₹1,200', status: 'Completed' },
  { service: 'Pool - Cabana Rental', guest: 'Rajesh Kumar', room: '302', time: '11:00 AM', amount: '₹2,000', status: 'Active' },
  { service: 'Health Club - Steam Bath', guest: 'Priya Nair', room: '305', time: '5:00 PM', amount: '₹800', status: 'Booked' },
]

export const feedbackEntries = [
  { id: 'FB-501', guest: 'John Williams', rating: 5, channel: 'QR Code', comment: 'Excellent service at front desk!', date: '24 Jun' },
  { id: 'FB-502', guest: 'Meera Desai', rating: 4, channel: 'QR Code', comment: 'Food was great, room cleaning could improve.', date: '24 Jun' },
  { id: 'FB-503', guest: 'Anonymous', rating: 3, channel: 'Voice of Customer', comment: 'WiFi speed needs improvement.', date: '23 Jun' },
]

export const reportCategories = {
  'Front Office': [
    'Check-in Reports', 'Check-out Reports', 'Reservation Reports', 'Occupancy Reports',
    'Corporate Booking Reports', 'OTA Reports', 'Travel Agent Reports',
    'Weekly Comparison', 'Monthly Comparison', 'Yearly Comparison',
  ],
  POS: ['Item-wise Sales', 'Daily Sales', 'Outlet-wise Reports'],
  Finance: ['P&L Statement', 'Revenue Reports', 'Expense Reports'],
}

export const implementationPhases = [
  { phase: 'Phase 1', title: 'Demo & Gap Analysis', items: ['Demo existing solution', 'Compare current vs standard ERP', 'Identify customizations', 'Estimate effort'] },
  { phase: 'Phase 2', title: 'Configure & Test', items: ['Configure all modules', 'Import legacy data (2-5 years)', 'Provide test environment', 'User acceptance testing'] },
  { phase: 'Phase 3', title: 'Parallel Run & Go-Live', items: ['Run old & new in parallel', 'Validate reports', 'Production rollout'] },
]

export const futureIntegrations = [
  { name: 'Booking.com / OTA', status: 'Future', phase: 'Post Phase 1' },
  { name: 'Channel Manager', status: 'Future', phase: 'Post Phase 1' },
  { name: 'Passport Scanner', status: 'Planned', phase: 'Auto-fill registration' },
]

export const deploymentInfo = {
  architecture: 'Hybrid — Cloud deployment with local database/cache',
  benefits: ['Offline capability during internet outages', 'Fast POS & Front Office billing', 'Sync when internet returns'],
  preference: 'POS and Front Office on-premise concern addressed via local cache',
}
