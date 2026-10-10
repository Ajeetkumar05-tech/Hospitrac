let currentUser = { name: "Dr. Alexander Fleming", role: "Admin" };

let patients = [
    { id: "P-101", name: "John Smith", age: 45, gender: "Male", blood: "O+", contact: "+1 555-0192", address: "12 Main St", history: "Hypertension" },
    { id: "P-102", name: "Sarah Connor", age: 32, gender: "Female", blood: "A-", contact: "+1 555-0143", address: "88 Pine Rd", history: "None" },
    { id: "P-103", name: "Michael Vance", age: 60, gender: "Male", blood: "B+", contact: "+1 555-0811", address: "404 Elm St", history: "Type-2 Diabetes" }
];

let doctors = [
    { id: "D-1", name: "Dr. Gregory House", spec: "Neurology", fee: 100, status: "Available" },
    { id: "D-2", name: "Dr. Meredith Grey", spec: "General Surgery", fee: 90, status: "In OPD" },
    { id: "D-3", name: "Dr. Stephen Strange", spec: "Cardiology", fee: 120, status: "Available" }
];

let appointments = [
    { id: "APT-501", patientId: "P-101", doctorId: "D-1", date: "2026-10-06", time: "10:30", reason: "Migraine Check", status: "Scheduled" },
    { id: "APT-502", patientId: "P-102", doctorId: "D-3", date: "2026-10-06", time: "11:00", reason: "Chest Pain", status: "Completed" }
];

let prescriptions = [
    { id: "RX-901", patientName: "Sarah Connor", doctorName: "Dr. Stephen Strange", diagnosis: "Mild Arrhythmia", meds: "Aspirin 75mg, Metoprolol 25mg", date: "2026-10-05" }
];

let labTests = [
    { id: "LAB-301", patientName: "John Smith", testName: "Lipid Profile", result: "Cholesterol: 210 mg/dL (Slightly High)", status: "Completed" },
    { id: "LAB-302", patientName: "Michael Vance", testName: "Fasting Blood Sugar (FBS)", result: "Pending", status: "Pending" }
];

let inventory = [
    { id: "MED-01", name: "Paracetamol 500mg", category: "Analgesic", stock: 120, reorder: 30, price: 5.00 },
    { id: "MED-02", name: "Amoxicillin 250mg", category: "Antibiotic", stock: 15, reorder: 25, price: 12.50 },
    { id: "MED-03", name: "Metformin 500mg", category: "Antidiabetic", stock: 8, reorder: 20, price: 8.00 }
];

let invoices = [
    { id: "INV-1001", patientName: "Sarah Connor", amount: 150, status: "Paid" }
];

let beds = [
    { id: "ICU-01", type: "ICU", status: "Occupied", patient: "John Smith" },
    { id: "ICU-02", type: "ICU", status: "Available", patient: "-" },
    { id: "GW-101", type: "General Ward", status: "Available", patient: "-" },
    { id: "GW-102", type: "General Ward", status: "Occupied", patient: "Michael Vance" }
];

let emergencyQueue = [
    { id: "ER-01", name: "Unidentified Male", priority: "Red (Critical)", complaint: "Trauma Injury" }
];

