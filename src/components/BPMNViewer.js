import BpmnJS from 'bpmn-js/dist/bpmn-navigated-viewer.production.min';
import React, { Component } from 'react';

export default class BPMNViewer extends Component {
  constructor() {
    super();
    this.state = {};
    this.updateData = this.updateData.bind(this);
    this.onWheel = this.onWheel.bind(this);
  }

  updateData(data) {
    const self = this;
    if (!this.viewer) {
      this.viewer = new BpmnJS({ container: '#bpmn-modeler' });
    }
    this.viewer.importXML(data, function(err) {
      if (err) {
        console.log(err);
      } else {
        self.canvas = self.viewer.get('canvas');
        self.canvas.zoom('fit-viewport', 'auto');
      }
    });
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  onWheel(e) {
    const currentScale = this.canvas._viewport.getCTM().a;
    const zoom = e.nativeEvent.wheelDelta / 300;
    this.canvas.zoom(currentScale + currentScale * zoom, 'auto');
  }

  render() {
    const { width, height } = this.state;
    return (
      <div>
        <div id="bpmn-modeler" style={{ width, height }} onWheel={this.onWheel}></div>
      </div>
    );
  }
}
