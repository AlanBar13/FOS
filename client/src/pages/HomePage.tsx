import { useEffect, useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Table } from "../models/Table";
import { useAlert } from "../hooks/useAlert";
import { useApi } from "../hooks/ApiProvider";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import CircularProgress from "@mui/material/CircularProgress";
import AppLayout from "../components/Shared/AppLayout";

export default function HomePage() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const api = useApi();
  const [companyName] = useState<string>(import.meta.env.VITE_COMPANY_NAME);
  const [selection, setSelection] = useState<string>("");
  const [tables, setTables] = useState<Table[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const selectTable = (event: ChangeEvent<HTMLSelectElement>) => {
    const tableId = event.target.value;
    if (tableId === "0") {
      showAlert("Mesa seleccionada no disponible", "warning");
      return;
    }

    setSelection(tableId);
    return navigate(`/menu?mesa=${tableId}`, { replace: true });
  };

  useEffect(() => {
    document.title = `${companyName} | FOS`;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const tables = await api.table.fetchTables();
        setTables(tables);
      } catch (error) {
        showAlert("Error con el servidor", "error");
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <AppLayout companyName={`${companyName} | FOS`} hideCart={true}>
      <Box
        sx={{
          height: "90vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Bienvenido a {companyName}
        </Typography>
        <Typography variant="subtitle1">Para iniciar elige mesa</Typography>
        {isLoading ? (
          <CircularProgress color="inherit" />
        ) : (
          <FormControl sx={{ width: "80%" }}>
            <NativeSelect
              value={selection}
              inputProps={{
                name: "mesa",
                id: "uncontrolled-native",
              }}
              onChange={(e) => selectTable(e)}
            >
              <option value={0}>Elige...</option>
              {tables.map((table) => (
                <option key={table.id} value={table.id}>
                  {table.name}
                </option>
              ))}
            </NativeSelect>
          </FormControl>
        )}
      </Box>
    </AppLayout>
  );
}