function showToast(msg, type = "success") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    const bgClass = type === "error" ? "bg-rose-600" : "bg-emerald-600";
    toast.className = `${bgClass} text-white text-xs px-4 py-3 rounded-lg shadow-xl flex items-center justify-between min-w-[200px] transition-all`;
    toast.innerHTML = `<span>${msg}</span><button onclick="this.parentElement.remove()" class="ml-2 font-bold">&times;</button>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

function switchPhase(phaseNum) {
    document.querySelectorAll(".phase-container").forEach(el => el.classList.add("hidden"));
    const targetPanel = document.getElementById(`phase-${phaseNum}-panel`);
    if (targetPanel) targetPanel.classList.remove("hidden");

    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.classList.remove("bg-indigo-50", "text-indigo-600");
        btn.classList.add("text-slate-600");
    });

    const activeBtn = document.getElementById(`nav-phase-${phaseNum}`);
    if (activeBtn) {
        activeBtn.classList.add("bg-indigo-50", "text-indigo-600");
    }

    if (phaseNum === 1) renderDashboardMetrics();
    if (phaseNum === 2) renderPatientsTable();
    if (phaseNum === 3) renderDoctorsGrid();
    if (phaseNum === 4) { populateDropdowns(); renderAppointmentsTable(); }
    if (phaseNum === 5) { populateDropdowns(); renderPrescriptionHistory(); }
    if (phaseNum === 6) { populateDropdowns(); renderLabTable(); }
    if (phaseNum === 7) renderPharmacyTable();
    if (phaseNum === 8) { populateDropdowns(); renderBillingTable(); }
    if (phaseNum === 9) renderBedMatrix();
    if (phaseNum === 10) renderERQueue();
    if (phaseNum === 12) renderAnalyticsCharts();
}

function populateDropdowns() {
    const patSelects = ["appt-patient-select", "rx-patient-select", "lab-patient-select", "bill-patient-select"];
    patSelects.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.innerHTML = patients.map(p => `<option value="${p.id}">${p.name} (${p.id})</option>`).join("");
        }
    });

    const docSelects = ["appt-doctor-select", "rx-doctor-select"];
    docSelects.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.innerHTML = doctors.map(d => `<option value="${d.name}">${d.name} (${d.spec})</option>`).join("");
        }
    });
}

function handleLogin(e) {
    e.preventDefault();
    const role = document.getElementById("login-role").value;
    currentUser.role = role;
    document.getElementById("user-display-role").textContent = role;
    showToast(`Logged in successfully as ${role}`);
    switchPhase(1);
}

function renderDashboardMetrics() {
    document.getElementById("dash-total-patients").textContent = patients.length;
    document.getElementById("dash-active-appointments").textContent = appointments.filter(a => a.status === 'Scheduled').length;
    document.getElementById("dash-opd-count").textContent = appointments.length;
    
    const availBeds = beds.filter(b => b.status === "Available").length;
    document.getElementById("dash-avail-beds").textContent = `${availBeds}/${beds.length}`;

    const lowStock = inventory.filter(i => i.stock <= i.reorder).length;
    document.getElementById("dash-stock-alerts").textContent = lowStock;

    const recentList = document.getElementById("dash-recent-patients-list");
    recentList.innerHTML = patients.slice(-3).map(p => `
        <div class="p-2 bg-white rounded border flex justify-between items-center">
            <div><span class="font-bold">${p.name}</span> (${p.gender}, ${p.age}y)</div>
            <span class="text-[10px] text-slate-400">${p.id}</span>
        </div>
    `).join("");

    const erSummary = document.getElementById("dash-emergency-summary");
    erSummary.innerHTML = emergencyQueue.map(e => `
        <div class="p-2 bg-rose-100 border-l-4 border-rose-600 rounded flex justify-between items-center">
            <div><span class="font-bold text-rose-800">${e.name}</span> - ${e.complaint}</div>
            <span class="text-[10px] bg-rose-200 text-rose-800 px-1.5 py-0.5 rounded">${e.priority}</span>
        </div>
    `).join("") || '<p class="text-slate-400">No active triage emergency</p>';
}

function savePatient(e) {
    e.preventDefault();
    const name = document.getElementById("patient-name").value;
    const age = document.getElementById("patient-age").value;
    const gender = document.getElementById("patient-gender").value;
    const blood = document.getElementById("patient-blood").value;
    const contact = document.getElementById("patient-contact").value;
    const address = document.getElementById("patient-address").value;
    const history = document.getElementById("patient-history").value;

    const newId = `P-${Math.floor(100 + Math.random() * 900)}`;
    patients.push({ id: newId, name, age, gender, blood, contact, address, history });
    showToast("Patient record created successfully!");
    resetPatientForm();
    renderPatientsTable();
}

function resetPatientForm() {
    document.getElementById("patient-form").reset();
}

function renderPatientsTable() {
    const query = (document.getElementById("patient-search")?.value || "").toLowerCase();
    const filtered = patients.filter(p => p.name.toLowerCase().includes(query) || p.id.toLowerCase().includes(query));
    
    const tbody = document.getElementById("patient-table-body");
    tbody.innerHTML = filtered.map(p => `
        <tr class="hover:bg-slate-50">
            <td class="p-3 font-bold text-indigo-600">${p.id}</td>
            <td class="p-3 font-semibold">${p.name}</td>
            <td class="p-3">${p.age} / ${p.gender}</td>
            <td class="p-3"><span class="bg-slate-100 border px-1.5 py-0.5 rounded text-[10px]">${p.blood}</span></td>
            <td class="p-3">${p.contact}</td>
            <td class="p-3 text-right">
                <button onclick="deletePatient('${p.id}')" class="text-rose-600 hover:text-rose-800"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join("");
}

