/*
  ============================================================
  viewer.js : the 3D model viewers (copied from V1 prints.js)
  ============================================================
  This file is a MODULE (see type="module" in the page), which
  means it can "import" code from other files. We import three.js,
  a library that draws 3D graphics with WebGL (your graphics card).

  The big picture, for every <div class="model-frame">:
    1. wait until it scrolls into view
    2. build a little 3D world: a SCENE, a CAMERA and some LIGHTS
    3. load the 3D file and put it on a "build plate" grid
    4. draw it about 60 times a second, while it's on screen

  You normally never need to edit this file. Everything per-model
  lives in the data- attributes in the HTML (projects.html, manufacturing.html).
*/

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { ThreeMFLoader } from 'three/addons/loaders/3MFLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


// ===================== 1. LOADING A FILE =====================

// Turns a file path into a 3D object. Which "loader" we use depends
// on the file extension: "models/cap.stl" -> "stl".
// It returns a Promise: a value that arrives LATER (files take time
// to download). "await" further down waits for it.
function loadModel(src) {
  const ext = src.split('?')[0].split('.').pop().toLowerCase();

  return new Promise(function (resolve, reject) {
    if (ext === 'stl') {
      // An STL is only shape (geometry), no colour, so we wrap it in a Mesh.
      new STLLoader().load(src, function (geometry) {
        resolve(new THREE.Mesh(geometry));
      }, undefined, reject);
    } else if (ext === 'obj') {
      new OBJLoader().load(src, resolve, undefined, reject);
    } else if (ext === '3mf') {
      new ThreeMFLoader().load(src, resolve, undefined, reject);
    } else if (ext === 'glb' || ext === 'gltf') {
      new GLTFLoader().load(src, function (gltf) { resolve(gltf.scene); }, undefined, reject);
    } else {
      reject(new Error('Unsupported file type: .' + ext));
    }
  });
}

// Paints every part of the model in one "filament" colour.
function applyFilament(object, color) {
  const material = new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.55,   // a bit matte, like a printed part
    metalness: 0.05,
  });
  object.traverse(function (child) {   // traverse = visit the object and everything inside it
    if (child.isMesh) child.material = material;
  });
}

// Counts the triangles, a rough measure of how detailed a model is.
function countTriangles(object) {
  let total = 0;
  object.traverse(function (child) {
    if (!child.isMesh) return;
    const geo = child.geometry;
    total += geo.index ? geo.index.count / 3 : geo.attributes.position.count / 3;
  });
  return Math.round(total);
}


// ===================== 2. ONE VIEWER =====================

