import React, { useState } from 'react';
import { HelpCircle, CheckSquare, Square, Copy, Check, Apple, Heart, Plus, Sparkles } from 'lucide-react';

interface Props {
  questions: string[];
  lifestyleTips: string[];
}

export const DoctorQuestions: React.FC<Props> = ({ questions: initialQuestions, lifestyleTips }) => {
  const [questions, setQuestions] = useState<string[]>(initialQuestions);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');

  const toggleCheck = (idx: number) => {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const copyQuestions = () => {
    const formatted = questions
      .map((q, i) => `${checkedItems[i] ? '[x]' : '[ ]'} ${i + 1}. ${q}`)
      .join('\n');
    navigator.clipboard.writeText(
      `REPORT SAATHI - QUESTIONS FOR MY DOCTOR:\n\n${formatted}\n\n(Generated for educational review)`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuestion.trim()) {
      setQuestions((prev) => [...prev, newQuestion.trim()]);
      setNewQuestion('');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* Interactive Doctor Discussion Checklist */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-800 flex items-center justify-center border border-navy-100 shadow-xs">
                <HelpCircle className="w-5 h-5 text-teal-700" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg text-navy-900">
                  Doctor Consultation Checklist
                </h3>
                <p className="text-xs text-slate-500">
                  Select questions you'd like to remember during your appointment
                </p>
              </div>
            </div>

            {/* Working Copy Button */}
            <button
              onClick={copyQuestions}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                copied
                  ? 'bg-teal-50 text-teal-800 border-teal-300'
                  : 'bg-white text-navy-700 hover:text-navy-950 border-slate-200 hover:bg-slate-50 shadow-xs'
              }`}
              title="Copy formatted checklist to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-teal-600 stroke-[2.5]" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy List</span>
                </>
              )}
            </button>
          </div>

          {/* Checklist items */}
          <ul className="space-y-2.5 mt-4">
            {questions.map((q, idx) => {
              const isChecked = Boolean(checkedItems[idx]);
              return (
                <li
                  key={idx}
                  onClick={() => toggleCheck(idx)}
                  className={`flex items-start gap-3 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-teal-50/60 border-teal-200 text-teal-950'
                      : 'bg-white border-slate-200 hover:border-teal-300 text-slate-800'
                  }`}
                >
                  <button type="button" className="mt-0.5 flex-shrink-0">
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-teal-700" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  <span className={`text-xs sm:text-sm font-medium leading-relaxed ${isChecked ? 'line-through opacity-75' : ''}`}>
                    {q}
                  </span>
                </li>
              );
            })}
          </ul>

          {/* Add custom question input */}
          <form onSubmit={handleAddQuestion} className="mt-4 flex items-center gap-2">
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Add your own question for the doctor..."
              className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-slate-800"
            />
            <button
              type="submit"
              disabled={!newQuestion.trim()}
              className="px-3 py-2.5 bg-navy-900 hover:bg-navy-800 disabled:opacity-40 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </form>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
          <span>{Object.values(checkedItems).filter(Boolean).length} of {questions.length} questions checked</span>
          <span className="italic">Educational reference aid</span>
        </div>
      </div>

      {/* General Lifestyle & Dietary Context */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center border border-teal-100 shadow-xs">
              <Apple className="w-5 h-5 text-teal-700" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-navy-900">
                Educational Wellness &amp; Nutrition Guidelines
              </h3>
              <p className="text-xs text-slate-500">
                Evidence-based habits that support metabolic &amp; circulatory balance
              </p>
            </div>
          </div>

          <ul className="space-y-3 mt-4">
            {lifestyleTips.map((tip, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-teal-50/40 border border-teal-100 text-navy-950"
              >
                <div className="p-1 bg-teal-100 text-teal-800 rounded-full mt-0.5 flex-shrink-0">
                  <Heart className="w-3 h-3" />
                </div>
                <span className="text-xs sm:text-sm leading-relaxed font-medium">
                  {tip}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 leading-normal flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Reminder:</strong> Nutritional and exercise suggestions are for educational context only. Always check with your doctor before beginning new supplements or dietary programs.
          </span>
        </div>
      </div>
    </div>
  );
};
