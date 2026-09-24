import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';

export type TrendDirection = 'up' | 'down';
export type TrendCardColor = 'primary' | 'info' | 'success' | 'warning' | 'error';

export interface TrendCardProps {
  value: React.ReactNode;
  label: string;
  trend: TrendDirection;
  data: number[];
  chartType?: 'line' | 'bar';
  color?: TrendCardColor;
}

export default function TrendCard({
  value,
  label,
  trend,
  data,
  chartType = 'line',
  color = 'primary',
}: TrendCardProps) {
  const theme = useTheme();
  const chartColor = theme.palette[color].main;
  const trendColor = trend === 'up' ? theme.palette.info.main : theme.palette.error.main;
  const TrendIcon = trend === 'up' ? ArrowDropUpIcon : ArrowDropDownIcon;

  return (
    <Card variant="outlined" sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Stack spacing={0.5}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
        <Stack direction="row" spacing={0} sx={{ alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          <TrendIcon sx={{ color: trendColor, fontSize: 20 }} />
        </Stack>
      </Stack>
      <Box sx={{ height: 72, mx: -1.5 }}>
        <SparkLineChart
          data={data}
          plotType={chartType}
          color={chartColor}
          area={chartType === 'line'}
          height={72}
          showTooltip
          showHighlight
        />
      </Box>
    </Card>
  );
}
