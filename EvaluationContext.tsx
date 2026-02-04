import React, { createContext, useContext, useMemo, useState } from 'react';
import { EvaluationInput, EvaluationResult } from './types';

type EvaluationState = {
  input: EvaluationInput | null;
  result: EvaluationResult | null;
  setInput: (input: EvaluationInput | null) => void;
  setResult: (result: EvaluationResult | null) => void;
  reset: () => void;
};

const EvaluationContext = createContext<EvaluationState | undefined>(undefined);

export const EvaluationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [input, setInput] = useState<EvaluationInput | null>(() => {
    const saved = localStorage.getItem('blogeval_input');
    return saved ? JSON.parse(saved) : null;
  });
  const [result, setResult] = useState<EvaluationResult | null>(() => {
    const saved = localStorage.getItem('blogeval_result');
    return saved ? JSON.parse(saved) : null;
  });

  // Persist to localStorage
  React.useEffect(() => {
    if (input) {
      localStorage.setItem('blogeval_input', JSON.stringify(input));
    } else {
      localStorage.removeItem('blogeval_input');
    }
  }, [input]);

  React.useEffect(() => {
    if (result) {
      localStorage.setItem('blogeval_result', JSON.stringify(result));
    } else {
      localStorage.removeItem('blogeval_result');
    }
  }, [result]);

  const value = useMemo(
    () => ({
      input,
      result,
      setInput,
      setResult,
      reset: () => {
        setInput(null);
        setResult(null);
        localStorage.removeItem('blogeval_input');
        localStorage.removeItem('blogeval_result');
      },
    }),
    [input, result]
  );

  return <EvaluationContext.Provider value={value}>{children}</EvaluationContext.Provider>;
};

export const useEvaluation = (): EvaluationState => {
  const context = useContext(EvaluationContext);
  if (!context) {
    throw new Error('useEvaluation must be used within EvaluationProvider');
  }
  return context;
};
