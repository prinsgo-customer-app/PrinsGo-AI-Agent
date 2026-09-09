"use client"
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function AdminPage() {
  const workspaceId = useAuthStore((state) => state.workspaceId);
  const [logs, setLogs] = useState<Record<string, unknown>[]>([]);
  const [hermesStatus, setHermesStatus] = useState({ status: 'Loading', message: '' });

  useEffect(() => {
    if (workspaceId) {
      api.get(`/ai-agent/admin/logs?workspaceId=${workspaceId}`)
        .then(res => setLogs(res.data.logs))
        .catch(console.error);

      api.get(`/ai-agent/admin/hermes/status`)
        .then(res => setHermesStatus(res.data))
        .catch(() => setHermesStatus({ status: 'Error', message: 'Could not fetch status' }));
    }
  }, [workspaceId]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <Card className="shadow-sm">
        <CardHeader><CardTitle>Hermes Integration Status</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              hermesStatus.status === 'Connected' ? 'bg-green-100 text-green-800' :
              hermesStatus.status === 'Disabled' ? 'bg-gray-100 text-gray-800' :
              'bg-red-100 text-red-800'
            }`}>
              {hermesStatus.status}
            </span>
            <span className="text-gray-600 text-sm">{hermesStatus.message}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader><CardTitle>Recent Audit Logs</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {logs.slice(0, 10).map((log: Record<string, unknown>) => (
              <div key={log._id as string} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="text-sm font-medium">{log.action as string}</p>
                  <p className="text-xs text-gray-500">Tool: {log.tool as string} | Result: {(log.result || log.error) as string}</p>
                </div>
                <span className="text-xs text-gray-400">{new Date(log.createdAt as string).toLocaleString()}</span>
              </div>
            ))}
            {logs.length === 0 && <p className="text-sm text-gray-500">No logs found.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}