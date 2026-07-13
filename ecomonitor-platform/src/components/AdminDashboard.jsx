import React, { useState } from 'react';

export default function AdminDashboard() {
  // Simulated state tracking platform-wide data for government oversight
  const [metrics] = useState({
    totalFinesCollected: "₦1,240,000",
    pendingVerifications: 7,
    activeCorporateSubscribers: 42,
  });

  const [pendingLogs, setPendingLogs] = useState([
    { id: "REP-003", company: "Umuahia Manufacturing Co.", date: "2026-07-05", weight: "450kg", type: "Hazardous Waste" },
    { id: "REP-004", company: "Golden Land Estates", date: "2026-07-04", weight: "800kg", type: "General Waste" },
  ]);

  return (
    <div className="min-h-screen bg-rose-50/30 p-6 font-sans">
      {/* Admin Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center border-b border-rose-200 pb-5 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Ministry Environmental Control Panel</h1>
          <p className="text-sm text-slate-500 mt-1">Government oversight, regulatory enforcement, and compliance verification audit trail.</p>
        </div>
        <span className="mt-4 md:mt-0 bg-rose-100 text-rose-900 border border-rose-200 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg">
          Clearance Level: State Administrator
        </span>
      </div>

      {/* Government Metrics Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Enforcement Revenue (Fines)</h3>
          <p className="text-3xl font-black text-rose-600 mt-2">{metrics.totalFinesCollected}</p>
          <p className="text-xs text-slate-400 mt-1">Automated collections via platform escrow leaks</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Awaiting Field Verification</h3>
          <p className="text-3xl font-black text-amber-500 mt-2">{metrics.pendingVerifications} Alerts</p>
          <p className="text-xs text-slate-400 mt-1">Requires digital manifest sign-off</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Licensed Taxable Entities</h3>
          <p className="text-3xl font-black text-slate-900 mt-2">{metrics.activeCorporateSubscribers} Firms</p>
          <p className="text-xs text-slate-400 mt-1">Active monthly compliance subscriptions</p>
        </div>
      </div>

      {/* Main Approval Queue Layout */}
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Corporate Disposal Approval Queue</h2>
        <p className="text-xs text-slate-400 mb-6">Review raw manifests uploaded by businesses to award compliance weight points or issue citations.</p>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-50">
                <th className="px-4 py-3">Company Name</th>
                <th className="px-4 py-3">Log ID</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Weight</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-slate-700">
              {pendingLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-4 py-4 font-bold text-slate-900">{log.company}</td>
                  <td className="px-4 py-4 font-mono text-xs">{log.id}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${log.type === 'Hazardous Waste' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-slate-100 text-slate-700'}`}>
                      {log.type}
                    </span>
                  </td>
                  <td className="px-4 py-4">{log.weight}</td>
                  <td className="px-4 py-4 text-right space-x-2">
                    <button className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition">
                      Approve & Certify
                    </button>
                    <button className="bg-rose-100 text-rose-700 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-rose-200 transition">
                      Issue Fine
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}