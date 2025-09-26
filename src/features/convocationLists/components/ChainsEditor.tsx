/* src/features/convocationLists/components/ChainsEditor.tsx */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Paper,
  Typography,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import { useEffect, useState } from "react";

import { AdmissionCategory } from "../../../types/AdmissionCategory";

/* ---------- NOVO tipo de regra (chave = name) ---------- */
export interface RemapRules {
  /** ex.: "AC": ["LB-PPI", "LB-Q"] */
  [categoryName: string]: string[];
}

/* ---------- Props ---------- */
interface ChainsEditorProps {
  open: boolean;
  onClose: () => void;
  value: RemapRules | null;             // regras atuais
  categories: AdmissionCategory[];      // somente as do PS
  onSave: (rules: RemapRules | null) => void;
}

/* ---------- Helpers ---------- */
const buildDefault = (cats: AdmissionCategory[]): RemapRules => {
  const names = cats.map((c) => c.name);
  const def: RemapRules = {};
  names.forEach((n) => {
    def[n] = names.filter((other) => other !== n);
  });
  return def;
};

/* ---------- Componente ---------- */
export default function ChainsEditor({
  open,
  onClose,
  value,
  categories,
  onSave,
}: ChainsEditorProps) {
  /* estado interno sempre baseado em NAMES ------------------------- */
  const [rulesState, setRulesState] = useState<RemapRules>({});

  /* converte regras que vierem com IDs numéricos (versão antiga) ---- */
  const migrateFromIds = (raw: any): RemapRules => {
    if (!raw) return buildDefault(categories);

    const idToName: Record<number, string> = {};
    categories.forEach((c) => (idToName[c.id!] = c.name));

    const converted: RemapRules = {};
    Object.entries(raw).forEach(([key, arr]) => {
      const originName =
        isNaN(Number(key)) ? key : idToName[Number(key)];
      converted[originName] = (arr as (string | number)[])
        .map((x) => (typeof x === "number" ? idToName[x] : x))
        .filter(Boolean) as string[];
    });
    return converted;
  };

  /* sincronia inicial / mudanças de categorias --------------------- */
  useEffect(() => {
    const base = migrateFromIds(value);
    const catNames = categories.map((c) => c.name);

    const complete: RemapRules = {};
    catNames.forEach((name) => {
      complete[name] =
        base[name] ??
        catNames.filter((other) => other !== name);
    });
    setRulesState(complete);
  }, [value, categories]);

  /* drag-and-drop --------------------------------------------------- */
  const onDragEnd = (
    result: any,
    originName: string,
  ) => {
    if (!result.destination) return;

    const items = Array.from(rulesState[originName]);
    const [removed] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, removed);

    setRulesState({ ...rulesState, [originName]: items });
  };

  /* remove destino individual -------------------------------------- */
  const removeTarget = (origin: string, target: string) => {
    setRulesState({
      ...rulesState,
      [origin]: rulesState[origin].filter((t) => t !== target),
    });
  };

  /* salvar ---------------------------------------------------------- */
  const handleSave = () => onSave(rulesState);

  /* UI -------------------------------------------------------------- */
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Ordem de remanejamento de vagas</DialogTitle>

      <DialogContent dividers sx={{ maxHeight: 480 }}>
        {categories.map((cat) => (
          <Paper
            key={cat.name}
            variant="outlined"
            sx={{ p: 2, mb: 2, bgcolor: "grey.50" }}
          >
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {cat.name}
            </Typography>

            <DragDropContext
              onDragEnd={(res) => onDragEnd(res, cat.name)}
            >
              <Droppable droppableId={`drop-${cat.name}`}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    {rulesState[cat.name]?.map((targetName, idx) => (
                      <Draggable
                        key={targetName}
                        draggableId={`drag-${cat.name}-${targetName}`}
                        index={idx}
                      >
                        {(dragProps) => (
                          <Paper
                            ref={dragProps.innerRef}
                            {...dragProps.draggableProps}
                            {...dragProps.dragHandleProps}
                            sx={{
                              px: 1.5,
                              py: 0.5,
                              display: "flex",
                              alignItems: "center",
                              bgcolor: "primary.light",
                              color: "primary.contrastText",
                            }}
                          >
                            {targetName}
                            <IconButton
                              size="small"
                              onClick={() =>
                                removeTarget(cat.name, targetName)
                              }
                              sx={{ ml: 0.5, color: "inherit" }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Paper>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </Paper>
        ))}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSave}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
