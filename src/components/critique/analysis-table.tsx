import React from 'react';
import type { CritiquePhotoOutput, CritiqueItem } from '@/lib/critique-types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ListChecks } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalysisTableProps {
  critique: CritiquePhotoOutput;
}

const CriterionRow: React.FC<{ item: CritiqueItem }> = ({ item }) => {
  const score = item.score || 0;
  const scoreColor =
    score >= 8
      ? 'text-green-400'
      : score >= 5
      ? 'text-yellow-400'
      : 'text-red-400';

  return (
    <TableRow>
      <TableCell className="font-medium">{item.criterion}</TableCell>
      <TableCell className="text-muted-foreground">{item.commentary}</TableCell>
      <TableCell className={cn('text-center text-lg font-bold', scoreColor)}>
        {score}/10
      </TableCell>
    </TableRow>
  );
};

const AnalysisTable: React.FC<AnalysisTableProps> = ({ critique }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-primary">
          <ListChecks className="mr-3 h-5 w-5" /> Detailed Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/4">Criterion</TableHead>
                <TableHead>Commentary</TableHead>
                <TableHead className="w-24 text-center">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                <TableCell colSpan={3} className="font-bold text-primary text-lg">
                  1. Technical Merit
                </TableCell>
              </TableRow>
              {critique.technicalMerit.map((item, index) => (
                <CriterionRow key={`tech-${index}`} item={item} />
              ))}
              <TableRow className="bg-secondary/50 hover:bg-secondary/50">
                <TableCell colSpan={3} className="font-bold text-primary text-lg">
                  2. Artistic Merit
                </TableCell>
              </TableRow>
              {critique.artisticMerit.map((item, index) => (
                <CriterionRow key={`art-${index}`} item={item} />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisTable;
