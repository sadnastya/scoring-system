import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, TablePagination, Box } from '@mui/material';
import api from '../../utils/api';
import Header from '../../components/Header';

const MonitoringTable = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchData = async (currentPage, perPage) => {
    try {
      const response = await api.get('/monitoring/', {
        params: { page: currentPage + 1, per_page: perPage },
      });
      setData(response.data.data); 
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData(page, rowsPerPage);
  }, [page, rowsPerPage]);

  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

 
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0)
  };

  return (
    <Box p={3} bgcolor="#141b2d" color="white">
      <Header title="Журнал отчётов" />
      <TableContainer component={Paper} sx={{ backgroundColor: "#141b2d" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ border: "1px solid #ddd", textAlign: "center", fontSize: "20px" }}>ID</TableCell>
              <TableCell sx={{ border: "1px solid #ddd", textAlign: "center", fontSize: "20px" }}>Модель</TableCell>
              <TableCell sx={{ border: "1px solid #ddd", textAlign: "center", fontSize: "20px" }}>Метрика</TableCell>
              <TableCell sx={{ border: "1px solid #ddd", textAlign: "center", fontSize: "20px" }}>Тип мониторинга</TableCell>
              <TableCell sx={{ border: "1px solid #ddd", textAlign: "center", fontSize: "20px" }}>Дата расчета</TableCell>
              <TableCell sx={{ border: "1px solid #ddd", textAlign: "center", fontSize: "20px" }}>Отчет</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell sx={{ border: "1px solid #ddd", textAlign: "center", fontSize: "18px", fontFamily: "Source Code Pro, sans-serif" }}>{row.id}</TableCell>
                <TableCell sx={{ border: "1px solid #ddd", textAlign: "center", fontSize: "18px", fontFamily: "Source Code Pro, sans-serif" }}>{row.model_name}</TableCell>
                <TableCell sx={{ border: "1px solid #ddd", textAlign: "center", fontSize: "18px", fontFamily: "Source Code Pro, sans-serif" }}>{row.metric_name}</TableCell>
                <TableCell sx={{ border: "1px solid #ddd", textAlign: "center", fontSize: "18px", fontFamily: "Source Code Pro, sans-serif" }}>{row.monitoring_type}</TableCell>
                <TableCell sx={{ border: "1px solid #ddd", textAlign: "center", fontSize: "18px", fontFamily: "Source Code Pro, sans-serif" }}>{row.calculation_date || 'ДД/ММ/ГГГГ'}</TableCell>
                <TableCell sx={{ border: "1px solid #ddd", textAlign: "center", fontSize: "18px", fontFamily: "Source Code Pro, sans-serif" }}>
                  <Button variant="contained" color="secondary" href={row.reportLink}>
                    Скачать
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={data.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]} // Options for rows per page
          labelRowsPerPage="Строк на странице"
        />
      </TableContainer>
    </Box>
  );
};

export default MonitoringTable;