function deletePatient(id) {
    patients = patients.filter(p => p.id !== id);
    showToast("Patient record removed", "error");
    renderPatientsTable();
}

function toggleDoctorModal() {
    document.getElementById("doctor-modal").classList.toggle("hidden");
}

function saveDoctor(e) {
    e.preventDefault();
    const name = document.getElementById("doc-name").value;
    const spec = document.getElementById("doc-spec").value;
    const fee = document.getElementById("doc-fee").value;

    doctors.push({ id: `D-${doctors.length + 1}`, name, spec, fee, status: "Available" });
    showToast("Doctor profile registered");
    toggleDoctorModal();
    renderDoctorsGrid();
}

function renderDoctorsGrid() {
    const grid = document.getElementById("doctors-grid");
    grid.innerHTML = doctors.map(d => `
        <div class="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
            <div class="flex justify-between items-start">
                <div>
                    <h4 class="font-bold text-slate-800">${d.name}</h4>
                    <p class="text-xs text-indigo-600 font-semibold">${d.spec}</p>
                </div>
                <span class="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">${d.status}</span>
            </div>
            <p class="text-xs text-slate-500">Consultation Fee: <span class="font-bold text-slate-700">$${d.fee}</span></p>
        </div>
    `).join("");
}

function saveAppointment(e) {
    e.preventDefault();
    const patientId = document.getElementById("appt-patient-select").value;
    const doctorId = document.getElementById("appt-doctor-select").value;
    const date = document.getElementById("appt-date").value;
    const time = document.getElementById("appt-time").value;
    const reason = document.getElementById("appt-reason").value;

    appointments.push({
        id: `APT-${Math.floor(500 + Math.random() * 400)}`,
        patientId, doctorId, date, time, reason, status: "Scheduled"
    });
    showToast("Appointment successfully booked!");
    renderAppointmentsTable();
}

function renderAppointmentsTable() {
    const tbody = document.getElementById("appt-table-body");
    tbody.innerHTML = appointments.map(a => {
        const pat = patients.find(p => p.id === a.patientId)?.name || a.patientId;
        return `
            <tr class="hover:bg-slate-50">
                <td class="p-3 font-bold">${a.id}</td>
                <td class="p-3">${pat}</td>
                <td class="p-3">${a.doctorId}</td>
                <td class="p-3">${a.date} ${a.time}</td>
                <td class="p-3"><span class="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded font-semibold">${a.status}</span></td>
                <td class="p-3 text-right">
                    <button onclick="cancelAppointment('${a.id}')" class="text-rose-600 text-xs font-semibold hover:underline">Cancel</button>
                </td>
            </tr>
        `;
    }).join("");
}

function cancelAppointment(id) {
    appointments = appointments.filter(a => a.id !== id);
    showToast("Appointment cancelled", "error");
    renderAppointmentsTable();
}

