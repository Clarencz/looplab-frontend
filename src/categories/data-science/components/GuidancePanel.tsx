import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface GuidanceSection {
    heading: string;
    content: React.ReactNode;
}

interface GuidancePanelProps {
    title: string;
    sections: GuidanceSection[];
    reminder?: string;
}

export function GuidancePanel({ title, sections, reminder }: GuidancePanelProps) {
    return (
        <Card className="sticky top-24">
            <CardHeader>
                <CardTitle className="text-sm">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                {sections.map((section, i) => (
                    <div key={i}>
                        <h4 className="font-semibold mb-2">{section.heading}</h4>
                        <div className="text-muted-foreground">{section.content}</div>
                    </div>
                ))}
                {reminder && (
                    <div className="pt-4 border-t">
                        <Badge variant="outline" className="mb-2">
                            ⚠️ Remember
                        </Badge>
                        <p className="text-muted-foreground">{reminder}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
