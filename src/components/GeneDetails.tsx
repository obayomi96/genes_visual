import React, { useEffect } from 'react';
import { Card, Text, Group, Badge, Button } from '@mantine/core';
import type { Gene } from '../@types/types';
import ViolinPlot from './ViolinPlot';
import DifferentialAnalysis from './DIfferencialAnalysis';
import GenomeBrowserView from './GenomeBrowserView';
import GeneExpressionChart from './GeneExpessionChart';

type Props = {
  selectedGenes: Gene[];
  genes: Gene[];
};

const GeneDetails = ({ selectedGenes, genes }: Props) => {
  const [geneData, setGeneData] = React.useState<Gene[] | null>(
    selectedGenes || null,
  );

  const initialGene = geneData[0];

  const differentialData = [];
  if (selectedGenes.length > 1) {
    const pairs = selectedGenes.flatMap((a, idx) =>
      selectedGenes.slice(idx + 1).map((b) => [a, b]),
    );
    pairs.forEach(([g1, g2]) => {
      const group1 = genes?.filter(
        (group) => group.geneSymbol === g1.geneSymbol,
      );
      const group2 = genes?.filter(
        (group) => group.geneSymbol === g2.geneSymbol,
      );
      group1.forEach((x, idx) => {
        const y = group2[idx % group2.length];
        differentialData.push({
          geneA: g1.geneSymbol,
          geneB: g2.geneSymbol,
          tissue: x.chromosome,
          expA: x.ensembl,
          expB: y.ensembl,
        });
      });
    });
  }

  useEffect(() => {
    setGeneData(selectedGenes);
  }, [selectedGenes]);

  if (!geneData || geneData.length === 0) {
    return (
      <Card p="md" withBorder radius="md">
        <Text style={{ fontWeight: 700 }}>Gene details</Text>
        <Text color="dimmed" size="sm">
          Select a single gene to view genome browser and expression; select
          multiple for comparisons/differential analysis.
        </Text>
      </Card>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gap: 12,
        overflowY: 'scroll',
        border: '1px solid #ddd',
        padding: '7px',
        borderRadius: '6px',
        position: 'relative',
      }}
    >
      <Button
        style={{
          cursor: 'pointer',
          fontWeight: 'light',
          color: '#14813cff',
          backgroundColor: '#a3eec0ff',
          textAlign: 'right',
          width: '50%',
          padding: '5px',
          borderRadius: '4px',
        }}
        size="sm"
        onClick={() => setGeneData([])}
      >
        Reset!
      </Button>
      <Card radius="md" withBorder>
        <Group>
          <div>
            <Text style={{ fontWeight: 700 }}>
              {initialGene.geneSymbol || initialGene.ensembl}
            </Text>
            <Text size="sm" color="dimmed">
              {initialGene.name}
            </Text>
          </div>
          <div>
            <Badge style={{ backgroundColor: 'gray' }}>
              {initialGene.biotype}
            </Badge>
            <Text size="xs" color="dimmed">
              chr{initialGene.chromosome}:{initialGene.start}-{initialGene.end}
            </Text>
          </div>
        </Group>
      </Card>

      <ViolinPlot genes={geneData} />

      <Card p="sm" withBorder radius="md">
        <Text style={{ fontWeight: 700 }} mb="xs">
          Genome view
        </Text>
        <GeneExpressionChart gene={initialGene} genes={selectedGenes} />
      </Card>

      <DifferentialAnalysis genes={geneData} />

      <Card p="sm" withBorder radius="md">
        <GenomeBrowserView gene={initialGene} />
      </Card>
    </div>
  );
};

export default GeneDetails;