function addRxMedicineRow() {
    const container = document.getElementById("rx-meds-list");
    const row = document.createElement("div");
    row.className = "flex gap-2 items-center";
    row.innerHTML = `
        <input type="text" placeholder="Drug Name & Dose" class="rx-med-input flex-1 border border-slate-300 rounded p-1.5 text-xs" required>
        <button type="button" onclick="this.parentElement.remove()" class="text-rose-600 font-bold text-xs">&times;</button>
    `;
    container.appendChild(row);
}

function generatePrescription(e) {
    e.preventDefault();
    const patId = document.getElementById("rx-patient-select").value;
    const pat = patients.find(p => p.id === patId)?.name || patId;
    const doc = document.getElementById("rx-doctor-select").value;
    const diag = document.getElementById("rx-diagnosis").value;

    const medInputs = document.querySelectorAll(".rx-med-input");
    const medsList = Array.from(medInputs).map(i => i.value).filter(Boolean).join(", ");

    prescriptions.push({
        id: `RX-${Math.floor(900 + Math.random() * 90)}`,
        patientName: pat,
        doctorName: doc,
        diagnosis: diag,
        meds: medsList || "Standard Vitamins",
        date: new Date().toISOString().split("T")[0]
    });

    showToast("Prescription generated successfully!");
    renderPrescriptionHistory();
}

function renderPrescriptionHistory() {
    const container = document.getElementById("rx-history-list");
    container.innerHTML = prescriptions.map(r => `
        <div class="p-3 bg-slate-50 border rounded-lg space-y-1">
            <div class="flex justify-between font-bold text-slate-800">
                <span>${r.patientName}</span>
                <span class="text-indigo-600 text-[10px]">${r.id}</span>
            </div>
            <p class="text-[11px] text-slate-500">Doc: ${r.doctorName}</p>
            <p class="text-[11px] font-semibold text-slate-700">Diagnosis: ${r.diagnosis}</p>
            <p class="text-[10px] text-emerald-700 bg-emerald-50 p-1 rounded">Rx: ${r.meds}</p>
        </div>
    `).join("");
}

function orderLabTest(e) {
    e.preventDefault();
    const patId = document.getElementById("lab-patient-select").value;
    const pat = patients.find(p => p.id === patId)?.name || patId;
    const testName = document.getElementById("lab-test-name").value;

    labTests.push({
        id: `LAB-${Math.floor(300 + Math.random() * 90)}`,
        patientName: pat,
        testName: testName,
        result: "Pending",
        status: "Pending"
    });
    showToast("Lab Investigation Requested");
    renderLabTable();
}

function renderLabTable() {
    const tbody = document.getElementById("lab-table-body");
    tbody.innerHTML = labTests.map(l => `
        <tr class="hover:bg-slate-50">
            <td class="p-3 font-bold text-indigo-600">${l.id}</td>
            <td class="p-3">${l.patientName}</td>
            <td class="p-3">${l.testName}</td>
            <td class="p-3 font-mono">${l.result}</td>
            <td class="p-3">
                <span class="text-[10px] px-2 py-0.5 rounded font-semibold ${l.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">${l.status}</span>
            </td>
            <td class="p-3 text-right">
                ${l.status === 'Pending' ? `<button onclick="updateLabResult('${l.id}')" class="text-indigo-600 hover:underline">Update</button>` : ''}
            </td>
        </tr>
    `).join("");
}

function updateLabResult(id) {
    const val = prompt("Enter Test Result Reading / Findings:");
    if (val) {
        const lab = labTests.find(l => l.id === id);
        if (lab) {
            lab.result = val;
            lab.status = "Completed";
            showToast("Lab Result Logged");
            renderLabTable();
        }
    }
}

function toggleMedicineModal() {
    document.getElementById("med-modal").classList.toggle("hidden");
}

function saveMedicine(e) {
    e.preventDefault();
    const name = document.getElementById("med-name").value;
    const stock = parseInt(document.getElementById("med-stock").value);
    const reorder = parseInt(document.getElementById("med-reorder").value);
    const price = parseFloat(document.getElementById("med-price").value);

    inventory.push({ id: `MED-0${inventory.length + 1}`, name, category: "General", stock, reorder, price });
    showToast("Inventory drug added");
    toggleMedicineModal();
    renderPharmacyTable();
}

