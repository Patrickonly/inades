// ===== HR Data =====
export const employees = [
  { id: 1, name: "Jean Baptiste Habimana", role: "Program Manager", department: "Programs", status: "Active", email: "jb.habimana@inades.org.rw", phone: "+250 788 123 456", joinDate: "2018-03-15", location: "Kigali" },
  { id: 2, name: "Marie Claire Uwimana", role: "Finance Officer", department: "Finance", status: "Active", email: "mc.uwimana@inades.org.rw", phone: "+250 788 234 567", joinDate: "2019-07-01", location: "Kigali" },
  { id: 3, name: "Emmanuel Nsengiyumva", role: "Field Coordinator", department: "Operations", status: "Active", email: "e.nsengiyumva@inades.org.rw", phone: "+250 788 345 678", joinDate: "2020-01-10", location: "Huye" },
  { id: 4, name: "Claudine Mukamana", role: "HR Administrator", department: "Human Resources", status: "Active", email: "c.mukamana@inades.org.rw", phone: "+250 788 456 789", joinDate: "2017-09-20", location: "Kigali" },
  { id: 5, name: "Patrick Niyonzima", role: "Agricultural Specialist", department: "Programs", status: "On Leave", email: "p.niyonzima@inades.org.rw", phone: "+250 788 567 890", joinDate: "2021-04-05", location: "Ngoma" },
  { id: 6, name: "Francine Ingabire", role: "Monitoring & Evaluation", department: "Programs", status: "Active", email: "f.ingabire@inades.org.rw", phone: "+250 788 678 901", joinDate: "2022-02-14", location: "Kigali" },
  { id: 7, name: "Théogène Ndayisaba", role: "IT Support", department: "Administration", status: "Active", email: "t.ndayisaba@inades.org.rw", phone: "+250 788 789 012", joinDate: "2023-06-01", location: "Kigali" },
  { id: 8, name: "Vestine Nyiransabimana", role: "Community Liaison", department: "Operations", status: "Active", email: "v.nyiransabimana@inades.org.rw", phone: "+250 788 890 123", joinDate: "2020-11-15", location: "Nyamasheke" },
];

export const jobVacancies = [
  { id: 1, title: "Project Coordinator – Rural Development", department: "Programs", location: "Huye", deadline: "2026-05-15", applications: 23, status: "Open" },
  { id: 2, title: "Finance Assistant", department: "Finance", location: "Kigali", deadline: "2026-05-01", applications: 45, status: "Open" },
  { id: 3, title: "M&E Officer", department: "Programs", location: "Ngoma", deadline: "2026-04-28", applications: 18, status: "Closed" },
  { id: 4, title: "Driver/Logistics Assistant", department: "Administration", location: "Kigali", deadline: "2026-05-20", applications: 12, status: "Open" },
];

export const leaveRequests = [
  { id: 1, employee: "Patrick Niyonzima", type: "Annual Leave", from: "2026-04-10", to: "2026-04-24", days: 10, status: "Approved", reason: "Family vacation" },
  { id: 2, employee: "Marie Claire Uwimana", type: "Sick Leave", from: "2026-04-12", to: "2026-04-14", days: 2, status: "Approved", reason: "Medical appointment" },
  { id: 3, employee: "Emmanuel Nsengiyumva", type: "Annual Leave", from: "2026-05-01", to: "2026-05-05", days: 4, status: "Pending", reason: "Personal matters" },
  { id: 4, employee: "Francine Ingabire", type: "Maternity Leave", from: "2026-06-01", to: "2026-08-31", days: 90, status: "Pending", reason: "Maternity" },
  { id: 5, employee: "Théogène Ndayisaba", type: "Study Leave", from: "2026-05-10", to: "2026-05-12", days: 2, status: "Rejected", reason: "Exam preparation" },
];

