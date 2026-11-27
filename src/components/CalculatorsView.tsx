import { useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  HeartPulse,
  Info,
  RotateCcw,
} from 'lucide-react';

type CalculatorTab = 'pam' | 'qtc' | 'ecg' | 'stevenson';

export function CalculatorsView() {
  const [activeTab, setActiveTab] = useState<CalculatorTab>('pam');

  // 1. PAM Calculator state
  const [pas, setPas] = useState<number>(185);
  const [pad, setPad] = useState<number>(115);

  const pam = useMemo(() => (pas + 2 * pad) / 3, [pas, pad]);
  const pamMinTarget = useMemo(() => pam * 0.75, [pam]);
  const pamMaxTarget = useMemo(() => pam * 0.8, [pam]);

  const pamStatus = useMemo(() => {
    if (pas >= 180 || pad >= 120) {
      return {
        tone: 'danger' as const,
        label: 'CRISIS HIPERTENSIVA (≥180/120 mmHg)',
        detail:
          'Descartar daño agudo de órgano diana. Si hay daño (Emergencia): UCI + línea arterial PAI y reducir PAM 20–25 % en la 1.ª hora. Excepción: disección aórtica (PAS 90–110 y FC <60 en 10–20 min).',
      };
    }
    if (pam < 65) {
      return {
        tone: 'danger' as const,
        label: 'HIPOPERFUSIÓN (PAM <65 mmHg)',
        detail:
          'Por debajo de la meta mínima de perfusión tisular (PAM ≥65 mmHg). Valorar shock cardiogénico (lactato, diuresis <0,5 ml/kg/h) e inicio de noradrenalina en SG5 % por vía central.',
      };
    }
    if (pas < 90) {
      return {
        tone: 'warning' as const,
        label: 'HIPOTENSIÓN SISTÓLICA (PAS <90 mmHg)',
        detail:
          'Evitar vasodilatadores (nitroglicerina requiere PAS >110 mmHg o TAM >70 mmHg). Evaluar precarga, VD (V4R si IAM inferior) y perfil de Stevenson.',
      };
    }
    if (pas >= 140 || pad >= 90) {
      return {
        tone: 'warning' as const,
        label: 'ELEVADA / HIPERTENSIÓN',
        detail:
          'Monitorizar tendencia seriada siguiendo el protocolo OMS/HEARTS. Si es candidato a rt-PA en ACV isquémico, mantener estrictamente <185/110 mmHg.',
      };
    }
    return {
      tone: 'nominal' as const,
      label: 'PERFUSIÓN NOMINAL (PAM ≥65 mmHg)',
      detail: 'Presión de perfusión sistémica dentro de rango objetivo habitual.',
    };
  }, [pas, pad, pam]);

  // 2. QTc Bazett state
  const [qtMs, setQtMs] = useState<number>(410);
  const [hrBpm, setHrBpm] = useState<number>(75);
  const [sex, setSex] = useState<'male' | 'female'>('male');

  const rrSec = useMemo(() => 60 / hrBpm, [hrBpm]);
  const qtcMs = useMemo(() => qtMs / Math.sqrt(rrSec), [qtMs, rrSec]);
  const qtcLimit = sex === 'male' ? 440 : 460;

  const qtcStatus = useMemo(() => {
    if (qtcMs > 500) {
      return {
        tone: 'danger' as const,
        label: 'ALARMA CRÍTICA (>500 ms · RIESGO TORSADES DE POINTES)',
        detail:
          'Signo de alarma crítico en UCI. Revisar potasio y magnesio séricos de inmediato y suspender fármacos prolongadores del QT (amiodarona, haloperidol, macrólidos).',
      };
    }
    if (qtcMs > qtcLimit) {
      return {
        tone: 'warning' as const,
        label: `QTc PROLONGADO (>${qtcLimit} ms)`,
        detail:
          'Supera el límite superior normal para el sexo seleccionado. Monitorizar ECG continuo y vigilar electrolitos (K⁺ y Mg²⁺).',
      };
    }
    return {
      tone: 'nominal' as const,
      label: `NOMINAL (<${qtcLimit} ms)`,
      detail: 'Intervalo QTc corregido dentro del rango fisiológico según fórmula de Bazett.',
    };
  }, [qtcMs, qtcLimit]);

  // 3. ECG Heart Rate Simulator state
  const [ecgMode, setEcgMode] = useState<'regular' | 'irregular'>('regular');
  const [rrSquares, setRrSquares] = useState<number>(4);
  const [qrsIn6s, setQrsIn6s] = useState<number>(11);

  const ecgBpm = useMemo(() => {
    if (ecgMode === 'regular') {
      return Math.round(300 / rrSquares);
    }
    return qrsIn6s * 10;
  }, [ecgMode, rrSquares, qrsIn6s]);

  const ecgClassification = useMemo(() => {
    if (ecgBpm < 60) return { tone: 'warning' as const, label: 'BRADICARDIA (<60 lpm)' };
    if (ecgBpm > 100) return { tone: 'danger' as const, label: 'TAQUICARDIA (>100 lpm)' };
    return { tone: 'nominal' as const, label: 'FRECUENCIA NORMAL (60–100 lpm)' };
  }, [ecgBpm]);

  // Dynamic SVG path for ECG strip
  const ecgStripPath = useMemo(() => {
    const width = 600;
    const baseY = 78;
    const pxPerLargeSquare = 30; // 20 squares across 600px
    const beatPositions: number[] = [];

    if (ecgMode === 'regular') {
      const step = rrSquares * pxPerLargeSquare;
      for (let x = 25; x < width - 25; x += step) {
        beatPositions.push(x);
      }
    } else {
      // Irregular R-R spacing reflecting qrsIn6s over 600px (approx visual representation)
      const count = Math.max(3, Math.min(18, Math.round((qrsIn6s * 2) / 3)));
      const avg = (width - 50) / count;
      const jitter = [0.72, 1.25, 0.85, 1.35, 0.78, 1.15, 0.9, 1.28, 0.8, 1.1];
      let x = 24;
      for (let i = 0; i < count && x < width - 25; i++) {
        beatPositions.push(x);
        x += avg * jitter[i % jitter.length];
      }
    }

    let d = `M 0 ${baseY}`;
    for (const bx of beatPositions) {
      if (ecgMode === 'regular') {
        // P wave
        d += ` L ${bx - 16} ${baseY} Q ${bx - 12} ${baseY - 9} ${bx - 8} ${baseY}`;
      } else {
        // Fibrillatory baseline f-waves
        d += ` L ${bx - 14} ${baseY - 2} L ${bx - 10} ${baseY + 2} L ${bx - 6} ${baseY}`;
      }
      // QRS complex
      d += ` L ${bx - 3} ${baseY + 5} L ${bx} ${baseY - 46} L ${bx + 4} ${baseY + 11} L ${bx + 7} ${baseY}`;
      // ST & T wave
      d += ` L ${bx + 14} ${baseY} Q ${bx + 21} ${baseY - 14} ${bx + 28} ${baseY}`;
    }
    d += ` L ${width} ${baseY}`;
    return { path: d, beatPositions };
  }, [ecgMode, rrSquares, qrsIn6s]);

  // 4. Stevenson + SCAI Diagnostic Simulator state
  const [congested, setCongested] = useState<boolean>(true);
  const [hypoperfused, setHypoperfused] = useState<boolean>(false);
  const [lactateHigh, setLactateHigh] = useState<boolean>(false);
  const [refractory, setRefractory] = useState<boolean>(false);

  const stevensonDiagnosis = useMemo(() => {
    if (!congested && !hypoperfused) {
      return {
        profile: 'Perfil A · Caliente y seco',
        scai: 'SCAI A (En riesgo / Compensado)',
        tone: 'nominal' as const,
        protocol: 'Paciente compensado sin signos de congestión ni hipoperfusión. Ajustar y optimizar terapia oral.',
      };
    }
    if (congested && !hypoperfused) {
      return {
        profile: 'Perfil B · Caliente y húmedo',
        scai: 'SCAI A–B (Edema agudo de pulmón)',
        tone: 'warning' as const,
        protocol:
          'Cabecera a 60–90° con piernas en declive, CPAP/VMNI 8–10 cmH₂O, furosemida IV lenta (máx. 4 mg/min; meta diuresis >100–150 ml/h a las 2 h) y nitroglicerina IV si PAS >110 mmHg.',
      };
    }
    if (!congested && hypoperfused) {
      return {
        profile: 'Perfil L · Frío y seco',
        scai: lactateHigh ? 'SCAI C (Hipoperfusión sin congestión)' : 'SCAI B (Pre-shock)',
        tone: 'warning' as const,
        protocol:
          'Sospechar hipovolemia o infarto de VD. Realizar reto de volumen cauto monitorizando respuesta clínica y VCI en POCUS.',
      };
    }
    return {
      profile: 'Perfil C · Frío y húmedo',
      scai: refractory ? 'SCAI D–E (Shock refractario / Extremis)' : lactateHigh ? 'SCAI C (Shock cardiogénico clásico)' : 'SCAI B–C (Pre-shock / Shock inicial)',
      tone: 'danger' as const,
      protocol:
        'Shock cardiogénico: noradrenalina en SG5 % por vía central (meta PAM ≥65 mmHg), dobutamina (2,5–15 mcg/kg/min) o levosimendán, control de lactato cada 2 h, evitar balance positivo >+1.000 ml en 36 h y preparar BCPIA / Impella / ECMO.',
    };
  }, [congested, hypoperfused, lactateHigh, refractory]);

  const toneClasses = (tone: 'nominal' | 'warning' | 'danger') => {
    if (tone === 'danger') {
      return 'border-rose-200 dark:border-rose-900 bg-rose-50/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-100';
    }
    if (tone === 'warning') {
      return 'border-amber-200 dark:border-amber-900 bg-amber-50/70 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100';
    }
    return 'border-teal-200 dark:border-teal-900 bg-teal-50/70 dark:bg-teal-950/40 text-teal-950 dark:text-teal-100';
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 mb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
              Simulación y cálculo hemodinámico · Ciclo de Kolb
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 m-0">
              Calculadoras y simuladores UCI
            </h2>
          </div>

          <div className="inline-flex flex-wrap items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs">
            {[
              { id: 'pam' as const, label: 'PAM y Crisis HTA' },
              { id: 'qtc' as const, label: 'QTc (Bazett)' },
              { id: 'ecg' as const, label: 'ECG Método 300' },
              { id: 'stevenson' as const, label: 'Stevenson y SCAI' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 1. PAM CALCULATOR */}
        {activeTab === 'pam' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
            <div className="space-y-5">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-5">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Fórmula hemodinámica</div>
                    <div className="font-mono text-sm font-semibold text-slate-800 dark:text-slate-200">
                      PAM = (PAS + 2 · PAD) ÷ 3
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500 dark:text-slate-400">Presión Arterial Media</div>
                    <div className="font-mono tabular-nums text-3xl font-bold text-teal-700 dark:text-teal-300">
                      {pam.toFixed(1)} <span className="text-sm font-normal text-slate-500">mmHg</span>
                    </div>
                  </div>
                </div>

                {/* Visual PAM range bar */}
                <div className="mb-2">
                  <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
                    <div className="absolute inset-y-0 left-0 bg-rose-500/70" style={{ width: '32%' }} />
                    <div className="absolute inset-y-0 left-[32%] bg-teal-500/70" style={{ width: '30%' }} />
                    <div className="absolute inset-y-0 left-[62%] bg-amber-500/70" style={{ width: '16%' }} />
                    <div className="absolute inset-y-0 left-[78%] bg-rose-600/80" style={{ width: '22%' }} />
                    <div
                      className="absolute top-0 bottom-0 w-1.5 bg-slate-900 dark:bg-white rounded-full transition-all"
                      style={{ left: `${Math.min(98, Math.max(2, ((pam - 30) / 140) * 100))}%` }}
                    />
                  </div>
                  <div className="flex justify-between font-mono tabular-nums text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                    <span>&lt;65 Hipoperfusión</span>
                    <span>65–105 Nominal</span>
                    <span>&gt;130 Crisis</span>
                  </div>
                </div>
              </div>

              <div className={`rounded-xl border p-4 text-sm ${toneClasses(pamStatus.tone)}`}>
                <div className="flex items-start gap-2.5">
                  {pamStatus.tone === 'nominal' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                  )}
                  <div>
                    <div className="font-bold mb-1">{pamStatus.label}</div>
                    <p className="m-0 leading-relaxed opacity-90">{pamStatus.detail}</p>
                  </div>
                </div>
              </div>

              {(pas >= 180 || pad >= 120) && (
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-4">
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Meta de emergencia hipertensiva en la 1.ª hora (descenso de PAM 20–25 %):
                  </div>
                  <div className="grid grid-cols-2 gap-3 font-mono tabular-nums">
                    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
                      <div className="text-xs text-slate-500">PAM objetivo (−20 %)</div>
                      <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        {pamMaxTarget.toFixed(0)} mmHg
                      </div>
                    </div>
                    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
                      <div className="text-xs text-slate-500">Límite inferior (−25 %)</div>
                      <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        {pamMinTarget.toFixed(0)} mmHg
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-5 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">Parámetros tensionales</span>
                <button
                  type="button"
                  onClick={() => {
                    setPas(120);
                    setPad(80);
                  }}
                  className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Normalizar</span>
                </button>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <label htmlFor="pas-slider" className="font-medium text-slate-700 dark:text-slate-300">
                    Presión Arterial Sistólica (PAS)
                  </label>
                  <span className="font-mono tabular-nums font-bold text-slate-900 dark:text-slate-100">
                    {pas} mmHg
                  </span>
                </div>
                <input
                  id="pas-slider"
                  type="range"
                  min={50}
                  max={250}
                  value={pas}
                  onChange={(e) => setPas(Number(e.target.value))}
                  className="w-full accent-teal-700 dark:accent-teal-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <label htmlFor="pad-slider" className="font-medium text-slate-700 dark:text-slate-300">
                    Presión Arterial Diastólica (PAD)
                  </label>
                  <span className="font-mono tabular-nums font-bold text-slate-900 dark:text-slate-100">
                    {pad} mmHg
                  </span>
                </div>
                <input
                  id="pad-slider"
                  type="range"
                  min={30}
                  max={160}
                  value={pad}
                  onChange={(e) => setPad(Number(e.target.value))}
                  className="w-full accent-teal-700 dark:accent-teal-400 cursor-pointer"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Escenarios clínicos del manual:</div>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPas(212);
                      setPad(118);
                    }}
                    className="text-left px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs hover:border-teal-500 cursor-pointer"
                  >
                    <strong className="text-slate-900 dark:text-slate-100">Caso Módulo II (ACV):</strong> 212/118 mmHg
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPas(74);
                      setPad(46);
                    }}
                    className="text-left px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs hover:border-teal-500 cursor-pointer"
                  >
                    <strong className="text-slate-900 dark:text-slate-100">Caso Módulo III (Shock):</strong> 74/46 mmHg
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPas(185);
                      setPad(105);
                    }}
                    className="text-left px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs hover:border-teal-500 cursor-pointer"
                  >
                    <strong className="text-slate-900 dark:text-slate-100">Caso Módulo VIII (EAP):</strong> 185/105 mmHg
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. QTc BAZETT CALCULATOR */}
        {activeTab === 'qtc' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
            <div className="space-y-5">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-5">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Fórmula de Bazett</div>
                    <div className="font-mono text-sm font-semibold text-slate-800 dark:text-slate-200">
                      QTc = QT ÷ √RR · (RR = {rrSec.toFixed(2)} s)
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500 dark:text-slate-400">Intervalo QTc</div>
                    <div className="font-mono tabular-nums text-3xl font-bold text-teal-700 dark:text-teal-300">
                      {Math.round(qtcMs)} <span className="text-sm font-normal text-slate-500">ms</span>
                    </div>
                  </div>
                </div>

                <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
                  <div className="absolute inset-y-0 left-0 bg-teal-500/70" style={{ width: '48%' }} />
                  <div className="absolute inset-y-0 left-[48%] bg-amber-500/70" style={{ width: '22%' }} />
                  <div className="absolute inset-y-0 left-[70%] bg-rose-600/80" style={{ width: '30%' }} />
                  <div
                    className="absolute top-0 bottom-0 w-1.5 bg-slate-900 dark:bg-white rounded-full transition-all"
                    style={{ left: `${Math.min(98, Math.max(2, ((qtcMs - 300) / 280) * 100))}%` }}
                  />
                </div>
                <div className="flex justify-between font-mono tabular-nums text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">
                  <span>300 ms</span>
                  <span>Límite: {qtcLimit} ms</span>
                  <span>&gt;500 ms Alarma</span>
                </div>
              </div>

              <div className={`rounded-xl border p-4 text-sm ${toneClasses(qtcStatus.tone)}`}>
                <div className="flex items-start gap-2.5">
                  {qtcStatus.tone === 'nominal' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                  )}
                  <div>
                    <div className="font-bold mb-1">{qtcStatus.label}</div>
                    <p className="m-0 leading-relaxed opacity-90">{qtcStatus.detail}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-5 space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">Medición del trazado</span>
                <div className="inline-flex p-0.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => setSex('male')}
                    className={`px-2.5 py-1 rounded-md font-medium cursor-pointer ${
                      sex === 'male'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Varón
                  </button>
                  <button
                    type="button"
                    onClick={() => setSex('female')}
                    className={`px-2.5 py-1 rounded-md font-medium cursor-pointer ${
                      sex === 'female'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    Mujer
                  </button>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <label htmlFor="qt-slider" className="font-medium text-slate-700 dark:text-slate-300">
                    Intervalo QT medido
                  </label>
                  <span className="font-mono tabular-nums font-bold text-slate-900 dark:text-slate-100">
                    {qtMs} ms ({(qtMs / 40).toFixed(1)} mm)
                  </span>
                </div>
                <input
                  id="qt-slider"
                  type="range"
                  min={260}
                  max={600}
                  step={5}
                  value={qtMs}
                  onChange={(e) => setQtMs(Number(e.target.value))}
                  className="w-full accent-teal-700 dark:accent-teal-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <label htmlFor="hr-slider" className="font-medium text-slate-700 dark:text-slate-300">
                    Frecuencia Cardíaca (FC)
                  </label>
                  <span className="font-mono tabular-nums font-bold text-slate-900 dark:text-slate-100">
                    {hrBpm} lpm
                  </span>
                </div>
                <input
                  id="hr-slider"
                  type="range"
                  min={40}
                  max={160}
                  value={hrBpm}
                  onChange={(e) => setHrBpm(Number(e.target.value))}
                  className="w-full accent-teal-700 dark:accent-teal-400 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. ECG SIMULATOR */}
        {activeTab === 'ecg' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-rose-50/30 dark:bg-slate-950 p-4 overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                  <span>25 mm/s · 10 mm/mV · {ecgMode === 'regular' ? 'Ritmo regular (Método 300)' : 'Ritmo irregular (Método 6 s)'}</span>
                  <span className="font-semibold text-teal-700 dark:text-teal-300">FC estimada: {ecgBpm} lpm</span>
                </div>
                <svg
                  viewBox="0 0 600 130"
                  className="w-full h-auto rounded-lg border border-rose-200/70 dark:border-slate-800 bg-white dark:bg-slate-950"
                  role="img"
                  aria-label="Simulador de tira de ritmo ECG"
                >
                  <defs>
                    <pattern id="ecgSmallGrid" width="6" height="6" patternUnits="userSpaceOnUse">
                      <path d="M 6 0 L 0 0 0 6" fill="none" className="stroke-rose-200/50 dark:stroke-rose-950/60" strokeWidth="0.5" />
                    </pattern>
                    <pattern id="ecgLargeGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <rect width="30" height="30" fill="url(#ecgSmallGrid)" />
                      <path d="M 30 0 L 0 0 0 30" fill="none" className="stroke-rose-300/70 dark:stroke-rose-900/70" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="600" height="130" fill="url(#ecgLargeGrid)" />
                  <path
                    d={ecgStripPath.path}
                    fill="none"
                    className="stroke-slate-900 dark:stroke-emerald-400"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  {ecgMode === 'regular' && ecgStripPath.beatPositions.length >= 2 && (
                    <g>
                      <line
                        x1={ecgStripPath.beatPositions[0]}
                        y1={20}
                        x2={ecgStripPath.beatPositions[1]}
                        y2={20}
                        className="stroke-teal-700 dark:stroke-teal-400"
                        strokeWidth="1.5"
                        strokeDasharray="3 2"
                      />
                      <text
                        x={(ecgStripPath.beatPositions[0] + ecgStripPath.beatPositions[1]) / 2}
                        y={14}
                        textAnchor="middle"
                        fontSize="10"
                        className="fill-teal-800 dark:fill-teal-300 font-mono font-semibold"
                      >
                        R-R = {rrSquares} {rrSquares === 1 ? 'cuadro' : 'cuadros'} ({(rrSquares * 0.2).toFixed(2)} s)
                      </text>
                    </g>
                  )}
                </svg>
              </div>

              <div className={`rounded-xl border p-4 text-sm flex items-center justify-between gap-4 ${toneClasses(ecgClassification.tone)}`}>
                <div className="flex items-center gap-2.5 font-semibold">
                  <HeartPulse className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{ecgClassification.label}</span>
                </div>
                <span className="font-mono tabular-nums text-lg font-bold">{ecgBpm} lpm</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-5 space-y-5">
              <div className="inline-flex w-full p-1 rounded-lg bg-slate-200/80 dark:bg-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setEcgMode('regular')}
                  className={`flex-1 py-1.5 rounded-md font-medium cursor-pointer ${
                    ecgMode === 'regular'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Ritmo regular (300)
                </button>
                <button
                  type="button"
                  onClick={() => setEcgMode('irregular')}
                  className={`flex-1 py-1.5 rounded-md font-medium cursor-pointer ${
                    ecgMode === 'irregular'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Irregular / FA (6 s)
                </button>
              </div>

              {ecgMode === 'regular' ? (
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <label htmlFor="rr-slider" className="font-medium text-slate-700 dark:text-slate-300">
                      Cuadros grandes entre R-R
                    </label>
                    <span className="font-mono tabular-nums font-bold text-slate-900 dark:text-slate-100">
                      {rrSquares} ({(rrSquares * 200).toFixed(0)} ms)
                    </span>
                  </div>
                  <input
                    id="rr-slider"
                    type="range"
                    min={1}
                    max={8}
                    step={0.5}
                    value={rrSquares}
                    onChange={(e) => setRrSquares(Number(e.target.value))}
                    className="w-full accent-teal-700 dark:accent-teal-400 cursor-pointer"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 mb-0 font-mono">
                    Fórmula: 300 ÷ {rrSquares} = {ecgBpm} lpm
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <label htmlFor="qrs6-slider" className="font-medium text-slate-700 dark:text-slate-300">
                      Complejos QRS en 30 cuadros (6 s)
                    </label>
                    <span className="font-mono tabular-nums font-bold text-slate-900 dark:text-slate-100">
                      {qrsIn6s} complejos
                    </span>
                  </div>
                  <input
                    id="qrs6-slider"
                    type="range"
                    min={3}
                    max={20}
                    value={qrsIn6s}
                    onChange={(e) => setQrsIn6s(Number(e.target.value))}
                    className="w-full accent-teal-700 dark:accent-teal-400 cursor-pointer"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 mb-0 font-mono">
                    Fórmula: {qrsIn6s} × 10 = {ecgBpm} lpm
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. STEVENSON & SCAI SIMULATOR */}
        {activeTab === 'stevenson' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
            <div className="space-y-4">
              <div className={`rounded-xl border p-5 ${toneClasses(stevensonDiagnosis.tone)}`}>
                <div className="flex items-start gap-3">
                  <Activity className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <div className="text-xs font-mono opacity-80 mb-1">{stevensonDiagnosis.scai}</div>
                    <h3 className="text-xl font-bold m-0 mb-2">{stevensonDiagnosis.profile}</h3>
                    <p className="text-sm leading-relaxed m-0 opacity-95">{stevensonDiagnosis.protocol}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-teal-700 dark:text-teal-400 shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  Recuerda: la dobutamina y los vasopresores pierden eficacia ante acidemia e hipoxemia severas. Corregir intercambio gaseoso con VNI es prioritario.
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-5 space-y-4">
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Hallazgos clínicos del paciente
              </div>

              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={congested}
                  onChange={(e) => setCongested(e.target.checked)}
                  className="mt-1 accent-teal-700"
                />
                <div className="text-xs">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">Signos de congestión (Húmedo)</div>
                  <div className="text-slate-500 dark:text-slate-400">Ortopnea, crepitantes, VCI &gt;21 mm, ingurgitación yugular</div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hypoperfused}
                  onChange={(e) => setHypoperfused(e.target.checked)}
                  className="mt-1 accent-teal-700"
                />
                <div className="text-xs">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">Signos de hipoperfusión (Frío)</div>
                  <div className="text-slate-500 dark:text-slate-400">Livedo, extremidades frías, llenado capilar &gt;3 s, letargia</div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={lactateHigh}
                  onChange={(e) => setLactateHigh(e.target.checked)}
                  className="mt-1 accent-teal-700"
                />
                <div className="text-xs">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">Hipoperfusión bioquímica</div>
                  <div className="text-slate-500 dark:text-slate-400">Lactato &gt;2 mmol/L o diuresis &lt;0,5 ml/kg/h</div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={refractory}
                  onChange={(e) => setRefractory(e.target.checked)}
                  className="mt-1 accent-teal-700"
                />
                <div className="text-xs">
                  <div className="font-semibold text-slate-900 dark:text-slate-100">Deterioro refractario</div>
                  <div className="text-slate-500 dark:text-slate-400">Sin respuesta a soporte inicial / requerimiento de asistencia mecánica</div>
                </div>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
