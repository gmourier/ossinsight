import { useEventCallback } from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import Skeleton from '@mui/material/Skeleton';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import CodeBlock from '@theme/CodeBlock';
import React, { useState } from 'react';
import { useRemoteData } from '../RemoteCharts/hook';

export interface DebugDialogProps {
  sql?: string,
  query: string,
  params?: any,
  open: boolean,
  onClose: () => any
}


export const DebugDialog = ({ sql, query, params, open, onClose }: DebugDialogProps) => {
  const [type, setType] = useState<'explain' | 'trace'>(null);
  const { data, error } = useRemoteData(`${type}/${query}`, params, false, !!open && !!type && !!params);

  const handleTabChange = useEventCallback((e: any, type: 'explain' | 'trace') => {
    setType(type);
  });

  const renderChild = () => {
    if (type) {
      if (error) {
        return <Alert severity='error'>Request failed ${(error as any)?.message ?? ''}</Alert>
      }
      if (!data) {
        return (
          <Box sx={{ pt: 0.5 }}>
            <Skeleton width="80%" />
            <Skeleton width="50%" />
            <Skeleton width="70%" />
          </Box>
        );
      }
      return (
        <Box sx={{ overflowX: 'scroll', color: 'rgb(248, 248, 242)', backgroundColor: 'rgb(40, 42, 54)', borderRadius: 2, py: 2 }} mb={2}>
          <Box display='table' fontFamily='monospace' fontSize={16} lineHeight={1} sx={{ borderSpacing: '16px 0' }}>
            <Box display='table-header-group'>
              <Box display='table-row'>
                {data.fields.map(field => (
                  <Box key={field.name} display='table-cell'>{field.name}</Box>
                ))}
              </Box>
            </Box>
            <Box display='table-footer-group'>
            {data.data.map((item, i) => (
              <Box key={i} display='table-row'>
                {data.fields.map(field => (
                  <Box key={field.name} display='table-cell' whiteSpace='nowrap'>{item[field.name]}</Box>
                ))}
              </Box>
            ))}
            </Box>
          </Box>
        </Box>
      )
    } else {
      return (
        <CodeBlock className="language-sql">
          {sql}
        </CodeBlock>
      );
    }
  };

  return (
    <>
      <Dialog
        open={open}
        maxWidth="xl"
        fullWidth={true}
        onClose={onClose}
      >
        <Container>
          <Tabs value={type} onChange={handleTabChange}>
            <Tab value={null} label="SQL" />
            {/*<Tab value="trace" label="TRACE" />*/}
            <Tab value="explain" label="EXPLAIN" />
          </Tabs>
          <br />
          {renderChild()}
        </Container>
      </Dialog>
    </>
  );
};

export default DebugDialog;
