'use client';
import { ISMOBILE } from '@/utils/screens';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Typography from '@mui/joy/Typography';
import { PieChart } from '@mui/x-charts/PieChart';

const data = [
  { id: '1', value: 500 },
  { id: '2', value: 300 },
  { id: '3', value: 100 },
  { id: '4', value: 200 },
];

interface SortedRecords {
  id: string;
  label: string;
  value: number;
}

export const MonthlyBudgetCard: React.FC<{
  budget: number;
  records?: Array<SortedRecords>;
  currency?: string;
}> = ({ budget, records, currency = 'USD' }) => {
  return (
    <Card className="col-span-6">
      <CardOverflow>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-0 justify-center">
              <div className="font-bold text-md sm:text-xl md:text-2xl">Monthly Budget</div>
              <div className="text-[11px] sm:text-xs md:text-sm text-start">
                For {new Date().toLocaleDateString(undefined, { month: 'long' })}
              </div>
            </div>
            <div className="flex flex-col gap-0 justify-center">
              <div
                className={`${
                  budget <= 0 ? 'text-green-600' : 'text-red-600'
                } font-bold text-md sm:text-xl md:text-2xl`}
              >
                {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(budget)}
              </div>
              <div className="text-[11px] sm:text-xs md:text-sm text-">{budget <= 0 ? 'Left' : 'Over'}</div>
            </div>
          </div>
          {Array.isArray(records) && records.length ? (
            <PieChart
              series={[
                {
                  data: records,
                  innerRadius: 30,
                  outerRadius: 100,
                  paddingAngle: 5,
                  cornerRadius: 5,
                  startAngle: -90,
                  endAngle: 180,
                  cx: 100,
                  cy: 150,
                },
              ]}
              tooltip={{
                trigger: 'none',
              }}
              slotProps={{
                legend: {
                  hidden: false,
                  labelStyle: {
                    fontSize: 12,
                  },
                  drawingArea: {
                    right: ISMOBILE ? 0 : 100,
                    bottom: ISMOBILE ? 0 : 50,
                    left: ISMOBILE ? 0 : 100,
                    top: ISMOBILE ? 0 : 50,
                    height: ISMOBILE ? 0 : 50,
                    width: ISMOBILE ? 0 : 50,
                  },
                },
              }}
              width={300}
              height={300}
            />
          ) : (
            <div className="relative w-full h-full">
              <div className="absolute top-1/2 left-1/2 lg:left-3/5 transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-default">
                <Typography level="h1" fontSize={'xl'} lineHeight={1.6}>
                  Add your first Transaction for {new Date().toLocaleDateString(undefined, { month: 'long' })}
                </Typography>
              </div>
              <div className="flex opacity-20 z-10 items-center justify-center">
                <PieChart
                  series={[
                    {
                      data,
                      innerRadius: 30,
                      outerRadius: 100,
                      paddingAngle: 5,
                      cornerRadius: 5,
                      startAngle: -90,
                      endAngle: 180,
                      cx: 100,
                      cy: 150,
                    },
                  ]}
                  tooltip={{
                    trigger: 'none',
                  }}
                  slotProps={{
                    legend: {
                      hidden: true,
                    },
                  }}
                  disableAxisListener
                  width={300}
                  height={300}
                />
              </div>
            </div>
          )}
        </CardContent>
      </CardOverflow>
    </Card>
  );
};
