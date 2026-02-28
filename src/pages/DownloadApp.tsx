import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Monitor, Zap, Shield, HardDrive, Code2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type Platform = 'mac' | 'windows' | 'linux' | 'unknown';

const DownloadApp = () => {
    const [platform, setPlatform] = useState<Platform>('unknown');

    useEffect(() => {
        // Detect user's platform
        const userAgent = window.navigator.userAgent.toLowerCase();
        if (userAgent.includes('mac')) {
            setPlatform('mac');
        } else if (userAgent.includes('win')) {
            setPlatform('windows');
        } else if (userAgent.includes('linux')) {
            setPlatform('linux');
        }
    }, []);

    const getPlatformDownloadUrl = () => {
        // TODO: Replace with actual download URLs
        const baseUrl = 'https://github.com/mathemalab/releases/latest/download';
        switch (platform) {
            case 'mac':
                return `${baseUrl}/MathemaLab-macOS.dmg`;
            case 'windows':
                return `${baseUrl}/MathemaLab-Windows.exe`;
            case 'linux':
                return `${baseUrl}/MathemaLab-Linux.AppImage`;
            default:
                return baseUrl;
        }
    };

    const getPlatformName = () => {
        switch (platform) {
            case 'mac':
                return 'macOS';
            case 'windows':
                return 'Windows';
            case 'linux':
                return 'Linux';
            default:
                return 'Your Platform';
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="container mx-auto px-4 py-16 md:py-24">
                {/* Hero Section */}
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                        <Monitor className="h-4 w-4" />
                        <span className="text-sm font-medium">Desktop App Required</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        Unlock the Full MathemaLab Experience
                    </h1>

                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Access powerful workspaces, run code locally, and leverage your system's full potential with the MathemaLab Desktop App.
                    </p>

                    {/* Primary Download Button */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                        <Button
                            size="lg"
                            className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                            onClick={() => window.location.href = getPlatformDownloadUrl()}
                        >
                            <Download className="mr-2 h-5 w-5" />
                            Download for {getPlatformName()}
                        </Button>

                        <Button
                            size="lg"
                            variant="outline"
                            className="text-lg px-8 py-6"
                            onClick={() => window.open('https://github.com/mathemalab/releases', '_blank')}
                        >
                            View All Platforms
                        </Button>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        Free • Open Source • Available for macOS, Windows, and Linux
                    </p>
                </div>

                {/* Why Desktop Section */}
                <div className="max-w-5xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-center mb-12">Why Desktop?</h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Feature 1 */}
                        <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <Zap className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
                            <p className="text-muted-foreground">
                                Run code execution, tests, and validations locally without network latency.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                            <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <HardDrive className="h-6 w-6 text-purple-500" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Local-First Storage</h3>
                            <p className="text-muted-foreground">
                                Keep your projects on your machine. Sync only what you want to share.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                            <div className="bg-pink-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <Code2 className="h-6 w-6 text-pink-500" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Full IDE Experience</h3>
                            <p className="text-muted-foreground">
                                Access Monaco Editor, integrated terminal, file explorer, and more.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                            <div className="bg-green-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <Shield className="h-6 w-6 text-green-500" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Privacy & Security</h3>
                            <p className="text-muted-foreground">
                                Your code stays on your device. No cloud processing required.
                            </p>
                        </div>

                        {/* Feature 5 */}
                        <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                            <div className="bg-orange-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <Monitor className="h-6 w-6 text-orange-500" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Native Performance</h3>
                            <p className="text-muted-foreground">
                                Built with Tauri for minimal resource usage and maximum speed.
                            </p>
                        </div>

                        {/* Feature 6 */}
                        <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                            <div className="bg-blue-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <Download className="h-6 w-6 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Offline Ready</h3>
                            <p className="text-muted-foreground">
                                Work on projects without an internet connection. Sync when ready.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Desktop-Only Features */}
                <div className="max-w-3xl mx-auto bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 border border-primary/20 rounded-2xl p-8 mb-16">
                    <h2 className="text-2xl font-bold mb-6 text-center">Desktop-Only Features</h2>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                            <div className="bg-primary rounded-full p-1 mt-0.5">
                                <svg className="h-3 w-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-muted-foreground"><strong className="text-foreground">Full Workspaces</strong> - Code editor, terminal, and file explorer for all categories</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="bg-primary rounded-full p-1 mt-0.5">
                                <svg className="h-3 w-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-muted-foreground"><strong className="text-foreground">Algorithm Practice</strong> - Solve problems with local execution and testing</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="bg-primary rounded-full p-1 mt-0.5">
                                <svg className="h-3 w-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-muted-foreground"><strong className="text-foreground">Custom Scenarios</strong> - Create and share learning content for classrooms</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="bg-primary rounded-full p-1 mt-0.5">
                                <svg className="h-3 w-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-muted-foreground"><strong className="text-foreground">Project Validation</strong> - Run comprehensive tests and checks locally</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="bg-primary rounded-full p-1 mt-0.5">
                                <svg className="h-3 w-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-muted-foreground"><strong className="text-foreground">STEM Visualizations</strong> - Interactive 3D models and data visualizations</span>
                        </li>
                    </ul>
                </div>

                {/* CTA */}
                <div className="text-center">
                    <Button
                        size="lg"
                        className="text-lg px-12 py-6 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                        onClick={() => window.location.href = getPlatformDownloadUrl()}
                    >
                        <Download className="mr-2 h-5 w-5" />
                        Get Started with Desktop
                    </Button>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default DownloadApp;
