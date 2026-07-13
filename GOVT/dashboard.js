import {
    db,
    collection,
    onSnapshot,
    query,
    orderBy
} from "./firebase.js";

// ===========================
// Dashboard Elements
// ===========================

const totalUsers = document.getElementById("totalUsers");
const totalReports = document.getElementById("totalReports");
const pendingReports = document.getElementById("pendingReports");
const criticalReports = document.getElementById("criticalReports");

const reportsTable = document.getElementById("reportsTable");

// ===========================
// Dashboard Statistics
// ===========================

function loadDashboard() {

    // Users
    onSnapshot(collection(db, "users"), (snapshot) => {

        totalUsers.textContent = snapshot.size;

    });

    // Reports
    onSnapshot(collection(db, "reports"), (snapshot) => {

        totalReports.textContent = snapshot.size;

        let pending = 0;
        let critical = 0;

        snapshot.forEach(doc => {

            const report = doc.data();

            if (report.status === "Pending") {
                pending++;
            }

            if (report.priority === "Critical") {
                critical++;
            }

        });

        pendingReports.textContent = pending;
        criticalReports.textContent = critical;

    });

}

loadDashboard();

// ===========================
// Recent Reports Table
// ===========================

const reportsQuery = query(
    collection(db, "reports"),
    orderBy("createdAt", "desc")
);

onSnapshot(reportsQuery, (snapshot) => {

    reportsTable.innerHTML = "";

    if (snapshot.empty) {

        reportsTable.innerHTML = `
            <tr>
                <td colspan="5" class="p-5 text-center text-gray-500">
                    No reports available
                </td>
            </tr>
        `;

        return;
    }

    snapshot.forEach((doc) => {

        const report = doc.data();

        reportsTable.innerHTML += `
            <tr class="border-b hover:bg-gray-50">

                <td class="p-4">
                    ${report.fullName || "-"}
                </td>

                <td class="p-4">
                    ${report.category || "-"}
                </td>

                <td class="p-4">
                    ${report.state || "-"}
                </td>

                <td class="p-4">

                    <span class="
                        px-3
                        py-1
                        rounded-full
                        text-sm

                        ${
                            report.status=="Resolved"
                            ? "bg-green-100 text-green-700"
                            : report.status=="Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : report.status=="Investigating"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700"
                        }

                    ">

                        ${report.status}

                    </span>

                </td>

                <td class="p-4">

                    ${
                        report.createdAt
                        ? new Date(report.createdAt.seconds*1000)
                          .toLocaleDateString()
                        : "-"
                    }

                </td>

            </tr>
        `;

    });

});