function renderPharmacyTable() {
    const tbody = document.getElementById("pharmacy-table-body");
    tbody.innerHTML = inventory.map(i => {
        const isAlert = i.stock <= i.reorder;
        return `
            <tr class="${isAlert ? 'bg-rose-50/50' : 'hover:bg-slate-50'}">
                <td class="p-3 font-bold">${i.id}</td>
                <td class="p-3 font-semibold">${i.name}</td>
                <td class="p-3 text-slate-500">${i.category}</td>
                <td class="p-3 font-bold ${isAlert ? 'text-rose-600' : 'text-slate-800'}">${i.stock}</td>
                <td class="p-3 text-slate-400">${i.reorder}</td>
                <td class="p-3">$${i.price.toFixed(2)}</td>
                <td class="p-3">
                    ${isAlert ? '<span class="bg-rose-100 text-rose-800 text-[10px] px-2 py-0.5 rounded font-bold"><i class="fa-solid fa-triangle-exclamation"></i> Low Stock</span>' : '<span class="text-emerald-600 text-[10px] font-semibold">Normal</span>'}
                </td>
                <td class="p-3 text-right">
                    <button onclick="restockMedicine('${i.id}')" class="text-indigo-600 hover:underline">Restock</button>
                </td>
            </tr>
        `;
    }).join("");
}

function restockMedicine(id) {
    const item = inventory.find(i => i.id === id);
    if (item) {
        item.stock += 50;
        showToast(`Restocked +50 units for ${item.name}`);
        renderPharmacyTable();
    }
}

function generateInvoice(e) {
    e.preventDefault();
    const patId = document.getElementById("bill-patient-select").value;
    const pat = patients.find(p => p.id === patId)?.name || patId;
    const opd = parseFloat(document.getElementById("bill-opd-fee").value) || 0;
    const pharma = parseFloat(document.getElementById("bill-pharma-fee").value) || 0;
    const lab = parseFloat(document.getElementById("bill-lab-fee").value) || 0;
    const bed = parseFloat(document.getElementById("bill-bed-fee").value) || 0;
    const status = document.getElementById("bill-status").value;

    const total = opd + pharma + lab + bed;
    invoices.push({
        id: `INV-${Math.floor(1000 + Math.random() * 900)}`,
        patientName: pat,
        amount: total,
        status: status
    });

    showToast(`Invoice generated: $${total}`);
    renderBillingTable();
}

function renderBillingTable() {
    const tbody = document.getElementById("billing-table-body");
    tbody.innerHTML = invoices.map(inv => `
        <tr class="hover:bg-slate-50">
            <td class="p-3 font-bold text-indigo-600">${inv.id}</td>
            <td class="p-3">${inv.patientName}</td>
            <td class="p-3 font-bold">$${inv.amount.toFixed(2)}</td>
            <td class="p-3"><span class="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-semibold">${inv.status}</span></td>
            <td class="p-3 text-right">
                <button onclick="window.print()" class="text-slate-600 hover:text-indigo-600"><i class="fa-solid fa-print"></i></button>
            </td>
        </tr>
    `).join("");
}

function renderBedMatrix() {
    const grid = document.getElementById("bed-matrix-grid");
    grid.innerHTML = beds.map(b => `
        <div class="p-4 rounded-xl border ${b.status === 'Available' ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'} space-y-2">
            <div class="flex justify-between items-center">
                <span class="font-bold text-sm text-slate-800">${b.id}</span>
                <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded ${b.status === 'Available' ? 'bg-emerald-200 text-emerald-800' : 'bg-rose-200 text-rose-800'}">${b.status}</span>
            </div>
            <p class="text-xs text-slate-500">${b.type}</p>
            <p class="text-xs font-semibold text-slate-700">Patient: ${b.patient}</p>
            <button onclick="toggleBedStatus('${b.id}')" class="w-full text-center text-xs border bg-white py-1 rounded font-semibold hover:bg-slate-50">
                ${b.status === 'Available' ? 'Assign Bed' : 'Discharge'}
            </button>
        </div>
    `).join("");
}

