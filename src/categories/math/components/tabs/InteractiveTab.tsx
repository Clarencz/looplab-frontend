import InteractiveParabola from '@/components/math/InteractiveParabola';

export function InteractiveTab() {
    return (
        <div className="h-full max-w-6xl mx-auto">
            <InteractiveParabola initialA={1} initialB={-4} initialC={3} />
        </div>
    );
}
