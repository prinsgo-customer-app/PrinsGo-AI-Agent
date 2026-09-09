"use client"
import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function IntegrationsPage() {
  const [hermesStatus, setHermesStatus] = useState({ status: 'Loading', message: '' });

  useEffect(() => {
    api.get(`/ai-agent/admin/hermes/status`)
      .then(res => setHermesStatus(res.data))
      .catch(() => setHermesStatus({ status: 'Error', message: 'Could not fetch status' }));
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Integrations</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-sm border-brand-emerald">
          <CardHeader><CardTitle>Hermes Agent Runtime</CardTitle></CardHeader>
          <CardContent>
             <p className="mb-4 text-sm text-gray-600">Official open-source Hermes integration for executing local tools securely.</p>
             <div className="flex justify-between items-center bg-gray-50 p-3 rounded">
               <span className="font-medium text-sm">Status</span>
               <span className={`px-2 py-1 rounded text-xs ${
                  hermesStatus.status === 'Connected' ? 'bg-green-100 text-green-800' :
                  hermesStatus.status === 'Disabled' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                 {hermesStatus.status}
               </span>
             </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader><CardTitle>GitHub</CardTitle></CardHeader>
          <CardContent>
             <p className="mb-4 text-sm text-gray-600">Connect to GitHub for code analysis and agent pull requests.</p>
             <button className="bg-gray-900 text-white px-4 py-2 rounded text-sm hover:bg-gray-800">
               Connect GitHub
             </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}