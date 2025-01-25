import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TableSortLabel,
  TablePagination,
  Button,
  IconButton,
  Popover,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import api from "../../utils/api";
import moment from 'moment';

const ListQuality = () => {
  const [rows, setData] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("id");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [filterAnchor, setFilterAnchor] = useState(null);
  const [filters, setFilters] = useState({
    product_type: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  const fetchData = async () => {
    const response = await api.get("/dq/");
    setData(response.data);
    setFilteredRows(response.data);
  };

  const handleSort = (property) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((row) => row.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const sortData = (data, order, orderBy) => {
    return [...data].sort((a, b) => {
      if (order === "asc") {
        return a[orderBy] > b[orderBy] ? 1 : -1;
      }
      return a[orderBy] < b[orderBy] ? 1 : -1;
    });
  };

  const paginateData = (data, page, rowsPerPage) => {
    return data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  };

  const applyFilters = () => {
    const filtered = rows.filter((row) => {
      const matchesProductType = filters.product_type
        ? row.product_type === filters.product_type
        : true;
      const matchesStatus = filters.status
        ? (filters.status === "passed" && row.status) ||
        (filters.status === "failed" && !row.status)
        : true;
      const matchesDate =
        (!filters.startDate || new Date(row.date) >= new Date(filters.startDate)) &&
        (!filters.endDate || new Date(row.date) <= new Date(filters.endDate));
      return matchesProductType && matchesStatus && matchesDate;
    });

    setFilteredRows(filtered);
    setFilterAnchor(null); // Закрыть поповер после применения фильтров
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box p={3} bgcolor="#141b2d" color="white">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <span>Выбрано: {selected.length}</span>
        <Box display="flex" alignItems="center">
          <IconButton
            onClick={(event) => setFilterAnchor(event.currentTarget)}
            color="secondary"
          >
            <FilterAltOutlinedIcon fontSize="large" />
          </IconButton>
          <Popover
            open={Boolean(filterAnchor)}
            anchorEl={filterAnchor}
            onClose={() => setFilterAnchor(null)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <Box p={2} width="300px">
              <Typography variant="h6" gutterBottom>
                Фильтрация
              </Typography>
              <TextField
                fullWidth
                label="Дата начала"
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, startDate: e.target.value }))
                }
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                fullWidth
                label="Дата окончания"
                type="date"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, endDate: e.target.value }))
                }
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                fullWidth
                select
                label="Вид страхового продукта"
                value={filters.product_type}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, product_type: e.target.value }))
                }
                margin="normal"
              >
                <MenuItem value="">Все</MenuItem>
                <MenuItem value="osago">ОСАГО</MenuItem>
                <MenuItem value="life">СТРАХОВАНИЕ ЖИЗНИ</MenuItem>
              </TextField>
              <TextField
                fullWidth
                select
                label="Статус проверки"
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
                margin="normal"
              >
                <MenuItem value="">Все</MenuItem>
                <MenuItem value="passed">Пройдено</MenuItem>
                <MenuItem value="failed">Не пройдено</MenuItem>
              </TextField>

              <Box display="flex" justifyContent="space-between" mt={2}>
                <Button variant="outlined" onClick={() => setFilters({
                  product_type: "",
                  status: "",
                  startDate: "",
                  endDate: "",
                })}>
                  Сбросить
                </Button>
                <Button variant="contained" onClick={applyFilters}>
                  Применить
                </Button>
              </Box>
            </Box>
          </Popover>
        </Box>
      </Box>


      <TableContainer component={Paper} sx={{ backgroundColor: "#141b2d" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" sx={{ border: "1px solid #ddd", textAlign: "center", color: "#fff", "&.Mui-checked": { color: "third.main" } }}>
                <Checkbox
                  sx={{ color: "#fff", "&.Mui-checked": { color: "third.main" } }}
                  indeterminate={selected.length > 0 && selected.length < filteredRows.length}
                  checked={selected.length === filteredRows.length}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell sx={{ border: "1px solid #ddd", textAlign: "center" }}>
                <TableSortLabel
                  active={orderBy === "id"}
                  direction={order}
                  onClick={() => handleSort("id")}
                  style={{ fontSize: '20px' }}
                >
                  № проверки
                </TableSortLabel>
              </TableCell >
              <TableCell sx={{ border: "1px solid #ddd", textAlign: "center" }}>
                <TableSortLabel
                  active={orderBy === "product_type"}
                  direction={order}
                  onClick={() => handleSort("product_type")}
                  style={{ fontSize: '20px' }}
                >
                  Вид продукта
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ border: "1px solid #ddd", textAlign: "center" }}>
                <TableSortLabel
                  active={orderBy === "status"}
                  direction={order}
                  onClick={() => handleSort("status")}
                  style={{ fontSize: '20px' }}
                >
                  Статус проверки
                </TableSortLabel>
              </TableCell>
              <TableCell sx={{ border: "1px solid #ddd", textAlign: "center" }}>
                <TableSortLabel
                  active={orderBy === "date"}
                  direction={order}
                  onClick={() => handleSort("date")}
                  style={{ fontSize: '20px' }}
                >
                  Дата
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginateData(sortData(filteredRows, order, orderBy), page, rowsPerPage).map((row) => {
              const isItemSelected = isSelected(row.id);
              return (
                <TableRow
                  key={row.id}
                  onClick={() => handleClick(row.id)}
                  role="checkbox"
                  selected={isItemSelected}

                  hover
                >
                  <TableCell padding="checkbox" sx={{ border: "1px solid #ddd", textAlign: "center" }}>
                    <Checkbox sx={{ color: "#fff", "&.Mui-checked": { color: "third.main" } }} checked={isItemSelected} />
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #ddd", textAlign: "center", fontSize: "18px", fontFamily: "Source Code Pro, sans-serif" }}>{row.id}</TableCell>
                  <TableCell sx={{ border: "1px solid #ddd", textAlign: "center", fontSize: "18px", fontFamily: "Source Code Pro, sans-serif" }}>{row.product_type}</TableCell>
                  <TableCell sx={{ border: "1px solid #ddd", textAlign: "center", fontSize: "18px", fontFamily: "Source Code Pro, sans-serif" }}>{row.status ? "Пройдено" : "Не пройдено"}</TableCell>
                  <TableCell sx={{ border: "1px solid #ddd", textAlign: "center", fontSize: "18px", fontFamily: "Source Code Pro, sans-serif" }}>
                    {moment(row.date).format('MMMM Do YYYY, HH:mm:ss')}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={filteredRows.length ?? 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default ListQuality;