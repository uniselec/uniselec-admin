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
  DropResult,
} from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import { AdmissionCategory } from "../../../types/AdmissionCategory";

/* ------------------------------------------------------------------ */
/* NOVO formato:
   {
     order: ["AC","LI - PCD","LI - EP"],     // ← ordem global
     AC:        ["LI - PCD","LI - EP"],      // ← destinos
     "LI - PCD":["LI - EP","AC"],
     …
   }
   (continua 100 % retro-compatível: se chegar no “jeito antigo”
   convertemos on-the-fly.)
--------------------------------------------------------------------- */
export interface RemapRules {
  order: string[];
  [categoryName: string]: string[] | string[];
}

/* ------------------------------------------------------------------ */
/* Props */
interface ChainsEditorProps {
  open: boolean;
  onClose: () => void;
  value: RemapRules | null;
  categories: AdmissionCategory[];
  onSave: (rules: RemapRules | null) => void;
}

/* Helpers ----------------------------------------------------------- */
const buildDefault = (cats: AdmissionCategory[]): RemapRules => {
  const names = cats.map((c) => c.name);
  const chains: RemapRules = { order: [...names] };
  names.forEach((n) => {
    chains[n] = names.filter((o) => o !== n);
  });
  return chains;
};

/* Converte regras antigas (chave numérica ou sem “order”) ----------- */
const migrateRules = (
  raw: any,
  cats: AdmissionCategory[],
): RemapRules => {
  if (!raw) return buildDefault(cats);

  /*         ids → names           */
  const idToName: Record<number, string> = {};
  cats.forEach((c) => (idToName[c.id!] = c.name));

  /* já está no modelo novo? */
  if (raw.order && Array.isArray(raw.order)) {
    return raw as RemapRules;
  }

  /* modelo antigo */
  const migrated: RemapRules = { order: [] };
  Object.entries(raw).forEach(([k, arr]) => {
    const originName = isNaN(Number(k)) ? k : idToName[Number(k)];
    migrated.order.push(originName);
    migrated[originName] = (arr as (string | number)[])
      .map((x) => (typeof x === "number" ? idToName[x] : x))
      .filter(Boolean) as string[];
  });

  /* garante todas as categorias */
  cats.forEach((c) => {
    if (!migrated.order.includes(c.name)) migrated.order.push(c.name);
    if (!migrated[c.name])
      migrated[c.name] = migrated.order.filter((n) => n !== c.name);
  });

  return migrated;
};

/* ------------------------------------------------------------------ */
/* Componente */
export default function ChainsEditor({
  open,
  onClose,
  value,
  categories,
  onSave,
}: ChainsEditorProps) {
  const [rules, setRules] = useState<RemapRules>({ order: [] });

  /* -------- inicialização / quando categorias mudam --------------- */
  useEffect(() => {
    setRules(migrateRules(value, categories));
  }, [value, categories]);

  /* -------- Drag & Drop: categorias (ordem global) ---------------- */
  const handleCategoryDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newOrder = Array.from(rules.order);
    const [moved] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, moved);
    setRules({ ...rules, order: newOrder });
  };

  /* -------- Drag & Drop: destinos dentro de cada categoria -------- */
  const handleTargetsDragEnd = (
    result: DropResult,
    originName: string,
  ) => {
    if (!result.destination) return;

    const items = Array.from(rules[originName] as string[]);
    const [removed] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, removed);

    setRules({ ...rules, [originName]: items });
  };

  const deleteTarget = (origin: string, target: string) => {
    setRules({
      ...rules,
      [origin]: (rules[origin] as string[]).filter((t) => t !== target),
    });
  };

  /* -------- salvar ----------------------------------------------- */
  const handleSave = () => onSave(rules);

  /* ---------------------------------------------------------------- */
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Sequência de redistribuição de vagas</DialogTitle>

      {/* ===================== ORDEM DAS LISTAS ===================== */}
      <DialogContent dividers sx={{ maxHeight: 520 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
          Arraste os blocos para definir <strong>a ordem geral</strong>. <br />
          Dentro de cada bloco, arraste as modalidades destino.
        </Typography>

        <DragDropContext onDragEnd={handleCategoryDragEnd}>
          <Droppable droppableId="categories-droppable" type="CATEGORY">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {rules.order.map((catName, catIndex) => {
                  const catObj = categories.find((c) => c.name === catName);
                  if (!catObj) return null;

                  return (
                    <Draggable
                      key={catName}
                      draggableId={`cat-${catName}`}
                      index={catIndex}
                    >
                      {(dragCat) => (
                        <Paper
                          ref={dragCat.innerRef}
                          {...dragCat.draggableProps}
                          sx={{
                            p: 2,
                            mb: 2,
                            bgcolor: "grey.50",
                            border: "1px solid #ccc",
                          }}
                        >
                          {/* cabeçalho do bloco ------------------- */}
                          <Typography
                            variant="subtitle1"
                            fontWeight="bold"
                            gutterBottom
                            {...dragCat.dragHandleProps} // ← pega aqui
                            sx={{ cursor: "grab" }}
                          >
                            {catName}
                          </Typography>

                          {/* destinos ----------------------------- */}
                          <DragDropContext
                            onDragEnd={(res) =>
                              handleTargetsDragEnd(res, catName)
                            }
                          >
                            <Droppable
                              droppableId={`targets-${catName}`}
                              type={`TARGETS-${catName}`}
                              direction="horizontal"
                            >
                              {(prov) => (
                                <div
                                  ref={prov.innerRef}
                                  {...prov.droppableProps}
                                  style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 8,
                                  }}
                                >
                                  {(rules[catName] as string[]).map(
                                    (targetName, idx) => (
                                      <Draggable
                                        key={targetName}
                                        draggableId={`t-${catName}-${targetName}`}
                                        index={idx}
                                      >
                                        {(dragT) => (
                                          <Paper
                                            ref={dragT.innerRef}
                                            {...dragT.draggableProps}
                                            {...dragT.dragHandleProps}
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
                                                deleteTarget(
                                                  catName,
                                                  targetName,
                                                )
                                              }
                                              sx={{
                                                ml: 0.5,
                                                color: "inherit",
                                              }}
                                            >
                                              <DeleteIcon fontSize="small" />
                                            </IconButton>
                                          </Paper>
                                        )}
                                      </Draggable>
                                    ),
                                  )}
                                  {prov.placeholder}
                                </div>
                              )}
                            </Droppable>
                          </DragDropContext>
                        </Paper>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
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
