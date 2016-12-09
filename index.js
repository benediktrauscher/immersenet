//external dependencies
const aframe = require('aframe');
const kframe = require('kframe');
const draw = require('aframe-draw-component').component;
const textwrap = require('aframe-textwrap-component').component;
const textcomp = require('aframe-text-component');
import registerClickDrag from 'aframe-click-drag-component';;
const gamepadControls = require('aframe-gamepad-controls');
const ngraph = require('ngraph.graph');
const layout3d = require('ngraph.forcelayout3d');
const detectClusters = require('ngraph.louvain');
const d3scale = require('d3-scale');
const $ = require('jquery');
const _ = require('underscore');

//internal dependencies
const customComponents = require('./custom_components.js');

//register modules
aframe.registerComponent('draw', draw);
aframe.registerComponent('textwrap', textwrap);
aframe.registerComponent('gamepad-controls', gamepadControls);
registerClickDrag(aframe);
// register custom components
aframe.registerComponent('update-raycaster', customComponents.updateRaycaster);
aframe.registerComponent('line', customComponents.lineEntity);
aframe.registerComponent('cursor-listener-gene', customComponents.selectGene);
aframe.registerComponent('listener-teleport', customComponents.teleporter);

//load sample data
let data = require('./sample_data/interactions.json');

//globals
const ITERATIONS_COUNT = 1000;
const scene = $('a-scene');

//create graph
const g = ngraph();
data.forEach(d => g.addLink(d.source, d.target));

const layout = layout3d(g, {
  springLength: 0.00001,
  springCoeff: 1.6
});

const clusters = detectClusters(g);

for (var i = 0; i < ITERATIONS_COUNT; i++) {
  layout.step();
}

// place red navigation spheres
[
  { x: -30, y: -30, z: -30},
  { x: 30, y: -30, z: -30},
  { x: -30, y: 30, z: -30},
  { x: -30, y: 30, z: 30},
  { x: 0, y: 0, z: 0 }
].forEach( c => {
  $(`
    <a-sphere position="${c.x} ${c.y} ${c.z}"
              color="red"
              radius="2"
              click-drag
              class="teleport"
              listener-teleport>
    </a-sphere>
  `).appendTo(scene);
})

//colors for clusters
let c = [];
g.forEachNode(node => {
  c.push({
    cluster: clusters.getClass(node.id),
    color: ''
  });
});
let colmap = _.indexBy(c, 'cluster');
let scheme = d3scale.schemeCategory20;
_.keys(colmap).forEach(k => colmap[k].color = scheme.shift());

//create boxes at node positions
g.forEachNode(node => {
  //get node position
  let nodePos = layout.getNodePosition(node.id);
  let col = colmap[clusters.getClass(node.id)].color;
  $(`
    <a-box position="${nodePos.x} ${nodePos.y} ${nodePos.z}"
              color="${col}"
              id="${node.id}"
              height="0.65"
              width="0.65"
              depth="0.65"
              draw="background: ${col}"
              class="gene"
              cursor-listener-gene
              textwrap="text: ${node.id};
                        color: #fff;
                        text-align: center;
                        x: 128; y:128;
                        font: 55px arial;">
    </a-box>
  `).appendTo(scene);
});

//set camera position
let firstNode = layout.getNodePosition(g.getNode(data[0].target).id);
$(`
  <a-entity position="20 0 20"
            physics="mass: 0">
    <a-camera gamepad-controls="flyEnabled: true;
                                lookEnabled: true;
                                enabled: true"
              wasd-controls="fly: true; acceleration: 150;"
              look-controls-enabled="true">
      <a-cursor id="cursor"
                material="color: white; shader: flat; transparency: false; opacity: 1.0"
                fuse="true"
                fuse-timeout="500"
                raycaster="objects: .gene,.teleport">
      </a-cursor>">
      <a-entity text="size: 0.2; height: 0.001"
                id="genetext"
                material="color: #fff"
                position="-0.5 -1.6 -5">
      </a-entity>
    </a-camera>
  </a-entity>
`).appendTo(scene);

const path = [];
g.forEachNode(node => {
  path.push(node.links.map(l => {
    let lobj = layout.getLinkPosition(l.id);
    return `${lobj.from.x} ${lobj.from.y} ${lobj.from.z},
            ${lobj.to.x} ${lobj.to.y} ${lobj.to.z}`;
  }).join(', '));
});

path.forEach(p => {
  $(`
    <a-entity class="link"
              mixin="edge"
              visible="true"
              line="path: ${p};
                    color: #ccc";
                    width: 0.5>
    </a-entity>
  `).appendTo(scene);
});

//some global event listeners
$(document).keydown((evt) => {
  if(evt.keyCode === 32){
    if(document.querySelector('.link').getAttribute('visible')){
      document.querySelectorAll('.link').forEach(el => el.setAttribute('visible', 'false'));
    } else {
      document.querySelectorAll('.link').forEach(el => el.setAttribute('visible', 'true'));
    }
  }
});

document.addEventListener('gamepadbuttondown', evt => {
  if(document.querySelector('.link').getAttribute('visible')){
    document.querySelectorAll('.link').forEach(el => el.setAttribute('visible', 'false'));
  } else {
    document.querySelectorAll('.link').forEach(el => el.setAttribute('visible', 'true'));
  }
});
