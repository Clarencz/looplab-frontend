import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FolderGit2, CheckCircle2, Clock, Code2 } from "lucide-react"

interface Project {
  id: string
  title: string
  techStack: string[]
  status: "completed" | "in-progress"
  summary: string
  completedAt?: string
}

interface ProjectTimelineProps {
  projects: Project[]
}

export function ProjectTimeline({ projects }: ProjectTimelineProps) {
  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-mono flex items-center gap-2">
          <FolderGit2 className="h-5 w-5 text-primary" />
          LoopLab Projects
        </CardTitle>
        <p className="text-xs text-muted-foreground">Automatically synced from your verified projects</p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="pr-4">
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="p-3 sm:p-4 rounded-lg bg-secondary/30 border border-border/30 hover:border-primary/30 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-3">
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-medium font-mono text-sm sm:text-base truncate">{project.title}</h4>
                      {project.status === "completed" ? (
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      ) : (
                        <Clock className="h-4 w-4 text-amber-500 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 sm:gap-1.5">
                      {project.techStack.slice(0, 4).map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs bg-secondary/50">
                          <Code2 className="h-3 w-3 mr-1" />
                          {tech}
                        </Badge>
                      ))}
                      {project.techStack.length > 4 && (
                        <Badge variant="outline" className="text-xs bg-secondary/50">
                          +{project.techStack.length - 4}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{project.summary}</p>
                    {project.completedAt && (
                      <p className="text-xs text-muted-foreground">Completed: {project.completedAt}</p>
                    )}
                  </div>
                  <Badge
                    variant={project.status === "completed" ? "default" : "secondary"}
                    className="self-start text-xs whitespace-nowrap flex-shrink-0"
                  >
                    {project.status === "completed" ? "Completed" : "In Progress"}
                  </Badge>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <FolderGit2 className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>No projects yet</p>
                <p className="text-sm">Complete LoopLab challenges to build your portfolio</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
