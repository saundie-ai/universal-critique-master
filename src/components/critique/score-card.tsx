import React from 'react';
import { cn } from '@/lib/utils';

interface ScoreCardProps {
  label: string;
  score: number;
  isTotal?: boolean;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ label, score, isTotal = false }) => {
  const scoreValue = score || 0;
  const colorClass =
    scoreValue >= 8
      ? 'text-green-400'
      : scoreValue >= 5
      ? 'text-yellow-400'
      : 'text-red-400';

  return (
    <div
      className={cn(
        'flex-1 rounded-lg bg-secondary p-4 text-center',
        isTotal && 'border-2 border-primary shadow-lg shadow-primary/20'
      )}
    >
      <div className={cn('text-4xl font-bold', isTotal ? 'text-primary' : colorClass)}>
        {scoreValue.toFixed(1)}
      </div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
};

export default ScoreCard;
