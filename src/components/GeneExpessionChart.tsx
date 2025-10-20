import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { Box, Text } from '@mantine/core';
import { Gene } from '../@types/types';
import { getBiotypeColor } from '../utils/helpers';

interface GeneExpressionChartProps {
  gene: Gene;
  genes: Gene[];
}

const GeneExpressionChart: React.FC<GeneExpressionChartProps> = ({
  gene,
  genes,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);

    const tissues = [
      'Brain',
      'Liver',
      'Heart',
      'Lung',
      'Kidney',
      'Muscle',
      'Skin',
      'Blood',
    ];

    const expressionData = tissues.map((tissue) => ({
      tissue,
      value: Math.random() * genes.length,
    }));

    const option = {
      title: {
        text: 'Expression for Tissues',
        left: 'center',
        textStyle: {
          fontSize: 14,
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params: any) => {
          const data = params[0];
          return `${data?.name}<br/>Expression: ${data?.value.toFixed(2)}`;
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '20%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: tissues,
        axisLabel: {
          rotate: 45,
          fontSize: 10,
        },
      },
      yAxis: {
        type: 'value',
        name: 'Expression Level',
        nameTextStyle: {
          fontSize: 10,
        },
      },
      series: [
        {
          data: expressionData?.map((item) => item.value),
          type: 'bar',
          itemStyle: {
            color: getBiotypeColor(gene.biotype),
          },
          emphasis: {
            itemStyle: {
              opacity: '0.8',
            },
          },
        },
      ],
    };

    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.dispose();
    };
  }, [gene]);

  return (
    <Box>
      <Text size="sm" color="dimmed" style={{ marginBottom: '10px' }}>
        Expression data for {gene.geneSymbol || gene.ensembl}
      </Text>
      <div
        ref={chartRef}
        style={{
          width: '100%',
          height: '250px',
        }}
      />
    </Box>
  );
};

export default GeneExpressionChart;
