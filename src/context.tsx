import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ProgramIdentity, Material, DistributionData, WeekStatusData, Semester } from './types';

interface ProsemContextType {
  identity: ProgramIdentity;
  setIdentity: React.Dispatch<React.SetStateAction<ProgramIdentity>>;
  materials: Material[];
  setMaterials: React.Dispatch<React.SetStateAction<Material[]>>;
  distribution: DistributionData;
  setDistribution: React.Dispatch<React.SetStateAction<DistributionData>>;
  weekStatuses: WeekStatusData;
  setWeekStatuses: React.Dispatch<React.SetStateAction<WeekStatusData>>;
  resetData: () => void;
}

const defaultIdentity: ProgramIdentity = {
  schoolName: '',
  subject: '',
  semester: 'Ganjil',
  schoolYear: '',
  gradePhase: '',
  isSmk: false,
  smkConcentration: '',
  hoursPerWeek: 0,
  effectiveWeeks: 0,
  teacherName: '',
  teacherNip: '',
  city: '',
  date: new Date().toISOString().split('T')[0],
  customHeader: 'PROGRAM SEMESTER',
};

const ProsemContext = createContext<ProsemContextType | undefined>(undefined);

export const ProsemProvider = ({ children }: { children: ReactNode }) => {
  const [identity, setIdentity] = useState<ProgramIdentity>(defaultIdentity);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [distribution, setDistribution] = useState<DistributionData>({});
  const [weekStatuses, setWeekStatuses] = useState<WeekStatusData>({});

  const resetData = () => {
    if (window.confirm('Apakah Anda yakin ingin mereset semua data? Semua isian akan dihapus.')) {
      setIdentity(defaultIdentity);
      setMaterials([]);
      setDistribution({});
      setWeekStatuses({});
    }
  };

  return (
    <ProsemContext.Provider value={{
      identity, setIdentity,
      materials, setMaterials,
      distribution, setDistribution,
      weekStatuses, setWeekStatuses,
      resetData
    }}>
      {children}
    </ProsemContext.Provider>
  );
};

export const useProsem = () => {
  const context = useContext(ProsemContext);
  if (context === undefined) {
    throw new Error('useProsem must be used within a ProsemProvider');
  }
  return context;
};
