import React, { useRef } from 'react';
import { X, Printer, FileText } from 'lucide-react';
import { useProsem } from '../context';
import ProsemTable from './ProsemTable';

interface PrintPreviewProps {
  onClose: () => void;
}

export default function PrintPreview({ onClose }: PrintPreviewProps) {
  const { identity } = useProsem();
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrintPdf = () => {
    if (!printRef.current) return;
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Cetak PDF Prosem</title>
            <style>
              @page { size: landscape; margin: 15mm; }
              body { font-family: 'Times New Roman', Times, serif; color: #000; padding: 0; margin: 0; }
              table { border-collapse: collapse; width: 100%; margin-top: 20px; font-size: 10pt; }
              table, th, td { border: 1px solid black; }
              th, td { padding: 4px; text-align: center; }
              .text-left { text-align: left !important; }
              .header-title { text-align: center; font-weight: bold; font-size: 14pt; margin-bottom: 20px; text-transform: uppercase; }
              .info-table { border: none; width: 100%; margin-bottom: 20px; font-weight: bold; font-size: 10pt; }
              .info-table td { border: none; padding: 2px; text-align: left; }
              .signature-table { border: none; width: 100%; margin-top: 40px; font-size: 10pt; }
              .signature-table td { border: none; text-align: center; }
              
              /* Tailwind Classes Mapping for Print */
              .bg-slate-100 { background-color: #f1f5f9 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .bg-slate-50 { background-color: #f8fafc !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .bg-slate-300 { background-color: #cbd5e1 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .text-slate-500 { color: #64748b !important; }
              .text-slate-400 { color: #94a3b8 !important; }
              .text-slate-800 { color: #1e293b !important; }
              
              /* PBM & Libur Cells */
              .bg-indigo-600 { background-color: #4f46e5 !important; color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .text-white { color: white !important; }
              .bg-red-500\\/10 { background-image: repeating-linear-gradient(45deg, #fecaca, #fecaca 4px, #fee2e2 4px, #fee2e2 8px) !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .text-red-600 { color: #dc2626 !important; }
              
              /* Layout Utilities */
              .border-none { border: none !important; }
              .font-bold { font-weight: bold !important; }
              .font-medium { font-weight: 500 !important; }
              .text-center { text-align: center !important; }
              .uppercase { text-transform: uppercase !important; }
              .italic { font-style: italic !important; }
              .p-0 { padding: 0 !important; }
              .py-1 { padding-top: 0.25rem !important; padding-bottom: 0.25rem !important; }
              .py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
              .px-1 { padding-left: 0.25rem !important; padding-right: 0.25rem !important; }
              .px-2 { padding-left: 0.5rem !important; padding-right: 0.5rem !important; }
              .w-full { width: 100% !important; }
              .h-full { height: 100% !important; }
              .min-h-\\[24px\\] { min-height: 24px !important; display: flex; align-items: center; justify-content: center; }
              .flex { display: flex !important; }
              .items-center { align-items: center !important; }
              .justify-center { justify-content: center !important; }
            </style>
          </head>
          <body>
            ${printRef.current.innerHTML}
            <script>
              setTimeout(() => {
                window.print();
                window.close();
              }, 500);
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } else {
      alert('Pop-up terblokir. Silakan izinkan pop-up di browser Anda untuk mencetak PDF, atau buka aplikasi ini di tab baru.');
    }
  };

  const handleExportWord = () => {
    if (!printRef.current) return;

    // Build the HTML structure for Word
    const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>Export HTML To Doc</title>
    <style>
      body { font-family: 'Times New Roman', serif; font-size: 12pt; }
      table { border-collapse: collapse; width: 100%; margin-top: 20px; }
      table, th, td { border: 1px solid black; }
      th, td { padding: 5px; text-align: center; }
      .text-left { text-align: left; }
      .header-title { text-align: center; font-weight: bold; font-size: 14pt; margin-bottom: 20px; text-transform: uppercase; }
      .info-table { border: none; width: 100%; margin-bottom: 20px; }
      .info-table td { border: none; padding: 2px; text-align: left; }
      .signature-table { border: none; width: 100%; margin-top: 40px; }
      .signature-table td { border: none; text-align: center; }
      .bg-slate-200 { background-color: #d1d5db; }
    </style>
    </head><body>`;
    
    const footer = "</body></html>";
    const sourceHTML = header + printRef.current.innerHTML + footer;
    
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = `Prosem_${identity.subject}_${identity.schoolYear.replace('/', '-')}.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center p-2 sm:p-4 lg:p-8 no-print">
      <div className="bg-white w-full max-w-[1200px] h-full flex flex-col rounded-xl overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Header Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-slate-50/80">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-800">Pratinjau Live</h2>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">Landscape View • Format Dokumen Resmi</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleExportWord}
              className="flex items-center px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
            >
              <FileText size={16} className="mr-2 text-slate-600" /> Export Word
            </button>
            <button 
              onClick={handlePrintPdf}
              className="flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Printer size={16} className="mr-2" /> Cetak PDF
            </button>
            <button 
              onClick={onClose}
              className="flex items-center justify-center p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-md transition-colors ml-2"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 overflow-auto p-4 sm:p-8 bg-slate-100 flex justify-center items-start custom-scrollbar">
          
          <div 
            className="bg-white shadow-xl border border-slate-200 print-container" 
            style={{ 
              width: '297mm', // A4 Landscape
              minHeight: '210mm',
              padding: '20mm',
              transformOrigin: 'top center',
            }}
          >
            {/* The printable content that will be exported to Word/PDF */}
            <div ref={printRef} className="print-content" style={{ fontFamily: '"Times New Roman", Times, serif', color: '#000' }}>
              
              <div className="header-title" style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '14pt', marginBottom: '20px', textTransform: 'uppercase' }}>
                {identity.customHeader || 'PROGRAM SEMESTER (PROSEM)'}
              </div>

              <table className="info-table text-[10pt]" style={{ width: '100%', marginBottom: '20px', border: 'none', fontWeight: 'bold' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '15%', border: 'none', padding: '2px', textAlign: 'left', textTransform: 'uppercase' }}>Sekolah</td>
                    <td style={{ width: '35%', border: 'none', padding: '2px', textAlign: 'left', textTransform: 'uppercase' }}>: {identity.schoolName || '................'}</td>
                    <td style={{ width: '20%', border: 'none', padding: '2px', textAlign: 'left', textTransform: 'uppercase' }}>Kelas/Fase</td>
                    <td style={{ width: '30%', border: 'none', padding: '2px', textAlign: 'left', textTransform: 'uppercase' }}>: {identity.gradePhase || '................'}</td>
                  </tr>
                  <tr>
                    <td style={{ border: 'none', padding: '2px', textAlign: 'left', textTransform: 'uppercase' }}>Mata Pelajaran</td>
                    <td style={{ border: 'none', padding: '2px', textAlign: 'left', textTransform: 'uppercase' }}>: {identity.subject || '................'}</td>
                    <td style={{ border: 'none', padding: '2px', textAlign: 'left', textTransform: 'uppercase' }}>Semester</td>
                    <td style={{ border: 'none', padding: '2px', textAlign: 'left', textTransform: 'uppercase' }}>: {identity.semester || '................'}</td>
                  </tr>
                  <tr>
                    <td style={{ border: 'none', padding: '2px', textAlign: 'left', textTransform: 'uppercase' }}>Tahun Pelajaran</td>
                    <td style={{ border: 'none', padding: '2px', textAlign: 'left', textTransform: 'uppercase' }}>: {identity.schoolYear || '................'}</td>
                    {identity.isSmk && (
                      <>
                        <td style={{ border: 'none', padding: '2px', textAlign: 'left', textTransform: 'uppercase' }}>Konsentrasi Keahlian</td>
                        <td style={{ border: 'none', padding: '2px', textAlign: 'left', textTransform: 'uppercase' }}>: {identity.smkConcentration || '................'}</td>
                      </>
                    )}
                  </tr>
                </tbody>
              </table>

              <div className="table-wrapper" style={{ marginTop: '20px', marginBottom: '30px' }}>
                <ProsemTable isPrintMode={true} />
              </div>

              <table className="signature-table text-[10pt]" style={{ width: '100%', marginTop: '40px', border: 'none' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '50%', border: 'none', textAlign: 'center' }}>
                      Mengetahui,<br />
                      Kepala Sekolah
                      <br /><br /><br /><br />
                      <strong>{identity.teacherName ? '_________________________' : '_________________________'}</strong><br />
                      NIP.
                    </td>
                    <td style={{ width: '50%', border: 'none', textAlign: 'center' }}>
                      {identity.city || '................'}, {identity.date ? new Date(identity.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '.......................'}<br />
                      Guru Mata Pelajaran
                      <br /><br /><br /><br />
                      <strong>{identity.teacherName || '_________________________'}</strong><br />
                      {identity.teacherNip ? `NIP. ${identity.teacherNip}` : 'NIP. .......................'}
                    </td>
                  </tr>
                </tbody>
              </table>
              
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
