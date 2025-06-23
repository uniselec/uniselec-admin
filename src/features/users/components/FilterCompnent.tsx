import React, { useState, useEffect, useMemo } from "react";
import { Autocomplete, Box, Button, IconButton, TextField, MenuItem } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Select from "react-select";
import useTranslate from "../../polyglot/useTranslate";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/locale/pt"; // Importando o idioma PT-PT
import { useGetUsersQuery } from "../../users/userSlice";




dayjs.locale("pt");

const customStyles = {
  control: (styles: any) => ({ ...styles, backgroundColor: "white", color: "#000" }),
  menu: (styles: any) => ({ ...styles, color: "#000" }),
  singleValue: (styles: any) => ({ ...styles, color: "#000" }),
};

interface FilterOption {
  key: string;
  label: string;
  value: string;
}

interface FilterComponentProps {
  onFilterChange: (filters: Record<string, string>) => void;
}

export const FilterComponent = ({ onFilterChange }: FilterComponentProps) => {
  const translate = useTranslate("filters.user");
  const translateOrderStatus = useTranslate("users.status");

  const availableFilters: FilterOption[] = [
    { key: "id", label: translate("id"), value: "" },
    { key: "name", label: translate("name"), value: "" },
    { key: "created_at", label: translate("created_at"), value: "" },
    { key: "email", label: translate("email"), value: "" },
  ];



  const [filters, setFilters] = useState<FilterOption[]>([]);
  const [availableFilterOptions, setAvailableFilterOptions] = useState<FilterOption[]>(availableFilters);

  useEffect(() => {
    const selectedKeys = filters.map((filter) => filter.key);
    setAvailableFilterOptions(availableFilters.filter((filter) => !selectedKeys.includes(filter.key)));
  }, [filters]);

  const handleFilterChange = (index: number, newValue: string) => {
    const newFilters = [...filters];
    newFilters[index].value = newValue;
    setFilters(newFilters);
  };

  const handleDateChange = (index: number, newDate: any) => {
    const formattedDate = newDate ? dayjs(newDate).format("YYYY-MM-DD") : "";
    handleFilterChange(index, formattedDate);
  };

  const handleApplyFilters = () => {
    const filtersObject: Record<string, string> = {};
    filters.forEach((filter) => {
      if (filter.value) {
        filtersObject[filter.key] = filter.value;
      }
    });
    onFilterChange(filtersObject);
  };

  const handleAddFilter = (option: FilterOption | null) => {
    if (option) {
      setFilters([...filters, { ...option, value: "" }]);
    }
  };

  const handleRemoveFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };


  const { data: usersData } = useGetUsersQuery(
    { page: 1, perPage: 25, filters: {} }
  );

  // transforma em opções [{ label, value }]
  const userOptions = useMemo(() => {
    if (!usersData?.data) return [];
    return usersData.data.map((e: any) => ({
      label: e.name,
      value: e.id,
    }));
  }, [usersData]);

  return (
    <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
      {filters.map((filter, index) => (
        <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {filter.key === "created_at" ? (
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt">
              <DatePicker
                label={translate("created_at")}
                value={filter.value ? dayjs(filter.value) : null}
                onChange={(newDate) => handleDateChange(index, newDate)}
                format="DD/MM/YYYY" // Formato PT-PT
                slotProps={{ textField: { size: "small", variant: "outlined" } }}
              />
            </LocalizationProvider>
          )

            : filter.key === "user" ?
              (
                <>
                  <Autocomplete
                    size="small"
                    sx={{ minWidth: 240 }}
                    options={userOptions}
                    loading={!usersData}
                    onChange={(_, option) => handleFilterChange(index, option ? (option as any).value : "")}
                    getOptionLabel={(option) => (typeof option === "string" ? option : (option as any).label)}
                    renderInput={(params) => (
                      <TextField {...params} label={filter.label} variant="outlined" />
                    )}
                    value={
                      userOptions.find((o) => o.value === filter.value) || null
                    }
                  />
                </>
              )
               : (
                  <TextField
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleApplyFilters();
                      }
                    }}
                    label={filter.label}
                    value={filter.value}
                    onChange={(e) => handleFilterChange(index, e.target.value)}
                    variant="outlined"
                    size="small"
                  />
                )}
          <IconButton onClick={() => handleRemoveFilter(index)} size="small" color="secondary">
            <CloseIcon />
          </IconButton>
        </Box>
      ))}

      <Select
        styles={customStyles}
        options={availableFilterOptions}
        onChange={handleAddFilter}
        placeholder={translate("add filter")}
        value={null}
        getOptionLabel={(option) => option ? option.label : ""}
      />

      <Button variant="contained" onClick={handleApplyFilters}>
        {translate("apply filter")}
      </Button>
    </Box>
  );
};
