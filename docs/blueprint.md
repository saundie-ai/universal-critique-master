# **App Name**: CritiqueLens AI

## Core Features:

- Image Upload & Preview: Allow users to upload an image via drag-and-drop or file selection, displaying an instant preview.
- Image Metadata & Overlays: Extract and display EXIF data from uploaded images. Provide interactive overlays for composition guides like Rule of Thirds and Golden Ratio.
- Contextual Input: Enable users to input an image title, photographer name, and specific contextual information or artistic intent for a more nuanced critique.
- AI-Powered Photo Critique Tool: Utilize the Gemini API to analyze the uploaded image and user context against predefined technical and artistic criteria, generating scores and detailed commentary. This tool uses reasoning to decide what feedback to incorporate.
- Interactive Critique Display: Present the AI's analysis, including a score summary, closing remarks, a detailed breakdown of technical and artistic merit, and specific post-production recommendations in an organized, responsive UI.
- Critique Export: Allow users to download a professional, styled image of their photo critique report, suitable for sharing or record-keeping.
- API Key Management: Securely manage and store the user's Gemini API key locally in the browser for authenticating AI critique requests.

## Style Guidelines:

- The chosen scheme is dark, reflecting the app's professional and analytical focus. Primary color is a deep, trustworthy blue (#3370D4), evoking focus and reliability in the context of critical evaluation. This contrasts effectively with a dark background. The background is a very dark, slightly desaturated blue-gray (#21252A), providing a clean, non-distracting canvas. The accent color is a vibrant blue-purple (#6A4FF2), chosen for its complementary energy, adding depth and drawing attention to key interactive elements and insights without overwhelming the primary blue.
- Body and headline font: 'Inter', a modern grotesque-style sans-serif, ensuring excellent readability and a contemporary, objective aesthetic. Note: currently only Google Fonts are supported.
- Utilize a consistent set of professional-grade Font Awesome Solid icons to visually represent actions, sections, and criteria, enhancing clarity and user experience (e.g., 'fas fa-cloud-upload-alt', 'fas fa-camera', 'fas fa-key', 'fas fa-chart-pie').
- Implement a responsive two-column layout on wider screens (input/upload on left, critique display on right) that gracefully collapses to a single-column stacked layout on smaller viewports. Content should be organized into clearly delineated cards and sections with generous spacing for readability.
- Incorporate subtle animations for visual feedback, such as a spinning loading indicator during AI analysis, a 'drag-over' state transition for the file drop zone, and smooth hover effects on buttons and interactive elements for a polished feel.