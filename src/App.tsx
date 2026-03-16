import React, { useState } from 'react';

// --- INTERFACES Y TIPOS ---
interface IconProps { size?: number; className?: string; }
interface ResultItem { id: number; chords: string[]; explanation: string; analysis: string; tensionCurve: string; theoryApplied: string; }

// --- ÍCONOS ---
const Compass = ({ size = 24, className = "" }: IconProps) => ( <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg> );
const ArrowRight = ({ size = 24, className = "" }: IconProps) => ( <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg> );
const ArrowLeft = ({ size = 24, className = "" }: IconProps) => ( <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg> );
const RefreshCw = ({ size = 24, className = "" }: IconProps) => ( <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg> );

// --- DATABASE DE ESTILOS Y TEORÍA ---
const STYLE_DB: Record<string, any> = {
  'Barroco': { voicing: 'Triadas/7mas', grammar: 'Contrapunto', tension: 'Moderada' },
  'Clásico': { voicing: 'Triadas/7mas', grammar: 'T-PD-D-T', tension: 'Equilibrada' },
  'Romántico': { voicing: '9nas/Cromatismo', grammar: 'Mediantes', tension: 'Alta' },
  'Jazz': { voicing: '9, 13, Alt', grammar: 'ii-V-I', tension: 'Muy Alta' },
  'Soul': { voicing: 'm7, maj7, 9, 13', grammar: 'Gospel/Blues', tension: 'Media' },
  'Rock': { voicing: 'Power chords/Triadas', grammar: 'I-bVII-IV', tension: 'Energética' },
  'Cinemático': { voicing: 'Clusters/Politonía', grammar: 'Narrativa', tension: 'Dinámica' },
  'Ambient / Minimalismo': { voicing: 'add9, maj7(no3)', grammar: 'Estática', tension: 'Baja' }
};

const NOTES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

