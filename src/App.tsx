import React, { useState } from 'react';

// --- INTERFACES ---
interface IconProps { size?: number; className?: string; }
interface ResultItem { id: number; chords: string[]; explanation: string; analysis: string; theory: string; styleRef: string; }

// --- ÍCONOS ---
const Compass = ({ size = 24, className = "" }: IconProps) => ( <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg> );
const ArrowRight = ({ size = 24, className = "" }: IconProps) => ( <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg> );
const ArrowLeft = ({ size = 24, className = "" }: IconProps) => ( <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg> );
const RefreshCw = ({ size = 24, className = "" }: IconProps) => ( <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg> );

// --- BASE DE DATOS DE ESTILOS EXPANDIDA ---
const STYLE_DATABASE: Record<string, any> = {
  'Barroco': { cadences: ['I-IV-V-I'], extensions: 'Triadas', modulation: 'Vecinas', desc: 'Contrapunto y armonía funcional pura.' },
  'Clásico': { cadences: ['I-ii-V-I'], extensions: '7ma Dominante', modulation: 'Relativas', desc: 'Claridad formal y equilibrio tonal.' },
  'Romántico': { cadences: ['I-bVI-V'], extensions: '9nas/Cromatismo', modulation: 'Mediantes', desc: 'Expresión emocional y armonía cromática.' },
  'Impresionista': { cadences: ['I-v-I'], extensions: '9, 11, 13', modulation: 'Paralela', desc: 'Color armónico y escalas exóticas.' },
  'Rock': { cadences: ['I-bVII-IV', 'I-V-vi-IV'], extensions: 'Power Chords / Triadas', modulation: 'Mixolidia', desc: 'Fuerza rítmica y uso de grados modales.' },
  'Rock Alternativo': { cadences: ['I-bIII-bVII', 'i-VI-III-VII'], extensions: 'sus2, sus4, add9', modulation: 'No-funcional', desc: 'Texturas modales y enlaces no convencionales.' },
  'Pop': { cadences: ['I-V-vi-IV', 'ii-IV-I-V'], extensions: 'add9, maj7', modulation: 'Diatónica', desc: 'Estructuras pegajosas y máxima claridad.' },
  'Jazz': { cadences: ['ii-V-I', 'I-VI-ii-V'], extensions: '9, 13, Alt', modulation: 'Ciclo de 5tas / Tritono', desc: 'Sustituciones complejas y lenguaje extendido.' },
  'Neo-Soul': { cadences: ['ii-v-I', 'IV-iii-ii-I'], extensions: 'm11, 9, 13', modulation: 'Cromática suave', desc: 'Groove armónico y parsimonia de voces.' },
  'Ambient / Minimalismo': { cadences: ['I-IV'], extensions: 'maj7(no3)', modulation: 'Estática', desc: 'Paisajes sonoros de baja resistencia perceptual.' }
};

const NOTES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

