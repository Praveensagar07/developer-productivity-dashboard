import React from 'react';
import { Task, Project, TaskStatus } from '../../types';
import { TaskCard } from './TaskCard';
import { Clock, CircleDot, CheckCircle2, Plus } from 'lucide-react';
import { Button } from '../ui/Button';

interface TaskBoardProps {
  tasks: Task[];
  projects: Project[];
  onSelectTask: (taskId: string) => void;
  onOpenNewTask: () => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  projects,
  onSelectTask,
  onOpenNewTask,
}) => {
  const projectMap = new Map(projects.map((p) => [p.id, p]));

  const columns: { id: TaskStatus; title: string; icon: React.ReactNode; color: string }[] = [
    {
      id: 'todo',
      title: 'To Do',
      icon: <Clock className="w-4 h-4 text-slate-500" />,
      color: 'border-slate-300 dark:border-slate-700',
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      icon: <CircleDot className="w-4 h-4 text-brand-500" />,
      color: 'border-brand-300 dark:border-brand-700',
    },
    {
      id: 'done',
      title: 'Done',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
      color: 'border-emerald-300 dark:border-emerald-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
      {columns.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.id);

        return (
          <div
            key={col.id}
            className="flex flex-col bg-slate-100/70 dark:bg-slate-900/60 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                {col.icon}
                <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                  {col.title}
                </h3>
                <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {columnTasks.length}
                </span>
              </div>
              {col.id === 'todo' && (
                <button
                  onClick={onOpenNewTask}
                  className="p-1 rounded-md text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                  title="Add Task"
                  aria-label="Add task to To Do column"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Task Card List */}
            <div className="flex flex-col gap-3 min-h-[200px]">
              {columnTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl my-auto">
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    No tasks in {col.title}
                  </p>
                </div>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    project={projectMap.get(task.projectId)}
                    onClick={() => onSelectTask(task.id)}
                  />
                ))
              )}
            </div>

            {col.id === 'todo' && (
              <div className="pt-3 mt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onOpenNewTask}
                  className="w-full text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 justify-center border border-dashed border-slate-300 dark:border-slate-700"
                  icon={<Plus className="w-3.5 h-3.5" />}
                >
                  Add Task
                </Button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
