import { Monitor, Tablet, Smartphone } from 'lucide-react';
import { PreviewMode } from '../types';
import { Button } from '@/components/ui/button';

interface PreviewControlsProps {
    previewMode: PreviewMode;
    onPreviewModeChange: (mode: PreviewMode) => void;
    isAutoRefresh: boolean;
    onAutoRefreshToggle: () => void;
    onManualRefresh: () => void;
}

export function PreviewControls({
    previewMode,
    onPreviewModeChange,
    isAutoRefresh,
    onAutoRefreshToggle,
    onManualRefresh,
}: PreviewControlsProps) {
    return (
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-background/95">
            <div className="flex items-center gap-1 border border-border rounded-md p-1">
                <Button
                    variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onPreviewModeChange('desktop')}
                    className="h-7 px-2"
                    title="Desktop view"
                >
                    <Monitor className="h-4 w-4" />
                </Button>
                <Button
                    variant={previewMode === 'tablet' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onPreviewModeChange('tablet')}
                    className="h-7 px-2"
                    title="Tablet view"
                >
                    <Tablet className="h-4 w-4" />
                </Button>
                <Button
                    variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onPreviewModeChange('mobile')}
                    className="h-7 px-2"
                    title="Mobile view"
                >
                    <Smartphone className="h-4 w-4" />
                </Button>
            </div>

            <div className="h-6 w-px bg-border mx-2" />

            <Button
                variant={isAutoRefresh ? 'default' : 'outline'}
                size="sm"
                onClick={onAutoRefreshToggle}
                className="h-7"
            >
                {isAutoRefresh ? 'Auto Refresh: ON' : 'Auto Refresh: OFF'}
            </Button>

            {!isAutoRefresh && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onManualRefresh}
                    className="h-7"
                >
                    Refresh Preview
                </Button>
            )}
        </div>
    );
}
