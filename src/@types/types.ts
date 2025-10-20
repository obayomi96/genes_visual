export interface Gene {
  ensembl: string;
  geneSymbol: string;
  name: string;
  biotype: string;
  chromosome: string;
  start: number;
  end: number;
  length?: number;
}

export interface GeneExpression {
  geneSymbol: string;
  tissue: string;
  expressionValue: number;
}

export interface DifferentialStats {
  geneSymbol: string;
  foldChange: number;
  pValue: number;
  meanExpression: number;
}
