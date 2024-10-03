import React, { useState } from 'react';
import faqsMisc from '../../config/abrechnung/faqs_misc.json';
import faqsTarmed from '../../config/abrechnung/faqs_tarmed.json';
import faqsTarco from '../../config/abrechnung/faqs_tarco.json';

type SectionContent = {
    title?: string;
    content: string | { sub_title: string; details: string }[];
};

type Chapter = {
    title: string;
    content?: string[];
    sections?: SectionContent[];
};

type QuizQuestion = {
    question: string;
    options: string[];
    correctAnswerIndex: number;
};

type FAQData = {
    introduction: { title: string; content: string };
    chapters: Chapter[];
    quiz: QuizQuestion[];
};

const faqSources: { [key: string]: FAQData } = {
    misc: faqsMisc.tarmed_faq,
    tarmed: faqsTarmed.tarmed_faq,
    tarco: faqsTarco.tarmed_faq,
};

const Abrechnung = () => {
    const [selectedSource, setSelectedSource] = useState<string>('tarmed');
    const [selectedChapterIndex, setSelectedChapterIndex] = useState<number | null>(null);
    const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
    const [showQuiz, setShowQuiz] = useState(false);
    const [showQuizResults, setShowQuizResults] = useState(false);

    const faq: FAQData = faqSources[selectedSource];

    const handleQuizAnswer = (questionIndex: number, selectedOption: number) => {
        const newAnswers = [...quizAnswers];
        newAnswers[questionIndex] = selectedOption;
        setQuizAnswers(newAnswers);
    };

    const renderQuiz = () => (
        <div className="quiz-section mt-8">
            <h3 className="text-3xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">Quiz</h3>
            {faq.quiz.map((question, questionIndex) => (
                <div key={questionIndex} className="mb-6 p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800">
                    <p className="font-semibold text-xl text-indigo-800 dark:text-indigo-300 mb-4">{question.question}</p>
                    {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="mb-2">
                            <button
                                className={`py-2 px-4 rounded-lg w-full text-left ${quizAnswers[questionIndex] === optionIndex ? 'bg-indigo-600 text-white' : 'bg-gray-300 dark:bg-gray-600'
                                    }`}
                                onClick={() => handleQuizAnswer(questionIndex, optionIndex)}
                            >
                                {option}
                            </button>
                        </div>
                    ))}
                </div>
            ))}
            <button

                className="mt-4 py-2 px-4 rounded-lg bg-amber-500 text-white"
                onClick={() => setShowQuizResults(true)}
            >
                Quiz Auswerten
            </button>
            {showQuizResults && (
                <div className="mt-6 p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800">
                    <h4 className="font-bold text-2xl text-indigo-800 dark:text-indigo-300 mb-4">Quiz Ergebnis</h4>
                    {faq.quiz.map((question, index) => (
                        <p key={index} className={`mb-2 ${quizAnswers[index] === question.correctAnswerIndex ? 'text-green-600' : 'text-red-600'}`}>
                            Frage {index + 1}: {quizAnswers[index] === question.correctAnswerIndex ? 'Richtig' : 'Falsch'}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 text-black dark:text-white transition-colors duration-500">
            <div className="container mx-auto py-16 px-6 md:px-12 lg:px-24">
                {/* Introduction Section */}
                <h2 className="text-4xl font-extrabold text-indigo-900 dark:text-white mb-8">{faq.introduction.title}</h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">{faq.introduction.content}</p>

                {/* Source Selection Buttons */}
                <div className="flex space-x-2 mb-8">
                    {Object.keys(faqSources).map((sourceKey) => (
                        <button
                            key={sourceKey}
                            className={`py-1 px-2 rounded-md font-semibold ${selectedSource === sourceKey ? 'bg-indigo-600 text-white' : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                            onClick={() => {
                                setSelectedSource(sourceKey);
                                setSelectedChapterIndex(null);
                                setShowQuiz(false);
                                setShowQuizResults(false);
                                setQuizAnswers([]);
                            }}
                        >
                            {sourceKey.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* Chapter Selection Buttons */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {faq.chapters.map((chapter, index) => (
                        <button
                            key={index}
                            className={`py-1 px-2 rounded-md font-semibold ${selectedChapterIndex === index ? 'bg-indigo-600 text-white' : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                            onClick={() => {
                                setSelectedChapterIndex(index);
                                setShowQuiz(false);
                                setShowQuizResults(false);
                                setQuizAnswers([]);
                            }}
                        >
                            {chapter.title}
                        </button>
                    ))}
                </div>

                {/* Chapter Content */}
                {selectedChapterIndex !== null && (
                    <div>
                        <h3 className="text-3xl font-bold text-indigo-700 dark:text-indigo-300 mb-4">
                            {faq.chapters[selectedChapterIndex].title}
                        </h3>
                        {/* Render Chapter Content if available */}
                        {faq.chapters[selectedChapterIndex].content?.map((paragraph, index) => (
                            <p key={index} className="text-md text-gray-700 dark:text-gray-400 mb-4">{paragraph}</p>
                        ))}
                        {/* Render Sections within the Chapter if available */}
                        {faq.chapters[selectedChapterIndex].sections?.map((section, index) => (
                            <div key={index} className="mb-6">
                                {section.title && (
                                    <h4 className="text-2xl font-semibold text-indigo-800 dark:text-indigo-300 mb-2">
                                        {section.title}
                                    </h4>
                                )}
                                {typeof section.content === 'string' ? (
                                    <p className="text-md text-gray-700 dark:text-gray-400">{section.content}</p>
                                ) : (
                                    section.content.map((subSection, subIndex) => (
                                        <div key={subIndex} className="mb-2">
                                            <h5 className="font-semibold text-lg text-indigo-700 dark:text-indigo-300">
                                                {subSection.sub_title}
                                            </h5>
                                            <p className="text-md text-gray-700 dark:text-gray-400">{subSection.details}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        ))}
                        {/* Quiz Button */}
                        <button
                            className="mt-6 py-2 px-4 rounded-lg bg-amber-500 text-white"
                            onClick={() => setShowQuiz(true)}
                        >
                            Quiz Starten
                        </button>
                    </div>
                )}

                {/* Render Quiz */}
                {showQuiz && renderQuiz()}
            </div>
        </div>
    );
};

export default Abrechnung;
