import React, { useState } from "react";
import { Grid, Card, CardContent, Typography, Box, CircularProgress, Switch, FormControlLabel } from "@mui/material";
import { Link } from "react-router-dom";
import { useGetApplicationOutcomesQuery } from "./applicationOutcomeSlice";

const categories = [
  { id: 1, label: "LB - PPI", vagas: 5 },
  { id: 2, label: "LB - Q", vagas: 1 },
  { id: 3, label: "LB - PCD", vagas: 1 },
  { id: 4, label: "LB - EP", vagas: 1 },
  { id: 5, label: "LI - PPI", vagas: 5 },
  { id: 6, label: "LI - Q", vagas: 0 },
  { id: 7, label: "LI - PCD", vagas: 1 },
  { id: 8, label: "LI - EP", vagas: 1 },
  { id: 9, label: "AC: Ampla Concorrência", vagas: 8 },
];

export const CategoryCards = () => {
  const [showPending, setShowPending] = useState(true); // Estado para o switch
  const [options, setOptions] = useState({
    page: 1,
    search: "",
    perPage: 10,
    rowsPerPage: [10, 20, 30],
  });

  const { data, isFetching, error } = useGetApplicationOutcomesQuery(options);

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowPending(event.target.checked);
  };

  if (isFetching) {
    return (
      <Box sx={{ padding: 2 }}>
        <Grid container spacing={2}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.id}>
              <Card sx={{ cursor: "pointer", height: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CardContent>
                  <CircularProgress />
                  <Typography variant="body2" sx={{ marginTop: 2, textAlign: 'center' }}>
                    Carregando...
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      {/* Switch para exibir com ou sem pendentes */}
      <FormControlLabel
        control={
          <Switch
            checked={showPending}
            onChange={handleSwitchChange}
            color="primary"
          />
        }
        label="Exibir Pendentes"
        sx={{ marginBottom: 2 }}
      />

      <Grid container spacing={2}>
        {categories.map((category) => {
          const filteredOutcomes = data?.data?.filter((outcome) => {
            const isApprovedOrPending =
              outcome.status === 'approved' || (showPending && outcome.status === 'pending');

            if (category.label === 'AC: Ampla Concorrência') {
              return isApprovedOrPending;
            }

            return isApprovedOrPending && outcome.application?.data?.vaga.includes(category.label);
          });

          return (
            <Grid item xs={12} sm={6} md={4} key={category.id}>
              <Link to={`/applications-results/${category.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card sx={{ cursor: "pointer", height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6">{category.label}</Typography>
                    <Typography variant="body2">
                      Vagas: {category.vagas}
                    </Typography>
                    <Typography variant="body2">
                      Candidatos: {filteredOutcomes?.length || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};
