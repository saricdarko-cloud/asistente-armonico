import React, { useState } from 'react';

// --- INTERFACES TYPESCRIPT ---
interface IconProps { size?: number; className?: string; }
interface MoodOption { id: string; label: string; emoji: string; }
interface ModulationType { id: string; label: string; desc: string; }
interface FormData { inputChords: string; modulation: string; modulationDistance: string; mood: string; style: string; }
interface ResultItem { id: number; chords: string[]; explanation: string; text: string; }

// --- ÍCONOS NATIVOS ---
const Compass = ({ size = 24, className = "" }: IconProps) => ( <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg> );
const ArrowRight = ({ size = 24, className = "" }: IconProps) => ( <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg> );
const ArrowLeft = ({ size = 24, className = "" }: IconProps) => ( <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg> );
const RefreshCw = ({ size = 24, className = "" }: IconProps) => ( <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg> );
const Copy = ({ size = 24, className = "" }: IconProps) => ( <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg> );
const Check = ({ size = 24, className = "" }: IconProps) => ( <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"/></svg> );
const Lightbulb = ({ size = 24, className = "" }: IconProps) => ( <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.2 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg> );
const BookOpen = ({ size = 24, className = "" }: IconProps) => ( <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> );

// --- CONFIGURACIÓN UI ---
const MOOD_OPTIONS: MoodOption[] = [
  { id: 'alegre', label: 'Alegre / Brillante', emoji: '☀️' }, { id: 'triste', label: 'Triste / Melancólico', emoji: '🌧️' }, { id: 'sombrio', label: 'Sombrío / Oscuro', emoji: '🌑' },
  { id: 'epico', label: 'Épico / Majestuoso', emoji: '🏔️' }, { id: 'tenso', label: 'Tenso / Disonante', emoji: '⚡' }, { id: 'etereo', label: 'Etéreo / Flotante', emoji: '☁️' },
  { id: 'misterioso', label: 'Misterioso / Intrigante', emoji: '🕵️' }, { id: 'nostalgico', label: 'Nostálgico / Añoranza', emoji: '🎞️' }, { id: 'triunfal', label: 'Triunfal / Victorioso', emoji: '🎺' },
  { id: 'intimo', label: 'Íntimo / Cálido', emoji: '☕' }
];

const STYLE_OPTIONS: string[] = [
  'Jazz', 'Pop', 'Bossa Nova', 'Neo-Soul', 'Clásica', 'R&B', 'Rock Alternativo', 'Lo-Fi Hip Hop', 'Cinemático', 'Funk',
  'Gospel', 'Bolero', 'Salsa', 'EDM / Electrónica', 'Metal Progresivo', 'Synthwave', 'Flamenco', 'Fusión'
];

const MODULATION_TYPES: ModulationType[] = [
  { id: 'vecinas', label: 'Tonalidades Vecinas', desc: '1er grado (relativas, dominante, subdominante)' },
  { id: 'homonimas', label: 'Homónimas (Paralelas)', desc: 'Misma tónica, distinto modo (Ej: Mayor a Menor)' },
  { id: 'mediantes', label: 'Mediantes Cromáticas', desc: 'Movimiento por 3ras (Ej: Do a Mi o Lab)' },
  { id: 'lejanas', label: 'Tonalidades Lejanas', desc: '2 a 3 alteraciones (Ej: Do a Re)' },
  { id: 'muy_lejanas', label: 'Extremas / Tritono', desc: 'Movimientos abruptos (Ej: Do a Fa#)' },
  { id: 'sorpresa', label: 'Sorpresa', desc: 'Elección libre del asistente' }
];

// --- MOTOR TEÓRICO: LAS 7 CAPAS ---
const NOTES: string[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const getNoteIndex = (noteStr: string): number => {
  const match = noteStr.match(/^[A-G][#b]?/i);
  if (!match) return 0;
  let note = match[0].toUpperCase();
  const flats: Record<string, string> = {'DB':'C#','EB':'D#','GB':'F#','AB':'G#','BB':'A#'};
  return NOTES.indexOf(flats[note] || note);
};

const transposeIndex = (root: number, interval: number) => (root + interval + 120) % 12;

// Capas 5 y 6: Motor de Emoción y Estilo (Construcción del acorde final)
const formatChord = (rootIndex: number, quality: string, mood: string, style: string): string => {
  const root = NOTES[rootIndex];
  let q = quality; // base: 'maj', 'm', '7', 'm7b5'

  // Motor de Estilo
  if (style === 'Jazz' || style === 'Bossa Nova' || style === 'Fusión') {
    if (q === 'maj') q = 'maj9';
    if (q === 'm') q = 'm9';
    if (q === '7') q = '13';
  } else if (style === 'Cinemático' || style === 'Clásica') {
    if (q === 'maj') q = 'maj7(no3)';
    if (q === 'm') q = 'm(add9)';
    if (q === '7') q = '11';
  } else if (style === 'Rock Alternativo' || style === 'Metal Progresivo') {
    if (q === 'maj') q = 'sus2';
    if (q === 'm') q = 'm7';
    if (q === '7') q = '7sus4';
  } else if (style === 'Neo-Soul' || style === 'R&B' || style === 'Lo-Fi Hip Hop') {
    if (q === 'maj') q = 'maj11';
    if (q === 'm') q = 'm11';
    if (q === '7') q = '7#9';
  } else {
    // Pop y otros (estándar)
    if (q === 'maj') q = 'maj7';
    if (q === 'm') q = 'm';
    if (q === '7') q = '7';
  }

  // Motor Emocional (Ajustes de tensión narrativa)
  if ((mood === 'oscuro' || mood === 'sombrio' || mood === 'tenso') && q.includes('7')) q = q.replace('7', '7b9').replace('13', '7b9');
  if ((mood === 'etereo' || mood === 'misterioso') && q.includes('7')) q = '11';
  if (mood === 'nostalgico' && q === 'm') q = 'm9';

  return `${root}${q}`;
};

export default function App() {
  const [step, setStep] = useState<number>(1);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({ inputChords: '', modulation: 'stay', modulationDistance: 'vecinas', mood: '', style: '' });
  const [results, setResults] = useState<ResultItem[]>([]);

  const updateForm = (key: keyof FormData, value: string) => { setFormData(prev => ({ ...prev, [key]: value })); };
  const nextStep = () => setStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  // Motor Principal: Ejecuta las 7 capas
  const generateNativeProgressions = () => {
    setIsGenerating(true); setStep(5);
    
    setTimeout(() => {
      const input = formData.inputChords.trim() || 'Cmaj7';
      // Capa 1 y 2: Análisis Musical Profundo
      const rootIndex = getNoteIndex(input);
      const isMinor = input.toLowerCase().includes('m') && !input.toLowerCase().includes('maj');
      
      const newResults: ResultItem[] = [];

      for (let i = 0; i < 3; i++) {
        let route: string[] = [input];
        let explanation = "";

        if (formData.modulation === 'modulate') {
          // Capas 3 y 4: Motor de Modulación
          let targetIndex = rootIndex;
          let targetIsMinor = isMinor;
          
          if (formData.modulationDistance === 'vecinas') {
             // Schoenberg (Regiones cercanas)
             const isSubdom = Math.random() > 0.5;
             targetIndex = transposeIndex(rootIndex, isSubdom ? 5 : 7);
             explanation = `[Modulación de Schoenberg] Nos movemos a la región vecina de ${NOTES[targetIndex]}. Se genera una EXPANSIÓN hacia la ${isSubdom ? 'Subdominante' : 'Dominante'} usando un acorde puente, buscando establecer un nuevo centro tonal sin saltos bruscos. `;
             route.push(formatChord(transposeIndex(targetIndex, 7), '7', formData.mood, formData.style));
             
          } else if (formData.modulationDistance === 'homonimas') {
             targetIsMinor = !isMinor;
             explanation = `[Intercambio Modal] Cambiamos el modo paralelo a ${NOTES[rootIndex]} ${targetIsMinor ? 'Menor' : 'Mayor'}. Esta es una MODULACIÓN de color que mantiene la misma nota base pero altera la percepción emocional (Resolución inesperada). `;
             route.push(formatChord(transposeIndex(rootIndex, 5), targetIsMinor ? 'm' : 'maj', formData.mood, formData.style));

          } else if (formData.modulationDistance === 'mediantes' || formData.modulationDistance === 'muy_lejanas') {
             // Neo-Riemanniana (P, L, R)
             const intervals = isMinor ? [3, 8] : [4, 9];
             const leap = intervals[Math.floor(Math.random() * intervals.length)];
             targetIndex = transposeIndex(rootIndex, leap);
             targetIsMinor = !isMinor;
             explanation = `[Teoría Neo-Riemanniana] Aplicamos un movimiento cromático hacia ${NOTES[targetIndex]}. Es una MODULACIÓN cinematográfica que ignora la gramática clásica, conectando acordes a través de la suavidad del voice leading (notas en común). `;
             route.push(formatChord(transposeIndex(rootIndex, isMinor ? 7 : 4), isMinor ? 'm' : 'maj', formData.mood, formData.style));

          } else {
             // Lerdahl (Tonal Pitch Space) - Lejanas / Sorpresa
             targetIndex = transposeIndex(rootIndex, Math.floor(Math.random() * 11) + 1);
             targetIsMinor = Math.random() > 0.5;
             explanation = `[Lerdahl - Tonal Pitch Space] Salto lejano en el espacio tonal hacia ${NOTES[targetIndex]}. Creamos una RESOLUCIÓN artificial usando un acorde suspendido para suavizar la distancia cognitiva entre ambas tonalidades. `;
             route.push(formatChord(transposeIndex(targetIndex, 7), '7', formData.mood, 'Rock Alternativo')); // Forzamos un sus/11
          }

          route.push(formatChord(targetIndex, targetIsMinor ? 'm' : 'maj', formData.mood, formData.style));

        } else {
          // Si no modula: Capa 3 (Gramática armónica interna)
          const approachType = i % 3;
          if (approachType === 0) {
            // Expansión Diatónica
            route.push(formatChord(transposeIndex(rootIndex, 5), isMinor ? 'm' : 'maj', formData.mood, formData.style));
            route.push(formatChord(transposeIndex(rootIndex, 7), '7', formData.mood, formData.style));
            route.push(formatChord(rootIndex, isMinor ? 'm' : 'maj', formData.mood, formData.style));
            explanation = `[Gramática Funcional] EXPANSIÓN diatónica pura. Nos alejamos hacia la región subdominante para acumular energía, pasando por el dominante para una RESOLUCIÓN clásica hacia la tónica.`;
          } else if (approachType === 1) {
            // Sustitución Tritonal
            route.push(formatChord(transposeIndex(rootIndex, 2), isMinor ? 'm7b5' : 'm', formData.mood, formData.style));
            route.push(formatChord(transposeIndex(rootIndex, 1), '7', formData.mood, formData.style));
            route.push(formatChord(rootIndex, isMinor ? 'm' : 'maj', formData.mood, formData.style));
            explanation = `[Tensión Narrativa] Aumentamos la fricción armónica usando una sustitución de tritono. Esta RESOLUCIÓN cromática descendente genera una sensación sofisticada típica del Jazz o Neo-Soul.`;
          } else {
            // Intercambio Modal (bVI - bVII - I)
            route.push(formatChord(transposeIndex(rootIndex, 8), 'maj', formData.mood, formData.style));
            route.push(formatChord(transposeIndex(rootIndex, 10), 'maj', formData.mood, formData.style));
            route.push(formatChord(rootIndex, isMinor ? 'm' : 'maj', formData.mood, formData.style));
            explanation = `[Préstamo Modal] EXPANSIÓN épica tomando acordes prestados del modo menor (bVI - bVII). Crea un arco narrativo heroico o misterioso antes de resolver nuevamente en la tónica.`;
          }
        }

        newResults.push({ id: i, chords: route, explanation: explanation.trim(), text: route.join(' - ') });
      }
      
      setResults(newResults); setIsGenerating(false);
    }, 1200);
  };

  const copyToClipboard = (text: string, id: number) => { navigator.clipboard.writeText(text); setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); };
  const canProceed = () => { switch (step) { case 1: return formData.inputChords.trim().length > 0; case 3: return formData.mood !== ''; case 4: return formData.style !== ''; default: return true; } };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Compass size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Asistente<span className="text-indigo-400">Armónico</span></h1>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 flex flex-col justify-center">
        {step < 5 && (
          <div className="mb-12">
            <div className="flex justify-between mb-3 text-sm font-medium text-slate-500">
              <span className={step >= 1 ? 'text-indigo-400' : ''}>Análisis</span>
              <span className={step >= 2 ? 'text-indigo-400' : ''}>Dirección</span>
              <span className={step >= 3 ? 'text-indigo-400' : ''}>Emoción</span>
              <span className={step >= 4 ? 'text-indigo-400' : ''}>Estilo</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 transition-all duration-500 ease-out" style={{ width: `${(step / 4) * 100}%` }} />
            </div>
          </div>
        )}

        <div className="min-h-[400px]">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">¿Qué acordes estamos analizando?</h2>
                <p className="text-slate-400 text-sm">Ingresa tu punto de partida armónico para iniciar el análisis.</p>
              </div>
              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                <input type="text" value={formData.inputChords} onChange={(e) => updateForm('inputChords', e.target.value)} placeholder="Ej: Cmaj7, Fm9..." className="w-full bg-slate-900 border border-slate-600 text-white text-xl p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-600" autoFocus />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Tonalidad y Dirección</h2>
                <p className="text-slate-400 text-sm">¿Deseas explorar la tonalidad actual o viajar a una nueva?</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={() => updateForm('modulation', 'stay')} className={`p-6 rounded-2xl border-2 text-left transition-all ${formData.modulation === 'stay' ? 'bg-indigo-600/20 border-indigo-500' : 'bg-slate-800 border-slate-700 hover:border-slate-500'}`}>
                  <div className="text-xl font-bold text-white mb-1">Mantener Tonalidad</div>
                  <div className="text-xs text-slate-400">Desarrollar progresiones dentro del mismo centro tonal.</div>
                </button>
                <button onClick={() => updateForm('modulation', 'modulate')} className={`p-6 rounded-2xl border-2 text-left transition-all ${formData.modulation === 'modulate' ? 'bg-indigo-600/20 border-indigo-500' : 'bg-slate-800 border-slate-700 hover:border-slate-500'}`}>
                  <div className="text-xl font-bold text-white mb-1">Modular</div>
                  <div className="text-xs text-slate-400">Crear puentes armónicos hacia una nueva tonalidad.</div>
                </button>
              </div>
              {formData.modulation === 'modulate' && (
                <div className="mt-6 bg-slate-800/50 p-6 rounded-2xl border border-slate-700 animate-in fade-in zoom-in-95">
                  <p className="text-white text-sm font-medium mb-4">Región armónica de destino:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {MODULATION_TYPES.map((type) => (
                      <button key={type.id} onClick={() => updateForm('modulationDistance', type.id)} className={`flex flex-col items-start p-3 rounded-xl border transition-all text-left ${formData.modulationDistance === type.id ? 'bg-indigo-500/20 border-indigo-500' : 'bg-slate-900 border-slate-600 hover:border-slate-500'}`}>
                        <span className={`text-xs font-bold mb-1 ${formData.modulationDistance === type.id ? 'text-indigo-300' : 'text-slate-200'}`}>{type.label}</span>
                        <span className="text-[10px] text-slate-500 leading-tight">{type.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Color y Emoción</h2>
                <p className="text-slate-400 text-sm">¿Qué carácter emotivo buscas?</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {MOOD_OPTIONS.map((mood) => (
                  <button key={mood.id} onClick={() => updateForm('mood', mood.id)} className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${formData.mood === mood.id ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white'}`}>
                    <span className="text-2xl">{mood.emoji}</span>
                    <span className="text-[10px] font-medium text-center">{mood.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Estilo Musical</h2>
                <p className="text-slate-400 text-sm">Contexto estilístico del análisis.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {STYLE_OPTIONS.map((style) => (
                  <button key={style} onClick={() => updateForm('style', style)} className={`p-3 rounded-xl border transition-all text-center text-sm font-medium ${formData.style === style ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'}`}>
                    {style}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="bg-indigo-500/20 p-4 rounded-full border border-indigo-500/30">
                    <Compass size={40} className="text-indigo-400" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">Propuestas Armónicas</h2>
                <div className="flex justify-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 bg-slate-800 rounded text-[10px] border border-slate-700 flex items-center gap-1"><BookOpen size={10}/> {formData.style}</span>
                  <span className="px-2 py-0.5 bg-slate-800 rounded text-[10px] border border-slate-700">{MOOD_OPTIONS.find(m => m.id === formData.mood)?.label}</span>
                </div>
              </div>
              
              {isGenerating ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                  <RefreshCw className="w-10 h-10 text-indigo-500 animate-spin" />
                  <p className="text-slate-500 text-sm font-medium animate-pulse">Analizando tensión y calculando espacios tonales...</p>
                </div>
              ) : (
                <div className="space-y-6 mt-4">
                  {results.map((res) => (
                    <div key={res.id} className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700 hover:border-indigo-500/30 transition-all">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div className="flex flex-wrap gap-2 items-center">
                          {res.chords.map((chord, idx) => (
                            <React.Fragment key={idx}>
                              <span className="px-3 py-1.5 bg-indigo-500/10 text-indigo-300 rounded-lg font-mono font-bold text-base border border-indigo-500/20">{chord}</span>
                              {idx < res.chords.length - 1 && <ArrowRight size={14} className="text-slate-600" />}
                            </React.Fragment>
                          ))}
                        </div>
                        <button onClick={() => copyToClipboard(res.text, res.id)} className="p-2 bg-slate-900/50 rounded-lg text-slate-500 hover:text-white transition-colors border border-slate-700">
                          {copiedId === res.id ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                        </button>
                      </div>
                      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 relative">
                        <div className="flex items-center gap-2 mb-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                          <Lightbulb size={14} /> Notas Analíticas
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">{res.explanation}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-center pt-4">
                    <button onClick={() => setStep(1)} className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2 border border-slate-700">
                      <RefreshCw size={16} /> Nueva Exploración
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {step < 5 && (
          <div className="mt-12 flex items-center justify-between border-t border-slate-800 pt-6">
            <button onClick={prevStep} disabled={step === 1} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${step === 1 ? 'text-slate-700 cursor-not-allowed' : 'text-slate-400 hover:text-white'}`}>
              <ArrowLeft size={18} /> Atrás
            </button>
            <button onClick={step === 4 ? generateNativeProgressions : nextStep} disabled={!canProceed()} className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${canProceed() ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}>
              {step === 4 ? 'Analizar y Proponer' : 'Siguiente'}
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
