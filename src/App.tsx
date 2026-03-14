import React, { useState } from 'react';

// --- INYECCIÓN FORZADA DE ESTILOS Y TAILWIND ---
// Esto se ejecuta inmediatamente al leer el archivo, antes de que React inicie.
if (typeof document !== 'undefined') {
  // 1. Forzar fondo oscuro y resetear estilos por defecto de StackBlitz
  if (!document.getElementById('force-dark-mode')) {
    const style = document.createElement('style');
    style.id = 'force-dark-mode';
    style.innerHTML = `
      body, html { 
        margin: 0; 
        padding: 0; 
        background-color: #020617 !important; /* slate-950 */
        color: #f8fafc !important; /* slate-50 */
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      }
      #root { min-height: 100vh; }
    `;
    document.head.appendChild(style);
  }

  // 2. Inyectar Tailwind CSS si no existe
  if (!document.getElementById('tailwind-cdn')) {
    const script = document.createElement('script');
    script.id = 'tailwind-cdn';
    script.src = 'https://cdn.tailwindcss.com';
    document.head.appendChild(script);
  }
}

// --- ÍCONOS NATIVOS (Sin dependencias externas) ---
const Compass = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>
);
const ArrowRight = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);
const ArrowLeft = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
);
const Sparkles = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
);
const RefreshCw = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
);
const Copy = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
);
const Check = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"/></svg>
);
const Lightbulb = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.2 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
);
const BookOpen = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
);

// --- INTERFACES Y TIPOS ---
interface MoodOption {
  id: string;
  label: string;
  emoji: string;
}

interface ModulationType {
  id: string;
  label: string;
  desc: string;
}

interface FormData {
  inputChords: string;
  modulation: 'stay' | 'modulate';
  modulationDistance: string;
  mood: string;
  style: string;
}

interface ResultItem {
  id: number;
  chords: string[];
  explanation: string;
  text: string;
}

// --- OPCIONES DE CONFIGURACIÓN ---
const MOOD_OPTIONS: MoodOption[] = [
  { id: 'alegre', label: 'Alegre / Brillante', emoji: '☀️' },
  { id: 'triste', label: 'Triste / Melancólico', emoji: '🌧️' },
  { id: 'sombrio', label: 'Sombrío / Oscuro', emoji: '🌑' },
  { id: 'epico', label: 'Épico / Majestuoso', emoji: '🏔️' },
  { id: 'tenso', label: 'Tenso / Disonante', emoji: '⚡' },
  { id: 'etereo', label: 'Etéreo / Flotante', emoji: '☁️' },
  { id: 'misterioso', label: 'Misterioso / Intrigante', emoji: '🕵️' },
  { id: 'nostalgico', label: 'Nostálgico / Añoranza', emoji: '🎞️' },
  { id: 'triunfal', label: 'Triunfal / Victorioso', emoji: '🎺' },
  { id: 'intimo', label: 'Íntimo / Cálido', emoji: '☕' }
];

const STYLE_OPTIONS: string[] = [
  'Jazz', 'Pop', 'Bossa Nova', 'Neo-Soul', 'Clásica', 
  'R&B', 'Rock Alternativo', 'Lo-Fi Hip Hop', 'Cinemático', 'Funk',
  'Gospel', 'Bolero', 'Salsa', 'EDM / Electrónica', 'Metal Progresivo',
  'Synthwave', 'Flamenco', 'Fusión'
];

const MODULATION_TYPES: ModulationType[] = [
  { id: 'vecinas', label: 'Tonalidades Vecinas', desc: '1er grado (relativas, dominante, subdominante)' },
  { id: 'homonimas', label: 'Homónimas (Paralelas)', desc: 'Misma tónica, distinto modo (Ej: Mayor a Menor)' },
  { id: 'mediantes', label: 'Mediantes Cromáticas', desc: 'Movimiento por 3ras (Ej: Do a Mi o Lab)' },
  { id: 'lejanas', label: 'Tonalidades Lejanas', desc: '2 a 3 alteraciones (Ej: Do a Re)' },
  { id: 'muy_lejanas', label: 'Extremas / Tritono', desc: 'Movimientos abruptos (Ej: Do a Fa#)' },
  { id: 'sorpresa', label: 'Sorpresa', desc: 'Elección libre del asistente' }
];

