
import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, ArrowRight, Award, HelpCircle } from 'lucide-react';
import { Lesson } from '../../types';

interface QuizModalProps {
    isOpen: boolean;
    onClose: () => void;
    lesson: Lesson;
    onComplete: (success: boolean) => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose, lesson, onComplete }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<{ [key: number]: number }>({}); // qIndex -> optionIndex
    const [showResult, setShowResult] = useState(false);

    // Reset when modal opens
    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(0);
            setAnswers({});
            setShowResult(false);
        }
    }, [isOpen, lesson]);

    if (!isOpen || !lesson.questions || lesson.questions.length === 0) return null;

    const currentQuestion = lesson.questions[currentIndex];
    const totalQuestions = lesson.questions.length;
    const currentSelected = answers[currentIndex];

    const handleOptionSelect = (optionIdx: number) => {
        setAnswers({ ...answers, [currentIndex]: optionIdx });
    };

    const handleNext = () => {
        if (currentIndex < totalQuestions - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setShowResult(true);
        }
    };

    const calculateScore = () => {
        let correct = 0;
        lesson.questions?.forEach((q, idx) => {
            if (answers[idx] === q.correctOptionIndex) correct++;
        });
        return correct;
    };

    const score = calculateScore();
    const minScore = lesson.minScore || Math.ceil(totalQuestions * 0.7);
    const passed = score >= minScore;

    if (showResult) {
        return (
            <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden text-center relative animate-in zoom-in-95 duration-300">
                    <div className={`h-32 flex items-center justify-center relative overflow-hidden ${passed ? 'bg-green-500' : 'bg-red-500'}`}>
                        <div className="absolute inset-0 bg-white/10 pattern-dots opacity-30"></div>
                        {passed ? (
                            <Award size={64} className="text-white drop-shadow-lg scale-110" />
                        ) : (
                            <AlertTriangle size={64} className="text-white drop-shadow-lg scale-110" />
                        )}
                    </div>

                    <div className="p-8">
                        <h2 className={`text-2xl font-bold mb-2 ${passed ? 'text-green-600' : 'text-red-600'}`}>
                            {passed ? 'Parabéns!' : 'Não foi dessa vez'}
                        </h2>
                        <p className="text-gray-500 mb-6">
                            Você acertou <strong className="text-gray-900">{score}</strong> de <strong className="text-gray-900">{totalQuestions}</strong> questões.
                            {!passed && (
                                <>
                                    <br />
                                    <span>O mínimo para aprovação é {minScore}.</span>
                                </>
                            )}
                        </p>

                        <button
                            onClick={() => onComplete(passed)}
                            className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95 flex items-center justify-center
                                ${passed ? 'bg-green-600 hover:bg-green-500' : 'bg-gray-800 hover:bg-gray-700'}`}
                        >
                            {passed ? 'Concluir Aula' : 'Tentar Novamente'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">

                {/* Header */}
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div>
                        <span className="text-xs font-bold text-diva-primary uppercase tracking-wider">Quiz</span>
                        <h3 className="font-bold text-gray-900">{lesson.title}</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
                        <X size={20} />
                    </button>
                </div>

                {/* Progress */}
                <div className="h-1.5 w-full bg-gray-100">
                    <div
                        className="h-full bg-diva-primary transition-all duration-300"
                        style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                    ></div>
                </div>

                {/* Question */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="mb-6">
                        <span className="text-xs font-bold text-gray-400 mb-1 block">Questão {currentIndex + 1} de {totalQuestions}</span>
                        <h2 className="text-xl font-bold text-gray-800 leading-snug">
                            {currentQuestion.text}
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {currentQuestion.options.map((opt, idx) => {
                            const isSelected = currentSelected === idx;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleOptionSelect(idx)}
                                    className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center justify-between group
                                        ${isSelected
                                            ? 'border-diva-primary bg-diva-primary/5 text-diva-primary ring-1 ring-diva-primary'
                                            : 'border-gray-100 hover:border-diva-primary/50 hover:bg-gray-50 text-gray-600'
                                        }`}
                                >
                                    <span className="font-medium">{opt}</span>
                                    {isSelected && <CheckCircle size={20} className="fill-current" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                    <span className="text-xs text-gray-400">
                        <HelpCircle size={12} className="inline mr-1" />
                        Selecione uma alternativa
                    </span>
                    <button
                        onClick={handleNext}
                        disabled={currentSelected === undefined}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold flex items-center transition-all shadow-md
                           ${currentSelected !== undefined
                                ? 'bg-diva-dark text-white hover:bg-diva-primary'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                    >
                        {currentIndex < totalQuestions - 1 ? 'Próxima' : 'Finalizar'}
                        <ArrowRight size={16} className="ml-2" />
                    </button>
                </div>

            </div>
        </div>
    );
};

export default QuizModal;
