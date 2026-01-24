import GeometricBuilder from '@/components/math/GeometricBuilder';

interface BreakthroughTabProps {
    onComplete: () => void;
}

export function BreakthroughTab({ onComplete }: BreakthroughTabProps) {
    return (
        <GeometricBuilder
            a={5}
            b={3}
            onComplete={onComplete}
        />
    );
}
