import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import CVTemplate from '../components/CVTemplate';

const CV = () => {
  const cvRef = useRef();

  const handleDownload = () => {
    const element = cvRef.current;
    const opt = {
      margin: 10,
      filename: 'Toshkanov_Ulugbek_CV.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        letterRendering: true
      },
      jsPDF: { 
        unit: 'mm', 
        format: 'a4', 
        orientation: 'portrait' 
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().from(element).set(opt).save();
  };

  return (
    <div className="bg-white text-black font-sans leading-relaxed min-h-screen">
      {/* Navigatsiya qismi - PDF ga kirmaydi */}
      <div className="max-w-[800px] mx-auto p-5 no-print flex justify-between items-center border-b border-gray-100 mb-4">
        <Link to="/" className="text-black no-underline font-bold hover:underline flex items-center gap-2">
          ← chiqish
        </Link>
        <button 
          onClick={handleDownload}
          className="bg-black text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-all active:scale-95 shadow-lg"
        >
          PDF sifatida saqlash
        </button>
      </div>

      {/* CV tarkibi - Faqat shu qism PDF bo'ladi */}
      <CVTemplate ref={cvRef} />
    </div>
  );
};

export default CV;
