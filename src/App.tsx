import { AppShell } from '@mantine/core';
import GeneTable from './components/GeneTable';

import './App.css';

export default function App() {
  return (
    <AppShell padding="md" className='App'>
      <GeneTable />
    </AppShell>
  );
}
