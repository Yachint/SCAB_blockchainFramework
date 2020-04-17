import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';


const Arrow = () => {

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
        <ArrowForwardIosIcon className={classes.root}/>
    );
};

export default Arrow;