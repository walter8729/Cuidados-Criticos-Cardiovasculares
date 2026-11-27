import { useEffect, useMemo, useState } from 'react';
import {
  ArrowUp,
  CheckCircle2,
  Circle,
  Eye,
  EyeOff,
  Menu,
  Moon,
  Printer,
  Search,
  Sun,
  X,
} from 'lucide-react';
import { MODULES_META } from './data/modulesMeta';
import { ModuleContent } from './components/ModuleContent';
import { CalculatorsView } from './components/CalculatorsView';
import { StudyToolsView } from './components/StudyToolsView';
import { GlossaryView } from './components/GlossaryView';

type ActiveView = 'manual' | 'calculators' | 'study' | 'glossary';

const STORAGE_THEME = 'ccc_theme';
const STORAGE_COMPLETED = 'ccc_completed_modules';
const STORAGE_MASTERED = 'ccc_mastered_terms';

function getInitialTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(STORAGE_THEME);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function loadStringArray(key: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);
  const [activeView, setActiveView] = useState<ActiveView>('manual');
  const [partFilter, setPartFilter] = useState<'all' | 1 | 2>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hideCasesByDefault, setHideCasesByDefault] = useState<boolean>(false);
  const [completedModules, setCompletedModules] = useState<string[]>(() =>
    loadStringArray(STORAGE_COMPLETED)
  );
  const [masteredTerms, setMasteredTerms] = useState<string[]>(() =>
    loadStringArray(STORAGE_MASTERED)
  );
  const [activeModuleId, setActiveModuleId] = useState<string>('m1');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  // Apply light/dark theme to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
    window.localStorage.setItem(STORAGE_THEME, theme);
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_COMPLETED, JSON.stringify(completedModules));
  }, [completedModules]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_MASTERED, JSON.stringify(masteredTerms));
  }, [masteredTerms]);

  // Track active module on scroll + back-to-top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 420);
      if (activeView !== 'manual') return;
      const offset = 130;
      let current = 'm1';
      for (const m of MODULES_META) {
        const el = document.getElementById(m.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= offset) {
            current = m.id;
          }
        }
      }
      setActiveModuleId(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeView]);

  const toggleModuleComplete = (id: string) => {
    setCompletedModules((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleMasteredTerm = (id: string) => {
    setMasteredTerms((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const navigateToModule = (moduleId: string) => {
    setActiveModuleId(moduleId);
    setPartFilter('all');
    setSearchQuery('');
    setMobileMenuOpen(false);
    if (activeView !== 'manual') {
      setActiveView('manual');
      setTimeout(() => {
        const el = document.getElementById(moduleId);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    } else {
      const el = document.getElementById(moduleId);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const switchView = (view: ActiveView) => {
    setActiveView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const progressPct = useMemo(
    () => Math.round((completedModules.length / MODULES_META.length) * 100),
    [completedModules.length]
  );

  const part1Modules = MODULES_META.filter((m) => m.part === 1);
  const part2Modules = MODULES_META.filter((m) => m.part === 2);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Strict 3-zone Top Bar Contract */}
      <header className="sticky top-0 z-40 h-14 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1320px] mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Abrir índice de módulos"
              className="lg:hidden p-1.5 -ml-1.5 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                switchView('manual');
              }}
              className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0 no-underline"
            >
              Cuidados Críticos CV
            </a>
          </div>

          {/* Zone 2: 4 clean single-line text navigation links */}
          <nav
            aria-label="Navegación principal"
            className="hidden md:flex items-center gap-7 text-sm font-medium"
          >
            {(
              [
                { id: 'manual', label: 'Manual' },
                { id: 'calculators', label: 'Calculadoras' },
                { id: 'study', label: 'Autoevaluación' },
                { id: 'glossary', label: 'Glosario' },
              ] as const
            ).map((item) => {
              const active = activeView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => switchView(item.id)}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer border-b-2 ${
                    active
                      ? 'border-teal-700 dark:border-teal-400 text-teal-800 dark:text-teal-300 font-semibold'
                      : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
              aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Modo claro</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Modo oscuro</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-14 bottom-0 z-30 bg-white dark:bg-slate-900 overflow-y-auto p-5 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-6">
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                Secciones
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { id: 'manual', label: 'Manual completo' },
                    { id: 'calculators', label: 'Calculadoras UCI' },
                    { id: 'study', label: 'Autoevaluación' },
                    { id: 'glossary', label: 'Glosario (51)' },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => switchView(item.id)}
                    className={`px-3 py-2.5 text-left text-sm font-medium rounded-lg border cursor-pointer ${
                      activeView === item.id
                        ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/60 text-teal-900 dark:text-teal-200'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                Índice de módulos ({completedModules.length}/8 estudiados)
              </div>
              <div className="space-y-1">
                {MODULES_META.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => navigateToModule(m.id)}
                    className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer"
                  >
                    <span>
                      <strong className="font-mono mr-2">{m.roman}.</strong>
                      {m.shortTitle}
                    </span>
                    {completedModules.includes(m.id) ? (
                      <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300 dark:text-slate-700 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main workspace container */}
      <div
        id="top"
        className="flex-1 max-w-[1320px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-[272px_minmax(0,1fr)] gap-8 items-start"
      >
        {/* Desktop Sticky Sidebar */}
        <aside className="hidden lg:block sticky top-20 space-y-5">
          {/* Progress card */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Progreso de estudio</span>
              <span className="font-mono tabular-nums text-teal-700 dark:text-teal-300 font-semibold">
                {completedModules.length}/8 ({progressPct} %)
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-teal-600 dark:bg-teal-400 transition-all duration-200"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Module index */}
          <nav
            aria-label="Índice de módulos"
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 space-y-4"
          >
            <div>
              <div className="px-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Parte 1 · Ponencias Dra. Madrazo
              </div>
              <ul className="space-y-0.5 list-none p-0 m-0">
                {part1Modules.map((m) => {
                  const isActive = activeView === 'manual' && activeModuleId === m.id;
                  const isDone = completedModules.includes(m.id);
                  return (
                    <li key={m.id}>
                      <button
                        type="button"
                        onClick={() => navigateToModule(m.id)}
                        className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 text-left text-sm rounded-lg transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-900 dark:text-teal-200 font-semibold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                        }`}
                      >
                        <span className="truncate">
                          <span className="font-mono text-xs text-slate-400 dark:text-slate-500 mr-2">
                            {m.roman}
                          </span>
                          {m.shortTitle}
                        </span>
                        {isDone && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="px-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                Parte 2 · Temas 20 al 30
              </div>
              <ul className="space-y-0.5 list-none p-0 m-0">
                {part2Modules.map((m) => {
                  const isActive = activeView === 'manual' && activeModuleId === m.id;
                  const isDone = completedModules.includes(m.id);
                  return (
                    <li key={m.id}>
                      <button
                        type="button"
                        onClick={() => navigateToModule(m.id)}
                        className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 text-left text-sm rounded-lg transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-900 dark:text-teal-200 font-semibold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                        }`}
                      >
                        <span className="truncate">
                          <span className="font-mono text-xs text-slate-400 dark:text-slate-500 mr-2">
                            {m.roman}
                          </span>
                          {m.shortTitle}
                        </span>
                        {isDone && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
              <button
                type="button"
                onClick={() => switchView('glossary')}
                className={`w-full flex items-center justify-between px-2.5 py-2 text-left text-sm rounded-lg transition-colors cursor-pointer ${
                  activeView === 'glossary'
                    ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-900 dark:text-teal-200 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                }`}
              >
                <span>Glosario terminológico</span>
                <span className="font-mono text-xs text-slate-400">51</span>
              </button>
              <button
                type="button"
                onClick={() => switchView('calculators')}
                className={`w-full flex items-center justify-between px-2.5 py-2 text-left text-sm rounded-lg transition-colors cursor-pointer ${
                  activeView === 'calculators'
                    ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-900 dark:text-teal-200 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                }`}
              >
                <span>Calculadoras UCI</span>
                <span className="font-mono text-xs text-slate-400">4</span>
              </button>
              <button
                type="button"
                onClick={() => switchView('study')}
                className={`w-full flex items-center justify-between px-2.5 py-2 text-left text-sm rounded-lg transition-colors cursor-pointer ${
                  activeView === 'study'
                    ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-900 dark:text-teal-200 font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70'
                }`}
              >
                <span>Autoevaluación</span>
                <span className="font-mono text-xs text-slate-400">16</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main content column */}
        <main className="min-w-0 space-y-6">
          {/* Mobile quick tabs */}
          <div className="flex md:hidden items-center gap-1 p-1 rounded-lg bg-slate-200/70 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-x-auto no-print">
            {(
              [
                { id: 'manual', label: 'Manual' },
                { id: 'calculators', label: 'Calculadoras' },
                { id: 'study', label: 'Autoevaluación' },
                { id: 'glossary', label: 'Glosario' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => switchView(item.id)}
                className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeView === item.id
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Editorial Title Block */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>Unidad de Cuidados Intensivos Cardiovasculares</span>
              <span aria-hidden="true">·</span>
              <span>8 módulos clínicos</span>
              <span aria-hidden="true">·</span>
              <span>51 términos en glosario</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 m-0">
              Cuidados Críticos Cardiovasculares
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl m-0">
              Guía de estudio basada en las ponencias de la Dra. Alicia Carolina Madrazo Garcete · Ciclo de Kolb: concepto, simulación, observación, consolidación.
            </p>
          </div>

          {/* Manual Toolbar (only in Manual view) */}
          {activeView === 'manual' && (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 flex flex-col xl:flex-row xl:items-center justify-between gap-3 no-print">
              <div className="relative flex-1 min-w-[220px]">
                <Search
                  className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar módulo, fármaco, escala o signo (ej. QTc, labetalol, V4R, TAVI...)"
                  aria-label="Buscar en el manual"
                  className="w-full pl-9 pr-9 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Limpiar búsqueda"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs">
                  {(
                    [
                      { key: 'all', label: 'Todos (I–VIII)' },
                      { key: 1, label: 'Parte 1 (I–IV)' },
                      { key: 2, label: 'Parte 2 (V–VIII)' },
                    ] as const
                  ).map((opt) => (
                    <button
                      key={String(opt.key)}
                      type="button"
                      onClick={() => setPartFilter(opt.key)}
                      className={`px-2.5 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        partFilter === opt.key
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setHideCasesByDefault((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  {hideCasesByDefault ? (
                    <>
                      <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Mostrar casos</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Modo autoevaluar casos</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Imprimir</span>
                </button>
              </div>
            </div>
          )}

          {/* Active view content */}
          {activeView === 'manual' && (
            <ModuleContent
              partFilter={partFilter}
              searchQuery={searchQuery}
              completedModules={completedModules}
              onToggleComplete={toggleModuleComplete}
              hideCasesByDefault={hideCasesByDefault}
              onResetFilters={() => {
                setPartFilter('all');
                setSearchQuery('');
              }}
            />
          )}

          {activeView === 'calculators' && <CalculatorsView />}

          {activeView === 'study' && (
            <StudyToolsView
              masteredTerms={masteredTerms}
              onToggleMastered={toggleMasteredTerm}
            />
          )}

          {activeView === 'glossary' && <GlossaryView />}

          <footer className="pt-6 pb-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
            <p className="m-0">
              Material de estudio; verificar dosis con protocolos vigentes de la institución.
            </p>
            <p className="m-0">
              Ciclo de Kolb · Ponencias Dra. Alicia Carolina Madrazo Garcete
            </p>
          </footer>
        </main>
      </div>

      {/* Scroll to top button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Volver arriba"
          className="no-print fixed bottom-5 right-5 z-30 w-10 h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
