# immersenet - immersive visualisation of genetic interactions

## Installation

```
git clone https://github.com/bene200/immersenet.git
cd immersenet
npm install
npm run build
```

The build step will create a bundled file that can be included into any html document

```{html}
<script src='path/to/immersenet.min.js'></script>
```

Alternatively you can include a pre-built version

```{html}
<script src='https://raw.githubusercontent.com/bene200/immersenet/master/build/immersenet.min.js'></script>
```


## Embed in a webpage

Create an empty div with id 'immersenet' and include the immersenet JavaScript bundle as shown above.

```{html}
<div id='immersenet'></div>
```

## Use your own data

As a temporary solution the data is bundled into the JavaScript file in JSON format. By default the example data set 'interactions.json' in the 'sample_data/' directory is used. To change this, edit line 2 of the 'index.js' file.

```{javascript}
let data = require('path/to/your/interactions.json')
```

The data structure of the data file should look like so

```{javascript}
[
  {
    source: 'a',
    target: 'b'
  },
  {
    source: 'b',
    target: 'c'
  },
  .
  .
  .
]
```

## Visualization

Immersenet visualises genetic interactions defined as a set of (currently) un-weighted un-directed gene pairs. Genes are displayed as labeled boxes that are connected by edges that indicate interaction. Strongly interconnected genes in the network have similar colours indicating sub-modules in the network. A number of red spheres are placed randomly around the network. They convey no biological meaning and serve as anchor points. You can teleport to these spheres to quickly navigate around the network.

Interactions:
* Move around the visualisation using WASD keys
* Hold the left-mouse button and move the mouse to adjust the camera.
* Gaze at a gene-box to display the gene name
* Gaze at a red sphere to teleport to it
* Press the space key to hide all edges. This facilitates selecting genes/spheres by gazing. Press the space key again to make edges reappear.
* Click and drag red spheres to reposition them.

## About

This project was created in the context of the Cold Spring Harbor Laboratory course 'Immersive Approaches to Biological Data Visualization'.

## License

Copyright (c) 2016 Benedikt Rauscher

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
