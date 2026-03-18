import type { z } from 'zod';
import type { critiquePhoto } from '@/ai/flows/critique-photo-flow';

type CritiquePhotoFlow = typeof critiquePhoto;

// Extract input and output types from the Zod schemas within the flow
export type CritiquePhotoInput = Parameters<CritiquePhotoFlow>[0];

// The output of the flow is a Promise, so we need to unwrap it
type Awaited<T> = T extends PromiseLike<infer U> ? U : T;
export type CritiquePhotoOutput = Awaited<ReturnType<CritiquePhotoFlow>>;

// We can also extract the individual item type for convenience
export type CritiqueItem = CritiquePhotoOutput['technicalMerit'][0];
