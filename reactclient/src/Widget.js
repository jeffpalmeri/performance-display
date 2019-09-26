import React, {Component} from 'react';
import Cpu from './Cpu';
import Mem from './Mem';
import Info from './Info';
import './Widget.css';
import uuid from 'uuid/v4';

const cpuWidgetId = uuid();
const memWidgetId = uuid();

class Widget extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { freeMem, totalMem, usedMem, memUsage, osType, uptime, cpuModel, numCores, cpuSpeed, cpuLoad, macA, isActive } = this.props.data;

    // const cpuWidgetId = createdIDs;
    // const memWidgetId = `mem-widget-${macA}`;

    const cpu = {cpuLoad, cpuWidgetId};
    const mem = {totalMem, usedMem, memUsage, freeMem, memWidgetId};
    const info = {macA, osType, uptime, cpuModel, numCores, cpuSpeed};

    let notActiveDiv = '';
    if(!isActive) {
      notActiveDiv = <div className="not-active">Offline</div>
    }

    return(
      <div className="widget col-sm-12">
        {notActiveDiv}
        <Cpu cpuData={cpu} />
        <Mem memData={mem} />
        <Info infoData ={info} />
      </div>
    )
  }
}

export default Widget;