import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Camera, ChevronDown, Info, ListChecks } from 'lucide-react';

const InstructionsAccordion = () => {
  return (
    <div className="mx-auto mb-8 max-w-5xl">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="rounded-lg border bg-card shadow-md">
          <AccordionTrigger className="p-4 text-primary hover:no-underline">
            <div className="flex items-center">
              <Info className="mr-2 h-5 w-5" />
              First Time? Click here for Instructions
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-6 pt-0 text-sm text-muted-foreground">
            <h4 className="mb-3 flex items-center text-lg font-bold text-foreground">
              <Camera className="mr-2 h-5 w-5 text-green-400" />
              How to Use this App
            </h4>
            <ol className="list-inside list-decimal space-y-2">
              <li>
                <strong>Add Context (Optional):</strong> Fill in the 'Image Details' on the
                left. Telling the AI your intent (e.g., "I wanted it dark/moody") helps it
                give a fairer critique.
              </li>
              <li>
                <strong>Upload:</strong> Drag & drop your photo into the center box, or click to browse.
              </li>
              <li>
                <strong>Analyze:</strong> Wait 5-15 seconds for the AI to score your work.
              </li>
              <li>
                <strong>Export:</strong> Click the 'Download Result' button to save a professional
                score card as a PNG image.
              </li>
            </ol>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default InstructionsAccordion;
