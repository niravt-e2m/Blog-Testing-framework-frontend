import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepIndicator from './StepIndicator';
import FileUpload from './FileUpload';
import { EvaluationInput, ToneOfVoiceInput, Reference } from '../types';
import { useEvaluation } from '../EvaluationContext';
import { evaluateContent } from '../services/backendService';

// Simple ID generator (browser-compatible alternative to crypto.randomUUID)
const generateId = () => `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const steps = [
  { id: 1, label: 'Blog Content', description: 'Your article' },
  { id: 2, label: 'Blog Outline', description: 'Structure' },
  { id: 3, label: 'Tone of Voice', description: 'Style guide' },
  { id: 4, label: 'Details', description: 'Resources & audience' },
];

const InputWizard: React.FC = () => {
  const navigate = useNavigate();
  const { setInput, setResult, reset } = useEvaluation();
  const [currentStep, setCurrentStep] = useState(0);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogText, setBlogText] = useState('');
  const [blogOutline, setBlogOutline] = useState('');
  const [toneInputType, setToneInputType] = useState<'text' | 'file'>('text');
  const [toneOfVoice, setToneOfVoice] = useState<ToneOfVoiceInput>({
    type: 'text',
    content: '',
  });
  const [references, setReferences] = useState<Reference[]>([
    { id: generateId(), type: 'link', content: '' }
  ]);
  const [targetAudience, setTargetAudience] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const addReference = () => {
    setReferences([
      ...references,
      { id: generateId(), type: 'link', content: '' }
    ]);
  };

  const removeReference = (id: string) => {
    if (references.length > 1) {
      setReferences(references.filter(ref => ref.id !== id));
    }
  };

  const updateReference = (id: string, updates: Partial<Reference>) => {
    setReferences(references.map(ref =>
      ref.id === id ? { ...ref, ...updates } : ref
    ));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId - 1);
  };

  const handleSubmit = async () => {
    // Filter out empty references
    const validReferences = references.filter(ref => ref.content.trim().length > 0);

    const input: EvaluationInput = {
      blogTitle,
      blogText,
      blogOutline,
      toneOfVoice,
      references: validReferences,
      targetAudience,
    };
    setSubmitError(null);
    setIsSubmitting(true);
    setInput(input);

    try {
      const result = await evaluateContent(input);
      setResult(result);
      navigate('/results');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Evaluation failed. Please try again.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return blogTitle.trim().length > 0 && blogText.trim().length >= 100;
      case 1:
        return blogOutline.trim().length > 0;
      case 2:
        return toneOfVoice.content.trim().length > 0;
      case 3:
        return targetAudience.trim().length > 0;
      default:
        return false;
    }
  };

  const handleToneFileSelect = (content: string, fileName: string) => {
    setToneOfVoice({
      type: 'file',
      content,
      fileName,
    });
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Content Evaluation
          </h1>
          <p className="text-gray-600 text-lg">
            Complete each step to evaluate your content
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator
          steps={steps}
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />

        {/* Step Content */}
        <div className="mt-8">
          <div className="
            bg-white backdrop-blur-xl 
            border border-gray-200 
            shadow-[0_4px_20px_rgba(0,0,0,0.12),_0_8px_40px_rgba(0,0,0,0.08)]
            rounded-3xl
            p-8
          ">
            {/* Step 1: Blog Content */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
                    Blog Title
                  </label>
                  <input
                    value={blogTitle}
                    onChange={(e) => setBlogTitle(e.target.value)}
                    placeholder="Enter your blog title..."
                    className="
                      w-full
                      bg-gray-50 
                      border border-gray-300
                      focus:bg-white focus:border-gray-400
                      rounded-2xl
                      px-6 py-4 text-gray-900
                      placeholder-gray-500
                      transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-gray-300
                      shadow-inner
                    "
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
                    Blog / Article Content
                  </label>
                  <textarea
                    value={blogText}
                    onChange={(e) => setBlogText(e.target.value)}
                    placeholder="Paste your blog post or article content here..."
                    className="
                      w-full h-80
                      bg-gray-50 
                      border border-gray-300
                      focus:bg-white focus:border-gray-400
                      rounded-2xl
                      p-6 text-gray-900
                      placeholder-gray-500
                      resize-none
                      transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-gray-300
                      shadow-inner
                    "
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-500">
                    <span>Paste your full article or blog post</span>
                    <span>{blogText.length.toLocaleString()} characters</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Blog Outline */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
                    Blog Outline
                  </label>
                  <textarea
                    value={blogOutline}
                    onChange={(e) => setBlogOutline(e.target.value)}
                    placeholder="Paste your blog outline or structure here..."
                    className="
                      w-full h-80
                      bg-gray-50 
                      border border-gray-300
                      focus:bg-white focus:border-gray-400
                      rounded-2xl
                      p-6 text-gray-900
                      placeholder-gray-500
                      resize-none
                      transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-gray-300
                      shadow-inner
                    "
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Provide the outline or structure you want the blog to follow
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Tone of Voice */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
                    Tone of Voice Reference
                  </label>

                  {/* Toggle */}
                  <div className="flex gap-2 mb-6">
                    <button
                      onClick={() => {
                        setToneInputType('text');
                        setToneOfVoice({ type: 'text', content: toneOfVoice.content });
                      }}
                      className={`
                        px-6 py-3 rounded-xl text-sm font-semibold
                        transition-all duration-200
                        ${toneInputType === 'text'
                          ? 'bg-black text-white shadow-lg'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }
                      `}
                    >
                      Enter Text
                    </button>
                    <button
                      onClick={() => {
                        setToneInputType('file');
                        setToneOfVoice({ type: 'file', content: '', fileName: undefined });
                      }}
                      className={`
                        px-6 py-3 rounded-xl text-sm font-semibold
                        transition-all duration-200
                        ${toneInputType === 'file'
                          ? 'bg-black text-white shadow-lg'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }
                      `}
                    >
                      Upload File
                    </button>
                  </div>

                  {toneInputType === 'text' ? (
                    <textarea
                      value={toneOfVoice.content}
                      onChange={(e) => setToneOfVoice({ type: 'text', content: e.target.value })}
                      placeholder="Describe your brand's tone of voice, or paste a sample of content that represents your ideal writing style..."
                      className="
                        w-full h-64
                        bg-gray-50 
                        border border-gray-300
                        focus:bg-white focus:border-gray-400
                        rounded-2xl
                        p-6 text-gray-900
                        placeholder-gray-500
                        resize-none
                        transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-gray-300
                        shadow-inner
                      "
                    />
                  ) : (
                    <FileUpload
                      onFileSelect={handleToneFileSelect}
                      acceptedTypes={['.txt', '.pdf']}
                      maxSizeMB={5}
                    />
                  )}

                  <p className="mt-4 text-sm text-gray-500">
                    Provide a reference for the tone and style you want to match
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Resources & Target Audience */}
            {currentStep === 3 && (
              <div className="space-y-8">
                {/* Resources Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">
                      References (Optional)
                    </label>
                    <button
                      onClick={addReference}
                      className="
                        flex items-center gap-2
                        px-4 py-2 rounded-xl text-sm font-semibold
                        bg-black text-white
                        transition-all duration-200
                        shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0
                      "
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Add Reference
                    </button>
                  </div>

                  <div className="space-y-4">
                    {references.map((ref, index) => (
                      <div
                        key={ref.id}
                        className="
                          p-5 rounded-2xl
                          bg-gray-50
                          border border-gray-300
                          shadow-sm
                          transition-all duration-200
                        "
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-gray-700">
                            Reference {index + 1}
                          </span>
                          <div className="flex items-center gap-2">
                            {/* Type Toggle */}
                            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                              <button
                                onClick={() => updateReference(ref.id, { type: 'link', content: '' })}
                                className={`
                                  px-3 py-1.5 rounded-md text-xs font-semibold
                                  transition-all duration-200
                                  ${ref.type === 'link'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                  }
                                `}
                              >
                                URL
                              </button>
                              <button
                                onClick={() => updateReference(ref.id, { type: 'text', content: '' })}
                                className={`
                                  px-3 py-1.5 rounded-md text-xs font-semibold
                                  transition-all duration-200
                                  ${ref.type === 'text'
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                  }
                                `}
                              >
                                Text
                              </button>
                            </div>

                            {/* Delete Button */}
                            {references.length > 1 && (
                              <button
                                onClick={() => removeReference(ref.id)}
                                className="
                                  p-2 rounded-lg
                                  text-gray-400 hover:text-red-500
                                  hover:bg-red-50
                                  transition-all duration-200
                                "
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>

                        {ref.type === 'link' ? (
                          <input
                            type="url"
                            value={ref.content}
                            onChange={(e) => updateReference(ref.id, { content: e.target.value })}
                            placeholder="https://example.com/resource"
                            className="
                              w-full
                              bg-white
                              border border-gray-300
                              focus:bg-white focus:border-gray-400
                              rounded-xl
                              px-4 py-3 text-gray-900
                              placeholder-gray-500
                              transition-all duration-200
                              focus:outline-none focus:ring-2 focus:ring-gray-300
                              shadow-sm
                            "
                          />
                        ) : (
                          <textarea
                            value={ref.content}
                            onChange={(e) => updateReference(ref.id, { content: e.target.value })}
                            placeholder="Paste reference material or additional context..."
                            className="
                              w-full h-24
                              bg-white
                              border border-gray-300
                              focus:bg-white focus:border-gray-400
                              rounded-xl
                              p-4 text-gray-900
                              placeholder-gray-500
                              resize-none
                              transition-all duration-200
                              focus:outline-none focus:ring-2 focus:ring-gray-300
                              shadow-sm
                            "
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <p className="mt-3 text-sm text-gray-500">
                    Add links or text content as references for fact-checking and verification
                  </p>
                </div>

                {/* Target Audience */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g., Marketing professionals, Tech enthusiasts, Small business owners..."
                    className="
                      w-full
                      bg-gray-50 
                      border border-gray-300
                      focus:bg-white focus:border-gray-400
                      rounded-2xl
                      px-6 py-4 text-gray-900
                      placeholder-gray-500
                      transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-gray-300
                      shadow-inner
                    "
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Describe who this content is intended for
                  </p>
                </div>

                {/* Quick Audience Suggestions */}
                <div className="flex flex-wrap gap-2">
                  {['Marketing Professionals', 'Developers', 'Executives', 'General Public', 'Students'].map((audience) => (
                    <button
                      key={audience}
                      onClick={() => setTargetAudience(audience)}
                      className="
                        px-4 py-2 rounded-xl text-sm
                        bg-gray-100 text-gray-600
                        hover:bg-gray-200 hover:text-gray-900
                        transition-colors duration-200
                      "
                    >
                      {audience}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          {submitError && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </div>
          )}

          <div className="flex justify-between mt-8">
            <button
              onClick={currentStep === 0 ? () => {
                reset();
                navigate('/');
              } : handleBack}
              className="
                px-8 py-4 rounded-2xl
                text-gray-600 font-semibold
                hover:bg-gray-100
                transition-all duration-200
              "
            >
              {currentStep === 0 ? 'Cancel' : 'Back'}
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid() || isSubmitting}
                className={`
                  px-10 py-4 rounded-2xl
                  font-bold
                  transition-all duration-200
                  ${isStepValid()
                    ? 'bg-black text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isStepValid() || isSubmitting}
                className={`
                  px-10 py-4 rounded-2xl
                  font-bold
                  transition-all duration-200
                  ${isStepValid()
                    ? 'bg-black text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                {isSubmitting ? 'Analyzing...' : 'Analyze Content'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputWizard;
