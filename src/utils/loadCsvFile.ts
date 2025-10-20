import Papa from 'papaparse';
import { Gene } from '../@types/types';

export const loadGeneDataFromFile = async (
  filePath: string,
): Promise<Gene[]> => {
  try {
    const response = await fetch(filePath);
    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        delimiter: ';',
        skipEmptyLines: true,
        complete: (results) => {
          const genes: Gene[] = results?.data.map((row: any) => ({
            ensembl: row.Ensembl || '',
            geneSymbol: row['Gene symbol'] || '',
            name: row.Name || '',
            biotype: row.Biotype || '',
            chromosome: row.Chromosome || '',
            start: parseInt(row['Seq region start']) || 0,
            end: parseInt(row['Seq region end']) || 0,
          }));
          resolve(genes);
        },
        error: (error: Error) => {
          reject(error);
        },
      });
    });
  } catch (error) {
    console.error('Error loading CSV file:', error);
    throw error;
  }
};
