import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Eye,
  EyeOff,
  AlertTriangle,
  Sparkles,
  Stethoscope,
} from 'lucide-react';
import { MODULES_META } from '../data/modulesMeta';

interface ModuleContentProps {
  partFilter: 'all' | 1 | 2;
  searchQuery: string;
  completedModules: string[];
  onToggleComplete: (moduleId: string) => void;
  hideCasesByDefault: boolean;
  onResetFilters: () => void;
}

interface CaseCardProps {
  title: string;
  scenario: React.ReactNode;
  resolution: React.ReactNode;
  defaultHidden: boolean;
}

function CaseCard({ title, scenario, resolution, defaultHidden }: CaseCardProps) {
  const [localOverride, setLocalOverride] = useState<boolean | null>(null);
  useEffect(() => {
    setLocalOverride(null);
  }, [defaultHidden]);
  const isRevealed = localOverride !== null ? localOverride : !defaultHidden;

  return (
    <div className="my-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/50 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 m-0">
          <Stethoscope className="w-4 h-4 text-teal-700 dark:text-teal-400 shrink-0" aria-hidden="true" />
          <span>{title}</span>
        </h3>
        <button
          type="button"
          onClick={() => setLocalOverride(!isRevealed)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          {isRevealed ? (
            <>
              <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Ocultar resolución</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Ver razonamiento y resolución</span>
            </>
          )}
        </button>
      </div>
      <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{scenario}</div>
      {isRevealed ? (
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-sm leading-relaxed text-slate-800 dark:text-slate-200">
          {resolution}
        </div>
      ) : (
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 italic">
          Fase de experimentación activa (Ciclo de Kolb): formula tu conducta clínica antes de revelar la resolución.
        </p>
      )}
    </div>
  );
}

function WarningBox({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="my-5 rounded-xl border border-rose-200 dark:border-rose-900/70 bg-rose-50/70 dark:bg-rose-950/35 p-4 text-sm leading-relaxed text-rose-950 dark:text-rose-100">
      <div className="flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-rose-700 dark:text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="space-y-1.5">
          {title && <p className="font-semibold text-rose-900 dark:text-rose-200 m-0">{title}</p>}
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}

function PearlBox({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="my-5 rounded-xl border border-teal-200 dark:border-teal-800/70 bg-teal-900 dark:bg-teal-950 text-white dark:text-teal-50 p-4 text-sm leading-relaxed">
      <div className="flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-teal-300 shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <span className="font-semibold text-teal-200">{label} </span>
          <span>{children}</span>
        </div>
      </div>
    </div>
  );
}

function ModuleHeader({
  id,
  roman,
  title,
  part,
  accentText,
  isCompleted,
  onToggle,
}: {
  id: string;
  roman: string;
  title: string;
  part: 1 | 2;
  accentText: string;
  isCompleted: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 mb-6 border-b border-slate-200 dark:border-slate-800">
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1.5">
          <span>Parte {part}</span>
          <span aria-hidden="true">·</span>
          <span>Módulo {roman}</span>
          <span aria-hidden="true">·</span>
          <span>{isCompleted ? 'Estudiado' : 'Pendiente'}</span>
        </div>
        <h2 className={`text-xl sm:text-2xl font-bold tracking-tight ${accentText} m-0`}>{title}</h2>
      </div>
      <button
        type="button"
        onClick={() => onToggle(id)}
        className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
          isCompleted
            ? 'border-teal-600/40 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200'
            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
        }`}
      >
        {isCompleted ? (
          <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" aria-hidden="true" />
        ) : (
          <Circle className="w-4 h-4 text-slate-400" aria-hidden="true" />
        )}
        <span>{isCompleted ? 'Estudiado' : 'Marcar como estudiado'}</span>
      </button>
    </div>
  );
}

const METHOD_300_DATA = [
  { squares: 1, bpm: 300, ms: 200, note: 'Taquicardia extrema (flutter 1:1 / TV rápida)' },
  { squares: 2, bpm: 150, ms: 400, note: 'Taquicardia (pensar en flutter auricular 2:1)' },
  { squares: 3, bpm: 100, ms: 600, note: 'Límite superior de la normalidad sinusal' },
  { squares: 4, bpm: 75, ms: 800, note: 'Frecuencia cardíaca normal (60–100 lpm)' },
  { squares: 5, bpm: 60, ms: 1000, note: 'Límite inferior de la normalidad sinusal' },
  { squares: 6, bpm: 50, ms: 1200, note: 'Bradicardia (<60 lpm)' },
];

const STEVENSON_PROFILES = [
  {
    key: 'A',
    title: 'A · Caliente y seco',
    status: 'Buena perfusión · Sin congestión',
    summary: 'Compensado. Ajustar terapia oral.',
    action: 'Mantener optimización farmacológica oral y vigilancia clínica habitual.',
    style: 'bg-violet-50/70 dark:bg-violet-950/35 border-violet-200 dark:border-violet-800/60',
  },
  {
    key: 'B',
    title: 'B · Caliente y húmedo',
    status: 'Buena perfusión · Congestión pulmonar',
    summary: 'Edema agudo de pulmón: furosemida IV + nitroglicerina.',
    action: 'Cabecera a 60–90°, CPAP/VMNI 8–10 cmH₂O, furosemida IV lenta (máx. 4 mg/min) y nitroglicerina si PAS >110 mmHg.',
    style: 'bg-teal-50/70 dark:bg-teal-950/35 border-teal-200 dark:border-teal-800/60',
  },
  {
    key: 'L',
    title: 'L · Frío y seco',
    status: 'Hipoperfusión · Sin congestión',
    summary: 'Hipovolemia. Reto de volumen cauto.',
    action: 'Valorar precarga (POCUS VCI) y administrar reto cauto de volumen monitorizando respuesta hemodinámica.',
    style: 'bg-amber-50/70 dark:bg-amber-950/35 border-amber-200 dark:border-amber-800/60',
  },
  {
    key: 'C',
    title: 'C · Frío y húmedo',
    status: 'Hipoperfusión · Congestión severa',
    summary: 'Shock cardiogénico: inotrópico, vasopresor, soporte mecánico.',
    action: 'Noradrenalina en SG5 % por vía central (meta PAM ≥65 mmHg), dobutamina o levosimendán, y preparar BCPIA / Impella / ECMO.',
    style: 'bg-rose-50/70 dark:bg-rose-950/35 border-rose-200 dark:border-rose-800/60',
  },
];

const SCAI_STAGES = [
  { code: 'A', label: 'En riesgo', detail: 'Paciente sin signos de shock pero con patología cardiovascular aguda susceptible de descompensación.' },
  { code: 'B', label: 'Pre-shock', detail: 'Hipotensión relativa o taquicardia sin hipoperfusión tisular (lactato aún normal).' },
  { code: 'C', label: 'Shock clásico', detail: 'Hipoperfusión clínica o bioquímica (lactato >2 mmol/L, diuresis <0,5 ml/kg/h, llenado capilar >3 s) que requiere inotrópicos/vasopresores.' },
  { code: 'D', label: 'Refractario', detail: 'Deterioro progresivo sin respuesta al soporte farmacológico inicial; valorar escalamiento o asistencia mecánica.' },
  { code: 'E', label: 'Extremis / RCP', detail: 'Colapso circulatorio refractario, paro cardíaco o soporte vital extracorpóreo en curso.' },
];

export function ModuleContent({
  partFilter,
  searchQuery,
  completedModules,
  onToggleComplete,
  hideCasesByDefault,
  onResetFilters,
}: ModuleContentProps) {
  const [selected300, setSelected300] = useState<number>(3);
  const [selectedStevenson, setSelectedStevenson] = useState<string>('B');
  const [selectedScai, setSelectedScai] = useState<string>('C');
  const [reperfusionBranch, setReperfusionBranch] = useState<'all' | 'yes' | 'no'>('all');

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const visibleModuleIds = new Set(
    MODULES_META.filter((m) => {
      if (partFilter !== 'all' && m.part !== partFilter) return false;
      if (!normalizedQuery) return true;
      return (
        m.fullTitle.toLowerCase().includes(normalizedQuery) ||
        m.shortTitle.toLowerCase().includes(normalizedQuery) ||
        m.searchKeywords.toLowerCase().includes(normalizedQuery)
      );
    }).map((m) => m.id)
  );

  const showPart1Header = ['m1', 'm2', 'm3', 'm4'].some((id) => visibleModuleIds.has(id));
  const showPart2Header = ['m5', 'm6', 'm7', 'm8'].some((id) => visibleModuleIds.has(id));

  if (visibleModuleIds.size === 0) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center">
        <p className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">
          No se encontraron módulos para «{searchQuery}»
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
          Prueba buscando otro término clínico (por ejemplo: ECG, PAM, Stevenson, V4R, TAVI, Stanford o marcapasos).
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-teal-700 hover:bg-teal-800 text-white transition-colors cursor-pointer"
        >
          Mostrar todos los módulos
        </button>
      </div>
    );
  }

  const active300 = METHOD_300_DATA.find((d) => d.squares === selected300) ?? METHOD_300_DATA[2];
  const activeStevenson = STEVENSON_PROFILES.find((s) => s.key === selectedStevenson) ?? STEVENSON_PROFILES[1];
  const activeScai = SCAI_STAGES.find((s) => s.code === selectedScai) ?? SCAI_STAGES[2];

  const getMeta = (id: string) => MODULES_META.find((m) => m.id === id)!;

  return (
    <div className="space-y-8">
      {showPart1Header && (
        <div className="space-y-5">
          <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 m-0">
              Parte 1 · Manual basado exclusivamente en las Ponencias de la Dra. Alicia Carolina Madrazo Garcete
            </h2>
          </div>

          {!normalizedQuery && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6">
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-4 mt-0">
                Este programa de formación avanzada aplica el <strong className="text-slate-900 dark:text-slate-100">Ciclo de Aprendizaje Experiencial de David Kolb</strong>, articulado en cuatro fases para cada competencia clínica:
              </p>
              <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 list-none p-0 m-0">
                <li className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-3.5">
                  <div className="text-xs font-mono text-teal-700 dark:text-teal-400 mb-1">01 · Teoría</div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">Conceptualización abstracta</div>
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 m-0">
                    Marco fisiopatológico, dianas terapéuticas cuantitativas y fundamentos electrofisiológicos y hemodinámicos.
                  </p>
                </li>
                <li className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-3.5">
                  <div className="text-xs font-mono text-teal-700 dark:text-teal-400 mb-1">02 · Práctica</div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">Experimentación activa y simulación clínica</div>
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 m-0">
                    Casos de estudio contextualizados en unidades de cuidados intensivos cardiovasculares con toma de decisiones de enfermería.
                  </p>
                </li>
                <li className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-3.5">
                  <div className="text-xs font-mono text-teal-700 dark:text-teal-400 mb-1">03 · Monitoreo</div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">Observación reflexiva</div>
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 m-0">
                    Vigilancia de alarmas, monitorización invasiva, curvas de presión y detección de complicaciones iatrogénicas.
                  </p>
                </li>
                <li className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-3.5">
                  <div className="text-xs font-mono text-teal-700 dark:text-teal-400 mb-1">04 · Retención</div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">Consolidación cognitiva</div>
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 m-0">
                    Puntos de anclaje nemotécnico, perlas clínicas y matrices de discriminación diagnóstica rápida.
                  </p>
                </li>
              </ol>
            </div>
          )}
        </div>
      )}

      {/* MÓDULO I */}
      {visibleModuleIds.has('m1') && (
        <section
          id="m1"
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7"
        >
          <ModuleHeader
            id="m1"
            roman="I"
            title={getMeta('m1').fullTitle}
            part={1}
            accentText={getMeta('m1').accentText}
            isCompleted={completedModules.includes('m1')}
            onToggle={onToggleComplete}
          />

          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0 mb-3">
            1. Fundamentos Fisiológicos, Vectores y Estandarización Técnica
          </h3>
          <ul className="space-y-2 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300 list-disc pl-5 mb-6">
            <li>
              <strong className="text-slate-900 dark:text-slate-100">Registro del potencial de acción miocárdico:</strong> El electrocardiograma (ECG) registra en superficie la sumatoria espacial y temporal de las corrientes eléctricas generadas por la despolarización y repolarización cardíaca.
            </li>
            <li>
              Un vector que se desplaza hacia un electrodo explorador inscribe una deflexión <strong className="text-slate-900 dark:text-slate-100">positiva</strong> (hacia arriba de la línea isoeléctrica).
            </li>
            <li>
              Un vector que se aleja del electrodo explorador inscribe una deflexión <strong className="text-slate-900 dark:text-slate-100">negativa</strong> (hacia abajo).
            </li>
            <li>
              Un vector que discurre en sentido perpendicular al electrodo genera un trazado <strong className="text-slate-900 dark:text-slate-100">isodifásico</strong>.
            </li>
            <li>
              <em className="text-slate-800 dark:text-slate-200">Principio de disociación electromecánica:</em> El ECG valora exclusivamente la actividad bioeléctrica, no la contracción mecánica ni la eficacia hemodinámica del corazón.
            </li>
          </ul>

          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-6 mb-3">
            Calibración milimétrica estándar
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
              { val: '25 mm/s', label: 'velocidad del papel' },
              { val: '0,04 s', label: '1 mm (cuadradito)' },
              { val: '0,20 s', label: '5 mm (cuadrado grande)' },
              { val: '10 mm/mV', label: 'calibración de voltaje' },
            ].map((stat) => (
              <div
                key={stat.val}
                className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3.5 text-center"
              >
                <div className="font-mono tabular-nums text-lg font-bold text-teal-700 dark:text-teal-300">
                  {stat.val}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
          <ul className="space-y-2 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300 list-disc pl-5 mb-6">
            <li>
              <strong className="text-slate-900 dark:text-slate-100">Eje horizontal (Tiempo):</strong> Velocidad estándar del papel a <strong className="font-mono tabular-nums">25 mm/s</strong>. Un milímetro (cuadradito pequeño) representa <strong className="font-mono tabular-nums">0,04 segundos (40 milisegundos)</strong>; cinco milímetros (cuadrado grande) equivalen a <strong className="font-mono tabular-nums">0,20 segundos (200 milisegundos)</strong>.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-slate-100">Eje vertical (Voltaje):</strong> Calibración universal de <strong className="font-mono tabular-nums">10 mm/mV</strong>. Un milímetro equivale a <strong className="font-mono tabular-nums">0,1 mV</strong>; dos cuadrados grandes (10 mm) representan <strong className="font-mono tabular-nums">1 mV</strong>.
            </li>
            <li>
              <em>Verificación técnica obligatoria:</em> Constatar al inicio del registro la presencia del rectángulo patrón de calibración (10 mm de altura por 5 mm de ancho). Una calibración a 5 mm/mV (medio voltaje) o 20 mm/mV (doble voltaje) induce a falsos diagnósticos de isquemia o hipertrofia.
            </li>
          </ul>

          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-6 mb-3">
            Disposición de derivaciones y planos de exploración
          </h3>
          <ul className="space-y-2.5 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300 list-disc pl-5 mb-6">
            <li>
              <strong className="text-slate-900 dark:text-slate-100">Plano frontal (extremidades):</strong> Derivaciones bipolares estándar (I, II, III) y monopolares aumentadas (aVR, aVL, aVF). Mnemotecnia de conexión por código de colores: brazo derecho (<strong>Rojo</strong>), brazo izquierdo (<strong>Amarillo</strong>), pierna izquierda (<strong>Verde</strong>) y pierna derecha (<strong>Negro/Tierra</strong>).
            </li>
            <li>
              <strong className="text-slate-900 dark:text-slate-100">Plano horizontal (precordiales estándar V1–V6):</strong>
              <ul className="list-circle pl-5 mt-1.5 space-y-1">
                <li><strong>V1:</strong> 4.º espacio intercostal (EIC) en la línea paraesternal derecha.</li>
                <li><strong>V2:</strong> 4.º EIC en la línea paraesternal izquierda.</li>
                <li><strong>V3:</strong> En el punto medio equidistante entre V2 y V4.</li>
                <li><strong>V4:</strong> 5.º EIC en la línea medioclavicular izquierda.</li>
                <li><strong>V5:</strong> 5.º EIC en la línea axilar anterior izquierda (mismo nivel horizontal que V4).</li>
                <li><strong>V6:</strong> 5.º EIC en la línea axilar media izquierda (mismo nivel horizontal que V4).</li>
              </ul>
            </li>
            <li>
              <strong className="text-slate-900 dark:text-slate-100">Derivaciones especiales en cuidados críticos:</strong>
              <ul className="list-circle pl-5 mt-1.5 space-y-1">
                <li>
                  <strong>Precordiales derechas (V3R–V6R):</strong> Espejo en hemitórax derecho de las precordiales estándar; <strong>V4R</strong> (5.º EIC línea medioclavicular derecha) es obligatoria ante todo infarto agudo de cara inferior para diagnosticar extensión al ventrículo derecho.
                </li>
                <li>
                  <strong>Precordiales posteriores (V7–V9):</strong> V7 (línea axilar posterior), V8 (línea medioescapular) y V9 (línea paravertebral izquierda) a nivel del 5.º EIC para pesquisar infartos de cara posterior (dorsal).
                </li>
              </ul>
            </li>
          </ul>

          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-6 mb-3">
            2. Algoritmo de los 5 Pasos para la Lectura Sistemática (Dra. Madrazo)
          </h3>
          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 mb-6">
            <table className="w-full min-w-[600px] border-collapse text-sm">
              <thead>
                <tr className="bg-teal-700 dark:bg-teal-900 text-white text-left">
                  <th className="py-2.5 px-3 font-semibold">Paso</th>
                  <th className="py-2.5 px-3 font-semibold">Parámetro a Evaluar</th>
                  <th className="py-2.5 px-3 font-semibold">Método / Técnica en UCI</th>
                  <th className="py-2.5 px-3 font-semibold">Criterio de Normalidad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="py-2.5 px-3 font-mono tabular-nums font-bold text-teal-700 dark:text-teal-300">1</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">Frecuencia Cardíaca (FC)</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                    • Ritmo regular: Método 300 (300 / n.º cuadros grandes R-R).<br />
                    • Ritmo irregular (ej. FA): Método 6 segundos (complejos QRS en 30 cuadros grandes × 10).
                  </td>
                  <td className="py-2.5 px-3 tabular-nums text-slate-700 dark:text-slate-300">
                    60 a 100 lpm. (&lt;60 = bradicardia, &gt;100 = taquicardia).
                  </td>
                </tr>
                <tr className="bg-slate-50/70 dark:bg-slate-950/40">
                  <td className="py-2.5 px-3 font-mono tabular-nums font-bold text-teal-700 dark:text-teal-300">2</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">Ritmo Cardíaco</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">Constatar activación originada en el nodo sinusal.</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                    • Onda P positiva en II, III y aVF.<br />
                    • Onda P negativa en aVR.<br />
                    • Toda onda P seguida de QRS.<br />
                    • Intervalos R-R regulares.
                  </td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="py-2.5 px-3 font-mono tabular-nums font-bold text-teal-700 dark:text-teal-300">3</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">Eje Eléctrico Frontal</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">Método de los cuadrantes en derivaciones I y aVF.</td>
                  <td className="py-2.5 px-3 tabular-nums text-slate-700 dark:text-slate-300">
                    -30° a +90° (QRS neto positivo en I y positivo en aVF).
                  </td>
                </tr>
                <tr className="bg-slate-50/70 dark:bg-slate-950/40">
                  <td className="py-2.5 px-3 font-mono tabular-nums font-bold text-teal-700 dark:text-teal-300">4</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">Ondas e Intervalos</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">Medición de despolarización y conducción en milisegundos.</td>
                  <td className="py-2.5 px-3 tabular-nums text-slate-700 dark:text-slate-300">
                    • Onda P: &lt;0,12 s (&lt;120 ms) y &lt;0,25 mV.<br />
                    • Intervalo PR: 0,12 a 0,20 s (120–200 ms).<br />
                    • Complejo QRS: &lt;0,12 s (&lt;120 ms).<br />
                    • Intervalo QTc (Bazett): &lt;440 ms (varón), &lt;460 ms (mujer).
                  </td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="py-2.5 px-3 font-mono tabular-nums font-bold text-teal-700 dark:text-teal-300">5</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">Punto J, ST y Onda T</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">Análisis de la línea isoeléctrica y repolarización ventricular.</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                    • Punto J: Nivelado con la línea base TP previa.<br />
                    • Segmento ST: Isoeléctrico (elevación &gt;1 mm en frontal o &gt;2 mm en V2–V3 es patológica).<br />
                    • Onda T: Asimétrica, positiva (salvo aVR y V1).
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-6 mb-3">
            Variaciones patológicas del eje eléctrico
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-6">
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4 text-sm text-slate-700 dark:text-slate-300">
              <div className="font-semibold text-teal-700 dark:text-teal-300 mb-1">Desviación a la izquierda (-30° a -90°)</div>
              QRS positivo en I y negativo en aVF. Etiología: hemibloqueo anterior izquierdo, hipertrofia ventricular izquierda avanzada, IAM inferior antiguo.
            </div>
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4 text-sm text-slate-700 dark:text-slate-300">
              <div className="font-semibold text-teal-700 dark:text-teal-300 mb-1">Desviación a la derecha (+90° a +180°)</div>
              QRS negativo en I y positivo en aVF. Etiología: sobrecarga del ventrículo derecho, tromboembolismo pulmonar (TEP), hemibloqueo posterior izquierdo.
            </div>
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4 text-sm text-slate-700 dark:text-slate-300">
              <div className="font-semibold text-teal-700 dark:text-teal-300 mb-1">Desviación extrema / Indeterminado (+180° a -90°)</div>
              QRS negativo en I y en aVF («eje en tierra de nadie»).
            </div>
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-6 mb-3">
            Prolongación del intervalo QTc y riesgo arrítmico
          </h3>
          <ul className="space-y-2 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300 list-disc pl-5 mb-6">
            <li>
              Calculado mediante la fórmula de Bazett: <strong className="font-mono text-slate-900 dark:text-slate-100">QTc = QT ÷ √RR</strong>
            </li>
            <li>
              Un <strong className="font-mono text-rose-700 dark:text-rose-400">QTc &gt;500 ms</strong> constituye un signo de alarma crítico en UCI por riesgo inminente de degeneración en <strong>Torsades de Pointes</strong> (taquicardia ventricular polimórfica), asociada a hipopotasemia, hipomagnesemia o fármacos (amiodarona, haloperidol, macrólidos).
            </li>
          </ul>

          <CaseCard
            title="Caso Clínico Simulado: Módulo I"
            defaultHidden={hideCasesByDefault}
            scenario={
              <p className="m-0">
                <strong>Escenario:</strong> Varón de 68 años ingresa en la Unidad de Críticos Cardiovasculares en el postoperatorio de cirugía vascular con escalofríos intensos y temblor muscular generalizado. El monitor central activa alarma de «Fibrilación Auricular Rápida con frecuencia de 160 lpm». Al obtener la tira de ritmo se aprecia una línea de base completamente oscilante e irregular que dificulta identificar las ondas.
              </p>
            }
            resolution={
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100 mb-2 mt-0">Razonamiento y resolución:</p>
                <ol className="list-decimal pl-5 space-y-1.5 m-0">
                  <li>
                    <em>Inspección analítica del trazado:</em> Al analizar simultáneamente derivaciones periféricas con menor masa muscular adyacente (V5 y derivación I), se identifican ondas P sinusales a 72 lpm que conducen con intervalos R-R perfectamente regulares.
                  </li>
                  <li>
                    <em>Juicio crítico de enfermería:</em> Se trata de un artefacto por <strong>temblor somático</strong> (contracción de musculatura esquelética) que simula una taquiarritmia auricular.
                  </li>
                  <li>
                    <em>Intervención inmediata:</em> Calentar activamente al paciente con manta de aire convectivo, asegurar el contacto y adherencia del gel de los electrodos, activar el filtro muscular del electrocardiógrafo (filtro de 35 Hz) y repetir el registro de 12 derivaciones antes de iniciar cualquier fármaco frenador o antiarrítmico.
                  </li>
                </ol>
              </div>
            }
          />

          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-6 mb-2">
            Refuerzo Cognitivo: Módulo I
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            <strong className="text-slate-900 dark:text-slate-100">Regla mnemotécnica del Método 300:</strong> Selecciona un intervalo de cuadros grandes entre dos ondas R consecutivas para revisar su equivalencia clínica:
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 mb-3">
            {METHOD_300_DATA.map((item) => {
              const active = item.squares === selected300;
              return (
                <button
                  key={item.squares}
                  type="button"
                  onClick={() => setSelected300(item.squares)}
                  className={`rounded-lg border p-3 text-center transition-colors cursor-pointer ${
                    active
                      ? 'border-teal-600 bg-teal-700 text-white dark:bg-teal-600 dark:border-teal-400'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 hover:border-teal-500/60'
                  }`}
                >
                  <div className="font-mono tabular-nums text-lg font-bold">{item.bpm}</div>
                  <div className={`text-xs ${active ? 'text-teal-100' : 'text-slate-500 dark:text-slate-400'}`}>
                    {item.squares === 1 ? '1 cuadro' : `${item.squares} cuadros`}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 px-4 py-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex flex-wrap items-center justify-between gap-2 mb-4">
            <span className="font-mono tabular-nums font-semibold text-teal-700 dark:text-teal-300">
              {active300.squares} {active300.squares === 1 ? 'cuadro grande' : 'cuadros grandes'} ({active300.ms} ms) → {active300.bpm} lpm
            </span>
            <span>{active300.note}</span>
          </div>

          <PearlBox label="Perla clínica:">
            La onda T simétrica, puntiaguda y de gran voltaje (en «tienda de campaña») es el primer signo electrocardiográfico de <strong>hiperpotasemia</strong> en el paciente crítico, antecediendo al ensanchamiento del QRS y al paro ventricular.
          </PearlBox>
        </section>
      )}

      {/* MÓDULO II */}
      {visibleModuleIds.has('m2') && (
        <section
          id="m2"
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7"
        >
          <ModuleHeader
            id="m2"
            roman="II"
            title={getMeta('m2').fullTitle}
            part={1}
            accentText={getMeta('m2').accentText}
            isCompleted={completedModules.includes('m2')}
            onToggle={onToggleComplete}
          />

          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0 mb-3">
            1. Técnica Estandarizada OMS/HEARTS frente a Monitorización Invasiva
          </h3>
          <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-3">
            <strong className="text-slate-900 dark:text-slate-100">Medición estandarizada no invasiva de la presión arterial (PA):</strong> Aplicación del protocolo OMS/HEARTS para evitar sesgos diagnósticos:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {[
              'Reposo previo mínimo de 5 minutos en ambiente térmico neutro y silencioso.',
              'No haber consumido cafeína, nicotina ni fármacos adrenérgicos en los 30 minutos previos.',
              'Paciente sentado con espalda apoyada, piernas descruzadas y pies planos sobre el piso. Vejiga urinaria evacuada (una vejiga llena puede elevar la PAS hasta 15 mmHg).',
              'Brazo descubierto y apoyado a la altura del corazón. El manguito debe cubrir el 80% de la circunferencia del brazo; un manguito pequeño sobreestima artificialmente la cifra tensional.',
              'Guardar silencio absoluto: conversar durante la toma incrementa la PA hasta en 10 mmHg.',
            ].map((item, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-3.5 text-sm text-slate-700 dark:text-slate-300"
              >
                <span className="font-mono text-xs text-amber-700 dark:text-amber-400 block mb-1">Paso 0{idx + 1}</span>
                {item}
              </div>
            ))}
          </div>

          <p className="text-[15px] font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Monitorización hemodinámica invasiva: Línea Arterial (PAI):
          </p>
          <ul className="space-y-2 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300 list-disc pl-5 mb-6">
            <li>Indicada en inestabilidad hemodinámica, necesidad de gasometrías seriadas y administración de vasoactivos en infusión continua.</li>
            <li>
              <strong className="text-slate-900 dark:text-slate-100">Cálculo de la Presión Arterial Media (PAM):</strong> Representa la verdadera presión de perfusión tisular durante todo el ciclo cardíaco: <strong className="font-mono text-slate-900 dark:text-slate-100">PAM = (PAS + 2·PAD) ÷ 3</strong>
            </li>
            <li>
              <strong className="text-slate-900 dark:text-slate-100">Eje flebostático y calibración:</strong> El transductor de presión debe nivelarse con el <strong>4.º espacio intercostal en la línea axilar media</strong> (referencia anatómica de la aurícula izquierda) y calibrarse a cero a la presión atmosférica al inicio de cada turno o tras cambios posturales.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-slate-100">Test de la onda cuadrada (Dynamic Response Test):</strong> Apertura rápida del sistema de lavado presurizado (a 300 mmHg de solución salina con heparina opcional):
              <ul className="list-circle pl-5 mt-1 space-y-1">
                <li><em>Subamortiguamiento (Underdamped):</em> Múltiples oscilaciones antes de volver a la línea base; sobreestima la PAS y subestima la PAD.</li>
                <li><em>Sobreamortiguamiento (Overdamped):</em> Pérdida de la hendidura dicrota y retorno lento sin oscilaciones; subestima la PAS.</li>
              </ul>
            </li>
            <li>
              <em>Seguridad del catéter:</em> Realización del <strong>test de Allen</strong> antes de la punción radial para verificar la permeabilidad del arco palmar y vigilancia horaria del relleno capilar y temperatura del miembro.
            </li>
          </ul>

          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-6 mb-3">
            2. Algoritmo Decisional ante Crisis Hipertensiva (PA ≥180/120 mmHg)
          </h3>
          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 mb-5">
            <table className="w-full min-w-[580px] border-collapse text-sm">
              <thead>
                <tr className="bg-amber-700 dark:bg-amber-900 text-white text-left">
                  <th className="py-2.5 px-3 font-semibold">Parámetro</th>
                  <th className="py-2.5 px-3 font-semibold">Urgencia Hipertensiva</th>
                  <th className="py-2.5 px-3 font-semibold">Emergencia Hipertensiva</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {[
                  ['Cifras tensionales', 'PAS ≥180 mmHg y/o PAD ≥120 mmHg.', 'PAS ≥180 mmHg y/o PAD ≥120 mmHg.'],
                  ['Daño agudo de órgano diana', 'Ausente. Sin compromiso vital inmediato.', 'Presente. Lesión aguda en encéfalo, corazón, retina, aorta o riñones.'],
                  ['Ubicación asistencial', 'Sala de observación / Box de agudos.', 'Ingreso inmediato en UCI.'],
                  ['Vía de administración', 'Vía ORAL (Captopril, Labetalol, Amlodipino).', 'Vía INTRAVENOSA continua en bomba de infusión.'],
                  ['Monitorización', 'No invasiva automatizada seriada.', 'Invasiva continua (Línea arterial PAI).'],
                  ['Objetivo hemodinámico', 'Reducción tensional gradual en 24 a 48 horas.', 'Reducción de la PAM de un 20% a 25% en la primera hora (o PAS a 160/100 mmHg en 2–6 horas).'],
                  ['Peligro iatrogénico', 'Descensos bruscos que inducen isquemia cerebral o miocárdica por fallo de autorregulación.', 'Demora terapéutica que expande el daño orgánico irreversible.'],
                ].map(([param, urg, emer], idx) => (
                  <tr key={param} className={idx % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/70 dark:bg-slate-950/40'}>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">{param}</td>
                    <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">{urg}</td>
                    <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">{emer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <WarningBox title="La gran excepción terapéutica: Síndrome Aórtico Agudo">
            <ul className="list-disc pl-5 space-y-1 m-0">
              <li>En la disección aórtica aguda <strong>no se aplica</strong> la reducción gradual del 25%.</li>
              <li>
                Se exige un control ultrarrápido en <strong>menos de 10 a 20 minutos</strong> con metas de <strong>PAS entre 90 y 110 mmHg</strong> y frecuencia cardíaca <strong>&lt;60 lpm</strong> mediante betabloqueantes intravenosos (esmolol o labetalol) asociados a vasodilatadores para minimizar la fuerza de cizallamiento (<em>dP/dt</em>).
              </li>
            </ul>
          </WarningBox>

          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-6 mb-3">
            3. Farmacología Parenteral en Cuidados Críticos
          </h3>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Crisis Hipertensiva en UCI</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4 text-sm">
              <div className="font-semibold text-amber-700 dark:text-amber-300 mb-1">Emergencia Neurológica (ACV / Encefalopatía)</div>
              <div className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">→ LABETALOL IV</div>
            </div>
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4 text-sm">
              <div className="font-semibold text-amber-700 dark:text-amber-300 mb-1">Emergencia Coronaria (SCA) o EAP</div>
              <div className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">→ NITROGLICERINA IV</div>
            </div>
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4 text-sm">
              <div className="font-semibold text-amber-700 dark:text-amber-300 mb-1">Emergencia Hipertensiva Refractaria</div>
              <div className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">→ NITROPRUSIATO SÓDICO IV (con fotoprotección)</div>
            </div>
          </div>

          <div className="space-y-5 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1.5">Labetalol IV</h4>
              <ul className="list-disc pl-5 space-y-1 m-0">
                <li><em>Mecanismo:</em> Bloqueador competitivo de receptores α₁ periféricos y β₁/β₂ adrenérgicos (proporción 1:7 tras administración intravenosa).</li>
                <li><em>Ventajas:</em> Reduce la resistencia vascular sistémica manteniendo el gasto cardíaco y el flujo sanguíneo cerebral, renal y coronario sin taquicardia refleja.</li>
                <li><em>Dosificación:</em> Bolos lentos de 20 mg en 2 minutos (duplicando cada 10 min hasta un máximo de 300 mg) o perfusión continua de 0,5 a 2 mg/min.</li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1.5">Nitroglicerina IV</h4>
              <ul className="list-disc pl-5 space-y-1 m-0">
                <li><em>Mecanismo:</em> Donador de óxido nítrico que induce vasodilatación venosa de predominio con reducción de la precarga y del consumo de oxígeno miocárdico. A dosis altas (&gt;100 mcg/min) induce vasodilatación arterial.</li>
                <li><em>Indicaciones:</em> Síndrome coronario agudo y edema agudo de pulmón cardiogénico.</li>
                <li><em>Cuidados enfermeros críticos:</em> Exige sistemas de infusión y frascos libres de cloruro de polivinilo (sistemas <strong>libres de PVC</strong> o de polietileno/vidrio), ya que el fármaco se adsorbe en el plástico convencional provocando pérdida de hasta el 80% de la dosis.</li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1.5">Nitroprusiato sódico IV</h4>
              <ul className="list-disc pl-5 space-y-1 m-0">
                <li><em>Mecanismo:</em> Vasodilatador arteriovenoso directo potente que reduce de forma simultánea la precarga y la postcarga.</li>
                <li>
                  <em>Precauciones de enfermería:</em>
                  <ul className="list-circle pl-5 mt-1 space-y-1">
                    <li><strong>Fotoprotección estricta:</strong> La molécula se inactiva por la luz ambiente; el frasco y la tubuladura deben recubrirse de material opaco.</li>
                    <li><strong>Monitorización invasiva obligatoria:</strong> Exige línea arterial para evitar hipotensiones catastróficas.</li>
                    <li><strong>Toxicidad por cianuro y tiocianato:</strong> Riesgo elevado en infusiones superiores a 48 horas, dosis &gt;2 mcg/kg/min o presencia de insuficiencia renal o hepática. Se vigila la aparición de acidosis metabólica inexplicable, confusión o deterioro neurológico.</li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>

          <CaseCard
            title="Caso Clínico Simulado: Módulo II"
            defaultHidden={hideCasesByDefault}
            scenario={
              <p className="m-0">
                <strong>Escenario:</strong> Mujer de 62 años es trasladada a UCI con déficit motor súbito en extremidades derechas y afasia de 80 minutos de evolución. La TC de cráneo descarta hemorragia (accidente cerebrovascular isquémico agudo con indicación de trombolisis con alteplasa). La línea arterial registra una presión de 212/118 mmHg (PAM 149 mmHg).
              </p>
            }
            resolution={
              <div>
                <p className="font-semibold text-slate-900 dark:text-slate-100 mb-2 mt-0">Razonamiento y resolución:</p>
                <ol className="list-decimal pl-5 space-y-1.5 m-0">
                  <li>
                    <em>Criterio de seguridad hemodinámica:</em> Para administrar el activador del plasminógeno tisular (rt-PA) sin inducir una transformación hemorrágica masiva, la presión arterial debe reducirse y mantenerse estrictamente por debajo de <strong>185/110 mmHg</strong>.
                  </li>
                  <li>
                    <em>Selección farmacológica de enfermería:</em> Iniciar perfusión continua de <strong>labetalol IV</strong> mediante bomba de infusión volumétrica, titulando la velocidad de infusión cada 10 minutos.
                  </li>
                  <li>
                    <em>Vigilancia y límites de seguridad:</em> Evitar reducciones tensionales excesivas (PAM &lt;80 mmHg) que agravarían la isquemia en el área de penumbra cerebral. Realizar valoración neurológica horaria mediante la escala NIHSS.
                  </li>
                </ol>
              </div>
            }
          />

          <PearlBox label="Perla clínica:">
            Jamás administres nifedipino sublingual de liberación inmediata en una crisis hipertensiva; produce vasodilatación no controlada, taquicardia refleja y colapsos coronarios o cerebrales fulminantes.
          </PearlBox>
        </section>
      )}

      {/* MÓDULO III */}
      {visibleModuleIds.has('m3') && (
        <section
          id="m3"
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7"
        >
          <ModuleHeader
            id="m3"
            roman="III"
            title={getMeta('m3').fullTitle}
            part={1}
            accentText={getMeta('m3').accentText}
            isCompleted={completedModules.includes('m3')}
            onToggle={onToggleComplete}
          />

          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0 mb-3">
            NT-proBNP en disnea aguda
          </h3>
          <div className="space-y-2.5 mb-4">
            {[
              { label: '<300 pg/mL: descarta IC (VPN >98 %)', pct: 17 },
              { label: '<50 años: >450 pg/mL', pct: 25 },
              { label: '50–75 años: >900 pg/mL', pct: 50 },
              { label: '>75 años: >1.800 pg/mL', pct: 100 },
            ].map((row) => (
              <div key={row.label} className="grid grid-cols-1 sm:grid-cols-[240px_1fr] items-center gap-2 text-sm">
                <span className="font-mono tabular-nums text-xs sm:text-sm text-slate-700 dark:text-slate-300">{row.label}</span>
                <div className="h-5 rounded bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded bg-violet-600 dark:bg-violet-400"
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-6">
            Lo elevan la insuficiencia renal y la FA; lo baja la obesidad severa. En POCUS, VCI &gt;21 mm con colapso inspiratorio &lt;50 % indica presión auricular derecha &gt;15 mmHg.
          </p>

          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-6 mb-1">
            Matriz de Stevenson (interactiva)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
            Columnas: congestión (seco / húmedo). Filas: perfusión (caliente / frío). Selecciona un cuadrante para ver su protocolo.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mb-3">
            {STEVENSON_PROFILES.map((prof) => {
              const active = prof.key === selectedStevenson;
              return (
                <button
                  key={prof.key}
                  type="button"
                  onClick={() => setSelectedStevenson(prof.key)}
                  className={`text-left rounded-lg border p-4 transition-all cursor-pointer ${prof.style} ${
                    active ? 'ring-2 ring-teal-600 dark:ring-teal-400' : 'opacity-85 hover:opacity-100'
                  }`}
                >
                  <div className="font-bold text-sm text-slate-900 dark:text-slate-100">{prof.title}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 mb-1.5">{prof.status}</div>
                  <div className="text-sm text-slate-800 dark:text-slate-200">{prof.summary}</div>
                </button>
              );
            })}
          </div>
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 p-3.5 text-sm text-slate-700 dark:text-slate-300 max-w-2xl mb-6">
            <strong className="text-slate-900 dark:text-slate-100">Conducta seleccionada ({activeStevenson.title}):</strong> {activeStevenson.action}
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-6 mb-2.5">
            Perfil B: edema agudo de pulmón
          </h3>
          <ul className="space-y-1.5 text-[15px] text-slate-700 dark:text-slate-300 list-disc pl-5 mb-6">
            <li>Cabecera a 60–90° con piernas en declive.</li>
            <li>CPAP/VMNI con 8–10 cmH₂O.</li>
            <li>Furosemida IV lenta, máx. 4 mg/min (ototoxicidad). A las 2 h: diuresis &gt;100–150 ml/h o Na urinario &gt;50–70 mEq/L.</li>
            <li>Nitroglicerina si PAS &gt;110 mmHg.</li>
          </ul>

          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-6 mb-2.5">
            Perfil C: clasificación SCAI
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-3">
            {SCAI_STAGES.map((stage) => {
              const active = stage.code === selectedScai;
              return (
                <button
                  key={stage.code}
                  type="button"
                  onClick={() => setSelectedScai(stage.code)}
                  className={`rounded-lg border p-3 text-center transition-colors cursor-pointer ${
                    active
                      ? 'border-violet-600 bg-violet-700 text-white dark:bg-violet-600 dark:border-violet-400'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 text-slate-800 dark:text-slate-200 hover:border-violet-400'
                  }`}
                >
                  <div className="font-mono text-lg font-bold">{stage.code}</div>
                  <div className={`text-xs ${active ? 'text-violet-100' : 'text-slate-500 dark:text-slate-400'}`}>
                    {stage.label}
                  </div>
                </button>
              );
            })}
          </div>
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 mb-4">
            <strong className="text-violet-700 dark:text-violet-300">Estadio SCAI {activeScai.code} ({activeScai.label}):</strong> {activeScai.detail}
          </div>
          <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-4">
            Hipoperfusión: lactato &gt;2 mmol/L, diuresis &lt;0,5 ml/kg/h, llenado capilar &gt;3 s.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-4">
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4 text-sm text-slate-700 dark:text-slate-300">
              <div className="font-semibold text-violet-700 dark:text-violet-300 mb-1">Noradrenalina</div>
              Primera línea, meta PAM &gt;65. Solo en SG5 %, por vía central.
            </div>
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4 text-sm text-slate-700 dark:text-slate-300">
              <div className="font-semibold text-violet-700 dark:text-violet-300 mb-1">Dobutamina</div>
              Inotrópico de elección (β1), 2,5–15 mcg/kg/min.
            </div>
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4 text-sm text-slate-700 dark:text-slate-300">
              <div className="font-semibold text-violet-700 dark:text-violet-300 mb-1">Levosimendán</div>
              Sensibilizador al calcio, en SG5 %; efecto &gt;7 días (OR-1896).
            </div>
          </div>
          <p className="text-sm font-semibold text-rose-700 dark:text-rose-400 mb-4">
            Balance positivo &gt;+1.000 ml en 36 h aumenta la mortalidad.
          </p>

          <CaseCard
            title="Caso: IAM anterior extenso a las 12 h"
            defaultHidden={hideCasesByDefault}
            scenario={
              <p className="m-0">
                Varón de 64 años, letárgico, diaforesis fría, livedo en rodillas, diuresis 12 ml/h. PA 74/46 (PAM 55), FC 118, lactato 4,2, SvcO₂ 51 %.
              </p>
            }
            resolution={
              <p className="m-0">
                <strong>Perfil C, SCAI C.</strong> Noradrenalina en SG5 % por vía central hasta PAM ≥65, dobutamina, urómetro con diuresis horaria, gasometría cada 2 h para seguir el lactato y preparar balón de contrapulsación o asistencia ventricular.
              </p>
            }
          />

          <PearlBox label="Mnemotecnia:">
            B = Buena perfusión + Burbujas pulmonares → diuréticos y vasodilatadores. C = Compromiso circulatorio + Congestión → Cardiogénico: inotrópicos y soporte mecánico.
          </PearlBox>
        </section>
      )}

      {/* MÓDULO IV */}
      {visibleModuleIds.has('m4') && (
        <section
          id="m4"
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7"
        >
          <ModuleHeader
            id="m4"
            roman="IV"
            title={getMeta('m4').fullTitle}
            part={1}
            accentText={getMeta('m4').accentText}
            isCompleted={completedModules.includes('m4')}
            onToggle={onToggleComplete}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-5">
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4 text-sm text-slate-700 dark:text-slate-300">
              <div className="font-semibold text-rose-700 dark:text-rose-300 mb-1">SCACEST</div>
              Oclusión total. ST elevado &gt;20 min en ≥2 derivaciones contiguas, o BCRI nuevo con sospecha clínica.
            </div>
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4 text-sm text-slate-700 dark:text-slate-300">
              <div className="font-semibold text-rose-700 dark:text-rose-300 mb-1">IAMSEST</div>
              Oclusión parcial con troponina ultrasensible sobre el percentil 99.
            </div>
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4 text-sm text-slate-700 dark:text-slate-300">
              <div className="font-semibold text-rose-700 dark:text-rose-300 mb-1">Angina inestable</div>
              Dolor isquémico en reposo, de inicio reciente o in crescendo, troponinas negativas.
            </div>
          </div>

          <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-300 mb-6">
            <strong className="text-slate-900 dark:text-slate-100">Dolor típico:</strong> opresión precordial no modificada por respiración ni palpación, signo de Levine (puño en el esternón), irradiación a cuello, mandíbula o brazo izquierdo, diaforesis.{' '}
            <strong className="text-slate-900 dark:text-slate-100">Equivalentes anginosos</strong> en ancianos, mujeres y diabéticos: disnea súbita, fatiga extrema o síncope.
          </p>

          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 m-0">
              Algoritmo de reperfusión en SCACEST
            </h3>
            <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs">
              {[
                { key: 'all' as const, label: 'Vista completa' },
                { key: 'yes' as const, label: 'ICP ≤120 min: SÍ' },
                { key: 'no' as const, label: 'ICP ≤120 min: NO' },
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setReperfusionBranch(opt.key)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    reperfusionBranch === opt.key
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-4 mb-4">
            <svg viewBox="0 0 620 300" className="w-full max-w-[620px] mx-auto h-auto" role="img" aria-label="Algoritmo de reperfusión en SCACEST">
              <g fontSize="13" textAnchor="middle" className="fill-slate-900 dark:fill-slate-100">
                <rect x="190" y="5" width="240" height="40" rx="8" className="fill-rose-50 dark:fill-rose-950/80 stroke-rose-600 dark:stroke-rose-400" strokeWidth="1.5" />
                <text x="310" y="30" fontWeight="700">Sospecha de SCACEST</text>
                <line x1="310" y1="45" x2="310" y2="65" className="stroke-rose-600 dark:stroke-rose-400" strokeWidth="2" />
                <rect x="190" y="65" width="240" height="40" rx="8" className="fill-rose-50 dark:fill-rose-950/80 stroke-rose-600 dark:stroke-rose-400" strokeWidth="1.5" />
                <text x="310" y="90">ECG de 12 derivaciones ≤10 min</text>
                <line x1="310" y1="105" x2="310" y2="125" className="stroke-rose-600 dark:stroke-rose-400" strokeWidth="2" />
                <rect x="170" y="125" width="280" height="40" rx="8" className="fill-rose-50 dark:fill-rose-950/80 stroke-rose-600 dark:stroke-rose-400" strokeWidth="1.5" />
                <text x="310" y="150" fontWeight="600">¿ICP posible en ≤120 min?</text>

                <g opacity={reperfusionBranch === 'no' ? 0.3 : 1}>
                  <line x1="230" y1="165" x2="120" y2="195" className="stroke-teal-600 dark:stroke-teal-400" strokeWidth="2" />
                  <text x="150" y="182" fontWeight="700" className="fill-teal-700 dark:fill-teal-300">SÍ</text>
                  <rect x="10" y="195" width="220" height="95" rx="8" className="fill-teal-50 dark:fill-teal-950/70 stroke-teal-600 dark:stroke-teal-400" strokeWidth="1.5" />
                  <text x="120" y="218" fontWeight="700">ICP primaria</text>
                  <text x="120" y="242">Puerta-balón ≤60 min</text>
                  <text x="120" y="262">en centro con sala 24 h</text>
                </g>

                <g opacity={reperfusionBranch === 'yes' ? 0.3 : 1}>
                  <line x1="390" y1="165" x2="500" y2="195" className="stroke-amber-600 dark:stroke-amber-400" strokeWidth="2" />
                  <text x="470" y="182" fontWeight="700" className="fill-amber-700 dark:fill-amber-300">NO</text>
                  <rect x="390" y="195" width="220" height="95" rx="8" className="fill-amber-50 dark:fill-amber-950/70 stroke-amber-600 dark:stroke-amber-400" strokeWidth="1.5" />
                  <text x="500" y="218" fontWeight="700">Fibrinólisis</text>
                  <text x="500" y="242">Puerta-aguja ≤10 min</text>
                  <text x="500" y="262">Sin respuesta a 60–90 min</text>
                  <text x="500" y="280">→ ICP de rescate</text>
                </g>
              </g>
            </svg>
          </div>

          <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
            Contraindicaciones absolutas de fibrinólisis: hemorragia intracraneal previa, ACV isquémico en 6 meses, sangrado digestivo activo, disección aórtica. Criterio de reperfusión: ST resuelto &gt;50 % y dolor cedido.
          </p>

          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 mb-6">
            <table className="w-full min-w-[460px] border-collapse text-sm">
              <thead>
                <tr className="bg-rose-700 dark:bg-rose-900 text-white text-left">
                  <th className="py-2.5 px-3 font-semibold">Antitrombótico</th>
                  <th className="py-2.5 px-3 font-semibold">Dosis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">AAS masticado</td>
                  <td className="py-2.5 px-3 font-mono tabular-nums text-slate-700 dark:text-slate-300">150–300 mg</td>
                </tr>
                <tr className="bg-slate-50/70 dark:bg-slate-950/40">
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">Ticagrelor / Prasugrel</td>
                  <td className="py-2.5 px-3 font-mono tabular-nums text-slate-700 dark:text-slate-300">Carga 180 mg / 60 mg</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">Clopidogrel</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">300–600 mg, si los anteriores están contraindicados</td>
                </tr>
                <tr className="bg-slate-50/70 dark:bg-slate-950/40">
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">Heparina no fraccionada</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">Bolo 70–100 UI/kg, control de TTPa (o enoxaparina)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-6 mb-2">
            Infarto del ventrículo derecho
          </h3>
          <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
            Hasta 30–50 % de los infartos inferiores (oclusión proximal de la coronaria derecha).
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
              { top: '1', label: 'Hipotensión' },
              { top: '2', label: 'Yugulares ingurgitadas' },
              { top: '3', label: 'Pulmones limpios' },
              { top: 'V4R', label: 'ST ≥1 mm' },
            ].map((item) => (
              <div
                key={item.top}
                className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3 text-center"
              >
                <div className="font-mono text-lg font-bold text-rose-700 dark:text-rose-300">{item.top}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">{item.label}</div>
              </div>
            ))}
          </div>

          <WarningBox title="Prohibidos en infarto de VD">
            <strong>Prohibidos:</strong> nitroglicerina, vasodilatadores arteriales, morfina y diuréticos. El VD isquémico depende de la precarga. <strong>Tratar con:</strong> cristaloides 200–300 ml en 15–20 min (PVC meta 10–14 mmHg) y traslado urgente para reperfusión.
          </WarningBox>

          <CaseCard
            title="Caso: ST elevado en II, III y aVF"
            defaultHidden={hideCasesByDefault}
            scenario={
              <p className="m-0">
                Varón de 57 años, PA 86/48, FC 54, pulmones limpios, yugulares ingurgitadas.
              </p>
            }
            resolution={
              <p className="m-0">
                Colocar V3R y V4R (ST +1,5 mm en V4R), suspender nitroglicerina y morfina, dos vías de 14–16 G con carga de cristaloides, AAS 300 mg + ticagrelor 180 mg y traslado a hemodinamia para ICP de la coronaria derecha.
              </p>
            }
          />

          <PearlBox label="Perla:">
            En todo infarto inferior, tras el ECG de 12 derivaciones, el primer acto de enfermería es registrar V3R y V4R, antes de cualquier fármaco que altere la precarga.
          </PearlBox>
        </section>
      )}

      {/* PARTE 2 HEADER */}
      {showPart2Header && (
        <div className="pt-4 pb-2 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 m-0">
            Parte 2 · Temas 20 al 30 (segundo manual)
          </h2>
        </div>
      )}

      {/* MÓDULO V */}
      {visibleModuleIds.has('m5') && (
        <section
          id="m5"
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7"
        >
          <ModuleHeader
            id="m5"
            roman="V"
            title={getMeta('m5').fullTitle}
            part={2}
            accentText={getMeta('m5').accentText}
            isCompleted={completedModules.includes('m5')}
            onToggle={onToggleComplete}
          />

          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0 mb-3">
            Tema 20 · Síndrome coronario agudo
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-5">
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4 text-sm text-slate-700 dark:text-slate-300">
              <div className="font-semibold text-blue-700 dark:text-blue-300 mb-1">SCACEST</div>
              Oclusión total o subtotal. ST elevado &gt;20 min en ≥2 derivaciones contiguas. ICP primaria &lt;120 min desde el primer contacto médico; fibrinólisis si se excede la ventana.
            </div>
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4 text-sm text-slate-700 dark:text-slate-300">
              <div className="font-semibold text-blue-700 dark:text-blue-300 mb-1">SCASEST</div>
              Oclusión incompleta: ST descendido, T invertida o angina inestable. Coronariografía: &lt;2 h (riesgo muy alto), &lt;24 h (temprana) o selectiva.
            </div>
          </div>

          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2.5">
            Complicaciones mecánicas (mortalidad extrema)
          </h4>
          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 mb-4">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="bg-blue-700 dark:bg-blue-900 text-white text-left">
                  <th className="py-2.5 px-3 font-semibold">Complicación</th>
                  <th className="py-2.5 px-3 font-semibold">Claves</th>
                  <th className="py-2.5 px-3 font-semibold">Cuadro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">Rotura de pared libre del VI</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">~1 %. &gt;65 años, mujer, primer IAM anterior, sin hipertrofia</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">Hemopericardio, taponamiento, colapso súbito</td>
                </tr>
                <tr className="bg-slate-50/70 dark:bg-slate-950/40">
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">Rotura septal (CIV aguda)</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">Shunt izquierda-derecha; bloqueo de rama en 40 %</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">Disnea brusca, soplo holosistólico nuevo, shock</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">Insuficiencia mitral aguda</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">Rotura de músculo papilar; frecuente en IAM inferior (irrigación única de la descendente posterior)</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">Edema agudo de pulmón súbito y shock</td>
                </tr>
              </tbody>
            </table>
          </div>
          <ul className="space-y-1.5 text-[15px] text-slate-700 dark:text-slate-300 list-disc pl-5 mb-6">
            <li>Monitoreo continuo: ECG de 12 derivaciones con análisis de ST, TA, PVC, gasto cardíaco y pulsioximetría.</li>
            <li>Oxígeno solo ante hipoxemia (SatO₂ &lt;90 %), control del dolor, valoración neurológica; tener listos inotrópicos, volumen o pericardiocentesis/cirugía urgente.</li>
          </ul>

          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-6 mb-2">
            Tema 21 · Post-intervencionismo estructural
          </h3>
          <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-3">
            Procedimientos percutáneos: <strong>TAVI</strong> (válvula aórtica), <strong>MitraClip</strong> (reparación mitral borde a borde), <strong>COI</strong> (cierre de orejuela izquierda) y cierre de <strong>CIA</strong>.
          </p>
          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 mb-6">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="bg-blue-700 dark:bg-blue-900 text-white text-left">
                  <th className="py-2.5 px-3 font-semibold">Complicación</th>
                  <th className="py-2.5 px-3 font-semibold">Reconocer</th>
                  <th className="py-2.5 px-3 font-semibold">Actuar / prevenir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {[
                  ['Hemorragia de la vía de acceso', 'Falla del dispositivo de cierre', 'Compresión bimanual directa'],
                  ['Pseudoaneurisma', 'Hematoma pulsátil conectado a la arteria, soplo sistólico, dolor', 'Doppler; sellado endovascular o trombina'],
                  ['Fístula arteriovenosa', 'Soplo continuo en la ingle', 'Eco Doppler, avisar a hemodinamia'],
                  ['Contraste yodado', 'Nefropatía; encefalopatía (déficit reversible en 24–72 h)', 'Hiperhidratación profiláctica'],
                  ['Intracardíacas', 'Perforación con taponamiento (guías, punción transeptal); leak paravalvular en TAVI', 'Eco urgente, vigilar hemodinamia'],
                ].map(([comp, rec, act], idx) => (
                  <tr key={comp} className={idx % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/70 dark:bg-slate-950/40'}>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">{comp}</td>
                    <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">{rec}</td>
                    <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">{act}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-6 mb-3">
            Tema 22 · Postoperatorio inmediato de cirugía cardiovascular
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-4">
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4 text-sm text-slate-700 dark:text-slate-300">
              <div className="font-semibold text-blue-700 dark:text-blue-300 mb-1">CEC</div>
              Respuesta inflamatoria sistémica por circulación extracorpórea, hemodilución, hipotermia y heparinización masiva.
            </div>
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4 text-sm text-slate-700 dark:text-slate-300">
              <div className="font-semibold text-blue-700 dark:text-blue-300 mb-1">Drenajes</div>
              Débito horario de tubos mediastínicos y pleurales.
            </div>
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4 text-sm text-slate-700 dark:text-slate-300">
              <div className="font-semibold text-blue-700 dark:text-blue-300 mb-1">Coagulopatía</div>
              Protamina (antagoniza heparina), ácido tranexámico o aminocaproico, hemocomponentes según tromboelastometría.
            </div>
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4 text-sm text-slate-700 dark:text-slate-300">
              <div className="font-semibold text-blue-700 dark:text-blue-300 mb-1">Digestivo y sedación</div>
              Vigilar peristaltismo, prevenir íleo, SNG para descomprimir, analgosedación adaptada al destete.
            </div>
          </div>

          <WarningBox title="Taponamiento postquirúrgico">
            El débito cae de golpe tras sangrado masivo, con hipotensión lábil, taquicardia, yugulares ingurgitadas y PVC alta. Indicación de reesternotomía urgente a pie de cama.
          </WarningBox>

          <CaseCard
            title="Caso: dolor inguinal 2 h después de TAVI"
            defaultHidden={hideCasesByDefault}
            scenario={
              <p className="m-0">
                Varón de 68 años, TAVI transfemoral derecha. PA 82/45, FC 118, palidez, dolor punzante en fosa ilíaca derecha y masa pulsátil dura en la ingle.
              </p>
            }
            resolution={
              <p className="m-0">
                <strong>Sospecha:</strong> hematoma retroperitoneal o pseudoaneurisma por falla del cierre. <strong>Acción:</strong> (1) compresión bimanual 1–2 cm sobre la punción, (2) suspender anticoagulantes y antiagregantes, (3) cristaloides para mantener PAS &gt;90, (4) pruebas cruzadas y angio-TC o Doppler, (5) avisar a hemodinamia para balón o trombina.
              </p>
            }
          />

          <PearlBox label="Perla:">
            El sangrado exteriorizado es falla de cicatrización hacia afuera. El pseudoaneurisma es una cavidad contenida por tejido blando, comunicada con la arteria, con flujo turbulento y riesgo de expansión.
          </PearlBox>
        </section>
      )}

      {/* MÓDULO VI */}
      {visibleModuleIds.has('m6') && (
        <section
          id="m6"
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7"
        >
          <ModuleHeader
            id="m6"
            roman="VI"
            title={getMeta('m6').fullTitle}
            part={2}
            accentText={getMeta('m6').accentText}
            isCompleted={completedModules.includes('m6')}
            onToggle={onToggleComplete}
          />

          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0 mb-3">
            Tema 23 · Síndrome aórtico agudo (SAA)
          </h3>
          <div className="space-y-2.5 mb-4">
            {[
              { label: 'Disección aórtica', pct: 80 },
              { label: 'Hematoma intramural', pct: 15 },
              { label: 'Úlcera penetrante', pct: 5 },
            ].map((item) => (
              <div key={item.label} className="grid grid-cols-1 sm:grid-cols-[200px_1fr] items-center gap-2 text-sm">
                <span className="font-mono tabular-nums text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  {item.label} · {item.pct} %
                </span>
                <div className="h-5 rounded bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full rounded bg-pink-600 dark:bg-pink-400" style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <ul className="space-y-1.5 text-[15px] text-slate-700 dark:text-slate-300 list-disc pl-5 mb-5">
            <li><strong>Disección:</strong> desgarro de la íntima, falsa luz en la media.</li>
            <li><strong>Hematoma intramural:</strong> sangrado de los vasa vasorum sin desgarro visible.</li>
            <li><strong>Úlcera aterosclerótica penetrante:</strong> placa que perfora la lámina elástica interna.</li>
          </ul>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-5">
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4 text-sm text-slate-700 dark:text-slate-300">
              <div className="font-semibold text-pink-700 dark:text-pink-300 mb-1">Stanford A · aorta Ascendente</div>
              Emergencia quirúrgica absoluta (cirugía Abierta). La mortalidad sube 1–2 % por hora de retraso en las primeras 48 h.
            </div>
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4 text-sm text-slate-700 dark:text-slate-300">
              <div className="font-semibold text-pink-700 dark:text-pink-300 mb-1">Stanford B · aorta descendente (Baja)</div>
              Distal a la subclavia izquierda. Tratamiento médico con betabloqueante; TEVAR si hay malperfusión visceral, dolor persistente o expansión.
            </div>
          </div>

          <WarningBox title="Terapia anti-impulso (dP/dt)">
            PAS 90–110 mmHg y FC &lt;60 lpm con esmolol o labetalol IV en perfusión; vasodilatador (nitroprusiato) solo después del betabloqueante; opiáceos de acción rápida. Vigilar diuresis (sonda vesical), simetría de pulsos y neurología de miembros inferiores.
          </WarningBox>

          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-6 mb-2">
            Tema 24 · Taponamiento cardíaco
          </h3>
          <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-4">
            La presión intrapericárdica supera la diastólica ventricular: se comprometen las cavidades derechas, cae el volumen sistólico y aparece shock obstructivo.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
              { top: '1', label: 'Hipotensión severa' },
              { top: '2', label: 'Ruidos apagados' },
              { top: '3', label: 'Yugulares ingurgitadas' },
              { top: '>10', label: 'mmHg: caída inspiratoria de PAS (pulso paradójico)' },
            ].map((item) => (
              <div
                key={item.top}
                className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3 text-center"
              >
                <div className="font-mono text-lg font-bold text-pink-700 dark:text-pink-300">{item.top}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{item.label}</div>
              </div>
            ))}
          </div>
          <ul className="space-y-1.5 text-[15px] text-slate-700 dark:text-slate-300 list-disc pl-5 mb-5">
            <li><strong>Rescate:</strong> pericardiocentesis ecoguiada o drenaje quirúrgico.</li>
            <li><strong>Enfermería:</strong> ECG continuo (ST elevado o extrasístoles ventriculares por contacto epicárdico), reposición agresiva de volumen antes del procedimiento y apoyo inotrópico.</li>
          </ul>

          <CaseCard
            title="Caso: Stanford B que empeora al 3.er día"
            defaultHidden={hideCasesByDefault}
            scenario={
              <p className="m-0">
                Mujer de 59 años con labetalol IV. Dolor lumbar desgarrante, paraparesia, anuria de 2 h, miembros inferiores fríos y sin pulsos femorales.
              </p>
            }
            resolution={
              <p className="m-0">
                <strong>Juicio:</strong> progresión de la disección con oclusión de arterias renales e ilíacas. <strong>Acción:</strong> alertar a cirugía vascular/hemodinamia (TEVAR de emergencia), laboratorio urgente (lactato, función renal, gasometría), dos vías de gran calibre, evitar Valsalva y ajustar analgosedación.
              </p>
            }
          />

          <PearlBox label="Mnemotecnia:">
            Stanford <strong>A</strong> = Ascendente → Abierto, cirugía urgente. Stanford <strong>B</strong> = Baja (descendente) → Betabloqueante.
          </PearlBox>
        </section>
      )}

      {/* MÓDULO VII */}
      {visibleModuleIds.has('m7') && (
        <section
          id="m7"
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7"
        >
          <ModuleHeader
            id="m7"
            roman="VII"
            title={getMeta('m7').fullTitle}
            part={2}
            accentText={getMeta('m7').accentText}
            isCompleted={completedModules.includes('m7')}
            onToggle={onToggleComplete}
          />

          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0 mb-3">
            Tema 25 · Taquiarritmias (FC &gt;100 lpm)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-4">
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4 text-sm text-slate-700 dark:text-slate-300">
              <div className="font-semibold text-emerald-700 dark:text-emerald-300 mb-1">QRS estrecho (&lt;120 ms)</div>
              Supraventriculares: taquicardia sinusal, FA, flutter, reentrada nodal, vías accesorias (WPW).
            </div>
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4 text-sm text-slate-700 dark:text-slate-300">
              <div className="font-semibold text-emerald-700 dark:text-emerald-300 mb-1">QRS ancho (&gt;120 ms)</div>
              Ventriculares: TV sostenida o no sostenida y FV. Emergencias de alto riesgo.
            </div>
          </div>

          <WarningBox title="Banderas rojas de inestabilidad hemodinámica">
            Hipotensión severa · dolor torácico isquémico · alteración aguda de conciencia · insuficiencia cardíaca aguda. Con cualquiera: <strong>cardioversión sincronizada inmediata</strong> con analgosedación previa.
          </WarningBox>

          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-6 mb-3">
            Tema 26 · Desfibrilación vs. cardioversión
          </h3>
          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 mb-3">
            <table className="w-full min-w-[580px] border-collapse text-sm">
              <thead>
                <tr className="bg-emerald-700 dark:bg-emerald-900 text-white text-left">
                  <th className="py-2.5 px-3 font-semibold">Parámetro</th>
                  <th className="py-2.5 px-3 font-semibold">Desfibrilación (DF)</th>
                  <th className="py-2.5 px-3 font-semibold">Cardioversión (CVE)</th>
                  <th className="py-2.5 px-3 font-semibold">Marcapasos transvenoso</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">Sincronización</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">Desactivada (asincrónica)</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">Activada en la onda R</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">Demanda / sincrónico</td>
                </tr>
                <tr className="bg-slate-50/70 dark:bg-slate-950/40">
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">Indicación</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">Paro: FV y TV sin pulso</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">FA, flutter, TSV, TV con pulso inestables</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">BAV sintomático, asistolia</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">Cuidados</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">150–200 J bifásico; minimizar pausas en RCP</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">Analgosedación; verificar marcas sobre R</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">Salida al doble del umbral; inmovilizar</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
            La sincronización evita descargar sobre la onda T (fenómeno R sobre T → FV).
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { val: '150–200 J', label: 'FA (escalonado)' },
              { val: '50–100 J', label: 'flutter / TSV' },
              { val: '120–150 J', label: 'TV monomórfica con pulso' },
              { val: '150–200 J', label: 'desfibrilación FV/TVSP' },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3 text-center"
              >
                <div className="font-mono tabular-nums text-base font-bold text-emerald-700 dark:text-emerald-300">{s.val}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-6 mb-2">
            Tema 27 · Bradiarritmias (FC &lt;60 lpm con repercusión)
          </h3>
          <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
            Disfunción sinusal: bradicardia severa, pausas, bloqueo sinoauricular, síndrome bradi-taqui.
          </p>
          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 mb-4">
            <table className="w-full min-w-[480px] border-collapse text-sm">
              <thead>
                <tr className="bg-emerald-700 dark:bg-emerald-900 text-white text-left">
                  <th className="py-2.5 px-3 font-semibold">Bloqueo AV</th>
                  <th className="py-2.5 px-3 font-semibold">Qué se ve</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {[
                  ['1.er grado', 'PR >0,20 s constante; todas las P conducen'],
                  ['2.º Mobitz I (Wenckebach)', 'PR se alarga hasta que una P no conduce'],
                  ['2.º Mobitz II', 'PR constante con fallo súbito de conducción; alto riesgo de bloqueo completo'],
                  ['2.º 2:1', 'Dos P por cada QRS conducido'],
                  ['3.er grado (completo)', 'Disociación AV: PP y RR regulares, PR totalmente variable'],
                ].map(([type, desc], idx) => (
                  <tr key={type} className={idx % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/70 dark:bg-slate-950/40'}>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">{type}</td>
                    <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4 text-sm text-slate-700 dark:text-slate-300 mb-6">
            <strong className="text-emerald-700 dark:text-emerald-300">Rescate:</strong> atropina IV 0,5–1 mg en bolos (máx. 3 mg). Sin respuesta: perfusión de adrenalina, dopamina o isoproterenol.
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-6 mb-3">
            Tema 28 · Marcapasos temporal
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-4">
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4 text-sm text-slate-700 dark:text-slate-300">
              <div className="font-semibold text-emerald-700 dark:text-emerald-300 mb-1">Transcutáneo (MTC)</div>
              No invasivo, de emergencia, con parches multifunción. Requiere analgosedación por el dolor de la contracción muscular.
            </div>
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4 text-sm text-slate-700 dark:text-slate-300">
              <div className="font-semibold text-emerald-700 dark:text-emerald-300 mb-1">Transvenoso (MTT)</div>
              Catéter endocárdico por yugular, subclavia o femoral, con electrodo en el ápex del VD.
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
              { top: '70–80', label: 'lpm frecuencia base' },
              { top: 'mV', label: 'sensibilidad (sensing)' },
              { top: 'mA', label: 'salida (output)' },
              { top: '×2', label: 'salida = 2 × umbral de captura' },
            ].map((item) => (
              <div
                key={item.top}
                className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3 text-center"
              >
                <div className="font-mono text-lg font-bold text-emerald-700 dark:text-emerald-300">{item.top}</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">{item.label}</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 mb-6">
            <strong>Complicaciones:</strong> neumotórax, perforación de VD con taponamiento, falla de captura o sensado por microdesplazamiento, bacteriemia.
          </p>

          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-6 mb-2.5">
            Tema 29 · Post-ablación en electrofisiología
          </h3>
          <ul className="space-y-1.5 text-[15px] text-slate-700 dark:text-slate-300 list-disc pl-5 mb-5">
            <li>Reposo supino 8–12 h sin flexionar la extremidad; vigilar hematomas externos o retroperitoneales.</li>
            <li>Derrame o taponamiento pericárdico en 2–3 % (punción transeptal o manipulación del ápex).</li>
            <li><strong>Tardía, alto riesgo:</strong> fístula aurículo-esofágica (fiebre, odinofagia, focalidad neurológica a las 2–4 semanas de una ablación de venas pulmonares).</li>
          </ul>

          <CaseCard
            title="Caso: espículas sin QRS"
            defaultHidden={hideCasesByDefault}
            scenario={
              <p className="m-0">
                Paciente de 74 años, IAM inferior con BAV completo (FC 32, PA 75/40), MTT por yugular derecha. A las 4 h pierde el conocimiento: espículas a 70 lpm sin QRS posterior.
              </p>
            }
            resolution={
              <p className="m-0">
                <strong>Falla de captura ventricular</strong> (umbral elevado por edema o isquemia, desplazamiento del cable o falla de fuente). <strong>Acción:</strong> subir la salida (mA) al máximo, decúbito lateral izquierdo, revisar conexiones, activar marcapasos transcutáneo si persiste la asistolia y avisar para recolocación fluoroscópica.
              </p>
            }
          />
        </section>
      )}

      {/* MÓDULO VIII */}
      {visibleModuleIds.has('m8') && (
        <section
          id="m8"
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7"
        >
          <ModuleHeader
            id="m8"
            roman="VIII"
            title={getMeta('m8').fullTitle}
            part={2}
            accentText={getMeta('m8').accentText}
            isCompleted={completedModules.includes('m8')}
            onToggle={onToggleComplete}
          />

          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0 mb-2.5">
            Tema 30
          </h3>
          <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-4">
            La caída de perfusión activa el SNS y el SRAA, sube la resistencia vascular y la sobrecarga hídrica; los péptidos natriuréticos (BNP/NT-proBNP) lo compensan solo en parte.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-5">
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4 text-sm text-slate-700 dark:text-slate-300">
              <div className="font-semibold text-orange-700 dark:text-orange-300 mb-1">Edema agudo de pulmón</div>
              Fallo retrógrado del VI: disnea severa, ortopnea, taquipnea, crepitantes difusos, expectoración rosada espumosa.
            </div>
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-4 text-sm text-slate-700 dark:text-slate-300">
              <div className="font-semibold text-orange-700 dark:text-orange-300 mb-1">Shock cardiogénico</div>
              Falla de bomba con hipoperfusión refractaria a volumen: PAS &lt;90, diuresis &lt;0,5 ml/kg/h, hiperlactatemia, alteración neurológica.
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 mb-4">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="bg-orange-700 dark:bg-orange-900 text-white text-left">
                  <th className="py-2.5 px-3 font-semibold">Grupo</th>
                  <th className="py-2.5 px-3 font-semibold">Fármaco / dispositivo</th>
                  <th className="py-2.5 px-3 font-semibold">Nota</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                <tr className="bg-white dark:bg-slate-900">
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">Inotrópicos</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">Dobutamina (β1, de elección) + noradrenalina si hay vasoplejía o hipotensión; levosimendán</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">Levosimendán no eleva el consumo de O₂ miocárdico</td>
                </tr>
                <tr className="bg-slate-50/70 dark:bg-slate-950/40">
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">Vasodilatadores</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">Nitroglicerina (baja precarga); nitroprusiato (baja postcarga)</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">Solo con TAM &gt;70 mmHg</td>
                </tr>
                <tr className="bg-white dark:bg-slate-900">
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">Asistencia mecánica</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">BCPIA, Impella, ECMO veno-arterial</td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">Cuando fallan los fármacos</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-[15px] text-slate-700 dark:text-slate-300 mb-5">
            <strong>Enfermería:</strong> Fowler alto (90°), CPAP/BiPAP precoz, furosemida IV en bolo, sonda vesical y línea arterial.
          </p>

          <CaseCard
            title="Caso: EAP hipertensivo"
            defaultHidden={hideCasesByDefault}
            scenario={
              <p className="m-0">
                Mujer de 72 años: disnea asfixiante, FR 38, SatO₂ 82 %, PA 185/105, FC 125, esputo rosado espumoso, crepitantes bilaterales.
              </p>
            }
            resolution={
              <p className="m-0">
                <strong>Diagnóstico:</strong> EAP cardiogénico hipertenso. <strong>Acción:</strong> cabecera a 90° con piernas en declive, CPAP 8–10 cmH₂O, furosemida IV más nitroglicerina titulada, sonda vesical para diuresis horaria.
              </p>
            }
          />

          <PearlBox label="Perla:">
            La dobutamina y los vasopresores pierden eficacia con acidemia e hipoxemia severa. Corregir el intercambio gaseoso y el pH con ventilación no invasiva es la prioridad antes de esperar respuesta farmacológica.
          </PearlBox>
        </section>
      )}
    </div>
  );
}