function createViewer(frame) {
  const status = frame.querySelector('.viewer-status');
  const card = frame.closest('.card, .featured-model');   // the box this viewer sits in
  const src = frame.dataset.model;                         // data-model="..."
  const color = frame.dataset.color || '#ff7a1a';          // data-color, or orange
  const zUp = (frame.dataset.up || 'z') === 'z';           // data-up

  // --- the 3D world ---
  const scene = new THREE.Scene();

  // PerspectiveCamera(field of view in degrees, aspect ratio, near, far)
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 10000);
  scene.add(camera);

  // alpha:true = see-through background, so the CSS gradient shows behind it
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));   // sharp, but capped for speed
  frame.prepend(renderer.domElement);   // put the <canvas> inside the frame

  // Soft light from everywhere (sky colour, ground colour)...
  scene.add(new THREE.HemisphereLight(0xfff0e4, 0x2e1a0c, 1.6));
  // ...plus a "key" light attached to the camera, so the side you're
  // looking at is always lit as you spin the model.
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
  keyLight.position.set(1, 1.5, 2);
  camera.add(keyLight);

  // OrbitControls = drag to rotate, scroll/pinch to zoom, right-drag to pan
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;       // smooth "coasting" after you let go
  controls.autoRotate = true;          // slow turntable spin...
  controls.autoRotateSpeed = 1.2;
  controls.addEventListener('start', function () {
    controls.autoRotate = false;       // ...that stops once the visitor grabs it
  });

  // Keep the drawing the same size as the frame, even when the window changes.
  // NEW: ResizeObserver runs our code whenever an element changes size.
  new ResizeObserver(function () {
    const w = frame.clientWidth;
    const h = frame.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }).observe(frame);

  // Double-click: back to the starting view
  renderer.domElement.addEventListener('dblclick', function () {
    controls.reset();
    controls.autoRotate = true;
  });

  // Fullscreen button. iPhones can't make a <div> fullscreen, so hide it there.
  const fullBtn = frame.querySelector('.viewer-btn');
  if (fullBtn) {
    if (!frame.requestFullscreen) {
      fullBtn.hidden = true;
    } else {
      fullBtn.addEventListener('click', function () {
        if (document.fullscreenElement) document.exitFullscreen();
        else frame.requestFullscreen();
      });
    }
  }

  // PHONES & TABLETS: a model that grabs every swipe would stop you scrolling
  // the page. So on touch screens the model starts "locked": swipes scroll the
  // page, one tap unlocks it (then swipes rotate), and tapping anywhere else
  // locks it again. "(pointer: coarse)" = the main pointer is a finger.
  if (window.matchMedia('(pointer: coarse)').matches) {
    const lock = function (locked) {
      controls.enabled = !locked;
      renderer.domElement.style.touchAction = locked ? 'pan-y' : 'none';   // pan-y = let the page scroll
      frame.classList.toggle('is-active', !locked);
    };
    lock(true);
    frame.addEventListener('click', function (e) {
      if (!e.target.closest('.viewer-btn') && !controls.enabled) lock(false);
    });
    document.addEventListener('pointerdown', function (e) {
      if (controls.enabled && !frame.contains(e.target)) lock(true);
    });
  }

  // --- placing the model on the build plate ---
  function showOnPlate(model) {
    // CAD and slicers use Z as "up"; three.js uses Y. Tip it upright.
    if (zUp) model.rotation.x = -Math.PI / 2;

    // A wrapper lets us move the model without undoing that rotation.
    const holder = new THREE.Group();
    holder.add(model);
    holder.updateMatrixWorld(true);

    // Box3 = an invisible box hugging the model. We use it to
    // centre the model and sit its bottom on the grid (y = 0).
    const box = new THREE.Box3().setFromObject(holder);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    holder.position.set(-center.x, -box.min.y, -center.z);
    scene.add(holder);

    // Build plate grid in 10 mm squares, roughly twice the model's footprint
    const plate = Math.max(20, Math.ceil(Math.max(size.x, size.z) * 2 / 10) * 10);
    const grid = new THREE.GridHelper(plate, Math.min(plate / 10, 60), 0x7a3f16, 0x2e1a0c);   // orange-brown "build plate" lines
    scene.add(grid);

    // Back the camera off until the whole model fits in view
    const radius = size.length() / 2;
    const distance = radius / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2)) * 1.15;
    const target = new THREE.Vector3(0, size.y / 2, 0);
    camera.position.copy(new THREE.Vector3(1, 0.7, 1.2).normalize().multiplyScalar(distance).add(target));
    camera.near = distance / 100;
    camera.far = distance * 100;
    camera.updateProjectionMatrix();
    controls.target.copy(target);
    controls.maxDistance = distance * 4;
    controls.update();
    controls.saveState();   // remember this view for the double-click reset

    return size;
  }

  // --- go! ---
  loadModel(src)
    .then(function (model) {
      if (color !== 'original') applyFilament(model, color);
      const size = showOnPlate(model);
      status.hidden = true;

      // Fill in the automatic spec chips. three.js "y" is the model's height,
      // so in printer terms it's X (width) × Y (depth) × Z (height).
      const stats = card && card.querySelector('.model-stats');
      if (stats) {
        const mm = [size.x, size.z, size.y].map(function (n) { return n.toFixed(1); });
        addChip(stats, mm.join(' × ') + ' mm');
        addChip(stats, countTriangles(model).toLocaleString() + ' tris');
      }
    })
    .catch(function (error) {
      // No file yet (or a typo in the path)? Show a wireframe placeholder
      // so the page still looks alive, with a note saying what's missing.
      console.warn('Could not load ' + src, error);
      const placeholder = new THREE.Mesh(
        new THREE.TorusKnotGeometry(10, 3, 120, 16),
        new THREE.MeshBasicMaterial({ color: 0x7a3f16, wireframe: true })
      );
      showOnPlate(placeholder);
      frame.classList.add('is-missing');
      status.textContent = location.protocol === 'file:'
        ? 'Open this page with Live Server to load 3D files'
        : 'Model not found: add ' + src;
    });

  // The drawing loop. setAnimationLoop runs the function every frame;
  // passing null stops it. We only draw while the viewer is on screen,
  // so ten viewers don't cook your laptop.
  return {
    start: function () {
      renderer.setAnimationLoop(function () {
        controls.update();
        renderer.render(scene, camera);
      });
    },
    stop: function () { renderer.setAnimationLoop(null); },
  };
}

function addChip(list, text) {
  const li = document.createElement('li');
  li.textContent = text;
  list.appendChild(li);
}


// ===================== 3. LAZY START =====================
// NEW: IntersectionObserver tells us when an element enters or leaves
// the screen. The first time a frame comes near, we build its viewer
// (that's when the file downloads). After that we just pause and
// resume its drawing loop.
//
// Heads-up: browsers allow about 16 live 3D canvases per page. If the
// library ever grows past ~14 models, split it across two pages.

const viewers = new Map();   // frame -> its viewer

const watcher = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    const frame = entry.target;
    if (entry.isIntersecting) {
      if (!viewers.has(frame)) viewers.set(frame, createViewer(frame));
      viewers.get(frame).start();
    } else if (viewers.has(frame)) {
      viewers.get(frame).stop();
    }
  });
}, { rootMargin: '200px' });   // start 200px before it actually scrolls into view

document.querySelectorAll('.model-frame').forEach(function (frame) {
  watcher.observe(frame);
});
