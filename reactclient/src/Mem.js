import React from 'react';
import drawCircle from './utilities/canvasLoadAnimations';

function Mem(props) {
  // console.log(props);
  let test2 = 'randomname2';
  const {totalMem, usedMem, memUsage, freeMem, memWidgetId} = props.memData;
  let canvas = document.querySelector(`.${memWidgetId}`);

  drawCircle(canvas, memUsage*100);
  // console.log(memUsage);
  const totalMemInGb = Math.floor((totalMem/1073741824 * 100))/100;
  const freeMemInGb = Math.floor((freeMem/1073741824 * 100))/100;

  return(
    <div className="col-sm-3">
      <h3>Memory Useage</h3>
      <div className="canvas-wrapper">
        <canvas className={memWidgetId} width="200" height="200"></canvas>
        <div className="mem-text">
          {memUsage*100}%
        </div>
      </div>
      <div>
        Total Memory: {totalMemInGb} gb
      </div>
      <div>
        Free Memory: {freeMemInGb} gb
      </div>
    </div>
  )
}

export default Mem;