import React, { useState } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TableSortLabel,
  IconButton,
  Tabs,
  Tab,
  Modal,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Switch
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import api from "../../../utils/api";
import moment from 'moment';

const AccountManagement = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("account");
  const [tab, setTab] = useState(0);
  const [accounts, setAccounts] = useState([]);
  const [IsOpenError, setOpenError] = React.useState(false);
  const [error_message, setErrorMessage] = React.useState("");


  const handleCloseError = () => setOpenError(false);

  const handleOpenError = (error) => {
    setErrorMessage(error)
    setOpenError(true)
  };




  const getUsers = async () => {
    const params = new URLSearchParams();

    params.append("page", 1);
    params.append("per_page", 50);

    const response = await api.get(`/auth/admin/users?${params.toString()}`);
    setAccounts(response.data.users);
  };

  const handleCreateAccount = async () => {
    try {
      const response = await api.post("/auth/register", { email, role });

      if (response.status !== 201) {
        throw new Error("Ошибка регистрации пользователя");
      }
      setEmail("");
      setRole("");

      getUsers();



    } catch (error) {
      handleOpenError((error.response.data.detals ?? "Ошибка") + ": " + error.response.data.error);
    }
  };


  const handleSort = (property) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedAccounts = [...accounts].sort((a, b) => {
    if (order === "asc") {
      return a[orderBy] > b[orderBy] ? 1 : -1;
    }
    return a[orderBy] < b[orderBy] ? 1 : -1;
  });

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    height: 150,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
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
      const response = await api.put(`/auth/admin/${editData.id}`, editData);
      console.log("Инцидент успешно обновлён:", response.data);

      getUsers();
      handleEditClose();
    } catch (error) {
      handleOpenError((error.response.data.detals ?? "Ошибка") + ": " + error.response.data.error)
    }
  };






  React.useEffect(() => {
    getUsers();
  }, []);

  return (
    <Box sx={{ p: 3, backgroundColor: "primary", minHeight: "100vh", color: "#fff" }}>
      <Tabs
        value={tab}
        onChange={(e, newValue) => setTab(newValue)}
        textColor="secondary"
        sx={{ mb: 3, backgroundColor: "#3b4252", borderRadius: 1 }}
        indicatorColor="secondary"
        variant="fullWidth"
        centered
      >
        <Tab label="Управление учётными записями" sx={{ color: "#eceff4" }} />
        <Tab label="Управление ролями и доступом" sx={{ color: "#eceff4" }} href="/manageRoles" />
      </Tabs>

      {tab === 0 && (
        <>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mb: 3,
              p: 2,
              backgroundColor: "#3b4252",
              borderRadius: 1,
            }}
          >
            <Typography variant="h3" sx={{ mb: 2 }}>Новая учётная запись</Typography>
            <TextField
              label="Введите электронную почту пользователя"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ width: "50%" }}
              InputLabelProps={{ style: { color: "#d8dee9" } }}
              InputProps={{
                style: { color: "#eceff4", backgroundColor: "#434c5e" },
              }}
            />
            <FormControl fullWidth>
              <InputLabel style={{ color: "#d8dee9" }}>Выберите роль</InputLabel>
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                sx={{ backgroundColor: "#434c5e", color: "#eceff4", width: "50%" }}
              >
                <MenuItem value="admin">Администратор</MenuItem>
                <MenuItem value="editor">Редактор</MenuItem>
                <MenuItem value="user">Пользователь</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "secondary.main",
                color: "primary.main",
                borderRadius: 3,
                width: "40%",
              }}
              onClick={handleCreateAccount}
            >
              Создать новую учётную запись
            </Button>
          </Box>

          <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
            <TextField
              variant="outlined"
              placeholder="Введите email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                flex: 1,
                mr: 2,
                input: { color: "#eceff4" },
                backgroundColor: "#434c5e",
              }}
            />
            <IconButton sx={{ color: "#88c0d0" }}>
              <SearchIcon />
            </IconButton>
          </Box>

          <TableContainer component={Paper} sx={{ backgroundColor: "#141b2d" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ border: "1px solid #ddd", textAlign: "center", fontSize: "18px" }}>
                    <TableSortLabel
                      active={orderBy === "account"}
                      direction={order}
                      onClick={() => handleSort("account")}
                      sx={{ color: "#d8dee9" }}
                    >
                      Учётная запись
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #ddd", textAlign: "center", fontSize: "18px" }}>
                    <TableSortLabel
                      active={orderBy === "date"}
                      direction={order}
                      onClick={() => handleSort("date")}
                      sx={{ color: "#d8dee9" }}
                    >
                      Дата создания
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #ddd", textAlign: "center", fontSize: "18px" }}>
                    <TableSortLabel
                      active={orderBy === "role"}
                      direction={order}
                      onClick={() => handleSort("role")}
                      sx={{ color: "#d8dee9" }}
                    >
                      Роль
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #ddd", textAlign: "center", fontSize: "18px" }}>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedAccounts.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ border: "1px solid #ddd", textAlign: "center", fontSize: "16px", fontFamily: "Source Code Pro, sans-serif" }}>{row.email}</TableCell>
                    <TableCell sx={{ border: "1px solid #ddd", textAlign: "center", fontSize: "16px", fontFamily: "Source Code Pro, sans-serif" }}>{moment(row.created_at).format('MMMM Do YYYY, HH:mm:ss')}</TableCell>
                    <TableCell sx={{ border: "1px solid #ddd", textAlign: "center", fontSize: "16px", fontFamily: "Source Code Pro, sans-serif" }}>{row.roles}</TableCell>
                    <TableCell sx={{ border: "1px solid #ddd", textAlign: "center", fontSize: "18px", fontFamily: "Source Code Pro, sans-serif" }}>
                      <Button
                        variant="text"
                        sx={{ color: "#88c0d0", ":hover": { color: "#81a1c1" } }}
                        onClick={() => handleEditOpen(row)}
                      >
                        Редактировать
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Modal
            open={IsOpenError}
            onClose={handleCloseError}>
            <Box sx={style} display={"grid"}>
              <Typography variant='h5' marginBottom={"auto"}>{error_message}</Typography>

              <Button onClick={handleCloseError} color="secondary" >Close</Button>
            </Box>
          </Modal>

          {/* Edit Modal */}
          <Dialog open={editOpen} onClose={handleEditClose} fullWidth maxWidth="sm" bgcolor="#1e1e2f">
            <DialogTitle><Typography variant="h3">Редактирование пользователя</Typography></DialogTitle>
            <DialogContent>
              <Box display="grid" gap={2}>
                <Box display="flex">
                  <Box flex={1} bgcolor="#2b2b3d" p={1}>
                    email пользователя
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={1}
                    value={editData?.email || ""}
                    onChange={(e) => handleEditChange("email", e.target.value)}
                  />
                </Box>
                <Box display="flex">
                  <Box flex={1} bgcolor="#2b2b3d" p={1}>
                    Изменить роль
                  </Box>
                  <Select
                    fullWidth
                    value={editData?.roles || ""}
                    onChange={(e) => handleEditChange("roles", e.target.value)}
                  >
                    <MenuItem value="admin">Администратор</MenuItem>
                    <MenuItem value="editor">Редактор</MenuItem>
                    <MenuItem value="user">Пользователь</MenuItem>

                  </Select>
                </Box>
                <Box display="flex" alignItems="center">
        <Box flex={1} bgcolor="#2b2b3d" p={1}>
          Заблокировать аккаунт?
        </Box>
        <Switch
          checked={editData?.is_blocked || false}
          onChange={(e) => handleEditChange("is_blocked", e.target.checked)}
          color="secondary"
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
      )}

      <Modal
        open={IsOpenError}
        onClose={handleCloseError}>
        <Box sx={style} display={"grid"}>
          <Typography variant='h5' marginBottom={"auto"}>{error_message}</Typography>

          <Button onClick={handleCloseError} color="secondary" >Close</Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default AccountManagement;
