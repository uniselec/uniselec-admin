import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import applicationsData from '../../applications.json';

interface Application {
  id: number;
  user_id: number;
  data: {
    edital: string;
    position: string;
    location_position: string;
    name: string;
    email: string;
    cpf: string;
    birtdate: string;
    sex: string;
    phone1: string;
    social_name?: string;
    address: string;
    city: string;
    uf: string;
    vaga: string[];
    bonus: string[];
    enem: string;
    updated_at: string;
  };
  verification_expected: string;
  verification_code: string;
  valid_verification_code: boolean;
  created_at: string;
  updated_at: string;
}

// Tipando o import de JSON explicitamente
const applications: Application[] = applicationsData as Application[];

interface DatePeriodData {
  datePeriod: string;
  count: number;
}

// Função para determinar o período do dia
const getPeriod = (hour: number): string => {
  if (hour >= 6 && hour < 12) return 'Manhã';
  if (hour >= 12 && hour < 18) return 'Tarde';
  if (hour >= 18 && hour < 24) return 'Noite';
  return 'Madrugada';
};

// Função para ordenação dos períodos
const periodOrder = (period: string): number => {
  switch (period) {
    case 'Manhã': return 1;
    case 'Tarde': return 2;
    case 'Noite': return 3;
    default: return 4;
  }
};

// Função para gerar as datas e períodos
const generateDatePeriodData = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const datePeriodData: DatePeriodData[] = [];

  while (start <= end) {
    const dateStr = start.toISOString().split('T')[0];
    ['Manhã', 'Tarde', 'Noite', 'Madrugada'].forEach((period) => {
      datePeriodData.push({ datePeriod: `${dateStr} - ${period}`, count: 0 });
    });
    start.setDate(start.getDate() + 1);
  }

  return datePeriodData;
};

const ApplicationsChart: React.FC = () => {
  const [datePeriodData, setDatePeriodData] = useState<DatePeriodData[]>([]);

  useEffect(() => {
    const initialData = generateDatePeriodData('2024-08-02', '2024-08-05');
    const datePeriodCounts: Record<string, number> = {};

    applications.forEach((application) => {
      const datetime = new Date(application.data.updated_at);
      const date = datetime.toISOString().split('T')[0];
      const period = getPeriod(datetime.getUTCHours());
      const key = `${date} - ${period}`;
      datePeriodCounts[key] = (datePeriodCounts[key] || 0) + 1;
    });

    // Atualiza os dados iniciais com as contagens reais
    const data = initialData.map(({ datePeriod }) => ({
      datePeriod,
      count: datePeriodCounts[datePeriod] || 0,
    }));

    setDatePeriodData(data);
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={datePeriodData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="datePeriod" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="count" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ApplicationsChart;
