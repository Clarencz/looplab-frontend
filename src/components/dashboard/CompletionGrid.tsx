import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CompletedProject {
  id: number;
  name: string;
  completedDate: string;
  difficulty: string;
}

interface CompletionGridProps {
  completedProjects: CompletedProject[];
}

const CompletionGrid = ({ completedProjects }: CompletionGridProps) => {
  // Generate weeks for the last 12 weeks
  const generateWeeks = () => {
    const weeks = [];
    const today = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - (i * 7));
      weeks.push({
        weekStart: weekStart.toISOString().split('T')[0],
        projects: [] as CompletedProject[],
      });
    }
    
    // Distribute completed projects into weeks
    completedProjects.forEach(project => {
      const projectDate = new Date(project.completedDate);
      weeks.forEach(week => {
        const weekDate = new Date(week.weekStart);
        const weekEnd = new Date(weekDate);
        weekEnd.setDate(weekDate.getDate() + 7);
        
        if (projectDate >= weekDate && projectDate < weekEnd) {
          week.projects.push(project);
        }
      });
    });
    
    return weeks;
  };

  const weeks = generateWeeks();
  
  const getIntensityClass = (count: number) => {
    if (count === 0) return "bg-muted/30";
    if (count === 1) return "bg-primary/30";
    if (count === 2) return "bg-primary/60";
    return "bg-primary";
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="border-glow rounded-lg p-4 bg-background/50">
          <p className="text-2xl font-bold text-primary">{completedProjects.length}</p>
          <p className="text-sm text-muted-foreground">Total Completed</p>
        </div>
        <div className="border-glow rounded-lg p-4 bg-background/50">
          <p className="text-2xl font-bold text-accent">
            {weeks.filter(w => w.projects.length > 0).length}
          </p>
          <p className="text-sm text-muted-foreground">Active Weeks</p>
        </div>
        <div className="border-glow rounded-lg p-4 bg-background/50">
          <p className="text-2xl font-bold text-primary">
            {Math.max(...weeks.map(w => w.projects.length))}
          </p>
          <p className="text-sm text-muted-foreground">Most in a Week</p>
        </div>
      </div>

      {/* Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-mono text-muted-foreground">
            Weekly Completion Grid
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 rounded bg-muted/30" />
              <div className="w-4 h-4 rounded bg-primary/30" />
              <div className="w-4 h-4 rounded bg-primary/60" />
              <div className="w-4 h-4 rounded bg-primary" />
            </div>
            <span>More</span>
          </div>
        </div>
        
        <TooltipProvider>
          <div className="grid grid-cols-12 gap-2">
            {weeks.map((week, index) => {
              const weekDate = new Date(week.weekStart);
              const formattedDate = weekDate.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              });
              
              return (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className={`
                        aspect-square rounded border border-border/50 cursor-pointer
                        hover:border-primary transition-all hover:scale-110
                        ${getIntensityClass(week.projects.length)}
                        ${week.projects.length > 0 ? 'animate-pulse-glow' : ''}
                      `}
                    >
                      {week.projects.length > 1 && (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-xs font-bold text-primary-foreground">
                            {week.projects.length}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-card border-border">
                    <div className="text-xs space-y-1">
                      <p className="font-semibold text-foreground">Week of {formattedDate}</p>
                      {week.projects.length > 0 ? (
                        <>
                          <p className="text-primary font-semibold">
                            {week.projects.length} project{week.projects.length > 1 ? 's' : ''} completed
                          </p>
                          <ul className="space-y-1 mt-2">
                            {week.projects.map(project => (
                              <li key={project.id} className="text-muted-foreground">
                                • {project.name}
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <p className="text-muted-foreground">No projects completed</p>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>

        <p className="text-xs text-muted-foreground mt-4 font-mono">
          Each square represents a week. Hover to see details.
        </p>
      </div>
    </div>
  );
};

export default CompletionGrid;
