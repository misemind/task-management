import { useEffect, useMemo, useState } from 'react';
import {
    MRT_EditActionButtons,
    MaterialReactTable,
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

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const Base_URL = 'http://localhost:4000';

type Jobs = {
    totalTasks: number,
    totalBatches: number,
    completedTasks: number;
    failedTasks: number;
    completedBatches: number,
    failedBatches: number,
    status: string;
};



export const JobsMuiTable = () => {
    const [tasks, setTasks] = useState<any>([]);
    const [total, setTotal] = useState<number>(0)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${Base_URL}/api/jobs?page=${pagination.pageIndex + 1}&limit=${pagination.pageSize}`);
            console.log("fetchTasks", response)
            setTasks(response?.data?.data);
            setTotal(response?.data?.total);
            setError('');
        } catch (err) {
            setError('Failed to fetch tasks');
            console.error(err);
        }
        setLoading(false);
    };

    const deleteTask = async (id: any) => {
        try {
            await axios.delete(`${Base_URL}/api/tasks/${id}`);
            setTasks((prev: any) => prev.filter((task: any) => task._id !== id));
        } catch (err) {
            throw err
        }
    };


    const createTask = async (task: any) => {
        try {
            const response = await axios.post(`${Base_URL}/api/tasks`, task);
            setTasks((prev: any) => [...prev, response.data.data]);

        } catch (err) {
            throw err
        }
    };

    const updateTask = async (id: any, values: any) => {
        try {
            const response = await axios.put(`${Base_URL}/api/tasks/${id}`, values);
            setTasks((prev: any) => prev.map((task: any) => task._id === id ? response.data.data : task));
        } catch (err) {
            throw err
        }
    };
    const openDeleteConfirmModal = (row: MRT_Row<any>) => {
        // if (window.confirm('Are you sure you want to delete this user?')) {
        deleteTask(row.original._id);
        // }
    };
    useEffect(() => {
        fetchTasks();
    }, []);

    const columns = useMemo<MRT_ColumnDef<Jobs>[]>(() => [
        { accessorKey: 'totalTasks', header: 'TotalTasks' },
        {
            accessorKey: 'totalBatches',
            header: 'totalBatches'
        },
        {
            accessorKey: 'status',
            header: 'Status',
            editVariant: 'select',
            editSelectOptions: ['To Do', 'In Progress']
        },
        { accessorKey: 'completedTasks', header: 'CompletedTasks' },
        {
            accessorKey: 'failedTasks',
            header: 'FailedTasks',
        },
        {
            accessorKey: 'completedBatches',
            header: 'completedBatches',
        },
        {
            accessorKey: 'failedBatches',
            header: 'failedBatches',
        }
    ], []);

    useEffect(() => {
        fetchTasks();
    }, [pagination])

    const table = useMaterialReactTable({
        columns,
        data: tasks,
        // editDisplayMode: 'modal',
        enableEditing: false,
        enableRowActions: true,
        getRowId: (row: any) => {
            console.log(row, '@#@#@#@#@#@#TTTTT')
            return row._id
        },
        onCreatingRowSave: async ({ values, table }) => {
            await createTask(values);
            table.setCreatingRow(null);
        },
        onEditingRowSave: async ({ values, table, row }: any) => {
            await updateTask(row.original._id, values);
            table.setEditingRow(null);
        },
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
        renderRowActions: ({ row, table }) => {
            console.log(row, 'ROWS')
            return <Box sx={{ display: 'flex', gap: '1rem' }}>
                <Tooltip title="Delete">
                    <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        },
        renderTopToolbarCustomActions: ({ table }) => (
            <>
                <Button
                    variant="contained"
                    onClick={() => {
                        table.setCreatingRow(true); // Open create row modal
                    }}
                >
                    Create New Jobs
                </Button>
            </>
        ),
        manualPagination: true,
        rowCount: total,
        state: {
            isLoading: loading,
            showAlertBanner: !!error,
            showProgressBars: loading,
            pagination
        },
        onPaginationChange: setPagination
    });

    return <Box sx={{
        // bottom: 0,
        // height: '100vh',
        // left: 0,
        // margin: 0,
        // maxHeight: '100vh',
        // maxWidth: '100vw',
        // padding: 0,
        // position: 'fixed',
        // right: 0,
        // top: 0,
        // width: '100vw',
        // zIndex: 999,
    }}><MaterialReactTable table={table} /></Box>;
};
