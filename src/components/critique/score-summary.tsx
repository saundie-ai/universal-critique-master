import React from 'react';
import type { CritiquePhotoOutput } from '@/lib/critique-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PieChart, Image as ImageIcon } from 'lucide-react';
import ScoreCard from './score-card';

interface ScoreSummaryProps {
  critique: CritiquePhotoOutput;
  onDownload: () => void;
}

const ScoreSummary: React.FC<ScoreSummaryProps> = ({ critique, onDownload }) => {
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-primary">
              <PieChart className="mr-3 h-5 w-5" />
              Score Summary
            </CardTitle>
            <Button size="sm" onClick={onDownload} className="bg-green-600 hover:bg-green-700">
              <ImageIcon className="mr-2 h-4 w-4" /> Download Result
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4 sm:flex-nowrap">
          <ScoreCard label="Technical Merit" score={critique.technicalAverage} />
          <ScoreCard label="Artistic Merit" score={critique.artisticAverage} />
          <ScoreCard label="Total Score" score={critique.totalAverage} isTotal />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-primary">
            Closing Remarks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="italic leading-relaxed text-muted-foreground">
            {critique.closingRemarks}
          </p>
        </CardContent>
      </Card>
    </>
  );
};

export default ScoreSummary;
