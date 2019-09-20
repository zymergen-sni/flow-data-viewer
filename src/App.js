import React from 'react';
import { postAPI } from './services/api';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ProcessModelDefSelector from './components/ProcessModelDefSelector';
import ProcessMoelInfo from './components/ProcessModelInfo';
import Drawer from '@material-ui/core/Drawer';
import BPMNViewer from './components/BPMNViewer';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';
import './App.css';

class App extends React.Component {
  constructor() {
    super();
    this.state = { drawerTab: 'modeler' };
    this.processModelInfoRef = React.createRef();
    this.BPMNViewerRef = React.createRef();
    this.onProcessModelSelected = this.onProcessModelSelected.bind(this);
    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.changeDrawerTab = this.changeDrawerTab.bind(this);

    // let query = 'SELECT * from ACT_RE_PROCDEF limit 50';
    // postAPI('http://localhost:8084/query', { query }).then((res) => console.log(res));
    // postAPI('http://localhost:8084/bpmn').then((res) => {
    //   res.map((item) => {
    //     console.log(item);
    //     let str = new TextDecoder().decode(new Uint8Array(item.BYTES_.data));
    //     console.log(str);
    //   });
    // });
    // postAPI('/versionsInUse', {
    //   startDate: new Date(new Date().getTime() - 6 * 30 * 24 * 60 * 60 * 1000),
    //   processModelName: 'createPlatesForCohort',
    // }).then((res) => {
    //   console.log(res);
    // });
  }

  onProcessModelSelected(e) {
    postAPI('/getLastUsedTime', { processModelName: e.value.KEY_ }).then((res) =>
      this.processModelInfoRef.current.updateData(res),
    );
  }

  toggleDrawer(e, isOpen = false, data) {
    this.setState({ isDrawerOpen: isOpen, drawerData: data });
    this.BPMNViewerRef.current.updateData(data);
  }

  changeDrawerTab(event, drawerTab) {
    this.setState({ drawerTab });
  }

  render() {
    const { drawerTab, drawerData } = this.state;
    return (
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6">Flow Process Model Explorer</Typography>
          </Toolbar>
        </AppBar>
        <div id="processModelSelector">
          <span>Select a Process Model</span>
          <ProcessModelDefSelector onProcessModelSelected={this.onProcessModelSelected} />
        </div>

        <ProcessMoelInfo ref={this.processModelInfoRef} toggleDrawer={this.toggleDrawer} />
        <Drawer open={this.state.isDrawerOpen} onClose={this.toggleDrawer}>
          <Button style={{ width: 100 }} color="primary" onClick={this.toggleDrawer}>
            Back
          </Button>
          <Tabs
            value={drawerTab}
            onChange={this.changeDrawerTab}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Model Viewer" value="modeler" />
            <Tab label="BPMN File" value="file" />
          </Tabs>
          <div style={{ display: drawerTab === 'modeler' ? 'block' : 'none' }}>
            <BPMNViewer ref={this.BPMNViewerRef} />
          </div>
          {drawerTab === 'file' && (
            <TextField
              style={{ width: window.innerWidth, height: window.innerHeight }}
              id="bpmnText"
              disabled
              multiline
              value={drawerData}
              margin="normal"
            />
          )}
        </Drawer>
      </div>
    );
  }
}

export default App;
