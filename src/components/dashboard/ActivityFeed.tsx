import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { CheckCircle2, GitBranch, Award } from "lucide-react";

const activities = [
  {
    id: 1,
    text: "You completed the",
    project: "Task Manager API",
    time: "2 hours ago",
    icon: CheckCircle2,
  },
  {
    id: 2,
    text: "You assigned",
    project: "GitHub: fix-BugsArray() repo",
    time: "5 hours ago",
    icon: GitBranch,
  },
  {
    id: 3,
    text: "You have a new project event",
    project: "open",
    time: "8 hours ago",
    icon: Award,
  },
  {
    id: 4,
    text: "You updated everything",
    project: "file",
    time: "1 day ago",
    icon: CheckCircle2,
  },
  {
    id: 5,
    text: "You assigned",
    project: "GitHub: fix-BugsArray() repo",
    time: "2 days ago",
    icon: GitBranch,
  },
];

const ActivityFeed = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="p-6 border-glow bg-gradient-card h-full">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <span className="text-primary">&gt;</span>
          Activity
        </h2>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex gap-3">
                <div className="p-2 bg-primary/10 rounded-full h-fit">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    {activity.text}{" "}
                    <span className="text-primary font-semibold">
                      {activity.project}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </motion.div>
  );
};

export default ActivityFeed;
