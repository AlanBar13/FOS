import { useState, useMemo } from "react";
import { Menu } from "../../../models/Menu";
import { Order, createCompareFn } from "../../../utils/tableUtils";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import TablePagination from "@mui/material/TablePagination";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from "@mui/material/Tooltip";

import { formatPriceFixed } from "../../../utils/numbers";
import { formatDate } from "../../../utils/dates";

interface MenuDataComponentProps {
  menu: Menu[];
  onMenuChange: (newMenu: Menu[]) => void;
  onEditClicked: (id: number) => void;
  onDeleteClicked: (id: number) => void;
}

const properties = [
  {
    name: "id",
    displayName: "id",
  },
  {
    name: "name",
    displayName: "nombre",
  },
  {
    name: "description",
    displayName: "descripcion",
    noSort: true,
  },
  {
    name: "available",
    displayName: "disponible",
  },
  {
    name: "category",
    displayName: "categoria",
  },
  {
    name: "price",
    displayName: "precio",
  },
  {
    name: "tax",
    displayName: "iva",
  },
  {
    name: "img",
    displayName: "imagen",
    noSort: true,
  },
  {
    name: "createdAt",
    displayName: "creado",
  },
  {
    name: "updatedAt",
    displayName: "actualizado",
  },
];

export default function MenuDataComponent({
  menu,
  onMenuChange,
  onDeleteClicked,
  onEditClicked,
}: MenuDataComponentProps) {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof Menu>("id");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const visibleRows = useMemo(() => {
    return menu
      .sort(createCompareFn(orderBy, order))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [menu, page, rowsPerPage]);

  const handleSort = (property: keyof Menu) => {
    const isAsc = orderBy === property && order == "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    const newRows = menu.slice().sort(createCompareFn(property, order));
    onMenuChange(newRows);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onEditButtonClicked = (id?: number) => {
    if (id == null) {
      return;
    }

    onEditClicked(id);
  };

  const onDeleteButtonClicked = (id?: number) => {
    if (id == null) {
      return;
    }

    onDeleteClicked(id);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="menu table">
          <TableHead>
            <TableRow>
              {properties.map((property) => (
                <TableCell
                  key={property.name}
                  sortDirection={
                    orderBy === (property.name as keyof Menu) ? order : false
                  }
                >
                  {property.noSort ? (
                    property.displayName.toLocaleUpperCase()
                  ) : (
                    <TableSortLabel
                      active={orderBy === (property.name as keyof Menu)}
                      direction={
                        orderBy === (property.name as keyof Menu)
                          ? order
                          : "asc"
                      }
                      onClick={() => handleSort(property.name as keyof Menu)}
                    >
                      {property.displayName.toLocaleUpperCase()}
                    </TableSortLabel>
                  )}
                </TableCell>
              ))}
              <TableCell>Editar</TableCell>
              <TableCell>Eliminar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleRows.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell component="th" scope="row">
                  {item.name}
                </TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>
                  {item.available ? (
                    <Chip color="success" label="Disponible" />
                  ) : (
                    <Chip color="error" label="No Disponible" />
                  )}
                </TableCell>
                <TableCell>{item.Category?.name ?? ""}</TableCell>
                <TableCell>{formatPriceFixed(item.price)}</TableCell>
                <TableCell>
                  {formatPriceFixed(item.tax ? item.tax : 0)}
                </TableCell>
                <TableCell>
                  {item.img !== null ? (
                    <Chip color="primary" label="Agregada" />
                  ) : (
                    <Chip label="No Agregada" />
                  )}
                </TableCell>
                <TableCell>{formatDate(item.createdAt)}</TableCell>
                <TableCell>{formatDate(item.updatedAt)}</TableCell>
                <TableCell>
                  <Tooltip title={`Editar ${item.name}`}>
                    <IconButton onClick={() => onEditButtonClicked(item.id)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip title={`Eliminar ${item.name}`}>
                    <IconButton onClick={() => onDeleteButtonClicked(item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 15, 20]}
        component="div"
        count={menu.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}
