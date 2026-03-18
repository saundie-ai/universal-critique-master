import React from 'react';
import type { CritiquePhotoOutput } from '@/lib/critique-types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SlidersHorizontal, Crop, Brush, Palette, Sparkles } from 'lucide-react';

interface RecommendationsProps {
  critique: CritiquePhotoOutput;
}

const RecommendationCard: React.FC<{ title: string; content: string; icon: React.ReactNode }> = ({ title, content, icon }) => (
    <div className="rounded-lg bg-secondary p-5 ">
        <div className="mb-2 flex items-center text-sm font-semibold text-accent">
            {icon} {title}
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{content}</p>
    </div>
);

const Recommendations: React.FC<RecommendationsProps> = ({ critique }) => {
  const pp = critique.postProduction;
  const ppItems = [
    { title: 'Cropping & Geometry', icon: <Crop className="mr-2 h-4 w-4" />, content: pp.cropping },
    { title: 'Global Adjustments', icon: <SlidersHorizontal className="mr-2 h-4 w-4" />, content: pp.globalAdjustments },
    { title: 'Local Adjustments', icon: <Brush className="mr-2 h-4 w-4" />, content: pp.localAdjustments },
    { title: 'Color Grading', icon: <Palette className="mr-2 h-4 w-4" />, content: pp.colorGrading },
    { title: 'Retouching', icon: <Sparkles className="mr-2 h-4 w-4" />, content: pp.retouching },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-accent">
          <SlidersHorizontal className="mr-3 h-5 w-5" /> Post-Production Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {ppItems.map((item, index) => (
            <RecommendationCard key={index} {...item} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Recommendations;
