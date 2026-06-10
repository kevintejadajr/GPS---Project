import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, List, LogOut, CheckCircle2, Trophy, BarChart3, Users } from 'lucide-react';
import { getConvocatorias, createConvocatoria, getRanking } from '../services/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [convocatorias, setConvocatorias] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'list' | 'create'
  
  // Form State
  const [nombreConvocatoria, setNombre] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaCierre, setFechaCierre] = useState('');
  const [requisitos, setRequisitos] = useState([{ descripcion: '', peso: 0, valorMinimo: 0 }]);
  const [mensaje, setMensaje] = useState('');
  const [mensajeTipo, setMensajeTipo] = useState<'success' | 'error'>('success');

  // Ranking Dashboard State
  const [selectedConvocatoriaId, setSelectedConvocatoriaId] = useState<number | ''>('');
  const [ranking, setRanking] = useState<any[]>([]);
  const [loadingRanking, setLoadingRanking] = useState(false);
  const [errorRanking, setErrorRanking] = useState('');

  useEffect(() => {
    // Validar sesión temporalmente
    const role = localStorage.getItem('role');
    if (role !== 'ADMIN') navigate('/login');
    
    fetchConvocatorias();
  }, [navigate]);

  const fetchConvocatorias = async () => {
    try {
      const data = await getConvocatorias();
      setConvocatorias(data);
      if (data.length > 0 && !selectedConvocatoriaId) {
        setSelectedConvocatoriaId(data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRanking = async (convocatoriaId: number) => {
    setLoadingRanking(true);
    setErrorRanking('');
    try {
      const data = await getRanking(convocatoriaId);
      setRanking(data);
    } catch (err: any) {
      setErrorRanking(err.message || 'Error al obtener el ranking');
    } finally {
      setLoadingRanking(false);
    }
  };

  useEffect(() => {
    if (selectedConvocatoriaId) {
      fetchRanking(Number(selectedConvocatoriaId));
    } else {
      setRanking([]);
    }
  }, [selectedConvocatoriaId]);

  const handleAddRequisito = () => {
    setRequisitos([...requisitos, { descripcion: '', peso: 0, valorMinimo: 0 }]);
  };

  const handleRequisitoChange = (index: number, field: string, value: any) => {
    const newReqs = [...requisitos];
    newReqs[index] = { ...newReqs[index], [field]: value };
    setRequisitos(newReqs);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');
    try {
      await createConvocatoria({
        nombreConvocatoria,
        titulo,
        descripcion,
        fechaCierre,
        requisitos
      });
      setMensajeTipo('success');
      setMensaje('¡Convocatoria creada con éxito!');
      fetchConvocatorias();
      
      // Reset form
      setNombre(''); setTitulo(''); setDescripcion(''); setFechaCierre('');
      setRequisitos([{ descripcion: '', peso: 0, valorMinimo: 0 }]);
      
      setTimeout(() => {
        setActiveTab('list');
        setMensaje('');
      }, 2000);
    } catch (err) {
      setMensajeTipo('error');
      setMensaje('Hubo un error al crear la convocatoria.');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl flex flex-col hidden md:flex z-10">
        <div className="p-6 text-center border-b border-gray-100">
          <h2 className="text-2xl font-bold text-indigo-600 tracking-tight">SIEAD Admin</h2>
          <p className="text-xs text-gray-500 mt-1">Gestión de Evaluaciones</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Dashboard / Ranking</span>
          </button>
          <button 
            onClick={() => setActiveTab('list')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'list' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <List className="w-5 h-5" />
            <span>Convocatorias</span>
          </button>
          <button 
            onClick={() => setActiveTab('create')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'create' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <PlusCircle className="w-5 h-5" />
            <span>Crear Nueva</span>
          </button>
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all">
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            {activeTab === 'dashboard' 
              ? 'Dashboard de Postulantes' 
              : activeTab === 'list' 
                ? 'Convocatorias Activas' 
                : 'Nueva Convocatoria'}
          </h1>
          <p className="text-gray-500 mt-1">
            {activeTab === 'dashboard'
              ? 'Visualiza el ranking de aspirantes docentes evaluados por la IA.'
              : activeTab === 'list'
                ? 'Gestiona y visualiza todas las convocatorias vigentes.'
                : 'Define los requisitos y reglas de evaluación para los postulantes.'}
          </p>
        </header>

        {mensaje && (
          <div className={`mb-6 p-4 rounded-xl flex items-center shadow-sm border animate-pulse ${
            mensajeTipo === 'success'
              ? 'bg-green-50 text-green-700 border-green-100'
              : 'bg-red-50 text-red-700 border-red-100'
          }`}>
            {mensajeTipo === 'success'
              ? <CheckCircle2 className="w-6 h-6 mr-3 flex-shrink-0" />
              : <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            }
            <span className="font-medium">{mensaje}</span>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Selector de Convocatoria */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Selecciona una Convocatoria</label>
                <select
                  value={selectedConvocatoriaId}
                  onChange={(e) => setSelectedConvocatoriaId(e.target.value ? Number(e.target.value) : '')}
                  className="w-full sm:w-80 px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white font-medium text-gray-700"
                >
                  <option value="">-- Elige una Convocatoria --</option>
                  {convocatorias.map((conv: any) => (
                    <option key={conv.id} value={conv.id}>
                      {conv.nombreConvocatoria} - {conv.titulo}
                    </option>
                  ))}
                </select>
              </div>
              {selectedConvocatoriaId && (
                <button
                  onClick={() => fetchRanking(Number(selectedConvocatoriaId))}
                  className="px-5 py-2.5 bg-indigo-50 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  Actualizar Datos
                </button>
              )}
            </div>

            {/* Ranking Table */}
            {selectedConvocatoriaId ? (
              loadingRanking ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  <p className="text-gray-500 font-medium">Cargando ranking y observaciones de la IA...</p>
                </div>
              ) : errorRanking ? (
                <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-100 text-center font-medium">
                  {errorRanking}
                </div>
              ) : ranking.length > 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                          <th className="px-6 py-4">Posición</th>
                          <th className="px-6 py-4">Aspirante</th>
                          <th className="px-6 py-4">Puntaje Final</th>
                          <th className="px-6 py-4">Observaciones del Motor de Reglas (IA)</th>
                          <th className="px-6 py-4">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm">
                        {ranking.map((row: any, idx: number) => {
                          const isTop3 = idx < 3;
                          const medalColors = [
                            'bg-amber-100 text-amber-800 border-amber-200', // Oro
                            'bg-slate-100 text-slate-800 border-slate-200', // Plata
                            'bg-orange-100 text-orange-800 border-orange-200' // Bronce
                          ];
                          return (
                            <tr key={row.postulacionId} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-2">
                                  {isTop3 ? (
                                    <span className={`flex items-center justify-center w-8 h-8 rounded-full border text-xs font-bold ${medalColors[idx]}`}>
                                      <Trophy className="w-4 h-4 mr-0.5" />
                                      {idx + 1}
                                    </span>
                                  ) : (
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 text-gray-500 border border-gray-200 text-xs font-bold">
                                      {idx + 1}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div>
                                  <div className="font-bold text-gray-900">{row.nombreAspirante}</div>
                                  <div className="text-gray-500 text-xs">{row.emailAspirante}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-lg font-extrabold text-indigo-600">{row.puntajeFinal.toFixed(1)}</span>
                                <span className="text-xs text-gray-400 font-semibold ml-1">pts</span>
                              </td>
                              <td className="px-6 py-4 max-w-md">
                                <div className="flex flex-wrap gap-1.5">
                                  {row.observaciones ? (
                                    row.observaciones.split('. ').filter(Boolean).map((o: string, oIdx: number) => {
                                      const isCumple = o.toLowerCase().startsWith('cumple');
                                      return (
                                        <span 
                                          key={oIdx} 
                                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                            isCumple 
                                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                              : 'bg-rose-50 text-rose-700 border border-rose-100'
                                          }`}
                                        >
                                          {o}
                                        </span>
                                      );
                                    })
                                  ) : (
                                    <span className="text-gray-400 italic">Sin observaciones</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                                  row.estado === 'EVALUADO' 
                                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' 
                                    : row.estado === 'RECHAZADO'
                                      ? 'bg-red-50 text-red-700'
                                      : 'bg-yellow-50 text-yellow-700'
                                }`}>
                                  {row.estado}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                  <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">Aún no se han registrado postulantes para esta convocatoria.</p>
                </div>
              )
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm text-gray-500 font-medium">
                Selecciona una convocatoria del selector superior para visualizar el ranking y detalle de las evaluaciones.
              </div>
            )}
          </div>
        )}

        {activeTab === 'list' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {convocatorias.map((conv: any) => (
              <div key={conv.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-shadow border border-gray-100 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 transform origin-bottom scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{conv.nombreConvocatoria}</h3>
                <h4 className="text-sm text-indigo-600 font-semibold mb-3">{conv.titulo}</h4>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">{conv.descripcion}</p>
                <div className="flex justify-between items-center text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                  <span>Cierre: <span className="font-bold text-gray-700">{conv.fechaCierre}</span></span>
                </div>
              </div>
            ))}
            {convocatorias.length === 0 && (
              <div className="col-span-full text-center py-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <List className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No hay convocatorias creadas aún.</p>
                <button onClick={() => setActiveTab('create')} className="mt-4 text-indigo-600 font-semibold hover:underline">
                  Crear la primera convocatoria
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'create' && (
          <form onSubmit={handleCreate} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Código/Nombre Corto</label>
                <input required type="text" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" value={nombreConvocatoria} onChange={e => setNombre(e.target.value)} placeholder="Ej. DOC-2024-1" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Título de la Convocatoria</label>
                <input required type="text" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Concurso de Méritos Docentes..." />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción General</label>
                <textarea required className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]" value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Detalla el propósito de esta convocatoria..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha de Cierre</label>
                <input required type="date" className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" value={fechaCierre} onChange={e => setFechaCierre(e.target.value)} />
              </div>
            </div>

            <hr className="my-8 border-gray-100" />
            
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Requisitos de Evaluación</h3>
                <p className="text-sm text-gray-500 mt-1">Define las reglas que el Motor de Reglas evaluará en los CVs.</p>
              </div>
              <button type="button" onClick={handleAddRequisito} className="flex items-center space-x-2 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition">
                <PlusCircle className="w-4 h-4" />
                <span>Agregar Requisito</span>
              </button>
            </div>

            <div className="space-y-4">
              {requisitos.map((req, idx) => (
                <div key={idx} className="flex flex-col md:flex-row gap-4 items-start bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Descripción / Palabra Clave</label>
                    <input required type="text" className="w-full p-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" value={req.descripcion} onChange={e => handleRequisitoChange(idx, 'descripcion', e.target.value)} placeholder="Ej. Experiencia docente, Maestría..." />
                  </div>
                  <div className="w-full md:w-32">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Puntaje (Peso)</label>
                    <input required type="number" min="0" step="0.1" className="w-full p-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" value={req.peso} onChange={e => handleRequisitoChange(idx, 'peso', parseFloat(e.target.value))} />
                  </div>
                  <div className="w-full md:w-32">
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Valor Mínimo</label>
                    <input required type="number" min="0" step="0.1" className="w-full p-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none" value={req.valorMinimo} onChange={e => handleRequisitoChange(idx, 'valorMinimo', parseFloat(e.target.value))} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5">
                Guardar y Publicar Convocatoria
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
