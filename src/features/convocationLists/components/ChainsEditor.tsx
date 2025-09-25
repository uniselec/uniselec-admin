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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useEffect, useState } from 'react';

import { AdmissionCategory } from '../../../types/AdmissionCategory';
import { RemapRules } from '../../../types/ConvocationList';

/* ─────────────────── TIPOS ─────────────────── */
interface ChainsEditorProps {
  open: boolean;
  onClose: () => void;
  /** Regras salvas (ou `null` se nunca definido) */
  value: RemapRules | null;
  /** Categorias que realmente existem no processo seletivo  */
  categories: AdmissionCategory[];
  /** Callback de salvamento  */
  onSave: (rules: RemapRules | null) => void;
}

/* ─────────────────── HELPERS ────────────────── */
/** Gera uma regra padrão: cada categoria remaneja para todas as outras */
const buildDefaultRules = (cats: AdmissionCategory[]): RemapRules => {
  const ids = cats.map((c) => c.id!);
  const defaultRules: RemapRules = {};
  ids.forEach((id) => {
    defaultRules[id] = ids.filter((otherId) => otherId !== id);
  });
  return defaultRules;
};

/* ─────────────────── COMPONENTE ─────────────── */
export default function ChainsEditor({
  open,
  onClose,
  value,
  categories,
  onSave,
}: ChainsEditorProps) {
  /**
   * O estado local precisa de index-signature numérica.
   * Garanta que seu tipo RemapRules tenha esta forma:
   *   export interface RemapRules { [categoryId: number]: number[] }
   */
  const [remapRulesState, setRemapRulesState] = useState<RemapRules>({});

  /* ---------- Sincroniza quando abrir ou mudar categorias ---------- */
  useEffect(() => {
    const initialRules = value ?? buildDefaultRules(categories);

    /* garante que todas as categorias apareçam mesmo se tiver regra faltando */
    const completeRules: RemapRules = {};
    const idsInProcess = categories.map((c) => c.id!);

    idsInProcess.forEach((categoryId) => {
      completeRules[categoryId] =
        initialRules[categoryId] ??
        idsInProcess.filter((id) => id !== categoryId);
    });

    setRemapRulesState(completeRules);
  }, [value, categories]);

  /* ---------- Drag & Drop ---------- */
  const handleDragEnd = (
    result: any,
    originCategoryId: number,
  ) => {
    if (!result.destination) return;

    const updatedTargets = Array.from(
      remapRulesState[originCategoryId],
    );
    const [removed] = updatedTargets.splice(result.source.index, 1);
    updatedTargets.splice(result.destination.index, 0, removed);

    setRemapRulesState({
      ...remapRulesState,
      [originCategoryId]: updatedTargets,
    });
  };

  const handleDeleteTarget = (
    originCategoryId: number,
    targetCategoryId: number,
  ) => {
    setRemapRulesState({
      ...remapRulesState,
      [originCategoryId]: remapRulesState[originCategoryId].filter(
        (id) => id !== targetCategoryId,
      ),
    });
  };

  /* ---------- Salvar ---------- */
  const handleSave = () => onSave(remapRulesState);

  /* ─────────────────── UI ─────────────────── */
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Ordem de remanejamento de vagas</DialogTitle>

      <DialogContent dividers sx={{ maxHeight: 480 }}>
        {categories.map((originCategory) => (
          <Paper
            key={originCategory.id}
            variant="outlined"
            sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}
          >
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {originCategory.name}
            </Typography>

            <DragDropContext
              onDragEnd={(res) =>
                handleDragEnd(res, originCategory.id!)
              }
            >
              <Droppable droppableId={`drop-${originCategory.id}`}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 8,
                    }}
                  >
                    {remapRulesState[originCategory.id!]?.map(
                      (targetCategoryId, index) => {
                        const targetCategory = categories.find(
                          (c) => c.id === targetCategoryId,
                        );
                        if (!targetCategory) return null;

                        return (
                          <Draggable
                            key={targetCategoryId}
                            draggableId={`drag-${originCategory.id}-${targetCategoryId}`}
                            index={index}
                          >
                            {(dragProps) => (
                              <Paper
                                ref={dragProps.innerRef}
                                {...dragProps.draggableProps}
                                {...dragProps.dragHandleProps}
                                sx={{
                                  px: 1.5,
                                  py: 0.5,
                                  display: 'flex',
                                  alignItems: 'center',
                                  bgcolor: 'primary.light',
                                  color: 'primary.contrastText',
                                }}
                              >
                                {targetCategory.name}
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    handleDeleteTarget(
                                      originCategory.id!,
                                      targetCategoryId,
                                    )
                                  }
                                  sx={{
                                    ml: 0.5,
                                    color: 'inherit',
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Paper>
                            )}
                          </Draggable>
                        );
                      },
                    )}
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
