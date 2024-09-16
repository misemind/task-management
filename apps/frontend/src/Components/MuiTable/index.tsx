
import { useEffect, useMemo, useState } from 'react';
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  // createRow,
  type MRT_ColumnDef,
  type MRT_Row,
  type MRT_TableOptions,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const Base_URL = 'http://localhost:4000';

const MuiTable = () => {
  const [tasks, setTasks] = useState<any>([])
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});
  const [deadline, setDeadline] = useState<dayjs.Dayjs | any>(null);
  // const limit = 5

  // get all tasks
  const getAllTasks = async () => {
    const response = await axios.get(`${Base_URL}/api/tasks`);
    setTasks(response?.data?.data)
  };

  // delete task
  const deleteTask = async (id: any) => {
    try {
      const res = await axios.delete(`${Base_URL}/api/tasks/${id}`)
      console.log('deleteTask', res)
    } catch (error) {
      console.log("deleteTasksfhslkfshf", error)

    }
  }

  const handleCreateUser: MRT_TableOptions<any>['onCreatingRowSave'] = async ({
    values,
    table,
  }) => {
    // Remove the id field from values before sending to the backend
    const { id, ...task } = values;
    try {
      const res = await axios.post(`${Base_URL}/api/tasks`, task); // Send data without 'id'
      console.log('User created successfully:', res.data);
      table.setCreatingRow(null); // Exit creating mode after successful creation
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  //UPDATE action
  const handleEditTask: MRT_TableOptions<any>['onEditingRowSave'] = async ({
    values,
    table,
    row,
  }) => {
    const { _id } = row?.original
    try {
      const response = await axios.put(`${Base_URL}/api/tasks/${_id}`, values);
      console.log('Task updated successfully:', response.data);
      table.setEditingRow(null); // Close the edit dialog
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  //DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<any>) => {
    // if (window.confirm('Are you sure you want to delete this user?')) {
    console.log("deleletete", row?.original?._id)
    deleteTask(row.original._id);
    // }
  };
  useEffect(() => {
    getAllTasks()
  }, [])


  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'title',
        header: 'Title',

      },
      {
        accessorKey: 'priority',
        header: 'Priority',
        editVariant: 'select',
        editSelectOptions: ['Low', "Medium"]

      },
      {
        accessorKey: 'status',
        header: 'Status',
        editVariant: 'select',
        editSelectOptions: ['To Do', 'In Progress']

      },
      {
        accessorKey: 'description',
        header: 'Description',
      },
      {
        accessorKey: 'deadline',
        header: 'Deadline',

      },
    ],
    [validationErrors],
  );
  const table = useMaterialReactTable({
    columns,
    data: tasks,
    editDisplayMode: 'modal',
    enableEditing: true,
    enableRowActions: true,
    getRowId: (row) => row._id,
    muiToolbarAlertBannerProps: undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: '500px',
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateUser,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleEditTask,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>

        <DialogTitle variant="h3">Create New User</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          {internalEditComponents} {/* or render custom edit components here */}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>


      </>
    ),
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Edit Task</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        onClick={() => {
          table.setCreatingRow(true); // Open create row modal
        }}
      >
        Create New Task
      </Button>
    ),
    state: {
      isLoading: false,
      showAlertBanner: false,
      showProgressBars: false,
    },
  });




  return <MaterialReactTable table={table} />;
};

const queryClient = new QueryClient();

const MuiTableWithProviders = () => (
  <QueryClientProvider client={queryClient}>
    <MuiTable />
  </QueryClientProvider>
);

export default MuiTableWithProviders;



