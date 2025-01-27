import React, { useState } from "react";
import {
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  Typography,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";

const RoleManagement = () => {
  const [tab, setTab] = useState(1); // Default to "Управление ролями и доступом"
  const [selectedRole, setSelectedRole] = useState("user");
  const [permissions, setPermissions] = useState({
    "Витрина данных": { view: true, edit: false, delete: false },
    "Качество данных": {
      view: true,
      edit: false,
      delete: false,
      subPermissions: {
        "Управление проверками": false,
        "История проверок": true,
        "История действий": false,
        "Аналитика запросов": false,
      },
    },
    "Каталог моделей": { view: true, edit: false, delete: false },
    "Мониторинг моделей": { view: true, edit: false, delete: false },
  });

  

  const handlePermissionChange = (category, type, subPermission) => {
    setPermissions((prev) => {
      const updated = { ...prev };
      if (subPermission) {
        updated[category].subPermissions[subPermission] = !updated[category].subPermissions[subPermission];
      } else {
        updated[category][type] = !updated[category][type];
      }
      return updated;
    });
  };

  return (
    <Box sx={{ p: 3, backgroundColor: "primary.main", minHeight: "100vh", color: "#fff" }}>
      <Tabs
        value={tab}
        onChange={(e, newValue) => setTab(newValue)}
        textColor="secondary"
        sx={{ mb: 3, backgroundColor: "#3b4252", borderRadius: 1 }}
        indicatorColor="secondary"
        variant="fullWidth"
        centered
      >
        <Tab label="Управление учётными записями" sx={{ color: "#eceff4" }} href="/manageUsers"/>
        <Tab label="Управление ролями и доступом" sx={{ color: "#eceff4" }} />
      </Tabs>

      {tab === 1 && (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:"repeat(4, minmax(0, 1fr))",
              gap: 2,
              mb: 3,
              p: 2,
              backgroundColor: "#3b4252",
              borderRadius: 1,
            }}
          >
            <FormControl fullWidth>
              <InputLabel style={{ color: "#d8dee9" }}>Выберите роль</InputLabel>
              <Select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                sx={{ backgroundColor: "#3b4252", color: "#eceff4", gridColumn: "span 2" }}
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
                ":hover": { backgroundColor: "#4c566a" },
                gridColumn: "span 1"
              }}
            >
              <Typography variant="h5">Создать новую роль</Typography>
              
            </Button>
          </Box>

          <TableContainer component={Paper} sx={{ backgroundColor: "#3b4252" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ border: "1px solid #ddd", textAlign: "center", fontSize: "18px" }}>Категория</TableCell>
                  <TableCell sx={{ border: "1px solid #ddd", textAlign: "center", fontSize: "18px" }}>Просмотр</TableCell>
                  <TableCell sx={{ border: "1px solid #ddd", textAlign: "center", fontSize: "18px" }}>Редактирование</TableCell>
                  <TableCell sx={{ border: "1px solid #ddd", textAlign: "center", fontSize: "18px" }}>Удаление</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(permissions).map((category) => (
                  <>
                    <TableRow key={category}>
                      <TableCell sx={{ border: "1px solid #ddd", fontSize: "18px" }}>{category}</TableCell>
                      <TableCell sx={{ border: "1px solid #ddd",  fontSize: "18px" }}>
                        <Switch
                          checked={permissions[category].view}
                          onChange={() => handlePermissionChange(category, "view")}
                          color="secondary"
                          
                        />
                      </TableCell>
                      <TableCell sx={{ border: "1px solid #ddd", textAlign: "center", fontSize: "18px" }}>
                        <Switch
                          checked={permissions[category].edit}
                          onChange={() => handlePermissionChange(category, "edit")}
                          color="secondary"
                        />
                      </TableCell>
                      <TableCell sx={{ border: "1px solid #ddd", textAlign: "center", fontSize: "18px" }}>
                        <Switch
                          checked={permissions[category].delete}
                          onChange={() => handlePermissionChange(category, "delete")}
                          color="secondary"
                        />
                      </TableCell>
                    </TableRow>

                    {permissions[category].subPermissions &&
                      Object.keys(permissions[category].subPermissions).map((sub) => (
                        <TableRow key={sub}>
                          <TableCell sx={{ border: "1px solid #ddd",  fontSize: "14px", pl: 4 }}>{sub}</TableCell>
                          <TableCell sx={{ border: "1px solid #ddd"}}  colSpan={3}>
                            <Switch
                              checked={permissions[category].subPermissions[sub]}
                              onChange={() => handlePermissionChange(category, null, sub)}
                              color="secondary"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                  </>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Button
            variant="contained"
            sx={{
              mt: 3,
              backgroundColor: "#5e81ac",
              color: "#eceff4",
              ":hover": { backgroundColor: "#4c566a" },
            }}
          >
            Сохранить изменения
          </Button>
        </>
      )}
    </Box>
  );
};

export default RoleManagement;