export const trainings = [
  { id: 1, title: "Project Cycle Management", provider: "UNDP Rwanda", date: "2026-05-10", participants: 12, status: "Upcoming", category: "Professional" },
  { id: 2, title: "Financial Reporting Standards", provider: "ICPAR", date: "2026-04-05", participants: 8, status: "Completed", category: "Finance" },
  { id: 3, title: "Gender Mainstreaming in Development", provider: "UN Women", date: "2026-06-15", participants: 20, status: "Upcoming", category: "Cross-cutting" },
  { id: 4, title: "Digital Literacy for Staff", provider: "Internal", date: "2026-03-20", participants: 30, status: "Completed", category: "IT" },
  { id: 5, title: "Participatory Rural Appraisal", provider: "FAO", date: "2026-07-01", participants: 15, status: "Planned", category: "Technical" },
];

export const performanceRecords = [
  { id: 1, employee: "Jean Baptiste Habimana", period: "Q1 2026", score: 92, rating: "Excellent", goals: 8, completed: 7 },
  { id: 2, employee: "Marie Claire Uwimana", period: "Q1 2026", score: 88, rating: "Very Good", goals: 6, completed: 5 },
  { id: 3, employee: "Emmanuel Nsengiyumva", period: "Q1 2026", score: 75, rating: "Good", goals: 7, completed: 5 },
  { id: 4, employee: "Claudine Mukamana", period: "Q1 2026", score: 95, rating: "Excellent", goals: 5, completed: 5 },
  { id: 5, employee: "Francine Ingabire", period: "Q1 2026", score: 82, rating: "Very Good", goals: 6, completed: 5 },
];

// ===== Financial Data =====
export const paymentRequests = [
  { id: "PAY-2026-001", description: "Field supplies – Huye Office", amount: 450000, currency: "RWF", requestedBy: "Emmanuel Nsengiyumva", date: "2026-04-10", status: "Approved", category: "Operations" },
  { id: "PAY-2026-002", description: "Training venue rental", amount: 800000, currency: "RWF", requestedBy: "Jean Baptiste Habimana", date: "2026-04-08", status: "Pending", category: "Programs" },
  { id: "PAY-2026-003", description: "Office stationery", amount: 120000, currency: "RWF", requestedBy: "Claudine Mukamana", date: "2026-04-12", status: "Approved", category: "Administration" },
  { id: "PAY-2026-004", description: "Consultant fees – M&E assessment", amount: 2500000, currency: "RWF", requestedBy: "Francine Ingabire", date: "2026-04-11", status: "Pending", category: "Programs" },
  { id: "PAY-2026-005", description: "Internet service – Q2", amount: 360000, currency: "RWF", requestedBy: "Théogène Ndayisaba", date: "2026-04-05", status: "Paid", category: "IT" },
];

export const travelRequests = [
  { id: "TRV-001", employee: "Jean Baptiste Habimana", destination: "Huye District", purpose: "Field monitoring visit", departure: "2026-04-20", return: "2026-04-22", budget: 280000, status: "Approved" },
  { id: "TRV-002", employee: "Francine Ingabire", destination: "Ngoma District", purpose: "Baseline data collection", departure: "2026-04-25", return: "2026-04-28", budget: 450000, status: "Pending" },
  { id: "TRV-003", employee: "Vestine Nyiransabimana", destination: "Nairobi, Kenya", purpose: "Regional IF meeting", departure: "2026-05-05", return: "2026-05-09", budget: 1200000, status: "Pending" },
];

export const vehicles = [
  { id: 1, plate: "RAD 234 A", make: "Toyota Land Cruiser", year: 2022, status: "Active", mileage: 45230, lastService: "2026-03-15", assignedTo: "Operations" },
  { id: 2, plate: "RAD 567 B", make: "Toyota Hilux", year: 2021, status: "Active", mileage: 62100, lastService: "2026-02-28", assignedTo: "Programs" },
  { id: 3, plate: "RAD 890 C", make: "Nissan Patrol", year: 2023, status: "In Maintenance", mileage: 18500, lastService: "2026-04-10", assignedTo: "Administration" },
  { id: 4, plate: "RAD 123 D", make: "Toyota RAV4", year: 2024, status: "Active", mileage: 8200, lastService: "2026-04-01", assignedTo: "Finance" },
];

