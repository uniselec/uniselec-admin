import { Box, Card, Typography } from "@mui/material";
import { useState, useEffect } from "react";
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

// Lista completa de UFs do Brasil
const allUFs = [
  "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MG", "MS",
  "MT", "PA", "PB", "PE", "PI", "PR", "RJ", "RN", "RO", "RR", "RS", "SC", "SE", "SP", "TO"
];

// Tipando o import de JSON explicitamente
const applications: Application[] = applicationsData as Application[];

export const ApplicationList = () => {
  const [ufCount, setUfCount] = useState<Record<string, number>>({});

  useEffect(() => {
    const count: Record<string, number> = {};
    // Inicializando a contagem para todas as UFs com 0
    allUFs.forEach((uf) => {
      count[uf] = 0;
    });
    // Contando as UFs presentes nos dados
    applications.forEach((application) => {
      const uf = application.data.uf;
      if (count[uf] !== undefined) {
        count[uf] += 1;
      }
    });
    setUfCount(count);
  }, []);

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Lista de Applications por UF
      </Typography>
      <Card sx={{ minWidth: 275, p: 2 }}>
        {Object.keys(ufCount).map((uf) => (
          <Typography key={uf}>
            {uf}: {ufCount[uf]}
          </Typography>
        ))}
      </Card>
    </Box>
  );
};
