import React, { useEffect, useState } from 'react';
import { Button, Box, Typography, CircularProgress, MenuItem, Select, FormControl, InputLabel, Card, CardContent, List, ListItem, ListItemText } from '@mui/material';
import { useGetApplicationsQuery } from './applicationSlice';
import { saveAs } from 'file-saver';

const modalities = [
  { label: "AC: Ampla Concorrência", value: "AC" },
  { label: "LB - PPI: Candidatos autodeclarados pretos, pardos ou indígenas, com renda familiar bruta per capita igual ou inferior a 1 salário mínimo e que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012).", value: "LB - PPI" },
  { label: "LB - Q: Candidatos autodeclarados quilombolas, com renda familiar bruta per capita igual ou inferior a  1 salário mínimo e que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012).", value: "LB - Q" },
  { label: "LB - PCD: Candidatos com deficiência, que tenham renda familiar bruta per capita igual ou inferior a 1 salário mínimo e que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012).", value: "LB - PCD" },
  { label: "LB - EP: Candidatos com renda familiar bruta per capita igual ou inferior a 1 salário mínimo que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012).", value: "LB - EP" },
  { label: "LI - PPI: Candidatos autodeclarados pretos, pardos ou indígenas, independentemente da renda, que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012).", value: "LI - PPI" },
  { label: "LI - Q: Candidatos autodeclarados quilombolas, independentemente da renda, tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012).", value: "LI - Q" },
  { label: "LI - PCD: Candidatos com deficiência, independentemente da renda, que tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012).", value: "LI - PCD" },
  { label: "LI - EP: Candidatos que, independentemente da renda, tenham cursado integralmente o ensino médio em escolas públicas (Lei nº 12.711/2012).", value: "LI - EP" },
];

const countApplicationsByModality = (applications: any[]) => {
  const counts: Record<string, { deferred: number, notDeferred: number }> = {};
  modalities.forEach(modality => {
    counts[modality.value] = { deferred: 0, notDeferred: 0 };
  });

  applications.forEach(app => {
    if (app.data.vaga && Array.isArray(app.data.vaga)) {
      app.data.vaga.forEach((vaga: string) => {
        const modality = modalities.find(modality => vaga.startsWith(modality.value));
        if (modality) {
          const enem = app.data.enem;
          const isDeferred = enem && enem.length === 12 && enem.startsWith('23');
          if (isDeferred) {
            counts[modality.value].deferred++;
          } else {
            counts[modality.value].notDeferred++;
          }
        }
      });
    }
  });

  // Total count for AC
  counts["AC"] = applications.reduce((acc, app) => {
    const enem = app.data.enem;
    const isDeferred = enem && enem.length === 12 && enem.startsWith('23');
    if (isDeferred) {
      acc.deferred++;
    } else {
      acc.notDeferred++;
    }
    return acc;
  }, { deferred: 0, notDeferred: 0 });

  return counts;
};

const paginateApplications = (applications: any[], pageSize: number) => {
  const pages = [];
  for (let i = 0; i < applications.length; i += pageSize) {
    pages.push(applications.slice(i, i + pageSize));
  }
  return pages;
};

const downloadCSV = (applications: any[], fileNamePrefix: string) => {
  const pages = paginateApplications(applications, 1000);
  const totalPages = pages.length;
  pages.forEach((page, index) => {
    const csvContent = page.map(app => app.data.enem).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${fileNamePrefix}_parte_${index + 1}_de_${totalPages}.txt`);
  });
};

const filterDeferredApplications = (applications: any[]) => {
  return applications.filter(app => {
    const enem = app.data.enem;
    return enem && enem.length === 12 && enem.startsWith('23');
  });
};

export const ApplicationCSVDownload = () => {
  const [page, setPage] = useState(1);
  const [allApplications, setAllApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedModality, setSelectedModality] = useState<string>("");
  const { data, isFetching, error } = useGetApplicationsQuery({ page, perPage: 1000 });

  useEffect(() => {
    if (data && !isFetching) {
      setAllApplications(prevState => [...prevState, ...data.data]);
      if (data.meta.current_page < data.meta.last_page && page < 4) {
        setPage(prevPage => prevPage + 1);
      } else {
        setIsLoading(false);
      }
    }
  }, [data, isFetching]);

  const handleDownloadByModality = () => {
    if (!selectedModality) return;

    let filteredApplications = allApplications;

    if (selectedModality !== "AC") {
      filteredApplications = filteredApplications.filter(app =>
        app.data.vaga && Array.isArray(app.data.vaga) && app.data.vaga.some((vaga: string) => vaga.startsWith(selectedModality))
      );
    }

    const deferredApplications = filterDeferredApplications(filteredApplications);
    downloadCSV(deferredApplications, `inscricoes_enem_${selectedModality}`);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography>Error fetching applications</Typography>;
  }

  const modalityCounts = countApplicationsByModality(allApplications);

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Download arquivo CSV para o INEP
        </Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="modality-select-label">Selecionar Modalidade</InputLabel>
          <Select
            labelId="modality-select-label"
            value={selectedModality}
            label="Selecionar Modalidade"
            onChange={(e) => setSelectedModality(e.target.value)}
          >
            {modalities.map((modality) => (
              <MenuItem key={modality.value} value={modality.value}>
                {modality.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" color="secondary" onClick={handleDownloadByModality}>
          Download CSV por Modalidade
        </Button>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Contagem de Inscrições por Modalidade
          </Typography>
          <List>
            {modalities.map((modality) => (
              <ListItem key={modality.value}>
                <ListItemText primary={`${modality.value}: ${modalityCounts[modality.value].deferred} deferidos, ${modalityCounts[modality.value].notDeferred} indeferidos`} />
              </ListItem>
            ))}
          </List>
        </Box>
      </CardContent>
    </Card>
  );
};