function toggleBedStatus(id) {
    const bed = beds.find(b => b.id === id);
    if (bed) {
        if (bed.status === 'Available') {
            const name = prompt("Enter Patient Name for Bed Assignment:");
            if (name) {
                bed.status = "Occupied";
                bed.patient = name;
                showToast(`Bed ${id} assigned to ${name}`);
            }
        } else {
            bed.status = "Available";
            bed.patient = "-";
            showToast(`Bed ${id} cleared and disinfected`);
        }
        renderBedMatrix();
    }
}

function addEmergencyPatient(e) {
    e.preventDefault();
    const name = document.getElementById("er-patient-name").value;
    const priority = document.getElementById("er-priority").value;
    const complaint = document.getElementById("er-complaint").value;

    emergencyQueue.push({
        id: `ER-${Math.floor(10 + Math.random() * 89)}`,
        name, priority, complaint
    });

    showToast("Emergency Patient Triaged!", "error");
    document.getElementById("emergency-form").reset();
    renderERQueue();
}

function renderERQueue() {
    const tbody = document.getElementById("er-table-body");
    tbody.innerHTML = emergencyQueue.map(e => `
        <tr class="hover:bg-slate-50">
            <td class="p-3 font-bold text-rose-600">${e.id}</td>
            <td class="p-3 font-semibold">${e.name}</td>
            <td class="p-3"><span class="bg-rose-100 text-rose-800 text-[10px] px-2 py-0.5 rounded font-bold">${e.priority}</span></td>
            <td class="p-3">${e.complaint}</td>
            <td class="p-3 text-right">
                <button onclick="clearEmergency('${e.id}')" class="bg-indigo-600 text-white text-[10px] px-2 py-1 rounded">Transfer/Admit</button>
            </td>
        </tr>
    `).join("");
}

function clearEmergency(id) {
    emergencyQueue = emergencyQueue.filter(e => e.id !== id);
    showToast("Emergency patient routed to ICU/Ward");
    renderERQueue();
}

function toggleRoleModal() {
    document.getElementById("role-modal").classList.toggle("hidden");
}

function setRole(roleName) {
    currentUser.role = roleName;
    document.getElementById("user-display-role").textContent = roleName;
    showToast(`Active permissions switched to ${roleName}`);
    toggleRoleModal();
}

function logoutUser() {
    document.getElementById("login-container").classList.remove("hidden");
    document.getElementById("dashboard-view").classList.add("hidden");
    showToast("Logged out of session");
}

let revenueChart = null;
let patientChart = null;

function renderAnalyticsCharts() {
    const revCtx = document.getElementById("chart-revenue")?.getContext("2d");
    const patCtx = document.getElementById("chart-patients")?.getContext("2d");

    if (revenueChart) revenueChart.destroy();
    if (patientChart) patientChart.destroy();

    if (revCtx) {
        revenueChart = new Chart(revCtx, {
            type: 'line',
            data: {
                labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
                datasets: [{
                    label: 'Revenue ($)',
                    data: [12000, 19000, 15000, 22000, 28000, 31000],
                    borderColor: '#4f46e5',
                    fill: false,
                    tension: 0.3
                }]
            }
        });
    }

    if (patCtx) {
        patientChart = new Chart(patCtx, {
            type: 'bar',
            data: {
                labels: ['OPD', 'IPD', 'Emergency', 'Laboratory'],
                datasets: [{
                    label: 'Patient Count',
                    data: [85, 32, 14, 60],
                    backgroundColor: ['#6366f1', '#10b981', '#f43f5e', '#f59e0b']
                }]
            }
        });
    }
}

window.onload = function() {
    switchPhase(1);
    addRxMedicineRow();
};