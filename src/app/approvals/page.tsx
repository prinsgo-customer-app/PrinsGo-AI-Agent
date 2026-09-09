"use client"
import React, { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function ApprovalsPage() {
  const workspaceId = useAuthStore((state) => state.workspaceId);
  const [approvals, setApprovals] = useState<Record<string, unknown>[]>([]);

  const fetchApprovals = useCallback(() => {
    if (workspaceId) {
      api.get(`/ai-agent/admin/approvals?workspaceId=${workspaceId}`)
        .then(res => setApprovals(res.data.approvals))
        .catch(console.error);
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  const handleResolve = async (id: string, status: string) => {
    try {
      await api.post(`/ai-agent/admin/approvals/${id}/resolve`, { status });
      fetchApprovals();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Approval Center</h1>

      <div className="space-y-4">
        {approvals.filter((a: Record<string, unknown>) => a.status === 'PENDING').map((approval: Record<string, unknown>) => (
          <Card key={approval._id as string} className="shadow-sm border-l-4 border-amber-500">
            <CardHeader className="pb-2 flex justify-between flex-row">
              <CardTitle className="text-lg">Action: {approval.actionType as string}</CardTitle>
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Risk: {approval.riskLevel as string}</span>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 mb-4">{approval.description as string}</p>
              <div className="flex gap-2">
                <Button variant="default" className="bg-brand-emerald" onClick={() => handleResolve(approval._id as string, 'APPROVED')}>
                  Approve
                </Button>
                <Button variant="outline" onClick={() => handleResolve(approval._id as string, 'REJECTED')}>
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {approvals.filter((a: Record<string, unknown>) => a.status === 'PENDING').length === 0 && (
          <p className="text-gray-500">No pending approvals.</p>
        )}
      </div>
    </div>
  );
}