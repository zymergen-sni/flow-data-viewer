import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import moment from 'moment';
import { postAPI } from '../services/api';

export default class ProcessMoelInfo extends Component {
  constructor() {
    super();
    this.state = { data: null };
    this.updateData = this.updateData.bind(this);
    this.getBPMN = this.getBPMN.bind(this);
  }

  getBPMN(row) {
    return () => {
      console.log(row);
      postAPI('/bpmn', { deploymentId: row.DEPLOYMENT_ID_, resourceName: row.RESOURCE_NAME_ }).then(
        (res) => {
          console.log(res);
          let str = new TextDecoder().decode(new Uint8Array(res[0].BYTES_.data));
          this.props.toggleDrawer(null, true, str);
        },
      );
    };
  }

  updateData(data) {
    this.setState({ data });
  }

  render() {
    const { data } = this.state;
    if (data === null) {
      return '';
    } else if (data.length === 0) {
      return <div style={{ padding: 20 }}>{'No result is found.'}</div>;
    } else {
      return (
        <Paper style={{ margin: 20 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Version</TableCell>
                <TableCell align="right">ID</TableCell>
                <TableCell align="right">Last Start Time</TableCell>
                <TableCell align="right">Last End Time</TableCell>
                <TableCell align="right">BPMN</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.ID_}>
                  <TableCell component="th" scope="row">
                    {row.VERSION_TAG_}
                  </TableCell>
                  <TableCell align="right">{row.ID_}</TableCell>
                  <TableCell align="right">{moment(row.START_TIME_).format('MMM Do YY')}</TableCell>
                  <TableCell align="right">{moment(row.END_TIME_).format('MMM Do YY')}</TableCell>
                  <TableCell align="right">
                    <Button color="primary" onClick={this.getBPMN(row)}>
                      {row.RESOURCE_NAME_}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      );
    }
  }
}
