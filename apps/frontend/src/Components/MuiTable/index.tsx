import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { TaskMuiTable } from './task';
import { JobsMuiTable } from './jobs';
import { Tabs, Tab, Box } from '@mui/material';
import { useState } from 'react';
const queryClient = new QueryClient();

const MuiTableWithProviders = () => {
  const [activeTab, setActiveTab] = useState('tasks');  // This will store the active tab

  const handleTabChange = (event: any, newValue: any) => {
    setActiveTab(newValue);
    // You can also reset pagination here if needed
  };
  return (
    <QueryClientProvider client={queryClient}>
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="Tabs for Tasks and Jobs">
          <Tab label="Tasks" value="tasks" />
          <Tab label="Jobs" value="jobs" />
        </Tabs>
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
