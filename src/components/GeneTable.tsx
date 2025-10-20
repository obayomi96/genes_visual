import React, { useEffect, useMemo, useState } from 'react';
import {
  MantineReactTable,
  useMantineReactTable,
  MRT_ColumnDef,
} from 'mantine-react-table';
import { Box, Center, Loader, Alert, Button, Paper } from '@mantine/core';
import { loadGeneDataFromFile } from '../utils/loadCsvFile';
import type { Gene } from '../@types/types';
import GeneDetails from './GeneDetails';
import { getBiotypeColor } from '../utils/helpers';

const currentlySelectedGenes = (
  genes: Gene[],
  selectedEnsembls: Set<string>,
) => {
  return genes.filter((item) => selectedEnsembls.has(item.ensembl));
};

const GeneTable: React.FC = () => {
  const [genes, setGenes] = useState<Gene[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGenes, setSelectedGenes] = useState<Gene[]>([]);

  useEffect(() => {
    setLoading(true);
    loadGeneDataFromFile('/data/genes_human.csv')
      .then((data) => {
        setGenes(data);
        setError(null);
      })
      .catch((err) => {
        setGenes([]);
        setError('Failed to load human gene data.');
        throw new Error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const columns = useMemo<MRT_ColumnDef<Gene>[]>(
    () => [
      {
        accessorKey: 'ensembl',
        header: 'Ensembl',
      },
      {
        accessorKey: 'geneSymbol',
        header: 'Gene Symbol',
        Cell: ({ cell }) => cell.getValue<string>() || 'N/A',
      },
      {
        accessorKey: 'name',
        header: 'Name',
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          return (
            <Box>
              {value && value.length > 50
                ? value.slice(0, 37) + '...'
                : value || 'N/A'}
            </Box>
          );
        },
      },
      {
        accessorKey: 'biotype',
        header: 'Biotype',
        Cell: ({ cell }) => {
          const value = cell.getValue<string>();
          return (
            <Box style={{ display: 'flex', alignItems: 'center' }}>
              <span
                style={{
                  height: '8px',
                  width: '8px',
                  marginRight: '6px',
                  backgroundColor: getBiotypeColor(value || ''),
                }}
              ></span>
              {value || 'N/A'}
            </Box>
          );
        },
      },
      {
        accessorKey: 'chromosome',
        header: 'Chromosome',
        Cell: ({ cell }) => <Box>{cell.getValue<string>() || 'N/A'}</Box>,
      },
    ],
    [],
  );

  const table = useMantineReactTable({
    columns,
    data: genes,
    enableRowSelection: true,
    enableMultiRowSelection: true,
    enableSorting: false,
    mantineTableBodyRowProps: ({ row }) => ({
      onClick: () => {
        const gene = row.original;
        setSelectedGenes((prev) => {
          const exists = prev.find((item) => item.ensembl === gene.ensembl);
          if (exists) {
            currentlySelectedGenes(
              genes,
              new Set(prev.map((item) => item.ensembl)),
            );
            return prev.filter((item) => item.ensembl !== gene.ensembl);
          }
          currentlySelectedGenes(
            genes,
            new Set([...prev.map((item) => item.ensembl), gene.ensembl]),
          );
          return [...prev, gene];
        });
        row.toggleSelected();
      },
      sx: {
        backgroundColor: row.getIsSelected() ? '#e0f2fe' : 'transparent',
        '&:hover': { backgroundColor: '#f8f9fa' },
        cursor: 'pointer',
      },
    }),
    initialState: { density: 'xs' },
    mantineTableProps: { highlightOnHover: true, withColumnBorders: false },
    state: { isLoading: loading },
  });

  if (loading) {
    return (
      <Center style={{ height: '60vh' }}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center style={{ height: '60vh' }}>
        <Alert color="red" title="Error">
          {error}
          <Button mt="md" onClick={() => window.location.replace('/')}>
            Retry
          </Button>
        </Alert>
      </Center>
    );
  }

  return (
    <Box
      style={{
        padding: '20px',
        position: 'relative',
        width: '100%',
        border: '0px',
      }}
    >
      <Box
        style={{
          display: 'flex',
          gap: '10px',
          height: '100%',
          border: '0px',
          justifyContent: 'between',
          width: '100%',
          alignItems: 'stretch',
        }}
      >
        <Paper
          style={{
            gap: '10px',
            height: '100%',
            border: '0px',
            width: '70%',
            boxSizing: 'border-box',
          }}
        >
          <MantineReactTable table={table} />
        </Paper>
        <Paper
          style={{
            padding: '10px',
            overflowY: 'scroll',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <GeneDetails selectedGenes={selectedGenes} genes={genes} />
        </Paper>
      </Box>
    </Box>
  );
};

export default GeneTable;
