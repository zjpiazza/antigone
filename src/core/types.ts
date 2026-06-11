export interface ProcessedImage {
  data: Buffer;
  base64: string;
  mimeType: string;
  width: number;
  height: number;
  format: string;
}

export interface ProviderOptions {
  apiKey: string;
  model: string;
}

export interface AnalyzeRequest {
  images: ProcessedImage[];
  prompt: string;
  jsonSchema?: Record<string, unknown>;
}

export interface Provider {
  name: string;
  analyze(request: AnalyzeRequest): Promise<string>;
}

export interface ToolOptions {
  provider?: string;
  model?: string;
  apiKey?: string;
}

export interface DescribeOptions extends ToolOptions {
  prompt?: string;
}

export interface CompareOptions extends ToolOptions {
  prompt?: string;
}

export interface DescribeResult {
  description: string;
  dimensions: { width: number; height: number };
  format: string;
}

export interface Difference {
  description: string;
  severity: "minor" | "major" | "critical";
  location: string;
}

export interface CompareResult {
  summary: string;
  differences: Difference[];
  match_score: number;
}

export interface OcrOptions extends ToolOptions {}

export interface OcrBlock {
  text: string;
  confidence: number;
}

export interface OcrResult {
  text: string;
  blocks: OcrBlock[];
}

export interface CheckUiOptions extends ToolOptions {
  requirements?: string;
  platform?: "ios" | "android";
}

export interface CheckUiIssue {
  description: string;
  severity: "minor" | "major" | "critical";
  guideline: string;
}

export interface CheckUiResult {
  score: number;
  issues: CheckUiIssue[];
  passes: string[];
}
