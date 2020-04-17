import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const BlockView = () => {

    const useStyles = makeStyles({
        root: {
          width: 250,
          marginTop: 120,
          padding: '8px',
          border: '5px solid grey',
          backgroundColor: 'lightBlue'
        },
        title: {
          fontSize: 14,
        },
        pos: {
          marginTop: 12,
        },
        screenPos: {
            width: 250,
        },
        text: {
          wordWrap: 'break-word',
          padding: '6px',
          border: '1px solid gray',
          borderRadius: '20px',
          backgroundColor: 'orange'
        }
      });

      const classes = useStyles();

    return(
        
    <Card className={classes.root} raised={true}>
      <CardContent>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          Block #n
        </Typography>
        <Typography variant="h5" component="h2">
          Hash: 
        </Typography>
        <Typography className={classes.text} variant="h6" component="h2">
          QmfNDGK65TiXsuvPJDFNmF4zxMCu1xGnyzMHZBbSv1oke8
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          Timestamp: 1587111548895
        </Typography>
        <Typography variant="body2" component="p">
          <br/>
          Transaction count : 20
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Details</Button>
      </CardActions>
    </Card>
   
    );
}

export default BlockView;