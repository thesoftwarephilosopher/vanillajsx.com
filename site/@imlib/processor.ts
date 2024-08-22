import { processSite, SiteProcessor } from "@imlib/core";

export default (files => {
  const allFiles = [...files];
  const out = processSite(allFiles);
  out.set('/token-provider.ts', allFiles.find(f => f.path === '/token-provider.js')!.module!.source);
  out.set('/monarch/samplecode.tsx', allFiles.find(f => f.path === '/monarch/samplecode.js')!.module!.source);
  return out;
}) as SiteProcessor;
