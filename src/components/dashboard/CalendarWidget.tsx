import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CalendarWidget = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="p-6 border-glow bg-gradient-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-primary">&gt;</span>
            Calendar
          </h2>
          <div className="flex gap-2">
            <button className="p-1 hover:bg-primary/10 rounded">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="p-1 hover:bg-primary/10 rounded">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md"
        />
      </Card>
    </motion.div>
  );
};

export default CalendarWidget;
