import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { TaskMuiTable } from './task';
import { JobsMuiTable } from './jobs';
import { Tabs, Tab, Box, Button } from '@mui/material';
import { useState, useRef } from 'react';
import axios from 'axios';
const queryClient = new QueryClient();
const Base_URL = 'http://localhost:4000';

const MuiTableWithProviders = () => {
  const [activeTab, setActiveTab] = useState('tasks');  // This will store the active tab
  const fileInputRef = useRef<any>(null);
  const handleTabChange = (event: any, newValue: any) => {
    setActiveTab(newValue);
  };
  const handleBulkUpload = () => {
    // Open file selector
    fileInputRef.current.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post(`${Base_URL}/api/tasks/bulk-create`, formData);
        console.log('response', response);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '2px' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="Tabs for Tasks and Jobs">
            <Tab label="Tasks" value="tasks" />
            <Tab label="Jobs" value="jobs" />
          </Tabs>
          <Button variant="contained" color="success" onClick={handleBulkUpload}>
            Bulk Upload
          </Button>
          <input
            type="file"
            accept=".xlsx, .xls"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
        </Box>
        <Box sx={{
          bottom: 0,
          height: '90vh',
          left: 0,
          margin: 0,
          maxHeight: '90vh',
          maxWidth: '100vw',
          padding: 0,
          // position: 'fixed',
          right: 0,
          // top: 0,
          width: '100vw',
        }}>
          {
            activeTab === "tasks" ? <TaskMuiTable /> : <JobsMuiTable />
          }
        </Box>


      </div>
    </QueryClientProvider>
  )
};

export default MuiTableWithProviders;
