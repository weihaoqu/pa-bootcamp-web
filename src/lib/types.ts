export interface Exercise {
  slug: string;
  name: string;
  testCount: number;
  order: number;
  difficulty?: 1 | 2 | 3;       // 1=introductory, 2=intermediate, 3=challenging
  estimatedMinutes?: number;
}

export interface ModuleInfo {
  slug: string;
  index: number;
  name: string;
  description: string;
  testCount: number;
  labSlug: string | null;
  hasLearn?: boolean;
  hasExplore?: boolean;
  exercises: Exercise[];
}

export interface LabInfo {
  slug: string;
  name: string;
  moduleIndex: number;
  description: string;
  testCount: number;
}

export interface FileEntry {
  name: string;
  path: string;         // relative path within the exercise/lab
  content: string;
}

export interface SlideData {
  content: string;       // markdown content for this slide
  index: number;
}
