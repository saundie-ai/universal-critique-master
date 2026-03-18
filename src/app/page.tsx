'use client';

import type { FC } from 'react';
import React, { useState, useRef, useCallback } from 'react';
import { critiquePhoto } from '@/ai/flows/critique-photo-flow';
import type { CritiquePhotoOutput } from '@/lib/critique-types';
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import InstructionsAccordion from '@/components/critique/instructions-accordion';
import UploadArea from '@/components/critique/upload-area';
import { CritiqueExporter } from '@/components/critique/critique-exporter';
import { readExifData } from '@/lib/exif';
import ScoreSummary from '@/components/critique/score-summary';
import AnalysisTable from '@/components/critique/analysis-table';
import Recommendations from '@/components/critique/recommendations';
import ApiKeyInstructions from '@/components/critique/api-key-instructions';
import { Card } from '@/components/ui/card';
import { Loader, TriangleAlert, Camera } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export interface FormInputs {
  title: string;
  photographer: string;
  userContext: string;
}

export interface FileData {
  dataUrl: string;
  exif: string;
}

const Home: FC = () => {
  const [formInputs, setFormInputs] = useState<FormInputs>({ title: '', photographer: '', userContext: '' });
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [critique, setCritique] = useState<CritiquePhotoOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  
  const { toast } = useToast();
  const exporterRef = useRef<{ export: () => void }>(null);
  
  const handleReset = useCallback(() => {
    setFileData(null);
    setCritique(null);
    setIsLoading(false);
    setError(null);
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if(fileInput) fileInput.value = '';
  }, []);

  const handleFileChange = useCallback(async (file: File) => {
    if (!file) return;

    handleReset();
    setIsLoading(true);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        if (!dataUrl) {
          throw new Error("Could not read file.");
        }
        
        const exif = await readExifData(file);
        setFileData({ dataUrl, exif });
        
        try {
          const result = await critiquePhoto({
            photoDataUri: dataUrl,
            title: formInputs.title || undefined,
            photographer: formInputs.photographer || undefined,
            userContext: formInputs.userContext || undefined,
            exifData: exif,
            apiKey: apiKey || undefined,
          });
          setCritique(result);
        } catch (aiError: any) {
          console.error("AI Critique Error:", aiError);
          const errorMessage = (aiError.message?.includes('API key') || aiError.message?.includes('authentication'))
            ? 'Invalid or missing API Key. Please enter a valid key or configure it in your backend.' 
            : 'The AI model failed to generate a critique. Please try again.';
          setError(errorMessage);
          toast({
            variant: "destructive",
            title: "Analysis Failed",
            description: errorMessage,
          });
        } finally {
          setIsLoading(false);
        }
      };
      reader.onerror = () => {
        throw new Error("Failed to read file.");
      }
      reader.readAsDataURL(file);
    } catch (e: any) {
      setError(e.message);
      setIsLoading(false);
       toast({
        variant: "destructive",
        title: "File Error",
        description: e.message,
      });
    }
  }, [formInputs, toast, handleReset, apiKey]);

  const handleDownload = () => {
    if (exporterRef.current) {
      exporterRef.current.export();
    }
  };

  return (
    <>
      <div className="flex min-h-screen flex-col bg-background">
        <div className="container mx-auto flex-grow p-4 sm:p-6 lg:p-8">
          <Header />
          <InstructionsAccordion />

          <main id="main-content" className="flex flex-col gap-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <UploadArea
                formInputs={formInputs}
                setFormInputs={setFormInputs}
                fileData={fileData}
                handleFileChange={handleFileChange}
                handleReset={handleReset}
                isLoading={isLoading}
              />
              <div>
                {isLoading ? (
                  <Card className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
                    <Loader className="h-12 w-12 animate-spin text-primary" />
                    <p className="mt-4 text-lg text-foreground">Analyzing your photograph...</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Evaluating 8 distinct criteria...
                    </p>
                  </Card>
                ) : error ? (
                  <div className="space-y-4">
                    <Alert variant="destructive">
                      <TriangleAlert className="h-4 w-4" />
                      <AlertTitle>Analysis Failed</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                    <ApiKeyInstructions apiKey={apiKey} setApiKey={setApiKey} />
                  </div>
                ) : critique ? (
                  <ScoreSummary critique={critique} onDownload={handleDownload} />
                ) : (
                   <div className="space-y-4">
                    <Card className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
                      <Camera className="mb-6 h-16 w-16 text-muted-foreground/30" />
                      <h2 className="text-2xl font-bold text-foreground">Awaiting Image</h2>
                      <p className="mt-2 text-muted-foreground">
                        Upload a photo to receive a comprehensive technical and artistic critique.
                      </p>
                    </Card>
                    <ApiKeyInstructions apiKey={apiKey} setApiKey={setApiKey} />
                  </div>
                )}
              </div>
            </div>
            
            {critique && (
              <div className="mt-8 flex flex-col gap-8">
                <AnalysisTable critique={critique} />
                <Recommendations critique={critique} />
                <div className="text-center text-xs text-muted-foreground/50">
                  <h3 className="mb-1 block font-bold uppercase tracking-wide">Legal Disclaimer</h3>
                  <p>
                    This critique is generated by an Artificial Intelligence system for informational and entertainment purposes only. It represents an automated analysis and should not be interpreted as professional advice or objective fact. The publisher makes no warranties, express or implied, regarding the accuracy, reliability, or completeness of this assessment. By using this tool, you acknowledge that the publisher assumes no liability for any actions taken or decisions made based on this generated content.
                  </p>
                </div>
              </div>
            )}
          </main>
        </div>
        <Footer />
      </div>
      {fileData && critique && (
        <CritiqueExporter
          ref={exporterRef}
          critique={critique}
          fileData={fileData}
          formInputs={formInputs}
        />
      )}
      <Toaster />
    </>
  );
};

export default Home;
