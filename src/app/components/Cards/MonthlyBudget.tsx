import { Card, CardContent, CardOverflow, Typography } from '@mui/joy';

export const MonthlyBudgetCard: React.FC = () => {
  return (
    <Card className="col-span-6">
      <CardOverflow>
        <CardContent>
          <Typography>Monthly Budget</Typography>
          <Typography>This is your monthly budget</Typography>
        </CardContent>
      </CardOverflow>
    </Card>
  );
};
