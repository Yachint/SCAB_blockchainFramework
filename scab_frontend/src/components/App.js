import React from 'react';
import AppNavbar from './AppNavbar';
import BlockView from './BlockView';
import Arrow from './Arrow';
import { Container } from '@material-ui/core';

const App = () => {
    return(
        <Container>
          <AppNavbar />
          <BlockView />
          <Arrow />
        </Container>
    );
};

export default App;