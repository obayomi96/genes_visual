import React from 'react';
import { Box, Paper, Text } from '@mantine/core';
import { Gene } from '../@types/types';
import { getBiotypeColor } from '../utils/helpers';

interface GenomeBrowserViewProps {
  gene: Gene;
}

const GenomeBrowserView: React.FC<GenomeBrowserViewProps> = ({ gene }) => {
  const geneLength = gene.start - gene.start;
  const padding = 10000;
  const viewStart = Math.max(0, gene.start - padding);
  const viewEnd = gene.start + padding;
  const viewLength = viewEnd - viewStart;
  const geneStartRelative = gene.start - viewStart;
  const genePositionPercent = (geneStartRelative / viewLength) * 100;
  const geneWidthPercent = (geneLength / viewLength) * 100;

  return (
    <Box>
      <h2>Genome Browser View</h2>
      <Text size="sm" style={{ marginBottom: '10px' }}>
        <strong>Location:</strong> Chr{gene.chromosome}:{' '}
        {gene.start.toLocaleString()} - {gene.start.toLocaleString()}
      </Text>

      <Paper p="md" style={{ marginBottom: '10px' }}>
        <Text size="xs" color="dimmed" style={{ marginBottom: '5px' }}>
          Chr:{gene.chromosome} ({viewStart.toLocaleString()} -{' '}
          {viewEnd.toLocaleString()})
        </Text>

        <Box
          style={{
            position: 'relative',
            height: '30px',
            background: '#f8f9fa',
            borderRadius: '4px',
          }}
        >
          <Box
            style={{
              position: 'absolute',
              left: `${genePositionPercent}%`,
              width: `${Math.max(geneWidthPercent, 1)}%`,
              height: '100%',
              background: getBiotypeColor(gene.biotype),
              borderRadius: '4px',
              border: '1px solid ' + getBiotypeColor(gene.biotype),
            }}
          />
        </Box>

        <Box
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '5px',
          }}
        >
          <Text size="xs">{viewStart.toLocaleString()}</Text>
          <Text size="xs">{viewEnd.toLocaleString()}</Text>
        </Box>
      </Paper>
    </Box>
  );
};

export default GenomeBrowserView;