export const fuelRecords = [
  { id: 1, vehicle: "RAD 234 A", date: "2026-04-12", liters: 65, cost: 97500, station: "SP Remera", driver: "Jean Claude" },
  { id: 2, vehicle: "RAD 567 B", date: "2026-04-11", liters: 50, cost: 75000, station: "Cobil Kicukiro", driver: "Emmanuel" },
  { id: 3, vehicle: "RAD 123 D", date: "2026-04-10", liters: 40, cost: 60000, station: "SP Nyarutarama", driver: "Patrick" },
  { id: 4, vehicle: "RAD 234 A", date: "2026-04-08", liters: 70, cost: 105000, station: "SP Kimironko", driver: "Jean Claude" },
];

export const procurementRequests = [
  { id: "RFQ-001", item: "Laptops (5 units)", category: "IT Equipment", budget: 3500000, requestedBy: "IT Department", date: "2026-04-10", status: "Under Review", bids: 4 },
  { id: "RFQ-002", item: "Office Furniture", category: "Furniture", budget: 1800000, requestedBy: "Administration", date: "2026-04-08", status: "Awarded", bids: 6 },
  { id: "RFQ-003", item: "Training Materials – Printing", category: "Services", budget: 450000, requestedBy: "Programs", date: "2026-04-12", status: "Open", bids: 2 },
];

export const pettyCash = [
  { id: 1, date: "2026-04-12", description: "Taxi for document delivery", amount: 5000, paidTo: "Driver", approvedBy: "Claudine Mukamana", balance: 195000 },
  { id: 2, date: "2026-04-11", description: "Office cleaning supplies", amount: 12000, paidTo: "Vendor", approvedBy: "Claudine Mukamana", balance: 200000 },
  { id: 3, date: "2026-04-10", description: "Refreshments for meeting", amount: 25000, paidTo: "Caterer", approvedBy: "Marie Claire Uwimana", balance: 212000 },
  { id: 4, date: "2026-04-09", description: "Photocopy charges", amount: 3000, paidTo: "Print Shop", approvedBy: "Claudine Mukamana", balance: 237000 },
];

export const assets = [
  { id: "AST-001", name: "Dell Latitude Laptop", category: "IT Equipment", purchaseDate: "2023-06-15", value: 800000, location: "Kigali Office", assignedTo: "Jean Baptiste Habimana", condition: "Good" },
  { id: "AST-002", name: "Canon Printer", category: "IT Equipment", purchaseDate: "2022-01-20", value: 350000, location: "Kigali Office", assignedTo: "Reception", condition: "Fair" },
  { id: "AST-003", name: "Projector – Epson", category: "IT Equipment", purchaseDate: "2024-03-10", value: 650000, location: "Conference Room", assignedTo: "Shared", condition: "Good" },
  { id: "AST-004", name: "Office Desk Set", category: "Furniture", purchaseDate: "2021-08-05", value: 200000, location: "Huye Office", assignedTo: "Emmanuel Nsengiyumva", condition: "Good" },
  { id: "AST-005", name: "Toyota Land Cruiser", category: "Vehicle", purchaseDate: "2022-02-14", value: 35000000, location: "Kigali", assignedTo: "Operations", condition: "Good" },
];

export const stockItems = [
  { id: 1, item: "A4 Paper (Reams)", category: "Stationery", quantity: 45, reorderLevel: 20, unitPrice: 5000, location: "Kigali Store" },
  { id: 2, item: "Printer Ink Cartridges", category: "IT Supplies", quantity: 8, reorderLevel: 5, unitPrice: 25000, location: "Kigali Store" },
  { id: 3, item: "Training Manuals", category: "Publications", quantity: 200, reorderLevel: 50, unitPrice: 3000, location: "Kigali Store" },
  { id: 4, item: "Flipchart Paper", category: "Training Materials", quantity: 30, reorderLevel: 10, unitPrice: 8000, location: "Kigali Store" },
  { id: 5, item: "Markers (boxes)", category: "Stationery", quantity: 15, reorderLevel: 10, unitPrice: 12000, location: "Kigali Store" },
];

