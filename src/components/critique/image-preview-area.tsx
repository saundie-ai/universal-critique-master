import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Trash2, Grid, Ratio, X } from 'lucide-react';
import CompositionOverlay, { type OverlayType } from './composition-overlay';
import type { FileData } from '@/app/page';

interface ImagePreviewAreaProps {
  fileData: FileData;
  onReset: () => void;
}

const ImagePreviewArea: React.FC<ImagePreviewAreaProps> = ({ fileData, onReset }) => {
  const [activeOverlay, setActiveOverlay] = useState<OverlayType>('none');
  
  const handleOverlayClick = (type: OverlayType) => {
    setActiveOverlay(p => p === type ? 'none' : type);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Preview</CardTitle>
          <Button variant="destructive" size="sm" onClick={onReset}>
            <Trash2 className="mr-2 h-4 w-4" /> New
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative mx-auto w-fit">
          <Image
            src={fileData.dataUrl}
            alt="Image preview"
            width={600}
            height={400}
            className="block h-auto max-h-[60vh] w-full max-w-full rounded-md object-contain"
            style={{ width: '100%', height: 'auto' }}
            onLoadingComplete={(img) => {
              // Trigger a resize event to ensure canvas is drawn correctly
              window.dispatchEvent(new Event('resize'));
            }}
          />
          <CompositionOverlay overlayType={activeOverlay} />
        </div>
        <div className="mt-4 flex justify-center space-x-2">
            <Button variant={activeOverlay === 'thirds' ? 'secondary' : 'ghost'} size="sm" onClick={() => handleOverlayClick('thirds')}>
                <Grid className="mr-1 h-4 w-4" /> Thirds
            </Button>
            <Button variant={activeOverlay === 'golden' ? 'secondary' : 'ghost'} size="sm" onClick={() => handleOverlayClick('golden')}>
                <Ratio className="mr-1 h-4 w-4" /> Golden
            </Button>
            {activeOverlay !== 'none' && (
                 <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => handleOverlayClick('none')}>
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
        <div className="mt-3 text-center font-mono text-xs text-muted-foreground">
          {fileData.exif}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImagePreviewArea;
