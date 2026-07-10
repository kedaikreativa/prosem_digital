import React, { useState } from 'react';
import { useProsem } from '../context';
import { GANJIL_MONTHS, GENAP_MONTHS, MonthData, WeekStatus } from '../types';

interface ProsemTableProps {
  isPrintMode?: boolean;
}

export default function ProsemTable({ isPrintMode = false }: ProsemTableProps) {
  const { identity, materials, distribution, setDistribution, weekStatuses, setWeekStatuses } = useProsem();
  const months: MonthData[] = identity.semester === 'Ganjil' ? GANJIL_MONTHS : GENAP_MONTHS;
  const [fillMode, setFillMode] = useState<'pbm' | 'libur'>('pbm');

  const toggleWeekStatus = (monthIndex: number, weekIndex: number) => {
    if (isPrintMode) return;
    
    setWeekStatuses(prev => {
      const monthData = prev[monthIndex] || {};
      const currentStatus = monthData[weekIndex] || 'efektif';
      const newStatus: WeekStatus = currentStatus === 'efektif' ? 'libur' : 'efektif';
      
      return {
        ...prev,
        [monthIndex]: {
          ...monthData,
          [weekIndex]: newStatus
        }
      };
    });
  };

  const handleJpChange = (materialId: string, monthIndex: number, weekIndex: number, value: string | number) => {
    let finalValue: number | string = '';
    
    if (value === 'L') {
      finalValue = 'L';
    } else if (value === '' || value === 0) {
      finalValue = '';
    } else {
      finalValue = Number(value);
    }
    
    setDistribution(prev => {
      const matDist = prev[materialId] || {};
      const monthDist = matDist[monthIndex] || {};
      
      return {
        ...prev,
        [materialId]: {
          ...matDist,
          [monthIndex]: {
            ...monthDist,
            [weekIndex]: finalValue
          }
        }
      };
    });
  };

  const getWeekStatus = (monthIndex: number, weekIndex: number): WeekStatus => {
    return (weekStatuses[monthIndex] && weekStatuses[monthIndex][weekIndex]) || 'efektif';
  };

  const getJpValue = (materialId: string, monthIndex: number, weekIndex: number): number | string => {
    const val = distribution[materialId]?.[monthIndex]?.[weekIndex];
    return val === undefined || val === 0 ? '' : val;
  };

  const getTotalJpForMaterial = (materialId: string) => {
    let total = 0;
    const matDist = distribution[materialId];
    if (matDist) {
      Object.values(matDist).forEach(month => {
        Object.values(month).forEach(jp => {
          if (typeof jp === 'number') {
            total += jp;
          } else if (typeof jp === 'string' && !isNaN(Number(jp)) && jp !== '') {
            total += Number(jp);
          }
        });
      });
    }
    return total;
  };

  const handleCellClick = (materialId: string, mIndex: number, wIndex: number) => {
    if (isPrintMode) return;
    
    const currentVal = distribution[materialId]?.[mIndex]?.[wIndex];
    const isLiburCell = currentVal === 'L';
    const isPbmCell = typeof currentVal === 'number' && currentVal > 0;
    
    if (fillMode === 'pbm') {
      if (isPbmCell) {
        handleJpChange(materialId, mIndex, wIndex, '');
      } else {
        const currentTotal = getTotalJpForMaterial(materialId);
        const target = materials.find(m => m.id === materialId)?.alokasiJp || 0;
        const remaining = target - currentTotal;
        
        let jpToAssign = identity.hoursPerWeek || 2;
        if (remaining > 0 && remaining < jpToAssign) {
          jpToAssign = remaining;
        }
        
        handleJpChange(materialId, mIndex, wIndex, jpToAssign);
      }
    } else if (fillMode === 'libur') {
      if (isLiburCell) {
        handleJpChange(materialId, mIndex, wIndex, '');
      } else {
        handleJpChange(materialId, mIndex, wIndex, 'L');
      }
    }
  };

  return (
    <div className={`overflow-x-auto ${isPrintMode ? 'w-full' : ''}`}>
      {!isPrintMode && (
        <div className="mb-4 bg-white p-3 border border-slate-200 rounded-md">
          <div className="text-xs font-bold text-slate-700 mb-2 uppercase">Mode Pengisian:</div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex space-x-2">
              <button
                onClick={() => setFillMode('pbm')}
                className={`px-3 py-1.5 rounded text-xs font-bold flex items-center border transition-colors ${
                  fillMode === 'pbm'
                    ? 'bg-indigo-50 border-indigo-600 text-indigo-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className={`w-3 h-3 rounded-full mr-2 ${fillMode === 'pbm' ? 'bg-indigo-600' : 'bg-slate-300'}`}></div>
                Belajar (JP)
              </button>
              <button
                onClick={() => setFillMode('libur')}
                className={`px-3 py-1.5 rounded text-xs font-bold flex items-center border transition-colors ${
                  fillMode === 'libur'
                    ? 'bg-red-50 border-red-600 text-red-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className={`w-3 h-3 rounded-full mr-2 ${fillMode === 'libur' ? 'bg-red-500' : 'bg-slate-300'}`}></div>
                Libur / Non-Efektif
              </button>
            </div>
            <div className="text-[10px] sm:text-xs text-slate-500 italic">
              *Tips: Klik sel pada tabel program di bawah untuk menerapkan warna/jadwal.
            </div>
          </div>
        </div>
      )}
      
      <table className={`min-w-full border-collapse border border-slate-400 text-[10px] sm:text-xs table-fixed`} style={{ width: isPrintMode ? '100%' : 'max-content' }}>
        <thead>
          <tr className="bg-slate-100 border-b border-slate-400">
            <th rowSpan={2} className="border border-slate-400 py-2 px-1 text-center font-bold w-8">NO</th>
            <th rowSpan={2} className="border border-slate-400 py-2 px-2 text-left font-bold min-w-[150px] w-48 uppercase">Materi Pembelajaran</th>
            <th rowSpan={2} className="border border-slate-400 py-2 px-1 text-center font-bold w-12">JP</th>
            
            {months.map((month, mIndex) => (
              <th key={mIndex} colSpan={month.weeks} className="border border-slate-400 py-1 text-center font-bold uppercase text-[10px]">
                {month.name}
              </th>
            ))}
          </tr>
          <tr className="bg-slate-50 font-bold">
            {months.map((month, mIndex) => (
              Array.from({ length: month.weeks }).map((_, wIndex) => {
                const status = getWeekStatus(mIndex, wIndex + 1);
                const isLibur = status === 'libur';
                return (
                  <th 
                    key={`${mIndex}-${wIndex}`} 
                    className={`border border-slate-400 py-1 text-center text-[10px] w-6 cursor-pointer ${isLibur ? 'bg-slate-300 text-slate-500' : 'hover:bg-indigo-50'} ${!isPrintMode ? 'transition-colors' : ''}`}
                    onClick={() => toggleWeekStatus(mIndex, wIndex + 1)}
                    title={isPrintMode ? '' : isLibur ? 'Klik untuk set sebagai Efektif' : 'Klik untuk set sebagai Libur'}
                  >
                    {wIndex + 1}
                  </th>
                );
              })
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-400">
          {materials.length === 0 ? (
            <tr>
              <td colSpan={3 + months.reduce((acc, m) => acc + m.weeks, 0)} className="border border-slate-400 py-6 text-center text-slate-400 italic text-xs">
                Belum ada data materi yang ditambahkan.
              </td>
            </tr>
          ) : materials.map((material, index) => {
            const distributedTotal = getTotalJpForMaterial(material.id);
            const isUnbalanced = distributedTotal !== material.alokasiJp;
            
            return (
              <tr key={material.id} className="hover:bg-slate-50 divide-x divide-slate-400">
                <td className="border-none py-2 text-center text-[10px]">{index + 1}</td>
                <td className="border-none py-2 px-2 text-[10px] sm:text-xs font-medium text-slate-800">{material.name}</td>
                <td className={`border-none py-2 px-1 text-center font-bold ${isUnbalanced && !isPrintMode ? 'text-red-600' : 'text-slate-800'}`}>
                  {material.alokasiJp}
                </td>
                
                {months.map((month, mIndex) => (
                  Array.from({ length: month.weeks }).map((_, wIndex) => {
                    const status = getWeekStatus(mIndex, wIndex + 1);
                    const isWeekLibur = status === 'libur';
                    const val = getJpValue(material.id, mIndex, wIndex + 1);
                    const isCellLibur = val === 'L';
                    const isEffectivelyLibur = isWeekLibur || isCellLibur;
                    const isPbmCell = typeof val === 'number' && val > 0;
                    
                    return (
                      <td 
                        key={`${mIndex}-${wIndex}`} 
                        className={`border-none p-0 text-center relative cursor-pointer
                          ${isEffectivelyLibur ? 'bg-red-500/10' : (isPbmCell ? 'bg-indigo-600' : 'bg-white hover:bg-slate-50')}
                        `}
                        onClick={(e) => {
                          handleCellClick(material.id, mIndex, wIndex + 1);
                        }}
                        style={isEffectivelyLibur ? {
                          backgroundImage: 'repeating-linear-gradient(45deg, #fecaca, #fecaca 4px, #fee2e2 4px, #fee2e2 8px)'
                        } : {}}
                      >
                        {isEffectivelyLibur ? (
                          <div className="w-full h-full min-h-[24px] sm:min-h-[28px] flex items-center justify-center text-red-600 select-none text-[10px] sm:text-xs font-bold">
                            {isPrintMode ? '' : 'L'}
                          </div>
                        ) : isPbmCell ? (
                          <div className="w-full h-full min-h-[24px] sm:min-h-[28px] flex items-center justify-center text-white select-none text-[10px] sm:text-xs font-bold">
                            ✓
                          </div>
                        ) : (
                          <div className="w-full h-full min-h-[24px] sm:min-h-[28px]"></div>
                        )}
                      </td>
                    );
                  })
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