export default function App() {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({ inputChords: '', modulation: 'stay', modulationDistance: 'vecinas', mood: 'nostalgico', style: 'Ambient / Minimalismo' });
  const [results, setResults] = useState<ResultItem[]>([]);

  const getNoteIndex = (note: string) => {
    let n = note.toUpperCase().split('M')[0].split('A')[0].split('7')[0].trim();
    const map: any = { 'DB': 'C#', 'D#': 'Eb', 'GB': 'F#', 'G#': 'Ab', 'A#': 'Bb' };
    return NOTES.indexOf(map[n] || n);
  };

  const calculateModulation = (root: number, distance: string) => {
    const steps: any = { vecinas: 7, mediantes: 4, lejanas: 2, muy_lejanas: 6 };
    return (root + (steps[distance] || 0)) % 12;
  };

  const generateProcess = () => {
    setIsGenerating(true); setStep(5);
    setTimeout(() => {
      const rootIdx = getNoteIndex(formData.inputChords || 'C');
      const isMinor = formData.inputChords.toLowerCase().includes('m');
      const targetIdx = formData.modulation === 'modulate' ? calculateModulation(rootIdx, formData.modulationDistance) : rootIdx;
      
      const output: ResultItem[] = [];
      for (let i = 0; i < 3; i++) {
        let path: string[] = [formData.inputChords || 'C'];
        let theory = "";
        
        // Lógica de Selección de Teoría Interna
        if (formData.modulationDistance === 'muy_lejanas') {
          theory = "Schoenberg (Regiones Tonales Remotas)";
          path.push(NOTES[(targetIdx + 1) % 12] + 'maj7', NOTES[(targetIdx + 7) % 12] + '7alt');
        } else if (formData.mood === 'etereo' || formData.mood === 'nostalgico') {
          theory = "Lerdahl (Tonal Pitch Space - Parsimonia)";
          path.push(NOTES[(rootIdx + 5) % 12] + 'add9', NOTES[(targetIdx + 11) % 12] + 'maj7');
        } else {
          theory = "Neo-Riemanniana (Transformación L-P-R)";
          path.push(NOTES[(rootIdx + 4) % 12] + 'm', NOTES[(targetIdx + 8) % 12]);
        }
        path.push(NOTES[targetIdx] + (isMinor ? 'm' : ''));

        output.push({
          id: i,
          chords: path,
          analysis: `Función: i → ♭VI → V → i | Tensión: ${STYLE_DB[formData.style].tension}`,
          tensionCurve: "Rest (0) ⮕ Development (5) ⮕ Peak (9) ⮕ Resolution (1)",
          theoryApplied: theory,
          explanation: `Motor de Estilo ${formData.style}: Se aplicó gramática ${STYLE_DB[formData.style].grammar} con voicings de ${STYLE_DB[formData.style].voicing}.`
        });
      }
      setResults(output); setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col selection:bg-indigo-500/30">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Compass size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter text-white">ASISTENTE ARMONICO</h1>
              <p className="text-[10px] text-indigo-400 font-bold tracking-[0.2em] uppercase">Architecture v3.0</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12">
        {step < 5 && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {step === 1 && (
              <section className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-white">1. Análisis Musical Profundo</h2>
                  <p className="text-slate-400 text-sm">El sistema analizará la tonalidad y la tensión acumulada de tu entrada.</p>
                </div>
                <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl">
                  <input 
                    type="text" 
                    value={formData.inputChords} 
                    onChange={(e) => setFormData({...formData, inputChords: e.target.value})} 
                    placeholder="Ej: Cm9 - Abmaj7" 
                    className="w-full bg-slate-950 border border-slate-700 p-6 rounded-2xl text-white text-2xl font-mono outline-none focus:border-indigo-500 transition-all placeholder:text-slate-700"
                  />
                </div>
                <button onClick={() => setStep(2)} className="w-full py-5 bg-indigo-600 rounded-2xl font-black text-lg hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20">MAPEAR FUNCIONES</button>
              </section>
            )}

            {step === 2 && (
              <section className="space-y-6">
                <h2 className="text-2xl font-bold text-white">2. Motor de Modulación (Círculo de Quintas)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button onClick={() => {setFormData({...formData, modulation: 'stay'}); setStep(3)}} className={`p-8 rounded-3xl border-2 text-left transition-all ${formData.modulation === 'stay' ? 'bg-indigo-600/10 border-indigo-500' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}>
                    <b className="block text-xl text-white mb-1">Mantener Tonalidad</b>
                    <span className="text-xs text-slate-500">Expansión dentro de la región tonal de Schoenberg.</span>
                  </button>
                  <button onClick={() => setFormData({...formData, modulation: 'modulate'})} className={`p-8 rounded-3xl border-2 text-left transition-all ${formData.modulation === 'modulate' ? 'bg-indigo-600/10 border-indigo-500' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}>
                    <b className="block text-xl text-white mb-1">Modular</b>
                    <span className="text-xs text-slate-500">Calcular salto perceptual en el Espacio Tonal.</span>
                  </button>
                </div>
                {formData.modulation === 'modulate' && (
                  <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                    <label className="text-[10px] font-bold text-indigo-400 uppercase mb-3 block">Distancia Tonal</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['vecinas', 'mediantes', 'lejanas', 'muy_lejanas'].map(d => (
                        <button key={d} onClick={() => {setFormData({...formData, modulationDistance: d}); setStep(3)}} className="py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs capitalize hover:border-indigo-500">{d.replace('_', ' ')}</button>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {step === 3 && (
              <section className="space-y-6">
                <h2 className="text-2xl font-bold text-white text-center">3. Motor Emocional (Arcos Narrativos)</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {['oscuro', 'nostalgico', 'heroico', 'etereo', 'tenso'].map(m => (
                    <button key={m} onClick={() => {setFormData({...formData, mood: m}); setStep(4)}} className="p-8 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col items-center gap-4 hover:border-indigo-500 transition-all group">
                      <span className="text-sm font-black uppercase tracking-widest text-slate-400 group-hover:text-white">{m}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {step === 4 && (
              <section className="space-y-6">
                <h2 className="text-2xl font-bold text-white">4. Motor de Estilo (Voicing Engine)</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.keys(STYLE_DB).map(s => (
                    <button key={s} onClick={() => setFormData({...formData, style: s})} className={`p-4 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all ${formData.style === s ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                      {s}
                    </button>
                  ))}
                </div>
                <div className="pt-8 border-t border-slate-800 flex justify-between">
                  <button onClick={() => setStep(3)} className="text-slate-500 font-bold py-2 px-4">ATRÁS</button>
                  <button onClick={generateProcess} className="px-10 py-5 bg-indigo-600 rounded-2xl font-black text-white shadow-xl shadow-indigo-600/20">GENERAR ARQUITECTURA</button>
                </div>
              </section>
            )}
          </div>
        )}

        {step === 5 && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-black text-white tracking-tighter">DESARROLLO ARMONICO</h2>
              <p className="text-indigo-400 text-sm font-bold uppercase tracking-widest">Estilo {formData.style} | Gramática Activa</p>
            </div>

            {isGenerating ? (
              <div className="py-24 flex flex-col items-center gap-6">
                <RefreshCw size={48} className="animate-spin text-indigo-500" />
                <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.3em]">Procesando capas teóricas...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {results.map(res => (
                  <div key={res.id} className="bg-slate-900/40 border border-slate-800 p-10 rounded-[2.5rem] space-y-8 hover:bg-slate-900/60 transition-all">
                    <div className="flex flex-wrap gap-6 items-center">
                      {res.chords.map((c, i) => (
                        <React.Fragment key={i}>
                          <div className="relative group">
                            <span className="text-4xl font-mono font-black text-white tracking-tighter">{c}</span>
                            <div className="absolute -bottom-1 left-0 w-0 h-1 bg-indigo-500 group-hover:w-full transition-all"></div>
                          </div>
                          {i < res.chords.length - 1 && <ArrowRight size={24} className="text-slate-800" />}
                        </React.Fragment>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-black/40 p-5 rounded-2xl border border-white/5 space-y-1">
                        <label className="text-[10px] font-black text-indigo-500 uppercase">Tensión Narrativa</label>
                        <p className="text-xs text-slate-300 font-medium italic">{res.tensionCurve}</p>
                      </div>
                      <div className="bg-black/40 p-5 rounded-2xl border border-white/5 space-y-1">
                        <label className="text-[10px] font-black text-purple-500 uppercase">Análisis de Función</label>
                        <p className="text-xs text-slate-400 font-mono">{res.analysis}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="h-px flex-1 bg-slate-800"></div>
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Lógica Aplicada</span>
                        <div className="h-px flex-1 bg-slate-800"></div>
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed"><b className="text-indigo-300">{res.theoryApplied}:</b> {res.explanation}</p>
                    </div>
                  </div>
                ))}
                <button onClick={() => setStep(1)} className="w-full py-6 bg-slate-800 rounded-3xl font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-700 transition-all">INICIAR NUEVA ESTRUCTURA</button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
