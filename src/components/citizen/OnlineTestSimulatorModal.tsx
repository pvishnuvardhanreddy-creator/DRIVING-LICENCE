import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, X, Sparkles, HelpCircle, ArrowRight, RotateCcw } from 'lucide-react';

interface OnlineTestSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTestPassed?: (score: number) => void;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const sampleQuestions: Question[] = [
  {
    id: 1,
    question: 'What does a red triangular traffic sign with an exclamation mark signify?',
    options: ['General Danger Ahead / Caution', 'Stop Immediately', 'No Overtaking', 'Hospital Ahead'],
    correctIndex: 0,
    explanation: 'A red triangular sign with an exclamation mark indicates general caution for unexpected road hazards ahead.',
  },
  {
    id: 2,
    question: 'While driving on a multi-lane highway, which lane is strictly meant for overtaking?',
    options: ['Middle Lane', 'Extreme Right Lane', 'Extreme Left Lane', 'Shoulder Lane'],
    correctIndex: 1,
    explanation: 'The extreme right lane is reserved for overtaking on Indian roads (right-hand drive system).',
  },
  {
    id: 3,
    question: 'What is the minimum legal age for applying for a Light Motor Vehicle (LMV) driving license in India?',
    options: ['16 Years', '18 Years', '21 Years', '25 Years'],
    correctIndex: 1,
    explanation: 'Under the Motor Vehicles Act, 18 years is the minimum age for a non-commercial LMV license.',
  },
  {
    id: 4,
    question: 'What should you do when approaching an uncontrolled pedestrian zebra crossing?',
    options: ['Honk loudly and speed up', 'Slow down and yield right-of-way to pedestrians', 'Flash high beams and proceed', 'Stop only if a traffic officer signals'],
    correctIndex: 1,
    explanation: 'Pedestrians have absolute right-of-way on zebra crossings.',
  },
  {
    id: 5,
    question: 'What does a solid continuous white line in the middle of a two-way road mean?',
    options: ['You are allowed to overtake freely', 'No changing lanes or straddling the line', 'Parking is allowed on the line', 'Speed limit is 80 km/h'],
    correctIndex: 1,
    explanation: 'Solid continuous white lines prohibit lane changing and overtaking.',
  },
];

export const OnlineTestSimulatorModal: React.FC<OnlineTestSimulatorModalProps> = ({
  isOpen,
  onClose,
  onTestPassed,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const currentQ = sampleQuestions[currentIndex];

  const handleSelectOption = (optIdx: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: optIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    sampleQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score += 2; // 2 marks per question = max 10
      }
    });
    return score;
  };

  const handleFinishTest = () => {
    setSubmitted(true);
    const score = calculateScore();
    if (score >= 6 && onTestPassed) {
      onTestPassed(score);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setSubmitted(false);
  };

  const score = calculateScore();
  const passed = score >= 6;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-gray-200 overflow-hidden text-gray-900 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0A4D8C] to-blue-900 text-white p-4 flex justify-between items-center border-b border-blue-950">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-300" />
            <h2 className="font-bold text-base">RTO Computerized Learner Test Simulator</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-blue-800 rounded-lg transition">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-5 space-y-5 text-xs">
          {!submitted ? (
            <>
              {/* Question Progress */}
              <div className="flex items-center justify-between bg-blue-50 p-3 rounded-xl border border-blue-100 font-bold text-blue-900">
                <span>Question {currentIndex + 1} of {sampleQuestions.length}</span>
                <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded text-[11px]">
                  Passing Score: 6 / 10 Marks
                </span>
              </div>

              {/* Current Question */}
              <div className="space-y-3">
                <div className="text-sm font-bold text-gray-900 leading-snug">
                  {currentQ.id}. {currentQ.question}
                </div>

                <div className="space-y-2">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedAnswers[currentQ.id] === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        className={`w-full text-left p-3 rounded-xl text-xs font-semibold transition flex items-center gap-3 border ${
                          isSelected
                            ? 'bg-[#0A4D8C] text-white border-[#0A4D8C] shadow-md'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-800 border-gray-200'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                            isSelected ? 'bg-amber-300 text-slate-950' : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <button
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 text-gray-700 font-bold rounded-xl transition"
                >
                  Previous
                </button>

                {currentIndex < sampleQuestions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIndex((prev) => prev + 1)}
                    className="px-5 py-2 bg-[#0A4D8C] hover:bg-blue-800 text-white font-bold rounded-xl shadow transition"
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    onClick={handleFinishTest}
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition flex items-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Submit Exam</span>
                  </button>
                )}
              </div>
            </>
          ) : (
            /* Results View */
            <div className="space-y-4 text-center py-2">
              {passed ? (
                <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="text-lg font-bold text-emerald-950">CONGRATULATIONS! TEST PASSED</h3>
                  <div className="text-2xl font-extrabold text-emerald-700">Score: {score} / 10 Marks</div>
                  <p className="text-gray-600 text-xs max-w-md mx-auto">
                    You have successfully cleared the official RTO Traffic Rules Computer Test. Your provisional Learner License clearance code has been appended to your application.
                  </p>
                  <div className="bg-white p-3 rounded-xl border border-emerald-200 font-mono text-emerald-900 font-bold text-xs inline-block">
                    Clearance Token: RTO-PASS-2026-90812
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 p-6 rounded-2xl space-y-3">
                  <XCircle className="w-12 h-12 text-red-600 mx-auto" />
                  <h3 className="text-lg font-bold text-red-950">TEST NOT CLEARED</h3>
                  <div className="text-2xl font-extrabold text-red-700">Score: {score} / 10 Marks</div>
                  <p className="text-gray-600 text-xs max-w-md mx-auto">
                    Minimum required score is 6 marks (60%). Please review traffic sign rules and re-attempt the online test.
                  </p>
                </div>
              )}

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Practice Test</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 bg-[#0A4D8C] text-white font-bold rounded-xl shadow transition"
                >
                  Close Window
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
