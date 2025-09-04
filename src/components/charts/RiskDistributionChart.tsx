import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { name: 'Riesgo Bajo', value: 1002, color: 'hsl(var(--success))' },
  { name: 'Riesgo Medio', value: 156, color: 'hsl(var(--warning))' },
  { name: 'Riesgo Alto', value: 89, color: 'hsl(var(--destructive))' },
];

const RiskDistributionChart = () => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Distribución de Riesgos</CardTitle>
        <CardDescription>
          Clasificación actual de estudiantes por nivel de riesgo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RiskDistributionChart;