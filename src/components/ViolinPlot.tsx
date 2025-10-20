import { useMemo } from 'react';
import { Card, Text } from '@mantine/core';
import Plot from 'react-plotly.js';
import type { Gene } from '../@types/types';
import { simulateExpressionForGene } from '../utils/helpers';

type Props = {
  genes: Gene[];
};

const ViolinPlot = ({ genes }: Props) => {
  const traces = useMemo(() => {
    return genes.map((gene) => {
      const values = simulateExpressionForGene(gene.ensembl, 120);
      return {
        type: 'violin',
        y: values,
        name: gene.geneSymbol || gene.ensembl,
        box: { visible: true },
        meanline: { visible: true },
        points: 'all',
      };
    });
  }, [genes]);

  if (genes.length === 0) {
    return (
      <Card radius="md" withBorder p="sm">
        <Text style={{ fontWeight: 700 }}>Violin / Expression</Text>
        <Text size="sm" color="dimmed">
          Select gene(s) to view expression distribution (simulated).
        </Text>
      </Card>
    );
  }

  return (
    <Card radius="md" withBorder p="sm">
      <Text style={{ fontWeight: 700 }} mb="xs">
        Expression (violin plot)
      </Text>
      <Plot
        data={traces}
        layout={{
          autosize: true,
          height: 340,
          yaxis: { title: 'Simulated expression' },
          margin: { t: 20 },
        }}
        style={{ width: '100%' }}
        useResizeHandler
      />
    </Card>
  );
};

export default ViolinPlot;
