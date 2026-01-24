// Score Card Component for Validation Results

interface ScoreCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    color: "green" | "yellow" | "red";
}

export function ScoreCard({ icon, label, value, color }: ScoreCardProps) {
    const colorClasses = {
        green: "text-green-500 bg-green-500/10 border-green-500/20",
        yellow: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
        red: "text-red-500 bg-red-500/10 border-red-500/20",
    };

    return (
        <div className={`p-3 rounded-lg border text-center ${colorClasses[color]}`}>
            <div className="flex justify-center mb-1">{icon}</div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="font-mono font-bold">{value}</p>
        </div>
    );
}
