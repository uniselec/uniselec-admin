// src/features/users/components/DownloadCsvButton.tsx
import { Button, Tooltip } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { useExportUsersCsvMutation } from "../userSlice";

type Props = {
  filters: Record<string, string>;   // para exportar o mesmo filtro da lista
};

export default function DownloadCsvButton({ filters }: Props) {
  const [exportCsv, { isLoading }] = useExportUsersCsvMutation();

  const handleClick = async () => {
    try {
      const blob = await exportCsv({ filters }).unwrap();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "users.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Erro ao gerar CSV.");
    }
  };

  return (
    <Tooltip title="Baixar CSV completo">
      <span>
        <Button
          variant="contained"
          color="success"
          size="small"
          startIcon={<DownloadIcon />}
          onClick={handleClick}
          disabled={isLoading}
        >
          CSV
        </Button>
      </span>
    </Tooltip>
  );
}