// --- MOTOR DE TEORÍA MUSICAL NATIVO ---
const NOTES: string[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const getNoteIndex = (noteStr: string): number => {
  const match = noteStr.match(/^[A-G][#b]?/i);
  if (!match) return 0;
  let note = match[0].toUpperCase();
  const flats: Record<string, string> = {'DB':'C#','EB':'D#','GB':'F#','AB':'G#','BB':'A#'};
  note = flats[note] || note;
  return NOTES.indexOf(note);
};

const transpose = (rootIndex: number, interval: number): string => {
  return NOTES[(rootIndex + interval + 120) % 12]; // +120 para evitar negativos
};

export default function App() {
  const [step, setStep] = useState<number>(1);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  // Estado de las selecciones del usuario
  const [formData, setFormData] = useState<FormData>({
    inputChords: '',
    modulation: 'stay', 
    modulationDistance: 'vecinas', 
    mood: '',
    style: ''
  });

  const [results, setResults] = useState<ResultItem[]>([]);

  const updateForm = (key: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value as any }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  // Generador Algorítmico 100% Nativo
  const generateNativeProgressions = () => {
    setIsGenerating(true);
    setStep(5);
    
    setTimeout(() => {
      const input = formData.inputChords.trim() || 'Cmaj7';
      const rootIndex = getNoteIndex(input);
      const isInputMinor = input.toLowerCase().includes('m') && !input.toLowerCase().includes('maj');
      
      const newResults: ResultItem[] = [];
      const stylesWithExtensions = ['Jazz', 'Neo-Soul', 'Bossa Nova', 'R&B', 'Fusión'];
      const useExtensions = stylesWithExtensions.includes(formData.style);

      for (let i = 0; i < 3; i++) {
        let chords: string[] = [input];
        let explanation = "";
        let targetIndex = rootIndex;
        let targetQuality = isInputMinor ? 'm' : '';

        // 1. Determinar el destino armónico
        if (formData.modulation === 'modulate') {
          let interval = 0;
          switch(formData.modulationDistance) {
            case 'vecinas': 
              interval = [7, 5, 9, 4][Math.floor(Math.random()*4)]; // V, IV, vi, iii
              targetQuality = (interval === 9 || interval === 4) ? 'm' : '';
              explanation += `Para esta modulación cercana, nos dirigimos a la región de ${transpose(rootIndex, interval)}. `;
              break;
            case 'homonimas': 
              targetQuality = isInputMinor ? '' : 'm';
              explanation += `Aplicando un intercambio modal paralelo, cambiamos la cualidad del centro tonal. `;
              break;
            case 'mediantes': 
              interval = [4, 8, 3, 9][Math.floor(Math.random()*4)]; // Relaciones de 3ra
              targetQuality = (Math.random() > 0.5) ? 'm' : '';
              explanation += `Utilizamos una mediante cromática para saltar armónicamente hacia ${transpose(rootIndex, interval)}${targetQuality}, creando un efecto dramático. `;
              break;
            case 'lejanas': 
              interval = [2, 10][Math.floor(Math.random()*2)]; // II, bVII
              explanation += `Modulamos hacia una tonalidad lejana (${transpose(rootIndex, interval)}), exigiendo una conducción de voces cuidadosa. `;
              break;
            case 'muy_lejanas': 
              interval = 6; // Tritono
              explanation += `Realizamos una modulación extrema a distancia de tritono (${transpose(rootIndex, interval)}), un recurso audaz. `;
              break;
            case 'sorpresa': 
              interval = Math.floor(Math.random() * 11) + 1;
              targetQuality = (Math.random() > 0.5) ? 'm' : '';
              explanation += `He calculado una modulación inesperada hacia ${transpose(rootIndex, interval)}${targetQuality}. `;
              break;
          }
          targetIndex = (rootIndex + interval) % 12;
        } else {
          explanation += `Manteniendo el anclaje tonal en la región de ${transpose(rootIndex, 0)}, `;
        }

        // 2. Construir la ruta (Acordes intermedios)
        let route: string[] = [];
        
        // Determinar "color" según el mood y estilo
        let subQuality = useExtensions ? 'maj9' : 'maj7';
        let domQuality = useExtensions ? '13' : '7';
        let minQuality = useExtensions ? 'm9' : 'm7';
        let halfDim = useExtensions ? 'm11b5' : 'm7b5';

        if (formData.mood === 'tenso' || formData.mood === 'misterioso') {
          domQuality = '7#9'; // Dominantes alterados
          subQuality = 'm(maj7)';
        } else if (formData.mood === 'etereo' || formData.mood === 'intimo') {
          domQuality = '9sus4';
          subQuality = 'add9';
        } else if (formData.mood === 'epico' || formData.mood === 'triunfal') {
          domQuality = 'sus4';
          subQuality = '';
        }

        // Algoritmo de cadencia hacia el target
        const approachType = i % 3; 

        if (approachType === 0) {
          // Ruta clásica: Acorde puente -> ii del target -> V del target -> Target
          let prepChordIndex = (targetIndex + 2) % 12; // ii
          let domChordIndex = (targetIndex + 7) % 12;  // V
          
          if (targetQuality === 'm') {
             route.push(`${transpose(prepChordIndex, 0)}${halfDim}`);
             route.push(`${transpose(domChordIndex, 0)}${domQuality.includes('b9') ? domQuality : '7b9'}`);
             explanation += `Implementamos una cadencia ii-V-i para aterrizar suavemente. `;
          } else {
             route.push(`${transpose(prepChordIndex, 0)}${minQuality}`);
             route.push(`${transpose(domChordIndex, 0)}${domQuality}`);
             explanation += `Aprovechamos un encadenamiento tradicional ii-V para establecer la nueva función tónica. `;
          }
          route.push(`${transpose(targetIndex, 0)}${targetQuality === 'm' ? minQuality : subQuality}`);

        } else if (approachType === 1) {
          // Sustitución Tritonal
          let subVIndex = (targetIndex + 1) % 12; // Acorde medio tono arriba
          let prepIndex = (targetIndex + 5) % 12; // IV del target
          
          route.push(`${transpose(prepIndex, 0)}${targetQuality === 'm' ? 'm7' : subQuality}`);
          route.push(`${transpose(subVIndex, 0)}${useExtensions ? '7#11' : '7'}`);
          route.push(`${transpose(targetIndex, 0)}${targetQuality === 'm' ? minQuality : subQuality}`);
          
          explanation += `Empleamos una sustitución tritonal (${transpose(subVIndex, 0)}7) que resuelve descendentemente por semitono, aportando el color ${formData.mood} típico del ${formData.style}. `;
        } else {
          // Mediante o Pedal
          let bVIIndex = (targetIndex + 8) % 12;
          let bVIIIndex = (targetIndex + 10) % 12;
          
          route.push(`${transpose(bVIIndex, 0)}maj7`);
          route.push(`${transpose(bVIIIndex, 0)}${domQuality}`);
          route.push(`${transpose(targetIndex, 0)}${targetQuality === 'm' ? minQuality : subQuality}`);
          
          explanation += `Tomamos prestados acordes de la tonalidad paralela menor (bVI - bVII) como mecanismo de aproximación (Backdoor progression), reforzando el estilo ${formData.style}. `;
        }

        // Agregar extensión final opcional
        if (Math.random() > 0.5) {
          let turnaround = (targetIndex + 9) % 12; // vi
          route.push(`${transpose(turnaround, 0)}${minQuality}`);
          explanation += `Cerramos con un grado de reposo secundario para mantener el movimiento armónico vivo.`;
        } else {
          explanation += `La resolución final aporta estabilidad al discurso musical.`;
        }

        chords = [...chords, ...route];

        newResults.push({
          id: i,
          chords: chords,
          explanation: explanation.trim(),
          text: chords.join(' - ')
        });
      }
      
      setResults(newResults);
      setIsGenerating(false);
    }, 1200); // Simulamos tiempo de "procesamiento matemático"
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">¿Qué acordes estamos analizando?</h2>
              <p className="text-slate-400">Ingresa tu punto de partida armónico para iniciar el análisis algorítmico.</p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
              <input
                type="text"
                value={formData.inputChords}
                onChange={(e) => updateForm('inputChords', e.target.value)}
                placeholder="Ej: Cmaj7, Fm9..."
                className="w-full bg-slate-900 border border-slate-600 text-white text-xl p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-slate-600"
                autoFocus
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Tonalidad y Dirección</h2>
              <p className="text-slate-400">¿Deseas explorar la tonalidad actual o viajar a una nueva?</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => updateForm('modulation', 'stay')}
                className={`p-6 rounded-2xl border-2 text-left transition-all ${
                  formData.modulation === 'stay' 
                    ? 'bg-indigo-600/20 border-indigo-500' 
                    : 'bg-slate-800 border-slate-700 hover:border-slate-500'
                }`}
              >
                <div className="text-xl font-bold text-white mb-1">Mantener Tonalidad</div>
                <div className="text-sm text-slate-400">Desarrollar progresiones explorando funciones dentro del mismo centro tonal.</div>
              </button>
              
              <button
                onClick={() => updateForm('modulation', 'modulate')}
                className={`p-6 rounded-2xl border-2 text-left transition-all ${
                  formData.modulation === 'modulate' 
                    ? 'bg-indigo-600/20 border-indigo-500' 
                    : 'bg-slate-800 border-slate-700 hover:border-slate-500'
                }`}
              >
                <div className="text-xl font-bold text-white mb-1">Modular</div>
                <div className="text-sm text-slate-400">Crear puentes armónicos hacia una nueva tonalidad de destino.</div>
              </button>
            </div>

            {formData.modulation === 'modulate' && (
              <div className="mt-6 bg-slate-800/50 p-6 rounded-2xl border border-slate-700 animate-in fade-in slide-in-from-top-4">
                <p className="text-white font-medium mb-4">¿Hacia qué región armónica modulamos?</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {MODULATION_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => updateForm('modulationDistance', type.id)}
                      className={`flex flex-col items-start p-3 rounded-xl border transition-all text-left ${
                        formData.modulationDistance === type.id
                          ? 'bg-indigo-500/20 border-indigo-500'
                          : 'bg-slate-900 border-slate-600 hover:border-slate-500'
                      }`}
                    >
                      <span className={`text-sm font-bold mb-1 ${formData.modulationDistance === type.id ? 'text-indigo-300' : 'text-slate-200'}`}>{type.label}</span>
                      <span className="text-xs text-slate-400 leading-tight">{type.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Color y Emoción</h2>
              <p className="text-slate-400">¿Qué carácter emotivo quieres que tenga el ejercicio?</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {MOOD_OPTIONS.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => updateForm('mood', mood.id)}
                  className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                    formData.mood === mood.id
                      ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <span className="text-3xl">{mood.emoji}</span>
                  <span className="text-xs font-medium text-center">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Estilo Musical</h2>
              <p className="text-slate-400">Define el contexto estilístico para el cálculo algorítmico.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {STYLE_OPTIONS.map((style) => (
                <button
                  key={style}
                  onClick={() => updateForm('style', style)}
                  className={`p-4 rounded-xl border transition-all text-center font-medium ${
                    formData.style === style
                      ? 'bg-indigo-500 border-indigo-500 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-indigo-500/20 p-4 rounded-full border border-indigo-500/30">
                  <Compass size={40} className="text-indigo-400" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">
                Propuestas Armónicas (Motor Nativo)
              </h2>
              <p className="text-slate-400 flex items-center justify-center gap-2 flex-wrap">
                <span className="px-2 py-1 bg-slate-800 rounded-md text-xs border border-slate-700 flex items-center gap-1"><BookOpen size={12}/> {formData.style}</span>
                •
                <span className="px-2 py-1 bg-slate-800 rounded-md text-xs border border-slate-700">{MOOD_OPTIONS.find(m => m.id === formData.mood)?.label}</span>
                •
                <span className="px-2 py-1 bg-slate-800 rounded-md text-xs border border-slate-700">
                  {formData.modulation === 'stay' ? 'Análisis tonal' : 'Análisis modulante'}
                </span>
              </p>
            </div>
            
            {isGenerating ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-4">
                <RefreshCw className="w-12 h-12 text-indigo-500 animate-spin" />
                <p className="text-slate-400 font-medium animate-pulse text-center">
                  El motor algorítmico está procesando vectores,<br/>calculando distancias modales y redactando notas...
                </p>
              </div>
            ) : (
              <div className="space-y-6 mt-8">
                {results.map((res) => (
                  <div key={res.id} className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700 hover:border-indigo-500/50 transition-all shadow-lg">
                    {/* Fila de Acordes */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <div className="flex flex-wrap gap-2 items-center">
                        {res.chords.map((chord, idx) => (
                          <React.Fragment key={idx}>
                            <span className="px-4 py-2 bg-indigo-500/10 text-indigo-300 rounded-lg font-mono font-bold text-lg border border-indigo-500/20 shadow-sm">
                              {chord}
                            </span>
                            {idx < res.chords.length - 1 && <ArrowRight size={16} className="text-slate-600" />}
                          </React.Fragment>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => copyToClipboard(res.text, res.id)}
                        className="self-start sm:self-center p-2 bg-slate-900/50 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors flex-shrink-0 border border-slate-700"
                        title="Copiar progresión"
                      >
                        {copiedId === res.id ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
                      </button>
                    </div>

                    {/* Explicación del Motor Algorítmico */}
                    <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-700/50 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-50"></div>
                      <div className="flex items-center gap-2 mb-3 text-indigo-400 font-medium">
                        <Lightbulb size={18} />
                        <h3>Notas Analíticas Calculadas</h3>
                      </div>
                      <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-line">
                        {res.explanation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isGenerating && (
              <div className="flex justify-center pt-8">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2 border border-slate-600 shadow-md"
                >
                  <RefreshCw size={18} />
                  Nuevo cálculo armónico
                </button>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return formData.inputChords.trim().length > 0;
      case 2: return true; 
      case 3: return formData.mood !== '';
      case 4: return formData.style !== '';
      default: return true;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Compass size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Asistente<span className="text-indigo-400">Armónico</span></h1>
          <span className="ml-auto text-xs font-mono bg-slate-800 text-slate-400 px-2 py-1 rounded-md border border-slate-700">Modo Local TS</span>
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
              <div 
                className="h-full bg-indigo-500 transition-all duration-500 ease-out"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="min-h-[400px]">
          {renderStep()}
        </div>

        {step < 5 && (
          <div className="mt-12 flex items-center justify-between border-t border-slate-800 pt-6">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-colors ${
                step === 1 
                  ? 'text-slate-600 cursor-not-allowed opacity-50' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ArrowLeft size={20} />
              Atrás
            </button>
            
            {step < 4 ? (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  canProceed()
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                Siguiente
                <ArrowRight size={20} />
              </button>
            ) : (
              <button
                onClick={generateNativeProgressions}
                disabled={!canProceed()}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                  canProceed()
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white shadow-lg shadow-indigo-500/25'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Sparkles size={20} />
                Procesar Localmente
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}