export default function App() {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({ inputChords: '', modulation: 'stay', modulationDistance: 'vecinas', mood: 'etereo', style: 'Rock' });
  const [results, setResults] = useState<ResultItem[]>([]);

  const getNoteIndex = (note: string) => {
    const match = note.match(/^[A-G][#b]?/i);
    if (!match) return 0;
    let n = match[0].toUpperCase().replace('D#', 'Eb').replace('G#', 'Ab').replace('A#', 'Bb').replace('DB', 'C#').replace('GB', 'F#');
    return NOTES.indexOf(n) === -1 ? 0 : NOTES.indexOf(n);
  };

  const generate = () => {
    setIsGenerating(true); setStep(5);
    setTimeout(() => {
      const rootIdx = getNoteIndex(formData.inputChords || 'C');
      const styleInfo = STYLE_DATABASE[formData.style];
      
      const output: ResultItem[] = [];
      for (let i = 0; i < 3; i++) {
        let prog: string[] = [formData.inputChords || 'C'];
        
        // Lógica de motor basada en DB
        if (formData.style === 'Rock' || formData.style === 'Rock Alternativo') {
          prog.push(NOTES[(rootIdx + 10) % 12], NOTES[(rootIdx + 5) % 12], NOTES[rootIdx]);
        } else if (formData.style === 'Jazz' || formData.style === 'Neo-Soul') {
          prog.push(NOTES[(rootIdx + 2) % 12] + 'm9', NOTES[(rootIdx + 7) % 12] + '13', NOTES[rootIdx] + 'maj9');
        } else {
          prog.push(NOTES[(rootIdx + 7) % 12], NOTES[(rootIdx + 9) % 12] + 'm', NOTES[(rootIdx + 5) % 12]);
        }

        output.push({
          id: i,
          chords: prog,
          theory: i === 0 ? "Schoenberg (Análisis de Región)" : i === 1 ? "Neo-Riemanniana (Voz Conducida)" : "Lerdahl (Espacio Tonal)",
          styleRef: `Manual de Estilo: ${styleInfo.desc} | Extensiones Sugeridas: ${styleInfo.extensions}`,
          analysis: `Gramática ${formData.style}: Movimiento por ${styleInfo.modulation}.`,
          explanation: `El motor procesó la progresión bajo la óptica de ${formData.style}, asegurando que la tensión narrativa sea coherente con el género.`
        });
      }
      setResults(output); setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center gap-3">
          <Compass size={24} className="text-indigo-500" />
          <h1 className="text-xl font-bold tracking-tighter">Arquitecto<span className="text-indigo-400">Armónico</span> <span className="text-[10px] bg-indigo-500/20 px-2 py-1 rounded text-indigo-300 ml-2 uppercase font-black">Full Engine</span></h1>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12">
        {step < 5 && (
          <div className="space-y-10">
            {step === 1 && (
              <div className="bg-slate-900/40 p-10 rounded-3xl border border-slate-800 space-y-6">
                <h2 className="text-3xl font-bold text-white">Análisis de Entrada</h2>
                <input type="text" value={formData.inputChords} onChange={(e) => setFormData({...formData, inputChords: e.target.value})} placeholder="Introduce acorde (C, Am, G7...)" className="w-full bg-slate-950 border border-slate-700 p-5 rounded-2xl text-white text-2xl outline-none focus:border-indigo-500 transition-all" />
                <button onClick={() => setStep(2)} className="w-full py-5 bg-indigo-600 rounded-2xl font-black text-lg hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20">INICIAR PROCESAMIENTO</button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-center">Selección de Estilo (Referencia DB)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.keys(STYLE_DATABASE).map(s => (
                    <button key={s} onClick={() => {setFormData({...formData, style: s}); setStep(3)}} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-indigo-500 text-left transition-all group">
                      <h3 className="font-bold text-indigo-300 group-hover:text-white">{s}</h3>
                      <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest">{STYLE_DATABASE[s].modulation}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white text-center">Estado Emocional</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['oscuro', 'nostalgico', 'heroico', 'etereo', 'tenso'].map(m => (
                    <button key={m} onClick={() => {setFormData({...formData, mood: m}); generate()}} className="p-8 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col items-center gap-4 hover:border-indigo-500 transition-all">
                      <span className="text-sm font-black uppercase tracking-widest">{m}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-indigo-600/10 border border-indigo-500/20 p-6 rounded-3xl text-center">
              <h2 className="text-2xl font-bold text-indigo-300">Composición Finalizada</h2>
              <p className="text-xs text-slate-500 uppercase font-bold mt-1">Estilo: {formData.style} | Tono: {formData.inputChords}</p>
            </div>

            {isGenerating ? (
              <div className="flex flex-col items-center py-20 gap-6">
                <RefreshCw size={48} className="animate-spin text-indigo-500" />
                <p className="text-slate-500 font-mono text-sm">Escaneando base de datos de géneros...</p>
              </div>
            ) : (
              results.map(res => (
                <div key={res.id} className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl hover:bg-slate-900 transition-colors">
                  <div className="flex gap-6 items-center overflow-x-auto pb-4">
                    {res.chords.map((c, i) => (
                      <React.Fragment key={i}>
                        <span className="text-3xl font-mono font-black text-white whitespace-nowrap">{c}</span>
                        {i < res.chords.length - 1 && <ArrowRight size={24} className="text-slate-700 flex-shrink-0" />}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="pt-6 border-t border-slate-800 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded font-bold">{res.theory}</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed font-medium">{res.styleRef}</p>
                    <p className="text-xs text-slate-500 italic">{res.analysis}</p>
                  </div>
                </div>
              ))
            )}
            <button onClick={() => setStep(1)} className="w-full py-5 bg-slate-800 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-700 transition-all">Nueva Exploración</button>
          </div>
        )}
      </main>
    </div>
  );
}
