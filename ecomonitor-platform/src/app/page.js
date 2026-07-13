'use client';
import React, { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import Dashboard from '@/components/Dashboard';
import Marketplace from '@/components/Marketplace';
import AdminDashboard from '@/components/AdminDashboard';

export default function Home() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Auth/Form States
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('citizen');
  const [companyName, setCompanyName] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch user role from Firestore profile metadata
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert('Please fill in all fields');
    setLoading(true);

    try {
      if (isSignUp) {
        // Create new identity authentication instance
        const res = await createUserWithEmailAndPassword(auth, email, password);
        // Save authorization metadata record profile
        await setDoc(doc(db, 'users', res.user.uid), {
          uid: res.user.uid,
          email,
          role: selectedRole,
          name: selectedRole === 'business' ? companyName : 'Platform User',
          createdAt: new Date()
        });
        setRole(selectedRole);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => signOut(auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  // If logged in, dynamically lock screen view strictly to authorization clearance mapping
  if (user && role) {
    return (
      <div className="relative">
        {/* Secure Management Header bar for logged in profiles */}
        <div className="bg-slate-900 text-white px-6 py-3 flex justify-between items-center text-xs border-b border-slate-800">
          <div>
            Logged in as: <span className="font-mono text-emerald-400 font-bold">{email}</span> | Clearances: <span className="uppercase tracking-wider font-bold text-amber-400">[{role}]</span>
          </div>
          <button onClick={handleLogout} className="bg-rose-600 px-3 py-1 rounded font-bold hover:bg-rose-700 transition">
            Secure Logout
          </button>
        </div>
        {role === 'citizen' && <Marketplace />}
        {role === 'business' && <Dashboard />}
        {role === 'admin' && <AdminDashboard />}
      </div>
    );
  }

  // Gatekeeper Landing Portal Screen layout template view
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">EcoMonitor</h1>
        <p className="mt-2 text-sm text-slate-600">
          Environmental Infrastructure & Autonomous Monetization Nexus
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm rounded-2xl border border-slate-200 sm:px-10">
          <h2 className="text-xl font-bold text-slate-900 mb-6 text-center">
            {isSignUp ? 'Create secure account access profile' : 'Sign in to platform terminal'}
          </h2>
          
          <form onSubmit={handleAuth} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase">Select Target Account Persona</label>
                <select 
                  value={selectedRole} 
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm"
                >
                  <option value="citizen">Citizen Ecosystem / Handler</option>
                  <option value="business">Enterprise Entity / Corporate Client</option>
                  <option value="admin">Regulatory Ministry Oversight Admin</option>
                </select>
              </div>
            )}

            {isSignUp && selectedRole === 'business' && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase">Registered Corporate Name</label>
                <input 
                  type="text" required
                  value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Apex Industrial Manufacturing Ltd"
                  className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase">Security Email Address</label>
              <input 
                type="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@ecomonitor.internal"
                className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase">Authorization Password</label>
              <input 
                type="password" required
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"
              />
            </div>

            <button type="submit" className="w-full bg-slate-900 text-white text-sm font-semibold py-3 rounded-xl hover:bg-slate-800 transition">
              {isSignUp ? 'Generate Verified Profile Access Token' : 'Authenticate Session Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => setIsSignUp(!isSignUp)} 
              className="text-xs font-semibold text-emerald-600 hover:underline"
            >
              {isSignUp ? 'Already have access credentials? Log in' : 'Request account creation license'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}