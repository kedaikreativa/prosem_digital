import React, { useState } from 'react';
import { useProsem } from '../context';
import { Material } from '../types';

export default function MaterialManager() {
  const { identity, materials, setMaterials, setDistribution } = useProsem();
  const [newMaterial, setNewMaterial] = useState({ name: '', alokasiJp: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', alokasiJp: '' });

  const targetTotal = identity.hoursPerWeek * identity.effectiveWeeks;
  const currentTotal = materials.reduce((sum, m) => sum + m.alokasiJp, 0);
  const isUnbalanced = targetTotal > 0 && currentTotal !== targetTotal;

  const handleAdd = () => {
    if (!newMaterial.name || !newMaterial.alokasiJp) return;
    
    const newId = crypto.randomUUID();
    setMaterials([...materials, {
      id: newId,
      name: newMaterial.name,
      alokasiJp: Number(newMaterial.alokasiJp)
    }]);
    setNewMaterial({ name: '', alokasiJp: '' });
  };

  const handleDelete = (id: string) => {
    setMaterials(materials.filter(m => m.id !== id));
    setDistribution(prev => {
      const newDist = { ...prev };
      delete newDist[id];
      return newDist;
    });
  };

  const startEdit = (material: Material) => {
    setEditingId(material.id);
    setEditForm({ name: material.name, alokasiJp: material.alokasiJp.toString() });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = (id: string) => {
    if (!editForm.name || !editForm.alokasiJp) return;
    
    setMaterials(materials.map(m => m.id === id ? {
      ...m,
      name: editForm.name,
      alokasiJp: Number(editForm.alokasiJp)
    } : m));
    setEditingId(null);
  };

  return (
    <div className="pt-4 border-t border-slate-100 mt-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase">Kelola Materi</h3>
      </div>
      
      <div className="flex flex-col gap-2 mb-4">
        <input 
          type="text" 
          placeholder="Nama Materi Pembelajaran" 
          value={newMaterial.name}
          onChange={e => setNewMaterial({...newMaterial, name: e.target.value})}
          className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
        />
        <div className="flex gap-2">
          <input 
            type="number" 
            placeholder="JP" 
            value={newMaterial.alokasiJp}
            onChange={e => setNewMaterial({...newMaterial, alokasiJp: e.target.value})}
            className="w-20 px-3 py-1.5 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
            min="0"
          />
          <button 
            onClick={handleAdd}
            className="flex-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase rounded hover:bg-indigo-100 transition-colors py-1.5"
          >
            + Tambah
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {materials.length === 0 ? (
          <div className="text-center text-xs text-slate-400 py-4 italic">Belum ada materi</div>
        ) : materials.map((material, index) => (
          <div key={material.id} className="p-3 bg-slate-50 rounded border border-slate-200 relative group">
            {editingId === material.id ? (
              <div className="flex flex-col gap-2">
                <input 
                  type="text" 
                  value={editForm.name}
                  onChange={e => setEditForm({...editForm, name: e.target.value})}
                  className="w-full px-2 py-1 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-indigo-500/20 outline-none"
                />
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    value={editForm.alokasiJp}
                    onChange={e => setEditForm({...editForm, alokasiJp: e.target.value})}
                    className="w-16 px-2 py-1 border border-slate-300 rounded text-xs focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    min="0"
                  />
                  <button onClick={() => saveEdit(material.id)} className="text-[10px] text-green-700 font-bold uppercase px-3 py-1 bg-green-50 rounded border border-green-200 hover:bg-green-100 transition-colors">Simpan</button>
                  <button onClick={cancelEdit} className="text-[10px] text-slate-600 font-bold uppercase px-3 py-1 bg-slate-100 rounded border border-slate-200 hover:bg-slate-200 transition-colors">Batal</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start">
                  <div className="text-xs font-medium pr-12 text-slate-800">{index + 1}. {material.name}</div>
                  <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">{material.alokasiJp} JP</span>
                </div>
                <div className="flex space-x-3 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEdit(material)} className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold uppercase">Edit</button>
                  <button onClick={() => handleDelete(material.id)} className="text-[10px] text-red-600 hover:text-red-800 font-bold uppercase">Hapus</button>
                </div>
              </>
            )}
          </div>
        ))}
        
        <div className={`p-3 rounded mt-4 flex justify-between items-center border ${isUnbalanced ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
          <div className={`text-xs font-medium ${isUnbalanced ? 'text-red-800' : 'text-green-800'}`}>Total Alokasi Saat Ini:</div>
          <div className={`text-sm font-black ${isUnbalanced ? 'text-red-600' : 'text-green-700'}`}>
            {currentTotal} / {targetTotal} JP
          </div>
        </div>
      </div>
    </div>
  );
}
