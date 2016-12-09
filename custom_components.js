const aframe = require('aframe');
const $ = require('jquery');

// initialize components object
const components = {};

const coordinates = aframe.utils.coordinates;

components.selectGene = {
  init: function () {
    this.el.addEventListener('click', function(e){
      $('#genetext').attr('text', `text: ${e.originalTarget.id}; size: 0.2; height: 0.001`);
    });
  }
};

components.teleporter = {
  init: function () {
    this.el.addEventListener('click', function(e){
      let el = e.originalTarget;
      document.querySelector('a-camera').setAttribute('position', el.getAttribute('position'));
    });
    this.el.addEventListener('gamepadbuttondown', function(e){
      let el = e.originalTarget;
      document.querySelector('a-camera').setAttribute('position', el.getAttribute('position'));
    });
  }
};

components.lineEntity = {
  // Allow line component to accept vertices and color.
  schema: {
    color: { default: '#333' },
    width: { default: '1' },
    path: {
      default: [
        { x: -0.5, y: 0, z: 0 },
        { x: 0.5, y: 0, z: 0 }
      ],
      // Deserialize path in the form of comma-separated vec3s: `0 0 0, 1 1 1, 2 0 3`.
      parse: function (value) {
        return value.split(',').map(coordinates.parse);
      },
      // Serialize array of vec3s in case someone does
      // setAttribute('line', 'path', [...]).
      stringify: function (data) {
        return data.map(coordinates.stringify).join(',');
      }
    }
  },
  // Create or update the line geometry.
  update: function(oldData) {
    let material = new THREE.LineBasicMaterial({
      color: this.data.color,
      transparent: true,
      opacity: 0.1,
      linewidth: this.data.width
    });
    // Add vertices to geometry.
    let geometry = new THREE.Geometry();
    this.data.path.forEach(vec3 => {
      geometry.vertices.push(
        new THREE.Vector3(vec3.x, vec3.y, vec3.z)
      );
    });
    // Apply mesh.
    this.el.setObject3D('mesh', new THREE.Line(geometry, material));
  },
  // Remove the line geometry.
  remove: () => {
    this.el.removeObject3D('mesh');
  }
};

components.updateRaycaster = {
    schema: { type: 'selector' },

    init: function () {
      console.log('hello');
      let raycasterEl = this.data;
      raycasterEl.components.raycaster.refreshObjects();
    }
};

module.exports = components;
