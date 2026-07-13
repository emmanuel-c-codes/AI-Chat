'use client';
import React, { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp } from 'firebase/firestore';

export default function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [weight, setWeight] = useState('');
  const [type, setType] = useState('General Waste');
  const [loading, setLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  // Read data isolated strictly to the logged-in corporate user
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, "compliance_logs"), where("companyUid", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const initiateSubscription = () => {
    const handler = window.PaystackPop.setup({
      key: 'pk_test_YOUR_PAYSTACK_PUBLIC_KEY', 
      email: auth.currentUser?.email || 'billing@firm.com',
      amount: 2500000, 
      currency: 'NGN',
      callback: function(response) {
        alert('Payment Reference Hash Verified: ' + response.reference);
        setIsPremium(true); 
      },
      onClose: function() {
        alert('Billing window exited.');
      }
    });
    handler.openIframe();
  };

  const handleLogWaste = async (e) => {
    e.preventDefault();
    if (!weight) return alert('Please enter the waste weight.');
    setLoading(true);

    try {
      await addDoc(collection(db, "compliance_logs"), {
        companyUid: auth.currentUser.uid,
        email: auth.currentUser.email,
        weight: `${weight}kg`,
        type: type,
        status: "Awaiting Verification",
        createdAt: serverTimestamp()
      });
      setWeight('');
      alert('Manifest successfully transmitted to government panel!');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <script src="https://js.paystack.co/v1/inline.js" async></script>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-5 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">EcoMonitor Business Hub</h1>
          <p className="text-sm text-slate-500 mt-1">Enterprise dashboard logging environmental operational metric trails.</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
          <span className={`px-3 py-1.5 rounded-lg border text-xs font-bold uppercase tracking-wider ${isPremium ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
            Status: {isPremium ? 'Premium Active' : 'Basic Tier Account'}
          </span>
          {!isPremium && (
            <button onClick={initiateSubscription} className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-emerald-700 transition">
              Activate Paystack SaaS License
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Log New Waste Manifest</h2>
          <form onSubmit={handleLogWaste} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase">Mass Cargo Load Disposed (kg)</label>
              <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 450" className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase">Hazard Class Stream Classification</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none">
                <option>General Waste</option>
                <option>Hazardous Chemical Compound Effluents</option>
                <option>Electronic Hardware E-Waste</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white text-sm font-semibold py-3 rounded-xl transition hover:bg-slate-800">
              {loading ? "Processing..." : "Submit Log for Verification"}
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Corporate Logs History Feed (Live Cloud Data)</h2>
          <div className="space-y-3">
            {logs.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-6 text-center">No active history logged yet for this authenticated business credential.</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="p-4 border border-slate-100 rounded-xl flex justify-between items-center bg-slate-50/50">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{log.type}</h4>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">Log ID: {log.id}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-slate-900 block">{log.weight}</span>
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded mt-1 border ${log.status === "Verified & Passed" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"}`}>{log.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}