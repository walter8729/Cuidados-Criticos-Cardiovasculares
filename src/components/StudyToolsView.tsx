import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Shuffle,
  XCircle,
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/quiz';
import { GLOSSARY_ENTRIES } from '../data/glossary';
import { MODULES_META } from '../data/modulesMeta';

interface StudyToolsViewProps {
  masteredTerms: string[];
  onToggleMastered: (id: string) => void;
}

export function StudyToolsView({ masteredTerms, onToggleMastered }: StudyToolsViewProps) {
  const [mode, setMode] = useState<'quiz' | 'flashcards'>('quiz');

  // Quiz state
  const [moduleFilter, setModuleFilter] = useState<string>('all');
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const filteredQuestions = useMemo(() => {
    if (moduleFilter === 'all') return QUIZ_QUESTIONS;
    return QUIZ_QUESTIONS.filter((q) => q.moduleId === moduleFilter);
  }, [moduleFilter]);

  const answeredCount = filteredQuestions.filter((q) => answers[q.id] !== undefined).length;
  const correctCount = filteredQuestions.filter((q) => answers[q.id] === q.correctIndex).length;

  // Flashcards state
  const [cardOrder, setCardOrder] = useState<string[]>(() => GLOSSARY_ENTRIES.map((g) => g.id));
  const [cardIndex, setCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [onlyPendingCards, setOnlyPendingCards] = useState<boolean>(false);

  const activeDeck = useMemo(() => {
    const map = new Map(GLOSSARY_ENTRIES.map((g) => [g.id, g]));
    const ordered = cardOrder.map((id) => map.get(id)!).filter(Boolean);
    if (!onlyPendingCards) return ordered;
    return ordered.filter((g) => !masteredTerms.includes(g.id));
  }, [cardOrder, onlyPendingCards, masteredTerms]);

  const safeIndex = activeDeck.length > 0 ? Math.min(cardIndex, activeDeck.length - 1) : 0;
  const currentCard = activeDeck[safeIndex];

  const handleShuffle = () => {
    const next = [...cardOrder];
    for (let i = next.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [next[i], next[j]] = [next[j], next[i]];
    }
    setCardOrder(next);
    setCardIndex(0);
    setIsFlipped(false);
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 mb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            Consolidación cognitiva · {QUIZ_QUESTIONS.length} preguntas · {GLOSSARY_ENTRIES.length} tarjetas
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 m-0">
            Autoevaluación clínica
          </h2>
        </div>

        <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs self-start">
          <button
            type="button"
            onClick={() => setMode('quiz')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
              mode === 'quiz'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Cuestionario ({QUIZ_QUESTIONS.length})
          </button>
          <button
            type="button"
            onClick={() => setMode('flashcards')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer whitespace-nowrap ${
              mode === 'flashcards'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Tarjetas de memoria ({masteredTerms.length}/{GLOSSARY_ENTRIES.length})
          </button>
        </div>
      </div>

      {mode === 'quiz' ? (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-3.5">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <label htmlFor="quiz-module-filter" className="text-slate-600 dark:text-slate-400 font-medium">
                Filtrar por módulo:
              </label>
              <select
                id="quiz-module-filter"
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
                className="rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                <option value="all">Todos los módulos (I–VIII)</option>
                {MODULES_META.map((m) => (
                  <option key={m.id} value={m.id}>
                    Módulo {m.roman} · {m.shortTitle}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono tabular-nums">
              <span className="text-slate-600 dark:text-slate-400">
                Respondidas: <strong className="text-slate-900 dark:text-slate-100">{answeredCount}/{filteredQuestions.length}</strong>
              </span>
              <span className="text-teal-700 dark:text-teal-300">
                Aciertos: <strong>{correctCount}</strong>
              </span>
              {answeredCount > 0 && (
                <button
                  type="button"
                  onClick={() => setAnswers({})}
                  className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 font-sans cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Reiniciar</span>
                </button>
              )}
            </div>
          </div>

          <div className="space-y-5">
            {filteredQuestions.map((q, index) => {
              const selected = answers[q.id];
              const hasAnswered = selected !== undefined;
              const isCorrect = selected === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/40 p-5"
                >
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                    Pregunta {index + 1} · {q.moduleLabel}
                  </div>
                  <p className="text-[15px] font-semibold text-slate-900 dark:text-slate-100 mb-3.5 mt-0">
                    {q.question}
                  </p>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isThisSelected = selected === optIdx;
                      const isThisCorrect = optIdx === q.correctIndex;

                      let btnStyle =
                        'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:border-teal-500';
                      if (hasAnswered) {
                        if (isThisCorrect) {
                          btnStyle =
                            'border-teal-600 bg-teal-50 dark:bg-teal-950/70 text-teal-950 dark:text-teal-100 font-medium';
                        } else if (isThisSelected) {
                          btnStyle =
                            'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-950 dark:text-rose-100';
                        } else {
                          btnStyle =
                            'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/50 text-slate-500 dark:text-slate-500';
                        }
                      }

                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                          className={`w-full text-left px-3.5 py-2.5 rounded-lg border text-sm transition-colors flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {hasAnswered && isThisCorrect && (
                            <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" aria-hidden="true" />
                          )}
                          {hasAnswered && isThisSelected && !isThisCorrect && (
                            <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" aria-hidden="true" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {hasAnswered && (
                    <div
                      className={`mt-3.5 rounded-lg border p-3.5 text-sm ${
                        isCorrect
                          ? 'border-teal-200 dark:border-teal-900 bg-teal-50/70 dark:bg-teal-950/40 text-teal-950 dark:text-teal-100'
                          : 'border-amber-200 dark:border-amber-900 bg-amber-50/70 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100'
                      }`}
                    >
                      <strong>{isCorrect ? 'Correcto: ' : 'Revisión clínica: '}</strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-3.5">
            <div className="flex items-center gap-3 text-xs">
              <label className="inline-flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyPendingCards}
                  onChange={(e) => {
                    setOnlyPendingCards(e.target.checked);
                    setCardIndex(0);
                    setIsFlipped(false);
                  }}
                  className="accent-teal-700"
                />
                <span>Solo términos pendientes</span>
              </label>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="font-mono tabular-nums text-slate-600 dark:text-slate-400">
                Dominados: <strong className="text-teal-700 dark:text-teal-300">{masteredTerms.length}/{GLOSSARY_ENTRIES.length}</strong>
              </span>
              <button
                type="button"
                onClick={handleShuffle}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <Shuffle className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Barajar</span>
              </button>
            </div>
          </div>

          {!currentCard ? (
            <div className="rounded-xl border border-teal-200 dark:border-teal-900 bg-teal-50/60 dark:bg-teal-950/40 p-8 text-center">
              <p className="text-base font-bold text-teal-950 dark:text-teal-100 mb-2">
                ¡Has marcado los {GLOSSARY_ENTRIES.length} términos del glosario como dominados!
              </p>
              <button
                type="button"
                onClick={() => setOnlyPendingCards(false)}
                className="px-4 py-2 text-xs font-medium rounded-lg bg-teal-700 hover:bg-teal-800 text-white cursor-pointer"
              >
                Ver todas las tarjetas de nuevo
              </button>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                <span>
                  Tarjeta {safeIndex + 1} de {activeDeck.length} · Parte {currentCard.part}
                </span>
                <span>{masteredTerms.includes(currentCard.id) ? 'Estado: Dominado' : 'Estado: En repaso'}</span>
              </div>

              <button
                type="button"
                onClick={() => setIsFlipped((prev) => !prev)}
                className="w-full min-h-[220px] rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-950/70 p-8 text-center flex flex-col items-center justify-center gap-3 hover:border-teal-500 transition-colors cursor-pointer"
              >
                <span className="text-xs font-mono text-teal-700 dark:text-teal-400">
                  {isFlipped ? 'Definición clínica' : 'Término (clic para voltear)'}
                </span>
                {isFlipped ? (
                  <p className="text-base sm:text-lg leading-relaxed text-slate-800 dark:text-slate-100 m-0 max-w-xl">
                    {currentCard.definition}
                  </p>
                ) : (
                  <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 m-0">
                    {currentCard.term}
                  </p>
                )}
              </button>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setCardIndex((prev) => (prev - 1 + activeDeck.length) % activeDeck.length);
                    setIsFlipped(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                  <span>Anterior</span>
                </button>

                <button
                  type="button"
                  onClick={() => onToggleMastered(currentCard.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                    masteredTerms.includes(currentCard.id)
                      ? 'border-teal-600 bg-teal-700 text-white'
                      : 'border-teal-600/40 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 hover:bg-teal-100 dark:hover:bg-teal-900/60'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                  <span>
                    {masteredTerms.includes(currentCard.id) ? 'Marcado como dominado' : 'Marcar como dominado'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCardIndex((prev) => (prev + 1) % activeDeck.length);
                    setIsFlipped(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                >
                  <span>Siguiente</span>
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
