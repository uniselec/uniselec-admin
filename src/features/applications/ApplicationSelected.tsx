import { Box, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetApplicationQuery
} from "./applicationSlice";
import { Application } from "../../types/Application";
import { ApplicationCard } from "./components/ApplicationCard";

export const ApplicationSelected = () => {
  const id = useParams().id as string;
  const { data: application, isFetching } = useGetApplicationQuery({ id });
  const [isdisabled, setIsdisabled] = useState(false);


  if(application?.data === undefined) {
      return (<>Carregando dados...</>);
  }

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Paper>
        <Box p={2}>
          <Box mb={2}>
            <Typography variant="h4">Detalhes da Inscrição</Typography>
          </Box>
        </Box>
        <ApplicationCard
          isLoading={false}
          application={application}
        />
      </Paper>
    </Box>
  );
};