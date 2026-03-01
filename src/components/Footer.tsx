import { Github, Twitter, Code2 } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-6 max-w-6xl py-12 lg:py-16">
        <div className="grid gap-12 grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4 group transition-transform hover:scale-105 origin-left">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-lg shadow-primary/20 overflow-hidden">
                <img src="/logo.png" alt="MathemaLab Logo" className="h-full w-full object-cover" />
              </div>
              <span className="text-xl font-bold tracking-tight">MathemaLab</span>
            </div>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs leading-relaxed">
              Learn by building. Guided by AI.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="text-muted-foreground transition-colors hover:text-foreground p-2 rounded-lg hover:bg-secondary/50">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground transition-colors hover:text-foreground p-2 rounded-lg hover:bg-secondary/50">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Projects</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Technologies</a></li>
              <li><a href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Learning Paths</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Categories</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Getting Started</a></li>
              <li><a href="/pricing#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Support</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</a></li>
              <li><a href="mailto:support@mathemalab.io" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</a></li>
              <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 MathemaLab. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made for learners
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;