import React from 'react';
import { useProsem } from '../context';

export default function IdentityForm() {
  const { identity, setIdentity } = useProsem();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let finalValue: string | number | boolean = value;

    if (type === 'checkbox') {
      finalValue = (e.target as HTMLInputElement).checked;
    } else if (type === 'number') {
      finalValue = value === '' ? 0 : Number(value);
    }

    setIdentity(prev => ({ ...prev, [name]: finalValue }));
  };

  const targetTotal = identity.hoursPerWeek * identity.effectiveWeeks;

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama Sekolah</label>
            <input type="text" name="schoolName" value={identity.schoolName} onChange={handleChange} className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" placeholder="Contoh: SMAN 1 Jakarta" />
          </div>
          
          <div className="col-span-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mata Pelajaran</label>
            <input type="text" name="subject" value={identity.subject} onChange={handleChange} className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" placeholder="Contoh: Matematika" />
          </div>
          
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Semester</label>
            <select name="semester" value={identity.semester} onChange={handleChange} className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all">
              <option value="Ganjil">Ganjil</option>
              <option value="Genap">Genap</option>
            </select>
          </div>
          
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tahun Pelajaran</label>
            <input type="text" name="schoolYear" value={identity.schoolYear} onChange={handleChange} className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" placeholder="Contoh: 2023/2024" />
          </div>
          
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Kelas / Fase</label>
            <select name="gradePhase" value={identity.gradePhase} onChange={handleChange} className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all">
              <option value="">Pilih Kelas/Fase</option>
              <option value="Kelas 1 / Fase A">Kelas 1 / Fase A</option>
              <option value="Kelas 2 / Fase A">Kelas 2 / Fase A</option>
              <option value="Kelas 3 / Fase B">Kelas 3 / Fase B</option>
              <option value="Kelas 4 / Fase B">Kelas 4 / Fase B</option>
              <option value="Kelas 5 / Fase C">Kelas 5 / Fase C</option>
              <option value="Kelas 6 / Fase C">Kelas 6 / Fase C</option>
              <option value="Kelas 7 / Fase D">Kelas 7 / Fase D</option>
              <option value="Kelas 8 / Fase D">Kelas 8 / Fase D</option>
              <option value="Kelas 9 / Fase D">Kelas 9 / Fase D</option>
              <option value="Kelas 10 / Fase E">Kelas 10 / Fase E</option>
              <option value="Kelas 11 / Fase F">Kelas 11 / Fase F</option>
              <option value="Kelas 12 / Fase F">Kelas 12 / Fase F</option>
            </select>
          </div>
          
          <div className="flex items-end pb-1.5">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" name="isSmk" checked={identity.isSmk} onChange={handleChange} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 focus:ring-2" />
              <span className="text-xs font-medium text-slate-600">Program SMK</span>
            </label>
          </div>
          
          {identity.isSmk && (
            <div className="col-span-2">
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Konsentrasi Keahlian</label>
              <input type="text" name="smkConcentration" value={identity.smkConcentration} onChange={handleChange} className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" placeholder="Contoh: Rekayasa Perangkat Lunak" />
            </div>
          )}
          
          <div className="grid grid-cols-3 gap-2 col-span-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">JP / Minggu</label>
              <input type="number" name="hoursPerWeek" value={identity.hoursPerWeek || ''} onChange={handleChange} className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" min="0" />
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mgg Efektif</label>
              <input type="number" name="effectiveWeeks" value={identity.effectiveWeeks || ''} onChange={handleChange} className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" min="0" />
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Total Target</label>
              <input type="text" readOnly className="w-full px-3 py-1.5 bg-slate-100 border border-slate-200 rounded text-sm font-bold text-indigo-700 outline-none" value={`${targetTotal} JP`} />
            </div>
          </div>
          
          <div className="col-span-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nama Guru</label>
            <input type="text" name="teacherName" value={identity.teacherName} onChange={handleChange} className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" placeholder="Nama Lengkap dengan Gelar" />
          </div>
          
          <div className="col-span-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">NIP Guru</label>
            <input type="text" name="teacherNip" value={identity.teacherNip} onChange={handleChange} className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" placeholder="NIP (Kosongkan jika tidak ada)" />
          </div>
          
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Daerah / Kota</label>
            <input type="text" name="city" value={identity.city} onChange={handleChange} className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" placeholder="Contoh: Jakarta" />
          </div>
          
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Tanggal Dokumen</label>
            <input type="date" name="date" value={identity.date} onChange={handleChange} className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" />
          </div>
          
          <div className="col-span-2">
            <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Kustomisasi Header</label>
            <input type="text" name="customHeader" value={identity.customHeader} onChange={handleChange} className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all" placeholder="Contoh: PROGRAM SEMESTER" />
          </div>
        </div>
      </div>
    </div>
  );
}
