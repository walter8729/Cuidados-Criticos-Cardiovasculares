import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { GLOSSARY_ENTRIES } from '../data/glossary';

export function GlossaryView() {
  const [query, setQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string>('ALL');
  const [sortOrder, setSortOrder] = useState<'alpha' | 'manual'>('alpha');

  const sortedEntries = useMemo(() => {
    const base = [...GLOSSARY_ENTRIES];
    if (sortOrder === 'alpha') {
      base.sort((a, b) => a.term.localeCompare(b.term, 'es', { sensitivity: 'base' }));
    }
    return base;
  }, [sortOrder]);

  const availableLetters = useMemo(() => {
    const letters = new Set<string>();
    for (const item of GLOSSARY_ENTRIES) {
      const first = item.term
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .charAt(0)
        .toUpperCase();
      letters.add(first);
    }
    return Array.from(letters).sort((a, b) => a.localeCompare(b, 'es'));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sortedEntries.filter((entry) => {
      if (selectedLetter !== 'ALL') {
        const first = entry.term
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .charAt(0)
          .toUpperCase();
        if (first !== selectedLetter) return false;
      }
      if (!q) return true;
      return (
        entry.term.toLowerCase().includes(q) ||
        entry.definition.toLowerCase().includes(q)
      );
    });
  }, [sortedEntries, query, selectedLetter]);

  return (
    <section
      id="glos"
      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7"
    >
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 mb-5 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            Referencia rápida · {GLOSSARY_ENTRIES.length} términos clínicos
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 m-0">
            Glosario terminológico
          </h2>
        </div>
        <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs self-start">
          <button
            type="button"
            onClick={() => setSortOrder('alpha')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
              sortOrder === 'alpha'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Orden A–Z
          </button>
          <button
            type="button"
            onClick={() => setSortOrder('manual')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
              sortOrder === 'manual'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Orden del manual
          </button>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search
            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filtrar términos o definiciones (ej. Bazett, PVC, taponamiento, Beck...)"
            aria-label="Buscar en el glosario"
            className="w-full pl-10 pr-10 py-2.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 dark:focus:ring-teal-400"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Limpiar búsqueda"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filtrar por letra inicial">
          <button
            type="button"
            onClick={() => setSelectedLetter('ALL')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              selectedLetter === 'ALL'
                ? 'bg-teal-700 text-white dark:bg-teal-600'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Todas
          </button>
          {availableLetters.map((letter) => (
            <button
              key={letter}
              type="button"
              onClick={() => setSelectedLetter(letter)}
              className={`w-7 h-7 text-xs font-mono font-medium rounded-md transition-colors cursor-pointer ${
                selectedLetter === letter
                  ? 'bg-teal-700 text-white dark:bg-teal-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 p-8 text-center">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-3">
            No se encontraron términos que coincidan con el filtro actual.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSelectedLetter('ALL');
            }}
            className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-teal-700 hover:bg-teal-800 text-white transition-colors cursor-pointer"
          >
            Restablecer filtros
          </button>
        </div>
      ) : (
        <dl className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 m-0">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/50 p-4 flex flex-col justify-between"
            >
              <div>
                <dt className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1.5">
                  {item.term}
                </dt>
                <dd className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 m-0">
                  {item.definition}
                </dd>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200/70 dark:border-slate-800/70 text-[11px] text-slate-400 dark:text-slate-500">
                Parte {item.part}
              </div>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
