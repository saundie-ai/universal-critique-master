import React from 'react';
import type { CritiquePhotoOutput } from '@/lib/critique-types';
import { Card } from '@/components/ui/card';
import { Camera, Loader, TriangleAlert } from 'lucide-react';
import ScoreSummary from './score-summary';
import AnalysisTable from './analysis-table';
import Recommendations from './recommendations';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface ResultsAreaProps {
  isLoading: boolean;
  error: string | null;
  critique: CritiquePhotoOutput | null;
  onDownload: () => void;
}

const ResultsArea: React.FC<ResultsAreaProps> = ({
  isLoading,
  error,
  critique,
  onDownload,
}) => {
  if (isLoading) {
    return (
      <Card className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
        <Loader className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-foreground">Analyzing your photograph...</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Evaluating 8 distinct criteria...
        </p>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <TriangleAlert className="h-4 w-4" />
        <AlertTitle>Analysis Failed</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (critique) {
    return (
      <div className="flex flex-col space-y-6">
        <ScoreSummary critique={critique} onDownload={onDownload} />
        <AnalysisTable critique={critique} />
        <Recommendations critique={critique} />
      </div>
    );
  }

  return (
    <Card className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
      <Camera className="mb-6 h-16 w-16 text-muted-foreground/30" />
      <h2 className="text-2xl font-bold text-foreground">Awaiting Image</h2>
      <p className="mt-2 text-muted-foreground">
        Upload a photo to receive a comprehensive technical and artistic critique.
      </p>
    </Card>
  );
};

export default ResultsArea;
