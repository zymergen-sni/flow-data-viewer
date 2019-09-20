import React, { Component } from 'react';
import { getAPI } from '../services/api';
import Select from 'react-select';

export default class SingleSelect extends Component {
  constructor() {
    super();
    this.state = { processModelDefs: [] };
    this.onChange = this.onChange.bind(this);
  }
  componentWillMount() {
    getAPI('/processModelDefs').then((res) =>
      this.setState({
        processModelDefs: res.map((p) => ({ label: p.NAME_, value: p })),
      }),
    );
  }

  onChange(e) {
    this.props.onProcessModelSelected(e);
  }
  render() {
    const { processModelDefs } = this.state;
    return (
      <div style={{ margin: 20, width: 500 }}>
        <Select
          className="basic-single"
          classNamePrefix="select"
          name="color"
          options={processModelDefs}
          onChange={this.onChange}
        />
      </div>
    );
  }
}
