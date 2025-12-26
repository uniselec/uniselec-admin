import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Tab,
  Tabs,
  Box,
} from "@mui/material";
import { AdmissionCategory } from "../../../types/AdmissionCategory";
import { KnowledgeArea } from "../../../types/KnowledgeArea";
import { CourseCriteria } from "../../../types/Course";
import type { SxProps, Theme } from "@mui/material/styles";

type CourseCriteriaModalProps = {
  courseName: string;
  admissionCategories: AdmissionCategory[];
  knowledgeAreas: KnowledgeArea[];
  currentVacancies: { [key: string]: number } | undefined;
  currentMinimumScores: { [key: string]: number } | undefined;
  onClose: () => void;
  onSave: (criteria: CourseCriteria) => void;
};

const buildInitialMap = <T extends { name?: string; slug?: string }>(
  items: T[],
  currentValues: { [key: string]: number } | undefined
): { [key: string]: number } => {
  return items.reduce<{ [key: string]: number }>((acc, item) => {
    const key = "slug" in item && item.slug ? item.slug : item.name!;
    acc[key] = currentValues?.[key] ?? 0;
    return acc;
  }, {});
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export const noNumberSpinnerSx = (): SxProps<Theme> => ({
  "& input[type=number]": {
    MozAppearance: "textfield", // Firefox
  },
  "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button": {
    WebkitAppearance: "none", // Chrome, Safari, Edge
    margin: 0,
  },
});

export const CourseCriteriaModal: React.FC<CourseCriteriaModalProps> = ({
  courseName,
  admissionCategories,
  knowledgeAreas,
  currentVacancies,
  currentMinimumScores,
  onClose,
  onSave,
}) => {

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [vacanciesMap, setVacanciesMap] = useState<{ [key: string]: number }>(
    () => buildInitialMap(admissionCategories, currentVacancies)
  );

  const [minimumScoresMap, setMinimumScoresMap] = useState<{ [key: string]: number }>(
    () => buildInitialMap(knowledgeAreas, currentMinimumScores) 
  );

  const handleInputChange = (categoryName: string, value: string) => {
    const numberValue = parseInt(value, 10) || 0;
    setVacanciesMap((prev) => ({ ...prev, [categoryName]: numberValue }));
  };

  const handleMinimunScore = (knowledgeAreaName: string, value: string) => {
    const minimumScore = parseFloat(value);
    setMinimumScoresMap((prev) => ({ ...prev, [knowledgeAreaName]: isNaN(minimumScore) ? 0 : minimumScore }));
  }

  const handleSave = () => {
    onSave({
      vacanciesMap: vacanciesMap,
      minimumScoresMap: minimumScoresMap,
    });
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">

      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="Define vagas e nota mínima"
        variant="fullWidth"
        sx={{ width: "100%" }}
      >
        <Tab label="Definir Vagas" {...a11yProps(0)} sx={{ flex: 1 }} />
        <Tab label="Definir nota mínima" {...a11yProps(1)} sx={{ flex: 1 }} />
      </Tabs>

      <CustomTabPanel value={value} index={0}>
        <DialogTitle>Definir Vagas para {courseName}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {admissionCategories.map((cat) => (
              <Grid item xs={12} key={cat.id}>
                <TextField
                  label={`Vagas para ${cat.name}`}
                  type="number"
                  value={vacanciesMap[cat.name]}
                  onChange={(e) => handleInputChange(cat.name, e.target.value)}
                  fullWidth
                  margin="dense"
                  sx={noNumberSpinnerSx()}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </CustomTabPanel>
      
      <CustomTabPanel value={value} index={1}>
        <DialogTitle>Definir nota mínima para</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {knowledgeAreas.map((knowledgeArea) => (
              <Grid item xs={12} key={knowledgeArea.slug}>
                <TextField
                  label={knowledgeArea.name}
                  type="number"
                  value={minimumScoresMap[knowledgeArea.slug]}
                  onChange={(e) => handleMinimunScore(knowledgeArea.slug, e.target.value)}
                  fullWidth
                  margin="dense"
                  sx={noNumberSpinnerSx()}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </CustomTabPanel>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} color="primary">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
