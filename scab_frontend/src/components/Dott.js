import React from 'react';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { makeStyles } from '@material-ui/core/styles';

const Dott = () => {

    const useStyles = makeStyles({
        root: {
          position: 'relative',
          left: '300px',
          bottom: '220px',
          fontSize: '80px'
        }
      });

      const classes = useStyles();

    return(
        <MoreHorizIcon className={classes.root}/>
    );
};

export default Dott;
