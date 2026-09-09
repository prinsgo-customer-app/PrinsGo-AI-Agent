"use client"
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useMemoryStore } from '@/store/memoryStore';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function MemoryPage() {
  const workspaceId = useAuthStore((state) => state.workspaceId);
  const user = useAuthStore((state) => state.user);
  const { memories, setMemories, addMemory } = useMemoryStore();
  const [content, setContent] = useState('');

  useEffect(() => {
    if (workspaceId) {
      api.get(`/ai-agent/memory?workspaceId=${workspaceId}`)
        .then(res => setMemories(res.data.memories))
        .catch(console.error);
    }
  }, [workspaceId, setMemories]);

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !workspaceId) return;

    try {
      const res = await api.post('/ai-agent/memory', {
        workspaceId,
        userId: user?._id,
        type: 'RULE',
        content
      });
      addMemory(res.data.memory);
      setContent('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Memory & Knowledge</h1>

      <Card className="shadow-sm">
        <CardHeader><CardTitle>Add Knowledge</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleAddMemory} className="flex gap-4">
            <input
              type="text"
              className="flex-1 p-2 border rounded"
              placeholder="e.g. Always use tailwind for styling"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button type="submit" className="bg-brand-emerald text-white px-4 py-2 rounded hover:bg-brand-emerald-dark">
              Save to Memory
            </button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {memories.map((mem: Record<string, unknown>) => (
          <Card key={mem._id as string} className="shadow-sm">
            <CardHeader className="pb-2">
              <Badge variant="secondary" className="w-fit">{mem.type as string}</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium">{mem.content as string}</p>
              <p className="text-xs text-gray-400 mt-2">{new Date(mem.createdAt as string).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}