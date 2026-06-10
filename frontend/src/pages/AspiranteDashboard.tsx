import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, UploadCloud, FileText, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';
import { getConvocatorias, extraerCV, crearPostulacion } from '../services/api';

export default function AspiranteDashboard() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [convocatorias, setConvocatorias] = useState([]);
  const [selectedConv, setSelectedConv] = useState<any>(null);
  
  const [file, setFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<string>('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'ASPIRANTE') navigate('/login');
    
    fetchConvocatorias();
  }, [navigate]);

  const fetchConvocatorias = async () => {
    try {
      const data = await getConvocatorias();
      setConvocatorias(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleExtract = async () => {
    if (!file) return;
    setIsExtracting(true);
    setErrorMsg('');
    try {
      const jsonStr = await extraerCV(file);
      // Format JSON for display
      const parsed = JSON.parse(jsonStr);
      setExtractedData(JSON.stringify(parsed, null, 2));
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al procesar el documento con IA.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSubmitPostulacion = async () => {
    if (!selectedConv || !extractedData) return;
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      const userId = localStorage.getItem('userId');
      await crearPostulacion({
        aspiranteId: parseInt(userId || '0'),
        convocatoriaId: selectedConv.id,
        datosValidadosJson: extractedData
      });
      
      setSuccessMsg('¡Postulación enviada exitosamente!');
      setTimeout(() => {
        setSuccessMsg('');
        setSelectedConv(null);
        setFile(null);
        setExtractedData('');
      }, 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al enviar la postulación.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 py-4 px-8 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 leading-tight">SIEAD</h1>
            <p className="text-xs text-gray-500 font-medium">Portal del Aspirante</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors bg-gray-50 hover:bg-red-50 px-4 py-2 rounded-lg font-medium">
          <LogOut className="w-4 h-4" />
          <span>Salir</span>
        </button>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Lista de Convocatorias */}
        <section className={`lg:col-span-5 ${selectedConv ? 'hidden lg:block' : 'block'}`}>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-[calc(100vh-140px)] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 sticky top-0 bg-white pb-2 border-b border-gray-50">Convocatorias Disponibles</h2>
            
            {convocatorias.length === 0 ? (
               <p className="text-gray-500 text-center mt-10">No hay convocatorias activas en este momento.</p>
            ) : (
              <div className="space-y-4">
                {convocatorias.map((conv: any) => (
                  <div 
                    key={conv.id} 
                    onClick={() => { setSelectedConv(conv); setFile(null); setExtractedData(''); setErrorMsg(''); }}
                    className={`p-5 rounded-xl border-2 transition-all cursor-pointer group ${selectedConv?.id === conv.id ? 'border-blue-500 bg-blue-50' : 'border-transparent bg-gray-50 hover:bg-gray-100 hover:border-gray-200'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`font-bold ${selectedConv?.id === conv.id ? 'text-blue-700' : 'text-gray-800'}`}>{conv.titulo}</h3>
                      <ChevronRight className={`w-5 h-5 ${selectedConv?.id === conv.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-600'}`} />
                    </div>
                    <p className="text-xs font-semibold text-gray-500 mb-2">Código: <span className="text-gray-700">{conv.nombreConvocatoria}</span></p>
                    <p className="text-sm text-gray-600 line-clamp-2">{conv.descripcion}</p>
                    <div className="mt-4 inline-block bg-white px-3 py-1 rounded-md text-xs font-semibold text-gray-600 border border-gray-200 shadow-sm">
                      Cierre: {conv.fechaCierre}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Panel de Postulación */}
        <section className={`lg:col-span-7 ${!selectedConv ? 'hidden lg:flex items-center justify-center' : 'block'}`}>
          {!selectedConv ? (
             <div className="text-center text-gray-400 flex flex-col items-center">
               <FileText className="w-16 h-16 mb-4 opacity-50" />
               <p className="text-lg">Selecciona una convocatoria para postularte.</p>
             </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-10 h-full flex flex-col animate-in slide-in-from-right-8 duration-300">
              <button className="lg:hidden mb-6 text-blue-600 font-semibold flex items-center" onClick={() => setSelectedConv(null)}>
                ← Volver a convocatorias
              </button>
              
              <div className="mb-8">
                <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-3">Postulación Activa</span>
                <h2 className="text-3xl font-extrabold text-gray-800 leading-tight">{selectedConv.titulo}</h2>
                <p className="text-gray-500 mt-2 text-sm leading-relaxed">{selectedConv.descripcion}</p>
              </div>

              {successMsg ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">¡Completado!</h3>
                  <p className="text-gray-600">{successMsg}</p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                  {errorMsg && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100">
                      {errorMsg}
                    </div>
                  )}

                  {/* Paso 1: Subir Archivo */}
                  {!extractedData && (
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="border-2 border-dashed border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition-colors rounded-2xl p-10 flex flex-col items-center justify-center text-center mb-6">
                        <UploadCloud className="w-12 h-12 text-blue-500 mb-4" />
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Sube tu Currículum Vitae (PDF)</h3>
                        <p className="text-sm text-gray-500 max-w-sm mb-6">Nuestra IA extraerá automáticamente tu experiencia y estudios para evaluarlos contra los requisitos.</p>
                        
                        <input type="file" accept=".pdf" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                        
                        <button 
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-white text-blue-600 border border-blue-200 font-semibold py-2.5 px-6 rounded-xl hover:bg-blue-50 transition-colors shadow-sm"
                        >
                          {file ? file.name : 'Seleccionar Archivo'}
                        </button>
                      </div>

                      <button 
                        onClick={handleExtract}
                        disabled={!file || isExtracting}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex justify-center items-center"
                      >
                        {isExtracting ? (
                          <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Analizando documento con IA...</>
                        ) : (
                          'Analizar Documento'
                        )}
                      </button>
                    </div>
                  )}

                  {/* Paso 2: Validar JSON */}
                  {extractedData && (
                    <div className="flex-1 flex flex-col animate-in fade-in duration-500">
                      <div className="mb-4">
                        <h3 className="text-lg font-bold text-gray-800">Revisa tu Información</h3>
                        <p className="text-sm text-gray-500">Verifica que la IA haya extraído correctamente tus datos antes de enviarlos. Puedes editar el texto directamente.</p>
                      </div>
                      
                      <textarea 
                        className="flex-1 w-full bg-gray-900 text-green-400 font-mono text-sm p-5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 mb-6 resize-none shadow-inner"
                        value={extractedData}
                        onChange={(e) => setExtractedData(e.target.value)}
                      />

                      <button 
                        onClick={handleSubmitPostulacion}
                        disabled={isSubmitting}
                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-200 transition-all flex justify-center items-center"
                      >
                        {isSubmitting ? (
                          <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Enviando Postulación...</>
                        ) : (
                          'Confirmar y Postular'
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