export const auditRecommendations = [
  { id: 1, source: "Internal Audit – Q4 2025", recommendation: "Strengthen procurement documentation for expenses above 500,000 RWF", responsible: "Finance Department", deadline: "2026-06-30", status: "In Progress", priority: "High" },
  { id: 2, source: "Board of Directors – March 2026", recommendation: "Develop a 5-year strategic plan with clear KPIs", responsible: "National Director", deadline: "2026-09-30", status: "Planned", priority: "High" },
  { id: 3, source: "External Audit – 2025", recommendation: "Implement digital asset tracking system", responsible: "IT Department", deadline: "2026-07-31", status: "In Progress", priority: "Medium" },
  { id: 4, source: "General Assembly – 2025", recommendation: "Increase field office staff capacity", responsible: "HR Department", deadline: "2026-12-31", status: "Planned", priority: "Medium" },
];

export const timesheets = [
  { id: 1, employee: "Jean Baptiste Habimana", week: "Apr 7-11, 2026", mon: 8, tue: 8, wed: 8, thu: 8, fri: 8, total: 40, status: "Approved" },
  { id: 2, employee: "Marie Claire Uwimana", week: "Apr 7-11, 2026", mon: 8, tue: 8, wed: 6, thu: 8, fri: 8, total: 38, status: "Approved" },
  { id: 3, employee: "Emmanuel Nsengiyumva", week: "Apr 7-11, 2026", mon: 9, tue: 8, wed: 8, thu: 9, fri: 7, total: 41, status: "Pending" },
  { id: 4, employee: "Francine Ingabire", week: "Apr 7-11, 2026", mon: 8, tue: 8, wed: 8, thu: 8, fri: 8, total: 40, status: "Approved" },
];

export const missionReports = [
  { id: "MSN-001", title: "Farmer Field School Monitoring – Huye", officer: "Jean Baptiste Habimana", date: "2026-04-05", location: "Huye District", status: "Submitted", expenses: 180000 },
  { id: "MSN-002", title: "Cooperative Assessment – Ngoma", officer: "Francine Ingabire", date: "2026-03-28", location: "Ngoma District", status: "Approved", expenses: 220000 },
  { id: "MSN-003", title: "Community Dialogue – Nyamasheke", officer: "Vestine Nyiransabimana", date: "2026-04-10", location: "Nyamasheke District", status: "Draft", expenses: 150000 },
];

// Dashboard stats
export const dashboardStats = {
  totalEmployees: 48,
  activeProjects: 12,
  pendingRequests: 15,
  budgetUtilization: 67,
  monthlyExpenses: [
    { month: "Oct", amount: 4200000 },
    { month: "Nov", amount: 3800000 },
    { month: "Dec", amount: 5100000 },
    { month: "Jan", amount: 4500000 },
    { month: "Feb", amount: 3900000 },
    { month: "Mar", amount: 4800000 },
  ],
  departmentBudget: [
    { name: "Programs", budget: 45000000, spent: 32000000 },
    { name: "Finance", budget: 15000000, spent: 9500000 },
    { name: "Operations", budget: 20000000, spent: 14000000 },
    { name: "HR", budget: 8000000, spent: 5200000 },
    { name: "IT", budget: 6000000, spent: 3800000 },
  ],
  recentActivities: [
    { action: "Leave request approved", user: "Patrick Niyonzima", time: "2 hours ago", type: "hr" },
    { action: "Payment processed", user: "Marie Claire Uwimana", time: "3 hours ago", type: "finance" },
    { action: "New job vacancy posted", user: "Claudine Mukamana", time: "5 hours ago", type: "hr" },
    { action: "Vehicle maintenance scheduled", user: "Théogène Ndayisaba", time: "1 day ago", type: "operations" },
    { action: "Training completed", user: "12 participants", time: "2 days ago", type: "training" },
    { action: "Procurement RFQ published", user: "Finance Team", time: "2 days ago", type: "finance" },
  ],
};
