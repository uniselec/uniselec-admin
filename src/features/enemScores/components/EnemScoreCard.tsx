import {
  Box,
  Button,
  FormControl,
  Grid,
  TextField,
} from "@mui/material";

  import { Link } from "react-router-dom";
import { EnemScore } from "../../../types/EnemScore";

  type Props = {
    enemScore: EnemScore;
    isLoading?: boolean;

  };

  export function EnemScoreCard({
    enemScore,
    isLoading = false
  }: Props) {
    return (
      <Box p={2}>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              {enemScore.enem}
            </Grid>




            <Grid item xs={12}>
              <Box display="flex" gap={2}>
                <Button variant="contained" component={Link} to="/enemScores">
                  Back
                </Button>


              </Box>
            </Grid>
          </Grid>
      </Box>
    );
  }