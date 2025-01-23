import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, TablePagination } from '@mui/material';
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
    <>
      <Header title="Список инцидентов" />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Модель</TableCell>
              <TableCell>Метрика</TableCell>
              <TableCell>Тип мониторинга</TableCell>
              <TableCell>Дата расчета</TableCell>
              <TableCell>Отчет</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.model_name}</TableCell>
                <TableCell>{row.metric_name}</TableCell>
                <TableCell>{row.monitoring_type}</TableCell>
                <TableCell>{row.calculation_date || 'ДД/ММ/ГГГГ'}</TableCell>
                <TableCell>
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
    </>
  );
};

export default MonitoringTable;
