"use client";
import { useState } from 'react';

export default function Home() {
  const [assessment, setAssessment] = useState<{level: string, advice: string} | null>(null);

  async function handleTriage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const symptom = formData.get("symptom");

    const response = await fetch('/api/triage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symptom }),
    });

    const data = await response.json();
    setAssessment(data);
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Patient Triage</h1>
        
        <form onSubmit={handleTriage} className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">Primary Symptom</label>
          <select name="symptom" className="w-full p-3 border rounded-lg border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none" required>
            <option value="">-- Select --</option>
            <option value="chest_pain">Chest Pain</option>
            <option value="fever">High Fever</option>
          </select>
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">
            Submit Assessment
          </button>
        </form>

        {assessment && (
          <div className="mt-8 p-4 bg-slate-50 border-l-4 border-blue-500 rounded">
            <p className="font-bold text-slate-800">Result: {assessment.level}</p>
            <p className="text-sm text-slate-600 mt-1">{assessment.advice}</p>
          </div>
        )}
      </div>
    </main>
  );
}