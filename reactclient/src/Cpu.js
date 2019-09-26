import React from 'react';
import drawCircle from './utilities/canvasLoadAnimations';

function Cpu(props) {
  let test = 'randomClassName';
  let canvas = document.querySelector(`.${props.cpuData.cpuWidgetId}`);
  drawCircle(canvas, props.cpuData.cpuLoad);
  console.log(props.cpuData.cpuWidgetId);
  
  return(
    <div className="col-sm-3 cpu">
      <h3>CPU load</h3>
      <div className="canvas-wrapper">
        <canvas className={props.cpuData.cpuWidgetId} width="200" height="200"></canvas>
        <div className="cpu-text">
          {props.cpuData.cpuLoad}%
        </div>
      </div>
    </div>
  )
}

export default Cpu;