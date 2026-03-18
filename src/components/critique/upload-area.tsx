import type { Dispatch, SetStateAction } from 'react';
import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Info, UploadCloud } from 'lucide-react';
import { Button } from '../ui/button';
import ImagePreviewArea from './image-preview-area';
import type { FormInputs, FileData } from '@/app/page';

interface UploadAreaProps {
  formInputs: FormInputs;
  setFormInputs: Dispatch<SetStateAction<FormInputs>>;
  fileData: FileData | null;
  handleFileChange: (file: File) => void;
  handleReset: () => void;
  isLoading: boolean;
}

const UploadArea: React.FC<UploadAreaProps> = ({
  formInputs,
  setFormInputs,
  fileData,
  handleFileChange,
  handleReset,
  isLoading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('border-primary', 'bg-primary/10');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-primary', 'bg-primary/10');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-primary', 'bg-primary/10');
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileChange(files[0]);
    }
  };
  
  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileChange(files[0]);
    }
  }

  const onBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-primary">
            <Info className="mr-2 h-5 w-5" />
            Image Details{' '}
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              (Optional)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="input-title" className="text-xs uppercase tracking-wider">
                Title
              </Label>
              <Input
                id="input-title"
                type="text"
                placeholder="e.g., 'Sunset at the Pier'"
                value={formInputs.title}
                onChange={(e) => setFormInputs({ ...formInputs, title: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="input-photographer" className="text-xs uppercase tracking-wider">
                Photographer
              </Label>
              <Input
                id="input-photographer"
                type="text"
                placeholder="e.g., 'Jane Doe'"
                value={formInputs.photographer}
                onChange={(e) => setFormInputs({ ...formInputs, photographer: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="input-context" className="text-xs uppercase tracking-wider">
              Additional Context for the Critic
            </Label>
            <Textarea
              id="input-context"
              rows={3}
              placeholder="Describe your intent, settings used, or specific areas you want feedback on..."
              className="resize-none"
              value={formInputs.userContext}
              onChange={(e) => setFormInputs({ ...formInputs, userContext: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {fileData ? (
        <ImagePreviewArea fileData={fileData} onReset={handleReset} />
      ) : (
        <div>
            <input
              type="file"
              id="file-input"
              ref={fileInputRef}
              className="hidden"
              accept="image/jpeg, image/png, image/webp"
              onChange={onFileInputChange}
            />
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className="flex h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-10 text-center transition-colors"
              onClick={onBrowseClick}
            >
              <UploadCloud className="mb-4 h-10 w-10 text-muted-foreground" />
              <p className="text-lg font-semibold text-foreground">
                Drag & drop your image here
              </p>
              <p className="mb-4 text-muted-foreground">or</p>
              <Button type="button" onClick={onBrowseClick} disabled={isLoading} className="relative z-10">
                Browse Files
              </Button>
            </div>
        </div>
      )}
    </div>
  );
};

export default UploadArea;
