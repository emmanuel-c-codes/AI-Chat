'use client';
import React, { useState, useEffect } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { uploadImageToImgBB } from '../lib/imgbb';

export default function Marketplace() {
  const [location, setLocation] = useState('');
  const [wasteType, setWasteType] = useState('Mixed Sorted Recyclables (Earn Points)');
  const [bounty, setBounty] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' or 'mine'

  useEffect(() => {
    const q = query(collection(db, "pickup_requests"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setJobs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => console.error(error));

    return () => unsubscribe();
  }, []);

  const handlePublishJob = async (e) => {
    e.preventDefault();
    if (!location || !bounty) return alert("Please fill out all fields!");
    setLoading(true);
    let imageUrl = "";

    try {
      if (imageFile) imageUrl = await uploadImageToImgBB(imageFile);

      await addDoc(collection(db, "pickup_requests"), {
        citizenUid: auth.currentUser.uid, // Track creator access identification token
        location,
        wasteType,
        bounty: `₦${Number(bounty).toLocaleString()}`,
        imageUrl,
        status: "Available",
        createdAt: serverTimestamp()
      });

      setLocation('');
      setBounty('');
      setImageFile(null);
      alert("Success! Job written directly to global database maps pipeline stream.");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Dynamically filter matching loop arrays based on who is logged in
  const displayedJobs = filter === 'all' 
    ? jobs 
    : jobs.filter(job => job.citizenUid === auth.currentUser?.uid);

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 pb-5 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Eco-Points & Waste Marketplace</h1>
          <p className="text-sm text-slate-500 mt-1">Cash out materials or hire independent dispatch handlers instantly.</p>
        </div>
        {/* Toggle options to clean up data overview representation */}
        <div className="mt-4 md:mt-0 flex bg-white p-1 rounded-xl border border-gray-200">
          <button onClick={() => setFilter('all')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${filter === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}>Global Bounties Map</button>
          <button onClick={() => setFilter('mine')} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition ${filter === 'mine' ? 'bg-slate-900 text-white' : 'text-slate-600'}`}>My Open Escrows</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Request On-Demand Dispatch</h2>
          <form onSubmit={handlePublishJob} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase">Pickup Location Address</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. 14 Aba Road, Umuahia" className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase">Batch Content Type</label>
              <select value={wasteType} onChange={(e) => setWasteType(e.target.value)} className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none">
                <option>Mixed Sorted Recyclables (Earn Points)</option>
                <option>Bulk Industrial Waste (Paid Escrow Job)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase">Bounty Fee (₦)</label>
              <input type="number" value={bounty} onChange={(e) => setBounty(e.target.value)} placeholder="e.g. 3000" className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase">Upload Snapshot Proof</label>
              <input type="file" onChange={(e) => setImageFile(e.target.files[0])} className="mt-1 block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:border-0 file:bg-gray-100 file:text-gray-700" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white text-sm font-semibold py-3 rounded-xl transition hover:bg-slate-800 disabled:bg-slate-400">
              {loading ? "Uploading to ImgBB & Cloud..." : "Publish Job to Live Map"}
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Open Local Bounties Feed</h2>
          <div className="space-y-4">
            {displayedJobs.length === 0 ? (
              <p className="text-sm text-gray-400 italic py-8 text-center">No matching jobs found in cloud stream parameters.</p>
            ) : (
              displayedJobs.map((job) => (
                <div key={job.id} className="p-4 border border-slate-100 rounded-xl flex items-center justify-between hover:bg-slate-50 transition">
                  <div className="flex gap-4 items-center">
                    {job.imageUrl && <img src={job.imageUrl} alt="proof" className="w-12 h-12 rounded-lg object-cover border border-gray-200" />}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">{job.id.substring(0,6).toUpperCase()}</span>
                        <h3 className="font-bold text-slate-800 text-sm">{job.wasteType}</h3>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">📍 {job.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-slate-900 block">{job.bounty}</span>
                    <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-green-50 border border-green-100 text-green-700 rounded-md">{job.status}</span>
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