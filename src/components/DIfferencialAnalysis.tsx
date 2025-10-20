import { useMemo } from 'react';
import { Card, Table, Text } from '@mantine/core';
import type { Gene } from '../@types/types';
import { simulateExpressionForGene } from '../utils/helpers';

const mean = (arr: number[]) => {
  return arr.reduce((s, a) => s + a, 0) / arr.length;
};

const std = (arr: number[]) => {
  const m = mean(arr);
  return Math.sqrt(
    arr.reduce((s, a) => s + (a - m) ** 2, 0) / (arr.length - 1 || 1),
  );
};

type Props = { genes: Gene[] };

const DifferentialAnalysis = ({ genes }: Props) => {
  const summary = useMemo(() => {
    return genes.map((value) => {
      const vals = simulateExpressionForGene(value.ensembl, 120);
      return {
        id: value.ensembl,
        name: value.geneSymbol || value.ensembl,
        mean: +mean(vals).toFixed(3),
        sd: +std(vals).toFixed(3),
      };
    });
  }, [genes]);

  const pairs: { a: string; b: string; meanDiff: number }[] = [];

  for (let i = 0; i < summary.length; i++) {
    for (let j = i + 1; j < summary.length; j++) {
      pairs.push({
        a: summary[i].name,
        b: summary[j].name,
        meanDiff: +Math.abs(summary[i].mean - summary[j].mean).toFixed(3),
      });
    }
  }

  if (genes.length < 2) {
    return (
      <Card p="sm" withBorder radius="md">
        <Text style={{ fontWeight: 700 }}>Differential Analysis</Text>
        <Text size="sm" color="dimmed">
          Select two or more genes to compute simple differential statistics
          (mean difference).
        </Text>
      </Card>
    );
  }

  return (
    <Card p="sm" withBorder radius="md">
      <Text style={{ fontWeight: 700 }} mb="xs">
        Differential Analysis (simple)
      </Text>
      <Table>
        <thead>
          <tr>
            <th>Gene A</th>
            <th>Gene B</th>
            <th>|mean(A)-mean(B)|</th>
          </tr>
        </thead>
        <tbody>
          {pairs.map((pair, idx) => (
            <tr key={idx}>
              <td>{pair.a}</td>
              <td>{pair.b}</td>
              <td style={{ fontFamily: 'monospace' }}>{pair.meanDiff}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
};

export default DifferentialAnalysis;
