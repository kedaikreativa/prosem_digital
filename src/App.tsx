import React, { useState } from 'react';
import { ProsemProvider, useProsem } from './context';
import IdentityForm from './components/IdentityForm';
import MaterialManager from './components/MaterialManager';
import ProsemTable from './components/ProsemTable';
import PrintPreview from './components/PrintPreview';
import { Printer, Calendar, RefreshCw } from 'lucide-react';

function MainApp() {
  const [activeTab, setActiveTab] = useState<'setup' | 'distribution'>('setup');
  const [showPreview, setShowPreview] = useState(false);
  const { resetData } = useProsem();

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 font-sans text-slate-800 overflow-hidden">
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm z-10 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">PROSEM <span className="text-indigo-600">Digital</span></h1>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={resetData}
            className="flex items-center px-4 py-2 bg-red-50 border border-red-200 rounded-md text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
          >
            <RefreshCw size={16} className="mr-2" /> <span className="hidden sm:inline">Reset</span>
          </button>
          <button 
            onClick={() => setShowPreview(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            <Printer size={16} className="mr-2" /> <span className="hidden sm:inline">Cetak / Export</span><span className="sm:hidden">Cetak</span>
          </button>
        </div>
      </header>

      {/* Mobile Tab Navigation (visible only on small screens) */}
      <div className="lg:hidden flex border-b border-slate-200 bg-white shrink-0">
        <button
          onClick={() => setActiveTab('setup')}
          className={`flex-1 py-3 text-[10px] sm:text-xs font-bold uppercase tracking-wider ${activeTab === 'setup' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:bg-slate-50 transition-colors'}`}
        >
          Identitas & Materi
        </button>
        <button
          onClick={() => setActiveTab('distribution')}
          className={`flex-1 py-3 text-[10px] sm:text-xs font-bold uppercase tracking-wider ${activeTab === 'distribution' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-500 hover:bg-slate-50 transition-colors'}`}
        >
          Distribusi JP
        </button>
      </div>

      <main className="flex-1 flex overflow-hidden p-0 lg:p-4 lg:space-x-4 relative">
        {/* Left Section (Setup) */}
        <section className={`w-full h-full lg:w-[450px] xl:w-[500px] bg-white lg:border border-slate-200 lg:rounded-xl flex flex-col overflow-hidden shadow-sm ${activeTab === 'setup' ? 'flex absolute inset-0 lg:relative z-0' : 'hidden lg:flex'}`}>
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
            <h2 className="font-semibold text-slate-700 uppercase tracking-wider text-xs">Identitas & Materi</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <IdentityForm />
            <MaterialManager />
          </div>
        </section>

        {/* Right Section (Distribution/Preview) */}
        <section className={`w-full h-full flex-1 bg-white lg:border border-slate-200 lg:rounded-xl shadow-lg flex flex-col overflow-hidden ${activeTab === 'distribution' ? 'flex absolute inset-0 lg:relative z-0' : 'hidden lg:flex'}`}>
          <div className="bg-slate-800 text-white px-4 sm:px-6 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-indigo-300" />
              </div>
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest">Tabel Distribusi JP</h2>
                <p className="text-[10px] text-slate-400 font-medium">Atur Alokasi Jam Pelajaran</p>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-auto bg-slate-100 p-2 sm:p-4 lg:p-6 custom-scrollbar flex flex-col items-center">
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 w-full xl:w-max min-w-full">
              <ProsemTable />
            </div>
          </div>
        </section>
      </main>

      {showPreview && <PrintPreview onClose={() => setShowPreview(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <ProsemProvider>
      <MainApp />
    </ProsemProvider>
  );
}
