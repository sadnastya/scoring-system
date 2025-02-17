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
  Button,
  TextField,
  TableSortLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Switch,
  FormControlLabel,
  MenuItem,
  Select,
  Typography
} from "@mui/material";
import Header from "../../components/Header";
import api from "../../utils/api";

const IncidentTable = () => {
  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState("asc");
  const [data, setData] = useState([]);
  const page = 0;
  const rowsPerPage = 50;
  const [orderBy, setOrderBy] = useState("incident_id");
  const [formData, setFormData] = useState({
    service: "",
    priority: "",
    description: "",
    notify: false,
  });
  const [open, setOpen] = useState(false);

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleEditOpen = (incident) => {
    setEditData(incident);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditData(null);
  };

  const handleEditChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditSubmit = async () => {
    try {
      const response = await api.put(`/observability/${editData.id_incident}`, editData);
      console.log("Инцидент успешно обновлён:", response.data);

      fetchData(); // Обновление данных после редактирования
      handleEditClose();
    } catch (error) {
      console.error("Ошибка при обновлении инцидента:", error);
    }
  };


  const handleSubmit = async () => {
    try {

      const dataToSend = {
        state: "Active",
        priority: formData.priority,
        description: formData.description,
        service: formData.service,
        trace_id: Math.floor(Math.random() * (10000 - 0 + 1)),
      };


      const response = await api.post("/observability/create", dataToSend);
      console.log("Успешное создание инцидента:", response.data);


      setFormData({
        state: "",
        priority: "",
        description: "",
        service: "",
        notify: false,
      });
      fetchData();

      handleCloseDialog();
    } catch (error) {
      console.error("Ошибка при создании инцидента:", error);
    }
  };


  const handleSort = (property) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);
  };

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


  const fetchData = async () => {
    try {
      const params = new URLSearchParams();

      params.append("page", page + 1);
      params.append("per_page", rowsPerPage);
      const response = await api.get(`/observability/?${params.toString()}`);

      const rows = response.data.data;

      setData(rows);
      console.log(data);

    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, [page, rowsPerPage]);


  const handleClick = (id) => {
    if (selected.includes(id)) {
      setSelected([]); // Снять выбор, если элемент уже выбран
    } else {
      setSelected([id]); // Установить только один выбранный элемент
    }
  };

  const isSelected = (id) => selected.includes(id); // Проверка выбора

  return (
    <>
      <Header title="Список инцидентов" />

      <Box p={3} sx={{ backgroundColor: "#141b2d", minHeight: "100vh", color: "#fff" }}>
        <Box display="flex" justifyContent="space-between" mb={2}>

          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleEditOpen(data.find((row) => row.id_incident === selected[0]))}
            disabled={selected.length === 0}
          >
            Редактировать инцидент
          </Button>


          <Button variant="contained" color="secondary" onClick={handleOpenDialog}>
            Создать инцидент
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ backgroundColor: "#141b2d" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ border: "1px solid #ddd", textAlign: "center" }}>

                </TableCell>

                <TableCell sx={{ border: "1px solid #ddd", textAlign: "center" }}>
                  <TextField
                    size="medium"
                    variant="outlined"
                    placeholder="ID инцидента"
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "#fff",
                        "& fieldset": { borderColor: "#4f4f6f" },
                      },
                    }}
                  />
                </TableCell>
                <TableCell sx={{ border: "1px solid #ddd", textAlign: "center" }}>
                  <TableSortLabel
                    active={orderBy === "service"}
                    direction={order}
                    onClick={() => handleSort("service")}
                  >
                    <Typography variant="h5" fontSize={20}>
                      Сервис
                    </Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ border: "1px solid #ddd", textAlign: "center" }}>
                  <TableSortLabel
                    active={orderBy === "state"}
                    direction={order}
                    onClick={() => handleSort("state")}>
                    <Typography variant="h5" fontSize={20}>Статус</Typography>

                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ border: "1px solid #ddd", textAlign: "center" }}>
                  <TableSortLabel
                    active={orderBy === "priority"}
                    direction={order}
                    onClick={() => handleSort("priority")}
                  >
                    <Typography variant="h5" fontSize={20}>
                      Приоритет
                    </Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ border: "1px solid #ddd", textAlign: "center" }}>
                  <Typography variant="h5" fontSize={20}>
                    Описание инцидента
                  </Typography>

                </TableCell>
                <TableCell sx={{ border: "1px solid #ddd", textAlign: "center" }}>
                  <TableSortLabel
                    active={orderBy === "last_updated"}
                    direction={order}
                    onClick={() => handleSort("last_updated")}
                  >
                    <Typography variant="h5" fontSize={20}>
                      Дата изменения
                    </Typography>
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginateData(sortData(data, order, orderBy), page, rowsPerPage).map((row) => {
                const isItemSelected = isSelected(row.id_incident);
                return (
                  <TableRow
                    key={row.id_incident}
                    role="checkbox"
                    onClick={() => handleClick(row.id_incident)}
                    selected={isItemSelected}
                    hover
                  >
                    <TableCell padding="checkbox" sx={{ border: "1px solid #ddd", textAlign: "center" }}>
                      <Checkbox sx={{ color: "#fff", "&.Mui-checked": { color: "third.main" } }} checked={isItemSelected} />
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #ddd", textAlign: "center", fontSize: "16px", fontFamily: "Source Code Pro, sans-serif" }}>{row.id_incident}</TableCell>
                    <TableCell sx={{ border: "1px solid #ddd", textAlign: "center", fontSize: "16px", fontFamily: "Source Code Pro, sans-serif" }}>{row.service}</TableCell>
                    <TableCell sx={{ border: "1px solid #ddd", textAlign: "center", fontSize: "16px", fontFamily: "Source Code Pro, sans-serif" }}>{row.state}</TableCell>
                    <TableCell sx={{ border: "1px solid #ddd", textAlign: "center", fontSize: "16px", fontFamily: "Source Code Pro, sans-serif" }}>{row.priority}</TableCell>
                    <TableCell sx={{ border: "1px solid #ddd", textAlign: "center", fontSize: "16px", fontFamily: "Source Code Pro, sans-serif" }}>{row.description}</TableCell>
                    <TableCell sx={{ border: "1px solid #ddd", textAlign: "center", fontSize: "16px", fontFamily: "Source Code Pro, sans-serif" }}>{row.last_updated}</TableCell>
                  </TableRow>

                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>



      {/* Модальное окно */}
      <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm" bgcolor="#1e1e2f">
        <DialogTitle><Typography variant="h3">Создание инцидента</Typography></DialogTitle>
        <DialogContent>
          <Box display="grid" gap={2}>
            <Box display="flex">
              <Box flex={1} bgcolor="#2b2b3d" p={1}>
                Сервис
              </Box>
              <Select
                fullWidth
                value={formData.service}
                onChange={(e) => handleChange("service", e.target.value)}
              >
                <MenuItem value="AUTH service">AUTH сервис</MenuItem>
                <MenuItem value="Model Service">Мониторинг моделей</MenuItem>
                <MenuItem value="Proxy service">Proxy сервис</MenuItem>
                <MenuItem value="DWH service">DWH сервис</MenuItem>
                <MenuItem value="DQ service">DQ сервис</MenuItem>
                <MenuItem value="UI service">UI сервис</MenuItem>
                <MenuItem value="Model Catalog service">Каталог моделей</MenuItem>
              </Select>
            </Box>
            <Box display="flex">
              <Box flex={1} bgcolor="#2b2b3d" p={1}>
                Приоритет
              </Box>
              <Select
                fullWidth
                value={formData.priority}
                onChange={(e) => handleChange("priority", e.target.value)}
              >
                <MenuItem value="High">Высокий</MenuItem>
                <MenuItem value="Medium">Средний</MenuItem>
                <MenuItem value="Low">Низкий</MenuItem>
              </Select>
            </Box>
            <Box display="flex">
              <Box flex={1} bgcolor="#2b2b3d" p={1}>
                Описание события
              </Box>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </Box>
          </Box>
        </DialogContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px={3}
          py={1}
          bgcolor="#2b2b3d"
        >
          <FormControlLabel
            control={
              <Switch
                checked={formData.notify}
                onChange={(e) => handleChange("notify", e.target.checked)}
              />
            }
            label="Уведомление в систему"
          />
          <DialogActions>
            <Button onClick={handleCloseDialog} color="third">
              Отмена
            </Button>
            <Button onClick={handleSubmit} color="secondary" variant="contained">
              Сохранить инцидент
            </Button>
          </DialogActions>
        </Box>
      </Dialog>


      {/* Модальное окно */}
      <Dialog open={editOpen} onClose={handleEditClose} fullWidth maxWidth="sm" bgcolor="#1e1e2f">
        <DialogTitle><Typography variant="h3">Редактирование инцидента</Typography></DialogTitle>
        <DialogContent>
          <Box display="grid" gap={2}>
            <Box display="flex">
              <Box flex={1} bgcolor="#2b2b3d" p={1}>
                Сервис
              </Box>
              <Select
                fullWidth
                value={editData?.service || ""}
                onChange={(e) => handleEditChange("service", e.target.value)}
              >
                <MenuItem value="AUTH service">AUTH сервис</MenuItem>
                <MenuItem value="Model Service">Мониторинг моделей</MenuItem>
                <MenuItem value="Proxy service">Proxy сервис</MenuItem>
                <MenuItem value="DWH service">DWH сервис</MenuItem>
                <MenuItem value="DQ service">DQ сервис</MenuItem>
                <MenuItem value="UI service">UI сервис</MenuItem>
                <MenuItem value="Model Catalog service">Каталог моделей</MenuItem>
              </Select>
            </Box>
            <Box display="flex">
              <Box flex={1} bgcolor="#2b2b3d" p={1}>
                Приоритет
              </Box>
              <Select
                fullWidth
                value={editData?.priority || ""}
                onChange={(e) => handleEditChange("priority", e.target.value)}
              >
                <MenuItem value="High">Высокий</MenuItem>
                <MenuItem value="Medium">Средний</MenuItem>
                <MenuItem value="Low">Низкий</MenuItem>
              </Select>
            </Box>
            <Box display="flex">
              <Box flex={1} bgcolor="#2b2b3d" p={1}>
                Статус
              </Box>
              <Select
                fullWidth
                value={editData?.state || ""}
                onChange={(e) => handleEditChange("state", e.target.value)}
              >
                <MenuItem value="In Progress">В процессе</MenuItem>
                <MenuItem value="Active">Активный</MenuItem>
                <MenuItem value="Resolved">Решенный</MenuItem>
              </Select>
            </Box>

            <Box display="flex">
              <Box flex={1} bgcolor="#2b2b3d" p={1}>
                Описание события
              </Box>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={editData?.description || ""}
                onChange={(e) => handleEditChange("description", e.target.value)}
              />
            </Box>
          </Box>
        </DialogContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          px={3}
          py={1}
          bgcolor="#2b2b3d"
        >

          <DialogActions>
            <Button onClick={handleEditClose} color="third">
              Отмена
            </Button>
            <Button onClick={handleEditSubmit} color="secondary" variant="contained">
              Сохранить изменения
            </Button>
          </DialogActions>
        </Box>
      </Dialog>


    </>
  );

};

export default IncidentTable;