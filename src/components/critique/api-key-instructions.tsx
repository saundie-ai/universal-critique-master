import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { KeyRound } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ApiKeyInstructionsProps {
    apiKey: string;
    setApiKey: (key: string) => void;
}

const ApiKeyInstructions: React.FC<ApiKeyInstructionsProps> = ({ apiKey, setApiKey }) => {
  return (
    <Alert variant="default" className="border-primary/50 bg-primary/5">
        <KeyRound className="h-5 w-5 text-primary" />
        <AlertTitle className="font-bold text-primary">Setup Required</AlertTitle>
        <AlertDescription>
            <div className="space-y-4 text-foreground">
                <p>This application uses the Google Gemini API. Please enter your key below, or follow the steps to create one.</p>
                
                <div className="space-y-1">
                    <Label htmlFor="api-key-input" className="text-xs uppercase tracking-wider">Your Google Gemini API Key</Label>
                    <Input 
                        id="api-key-input"
                        type="password"
                        placeholder="Enter your API key here"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="bg-background/80"
                    />
                </div>

                <div className="text-xs text-muted-foreground">
                    <p className="mb-2 font-semibold">Alternatively, for persistent use:</p>
                    <ol className="list-inside list-decimal space-y-2">
                        <li>Visit <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline">Google AI Studio</a> to generate an API key.</li>
                        <li>Create a new file named <code>.env</code> in the main project folder.</li>
                        <li>Add your key to the <code>.env</code> file like this:
                            <pre className="mt-2 rounded-md bg-card p-2 font-mono text-xs"><code>GEMINI_API_KEY=YOUR_API_KEY_HERE</code></pre>
                        </li>
                        <li className="font-semibold">Important: You must restart the application after creating or modifying the <code>.env</code> file.</li>
                    </ol>
                </div>
            </div>
        </AlertDescription>
    </Alert>
  );
};

export default ApiKeyInstructions;
