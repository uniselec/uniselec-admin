import React from "react";
import {
  Box,
  Button,
  FormControl,
  Grid,
  TextField,
  Typography,
  Autocomplete,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { ConvocationList } from "../../../types/ConvocationList";



type Props = {
  convocationList: ConvocationList;
  isdisabled?: boolean;
  isLoading?: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setConvocationList: React.Dispatch<React.SetStateAction<ConvocationList>>;
};

export function ConvocationListCardDetail({
  convocationList,
  isdisabled = false,
  isLoading = false,
  handleSubmit,
  handleChange,
  setConvocationList,
}: Props) {

  const { id: processSelectionId } = useParams<{ id: string }>();

  return (
    <Box p={2}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Nome do Curso */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                required
                name="name"
                label="Nome do Curso"
                value={convocationList.name || ""}
                disabled={isdisabled}
                onChange={handleChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" gap={2}>
              <Button variant="contained" component={Link}
                to={`/process-selections/${processSelectionId}/convocation-lists`}
              >
                Voltar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={isdisabled || isLoading}
              >
                {isLoading ? "Salvando..." : "Guardar"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
