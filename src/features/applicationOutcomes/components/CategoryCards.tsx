import React, { useState } from "react";
import { Grid, Card, CardContent, Typography, Box, CircularProgress, Switch, FormControlLabel } from "@mui/material";
import { Link } from "react-router-dom";
import { Results } from "../../../types/ApplicationOutcome";


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

type Props = {
  applicationOutcomes: Results | undefined;
  isFetching: boolean;
};

export function CategoryCards({
  applicationOutcomes,
  isFetching,
}: Props) {

  if (isFetching) {
    return (
      <Box sx={{ padding: 2 }}>
        <Grid container spacing={2}>
          <Card sx={{ cursor: "pointer", height: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CardContent>
              <CircularProgress />
              <Typography variant="body2" sx={{ marginTop: 2, textAlign: 'center' }}>
                Carregando...
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      {/* {JSON.stringify(applicationOutcomes)} */}
      <Grid container spacing={2}>
        {categories.map((category) => {
          return (
            <Grid item xs={12} sm={6} md={4} key={category.id}>
              <Link to={`/applications-results/${category.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card sx={{ cursor: "pointer", height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6">{category.label}</Typography>

                    <Typography variant="body2">

                      Vagas: {category.vagas}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          );
        })}
        <Grid item xs={12} sm={6} md={4} key={9}>
          <Link to={`/applications-results/no20/${9}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Card sx={{ cursor: "pointer", height: "100%" }}>
              <CardContent>
                <Typography variant="h6">{"AC: Ampla Concorrência - Sem Bonificação de 20%"}</Typography>
                <Typography variant="body2">
                  Vagas: 8
                </Typography>
                {/* <Typography variant="body2">
                      Candidatos: {filteredOutcomes?.length || 0}
                    </Typography> */}
              </CardContent>
            </Card>
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
}
