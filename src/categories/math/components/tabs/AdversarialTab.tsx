import ErrorHuntingWorkspace from '@/components/math/ErrorHuntingWorkspace';
import { quadraticExpansionProblem } from '@/lib/math/demoProblems';

interface AdversarialTabProps {
    onComplete: (finalScore: number) => void;
}

export function AdversarialTab({ onComplete }: AdversarialTabProps) {
    return (
        <ErrorHuntingWorkspace
            problem={quadraticExpansionProblem}
            onComplete={onComplete}
        />
    );
}
