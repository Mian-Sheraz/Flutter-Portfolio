(function () {
  'use strict';

  // Check for prefers-reduced-motion
  window.__portfolioStaticMode = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================================
     1. PRELOADER & ENGINE BOOTSTRAP
     ========================================================================== */
  (function initPreloader() {
    var pl = document.getElementById('preloader');
    if (!pl) return;

    var num = document.getElementById('plNum');
    var fill = document.getElementById('plFill');
    var msg = document.getElementById('plMsg');

    var msgs = [
      'Initializing Flutter Engine…',
      'Compiling Dart AOT…',
      'Warming Impeller Shaders…',
      'Mounting Clean Architecture…',
      'Hydrating State Containers…',
      'Ready for Mohammad Sheraz'
    ];

    var progress = 0;
    var msgIdx = 0;

    var interval = setInterval(function () {
      progress += Math.floor(Math.random() * 8) + 4;
      if (progress > 100) progress = 100;

      if (num) num.textContent = progress;
      if (fill) fill.style.width = progress + '%';

      var nextMsgIdx = Math.min(Math.floor((progress / 100) * msgs.length), msgs.length - 1);
      if (nextMsgIdx !== msgIdx && msg) {
        msgIdx = nextMsgIdx;
        msg.textContent = msgs[msgIdx];
      }

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(function () {
          pl.style.opacity = '0';
          pl.style.visibility = 'hidden';
          document.body.classList.remove('loading');
          window.__pageReady = true;
          document.dispatchEvent(new Event('page:ready'));
        }, 350);
      }
    }, 45);

    // Preloader Canvas Aurora
    var canvas = document.getElementById('plAurora');
    if (canvas && typeof THREE !== 'undefined' && !window.__portfolioStaticMode) {
      try {
        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.z = 5;

        var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setSize(window.innerWidth, window.innerHeight);

        var geom = new THREE.IcosahedronGeometry(1.5, 2);
        var mat = new THREE.MeshBasicMaterial({
          color: 0x00f2fe,
          wireframe: true,
          transparent: true,
          opacity: 0.14
        });
        var mesh = new THREE.Mesh(geom, mat);
        scene.add(mesh);

        function animPl() {
          if (pl.style.visibility === 'hidden') return;
          requestAnimationFrame(animPl);
          mesh.rotation.x += 0.003;
          mesh.rotation.y += 0.005;
          renderer.render(scene, camera);
        }
        animPl();

        window.addEventListener('resize', function () {
          if (!renderer) return;
          renderer.setSize(window.innerWidth, window.innerHeight);
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
        });
      } catch (e) {
        console.warn('Preloader canvas failed', e);
      }
    }
  })();


  /* ==========================================================================
     3. SCROLL PROGRESS INDICATOR
     ========================================================================== */
  (function initScrollProgress() {
    var bar = document.querySelector('.sr-bar');
    if (!bar) return;

    window.addEventListener('scroll', function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var progress = h > 0 ? window.scrollY / h : 0;
      bar.style.transform = 'scaleX(' + Math.min(1, Math.max(0, progress)) + ')';
    }, { passive: true });
  })();

  /* ==========================================================================
     4. HERO 3D THREE.JS CANVAS — INTERACTIVE FLUTTER 3D SMARTPHONE
     ========================================================================== */
  (function initHero3D() {
    var canvas = document.getElementById('hero3d');
    if (!canvas || typeof THREE === 'undefined') return;

    var parent = canvas.parentElement;

    try {
      var scene = new THREE.Scene();

      var camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
      camera.position.set(0, 0, 7.8);

      var renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      function resizeRenderer() {
        var w = (parent && (parent.clientWidth || parent.offsetWidth)) || canvas.clientWidth || 520;
        var h = (parent && (parent.clientHeight || parent.offsetHeight)) || canvas.clientHeight || 520;
        w = Math.max(w, 280);
        h = Math.max(h, 400);
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
      resizeRenderer();
      window.addEventListener('resize', resizeRenderer);
      window.addEventListener('load', resizeRenderer);
      document.addEventListener('page:ready', resizeRenderer);
      setTimeout(resizeRenderer, 150);
      setTimeout(resizeRenderer, 600);

      // --- LIGHTING ---
      var ambLight = new THREE.AmbientLight(0xffffff, 0.95);
      scene.add(ambLight);

      var keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
      keyLight.position.set(4, 5, 5);
      scene.add(keyLight);

      var fillLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
      fillLight.position.set(-4, -2, 4);
      scene.add(fillLight);

      var rimLight = new THREE.DirectionalLight(0x818cf8, 1.3);
      rimLight.position.set(0, 3, -4);
      scene.add(rimLight);

      var cursorLight = new THREE.PointLight(0x38bdf8, 1.5, 9);
      cursorLight.position.set(0, 0, 3.5);
      scene.add(cursorLight);

      // Helper: rounded rectangle shape
      function createRoundedRectShape(w, h, r) {
        var s = new THREE.Shape();
        var x = -w / 2, y = -h / 2;
        s.moveTo(x + r, y);
        s.lineTo(x + w - r, y);
        s.quadraticCurveTo(x + w, y, x + w, y + r);
        s.lineTo(x + w, y + h - r);
        s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        s.lineTo(x + r, y + h);
        s.quadraticCurveTo(x, y + h, x, y + h - r);
        s.lineTo(x, y + r);
        s.quadraticCurveTo(x, y, x + r, y);
        return s;
      }

      // Root scene group for parallax & rotation
      var worldGroup = new THREE.Group();
      scene.add(worldGroup);

      var phoneGroup = new THREE.Group();
      worldGroup.add(phoneGroup);

      // --- SMARTPHONE CHASSIS ---
      var phoneW = 2.18, phoneH = 4.38, cornerR = 0.32, depth = 0.17;
      var chassisShape = createRoundedRectShape(phoneW, phoneH, cornerR);
      var extrudeSettings = {
        depth: depth,
        bevelEnabled: true,
        bevelSegments: 5,
        steps: 1,
        bevelSize: 0.024,
        bevelThickness: 0.024
      };
      var chassisGeo = new THREE.ExtrudeGeometry(chassisShape, extrudeSettings);
      chassisGeo.center();

      var chassisMat = new THREE.MeshStandardMaterial({
        color: 0x141a24,
        metalness: 0.75,
        roughness: 0.3
      });
      var chassis = new THREE.Mesh(chassisGeo, chassisMat);
      phoneGroup.add(chassis);

      // Smooth Rounded Metallic Rim / Antenna band (matching phone corner curvature)
      var rimShape = createRoundedRectShape(phoneW + 0.012, phoneH + 0.012, cornerR + 0.006);
      var rimGeo = new THREE.ExtrudeGeometry(rimShape, {
        depth: depth * 0.9,
        bevelEnabled: false
      });
      rimGeo.center();
      var rimMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        metalness: 0.9,
        roughness: 0.15,
        emissive: 0x0284c7,
        emissiveIntensity: 0.35
      });
      var outerRim = new THREE.Mesh(rimGeo, rimMat);
      phoneGroup.add(outerRim);

      // Side buttons (Power, Volume Rocker, Action)
      var btnMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.3 });
      var pwrBtn = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.44, 0.06), btnMat);
      pwrBtn.position.set(phoneW / 2 + 0.03, 0.45, 0);
      phoneGroup.add(pwrBtn);

      var volUp = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.32, 0.06), btnMat);
      volUp.position.set(-phoneW / 2 - 0.03, 0.65, 0);
      phoneGroup.add(volUp);

      var volDown = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.32, 0.06), btnMat);
      volDown.position.set(-phoneW / 2 - 0.03, 0.25, 0);
      phoneGroup.add(volDown);

      var actionBtn = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.2, 0.06), btnMat);
      actionBtn.position.set(-phoneW / 2 - 0.03, 1.15, 0);
      phoneGroup.add(actionBtn);

      // Solid Titanium Backplate (visible when rotating to the backside)
      var backplateShape = createRoundedRectShape(phoneW - 0.02, phoneH - 0.02, cornerR - 0.01);
      var backplateGeo = new THREE.ShapeGeometry(backplateShape, 24);
      var backplateMat = new THREE.MeshStandardMaterial({
        color: 0x0d121c,
        metalness: 0.75,
        roughness: 0.25,
        side: THREE.FrontSide
      });
      var backplate = new THREE.Mesh(backplateGeo, backplateMat);
      backplate.rotation.y = Math.PI; // Face the rear
      backplate.position.set(0, 0, -depth / 2 - 0.012);
      phoneGroup.add(backplate);

      // Camera Bump on the back
      var camBumpShape = createRoundedRectShape(0.85, 0.85, 0.2);
      var camBumpGeo = new THREE.ExtrudeGeometry(camBumpShape, { depth: 0.06, bevelEnabled: true, bevelSegments: 3, bevelSize: 0.015, bevelThickness: 0.015 });
      camBumpGeo.center();
      var camBumpMat = new THREE.MeshStandardMaterial({ color: 0x0b0e14, metalness: 0.7, roughness: 0.3 });
      var camBump = new THREE.Mesh(camBumpGeo, camBumpMat);
      camBump.position.set(-0.52, 1.48, -depth / 2 - 0.035);
      phoneGroup.add(camBump);

      // Triple Camera Lenses
      var lensGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.04, 24);
      lensGeo.rotateX(Math.PI / 2);
      var lensMat = new THREE.MeshStandardMaterial({ color: 0x05070a, metalness: 0.95, roughness: 0.1 });
      var rimLensMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.9, roughness: 0.2 });

      [[-0.68, 1.66], [-0.68, 1.3], [-0.36, 1.48]].forEach(function (coords) {
        var lens = new THREE.Mesh(lensGeo, lensMat);
        lens.position.set(coords[0], coords[1], -depth / 2 - 0.075);
        phoneGroup.add(lens);

        var lensRim = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.015, 12, 24), rimLensMat);
        lensRim.position.set(coords[0], coords[1], -depth / 2 - 0.078);
        phoneGroup.add(lensRim);
      });

      // --- DYNAMIC FLUTTER APP SCREEN TEXTURE ---
      var screenCanvas = document.createElement('canvas');
      screenCanvas.width = 540;
      screenCanvas.height = 1080;
      var sCtx = screenCanvas.getContext('2d');

      var screenTexture = new THREE.CanvasTexture(screenCanvas);
      screenTexture.minFilter = THREE.LinearFilter;
      screenTexture.magFilter = THREE.LinearFilter;

      // Screen plane geometry with custom UV mapping (fits strictly inside bezel)
      var screenW = 2.02, screenH = 4.22, screenR = 0.24;
      var screenShape = createRoundedRectShape(screenW, screenH, screenR);
      var screenGeo = new THREE.ShapeGeometry(screenShape, 24);

      var posAttr = screenGeo.attributes.position;
      var uvs = [];
      var minX = -screenW / 2, maxX = screenW / 2, minY = -screenH / 2, maxY = screenH / 2;
      for (var i = 0; i < posAttr.count; i++) {
        var ux = (posAttr.getX(i) - minX) / (maxX - minX);
        var uy = (posAttr.getY(i) - minY) / (maxY - minY);
        uvs.push(ux, uy);
      }
      screenGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

      // Screen placed in front of chassis — FRONT SIDE ONLY (never bleeds to backside!)
      var screenMat = new THREE.MeshBasicMaterial({
        map: screenTexture,
        side: THREE.FrontSide
      });
      var screenMesh = new THREE.Mesh(screenGeo, screenMat);
      screenMesh.position.set(0, 0, 0.116);
      phoneGroup.add(screenMesh);

      // Glass sheen overlay on the screen (FRONT SIDE ONLY)
      var glassOverlayMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.04,
        side: THREE.FrontSide
      });
      var glassOverlay = new THREE.Mesh(screenGeo.clone(), glassOverlayMat);
      glassOverlay.position.set(0, 0, 0.118);
      phoneGroup.add(glassOverlay);

      // Touch ripple tracking
      var touchRipples = [];
      function addRipple(x, y) {
        touchRipples.push({ x: x, y: y, r: 5, maxR: 75, opacity: 0.9 });
      }

      // Rounded rect helper for 2D canvas
      function drawRoundedRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
      }

      // Draw Flutter bird logo mark
      function drawFlutterBird(ctx, x, y, scale) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        // Top wing
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(24, 24);
        ctx.lineTo(14, 24);
        ctx.lineTo(-5, 5);
        ctx.closePath();
        ctx.fillStyle = '#02569B';
        ctx.fill();

        // Lower wing
        ctx.beginPath();
        ctx.moveTo(7, 17);
        ctx.lineTo(19, 29);
        ctx.lineTo(11, 29);
        ctx.lineTo(2, 20);
        ctx.closePath();
        ctx.fillStyle = '#0175C2';
        ctx.fill();

        // Mid diamond
        ctx.beginPath();
        ctx.moveTo(14, 24);
        ctx.lineTo(24, 24);
        ctx.lineTo(16, 32);
        ctx.lineTo(9, 29);
        ctx.closePath();
        ctx.fillStyle = '#29B6F6';
        ctx.fill();

        ctx.restore();
      }

      // Function to render the vibrant Flutter App UI onto the screen texture
      function updateScreen(time) {
        var cw = screenCanvas.width, ch = screenCanvas.height;
        sCtx.clearRect(0, 0, cw, ch);

        // 1. Sleek Background with Cyber Ambient Orbs
        var bgGrad = sCtx.createLinearGradient(0, 0, 0, ch);
        bgGrad.addColorStop(0, '#0a0d14');
        bgGrad.addColorStop(0.5, '#07090e');
        bgGrad.addColorStop(1, '#050609');
        sCtx.fillStyle = bgGrad;
        sCtx.fillRect(0, 0, cw, ch);

        // Ambient radial light top-right
        var rad1 = sCtx.createRadialGradient(cw * 0.8, 140, 10, cw * 0.8, 140, 240);
        rad1.addColorStop(0, 'rgba(56, 189, 248, 0.18)');
        rad1.addColorStop(1, 'transparent');
        sCtx.fillStyle = rad1;
        sCtx.fillRect(0, 0, cw, 400);

        // Ambient radial light bottom-left
        var rad2 = sCtx.createRadialGradient(cw * 0.2, ch * 0.7, 10, cw * 0.2, ch * 0.7, 260);
        rad2.addColorStop(0, 'rgba(99, 102, 241, 0.12)');
        rad2.addColorStop(1, 'transparent');
        sCtx.fillStyle = rad2;
        sCtx.fillRect(0, ch * 0.4, cw, ch * 0.6);

        // 2. Dynamic Island
        var diW = 144, diH = 32, diX = (cw - diW) / 2, diY = 18;
        drawRoundedRect(sCtx, diX, diY, diW, diH, 16);
        sCtx.fillStyle = '#000000';
        sCtx.fill();
        sCtx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        sCtx.lineWidth = 1;
        sCtx.stroke();

        // Dynamic Island Camera dot & Audio/Indicator LED
        sCtx.beginPath();
        sCtx.arc(diX + diW - 24, diY + diH / 2, 4.5, 0, Math.PI * 2);
        sCtx.fillStyle = '#111827';
        sCtx.fill();

        // Pulsing green live indicator
        var greenPulse = 0.5 + 0.5 * Math.sin(time * 4);
        sCtx.beginPath();
        sCtx.arc(diX + 24, diY + diH / 2, 3.5, 0, Math.PI * 2);
        sCtx.fillStyle = 'rgba(34, 197, 94, ' + (0.7 + greenPulse * 0.3) + ')';
        sCtx.shadowColor = '#22c55e';
        sCtx.shadowBlur = 8;
        sCtx.fill();
        sCtx.shadowBlur = 0;

        // 3. Status Bar
        sCtx.fillStyle = '#f1f5f9';
        sCtx.font = '600 16px -apple-system, Inter, sans-serif';
        sCtx.textAlign = 'left';
        sCtx.fillText('9:41', 34, 40);

        // 5G, Wifi & Battery icons on right
        sCtx.textAlign = 'right';
        sCtx.font = '500 13px Inter, sans-serif';
        sCtx.fillStyle = '#cbd5e1';
        sCtx.fillText('5G', cw - 78, 39);

        // Battery Pill
        var bX = cw - 65, bY = 28, bW = 28, bH = 14;
        drawRoundedRect(sCtx, bX, bY, bW, bH, 4);
        sCtx.strokeStyle = '#94a3b8';
        sCtx.lineWidth = 1.5;
        sCtx.stroke();
        drawRoundedRect(sCtx, bX + 2.5, bY + 2.5, bW - 5, bH - 5, 2);
        sCtx.fillStyle = '#22c55e';
        sCtx.fill();
        sCtx.fillRect(bX + bW + 1, bY + 4, 2, 6);

        // 4. App Bar / Header
        drawFlutterBird(sCtx, 34, 82, 1.15);
        sCtx.textAlign = 'left';
        sCtx.font = '700 20px Inter, sans-serif';
        sCtx.fillStyle = '#f8fafc';
        sCtx.fillText('Flutter Impeller', 76, 102);

        sCtx.font = '500 12px Inter, sans-serif';
        sCtx.fillStyle = '#38bdf8';
        sCtx.fillText('ENGINE v3.24 · PRODUCTION READY', 76, 119);

        // Crash-Free Pill Top Right
        var pillW = 86, pillH = 26, pillX = cw - pillW - 32, pillY = 96;
        drawRoundedRect(sCtx, pillX, pillY, pillW, pillH, 13);
        sCtx.fillStyle = 'rgba(34, 197, 94, 0.14)';
        sCtx.fill();
        sCtx.strokeStyle = 'rgba(34, 197, 94, 0.4)';
        sCtx.lineWidth = 1;
        sCtx.stroke();
        sCtx.font = '600 11px Inter, sans-serif';
        sCtx.fillStyle = '#4ade80';
        sCtx.textAlign = 'center';
        sCtx.fillText('99.9% Crashless', pillX + pillW / 2, pillY + 17);

        // 5. Featured Interactive Performance Card (Wave / Frame Pipeline)
        var c1X = 30, c1Y = 148, c1W = cw - 60, c1H = 200;
        drawRoundedRect(sCtx, c1X, c1Y, c1W, c1H, 20);
        var cardGrad = sCtx.createLinearGradient(c1X, c1Y, c1X + c1W, c1Y + c1H);
        cardGrad.addColorStop(0, 'rgba(24, 32, 48, 0.85)');
        cardGrad.addColorStop(1, 'rgba(15, 20, 30, 0.85)');
        sCtx.fillStyle = cardGrad;
        sCtx.fill();
        sCtx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
        sCtx.lineWidth = 1.2;
        sCtx.stroke();

        // Card Title & 60 FPS Badge
        sCtx.textAlign = 'left';
        sCtx.font = '600 12px Inter, sans-serif';
        sCtx.fillStyle = '#7dd3fc';
        sCtx.fillText('ACTIVE RENDER PIPELINE', c1X + 20, c1Y + 32);

        sCtx.font = '800 28px Inter, sans-serif';
        sCtx.fillStyle = '#ffffff';
        sCtx.fillText('60.0', c1X + 20, c1Y + 68);

        sCtx.font = '600 14px Inter, sans-serif';
        sCtx.fillStyle = '#38bdf8';
        sCtx.fillText('FPS · 0 Jank', c1X + 92, c1Y + 65);

        // Frame Budget Pill
        drawRoundedRect(sCtx, c1X + c1W - 124, c1Y + 22, 104, 26, 13);
        sCtx.fillStyle = 'rgba(56, 189, 248, 0.16)';
        sCtx.fill();
        sCtx.font = '600 11px Inter, sans-serif';
        sCtx.fillStyle = '#38bdf8';
        sCtx.textAlign = 'center';
        sCtx.fillText('1.8ms Frame', c1X + c1W - 72, c1Y + 39);

        // Live Animated Waveform Chart
        sCtx.beginPath();
        var chartX = c1X + 20, chartY = c1Y + 145, chartW = c1W - 40;
        sCtx.moveTo(chartX, chartY);

        for (var px = 0; px <= chartW; px += 4) {
          var normX = px / chartW;
          var wave = Math.sin(normX * 8 + time * 3.5) * 16 + Math.cos(normX * 14 - time * 2) * 8;
          var py = chartY - 24 + wave;
          sCtx.lineTo(chartX + px, py);
        }

        sCtx.strokeStyle = '#38bdf8';
        sCtx.lineWidth = 3;
        sCtx.shadowColor = '#00f0ff';
        sCtx.shadowBlur = 12;
        sCtx.stroke();
        sCtx.shadowBlur = 0;

        // Wave Fill Underneath
        sCtx.lineTo(chartX + chartW, c1Y + c1H - 16);
        sCtx.lineTo(chartX, c1Y + c1H - 16);
        sCtx.closePath();
        var waveFill = sCtx.createLinearGradient(0, chartY - 40, 0, c1Y + c1H);
        waveFill.addColorStop(0, 'rgba(56, 189, 248, 0.22)');
        waveFill.addColorStop(1, 'rgba(56, 189, 248, 0)');
        sCtx.fillStyle = waveFill;
        sCtx.fill();

        // 6. Architectural Status Widgets
        var widgets = [
          {
            icon: '⚡',
            name: 'Riverpod 2.0 AsyncState',
            desc: 'AutoDisposeProvider · Cached 14ms',
            tag: 'SYNCD',
            tagColor: '#22c55e',
            color: '#38bdf8'
          },
          {
            icon: '🏛️',
            name: 'Clean Architecture Domain',
            desc: 'Strict Layer Decoupling · 100% Mockable',
            tag: 'TESTED',
            tagColor: '#38bdf8',
            color: '#818cf8'
          },
          {
            icon: '🔄',
            name: 'Offline-First Reactive Hive',
            desc: 'Sub-5ms local persistence & Cloud stream',
            tag: 'STREAM',
            tagColor: '#a855f7',
            color: '#c084fc'
          }
        ];

        var wY = 368;
        widgets.forEach(function (wgt, idx) {
          drawRoundedRect(sCtx, 30, wY, cw - 60, 84, 16);
          sCtx.fillStyle = 'rgba(20, 26, 38, 0.78)';
          sCtx.fill();
          sCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
          sCtx.lineWidth = 1;
          sCtx.stroke();

          // Icon circle
          sCtx.beginPath();
          sCtx.arc(68, wY + 42, 22, 0, Math.PI * 2);
          sCtx.fillStyle = 'rgba(56, 189, 248, 0.12)';
          sCtx.fill();
          sCtx.font = '18px Inter, sans-serif';
          sCtx.textAlign = 'center';
          sCtx.fillText(wgt.icon, 68, wY + 48);

          // Texts
          sCtx.textAlign = 'left';
          sCtx.font = '600 14px Inter, sans-serif';
          sCtx.fillStyle = '#f1f5f9';
          sCtx.fillText(wgt.name, 102, wY + 36);

          sCtx.font = '500 12px Inter, sans-serif';
          sCtx.fillStyle = '#94a3b8';
          sCtx.fillText(wgt.desc, 102, wY + 56);

          // Tag
          var tW = 60, tH = 22, tX = cw - 30 - tW - 14, tY = wY + 31;
          drawRoundedRect(sCtx, tX, tY, tW, tH, 6);
          sCtx.fillStyle = 'rgba(255, 255, 255, 0.05)';
          sCtx.fill();
          sCtx.font = '700 10px Inter, sans-serif';
          sCtx.fillStyle = wgt.tagColor;
          sCtx.textAlign = 'center';
          sCtx.fillText(wgt.tag, tX + tW / 2, tY + 15);

          wY += 98;
        });

        // 7. Live Dart Code Snippet Card
        var codeY = wY + 12;
        drawRoundedRect(sCtx, 30, codeY, cw - 60, 164, 16);
        sCtx.fillStyle = '#0b0f17';
        sCtx.fill();
        sCtx.strokeStyle = 'rgba(56, 189, 248, 0.22)';
        sCtx.lineWidth = 1;
        sCtx.stroke();

        // Mac dots on code card
        sCtx.beginPath();
        sCtx.arc(52, codeY + 22, 5, 0, Math.PI * 2);
        sCtx.fillStyle = '#ff5f56';
        sCtx.fill();
        sCtx.beginPath();
        sCtx.arc(68, codeY + 22, 5, 0, Math.PI * 2);
        sCtx.fillStyle = '#ffbd2e';
        sCtx.fill();
        sCtx.beginPath();
        sCtx.arc(84, codeY + 22, 5, 0, Math.PI * 2);
        sCtx.fillStyle = '#27c93f';
        sCtx.fill();

        sCtx.textAlign = 'right';
        sCtx.font = '600 11px "JetBrains Mono", Consolas, monospace';
        sCtx.fillStyle = '#64748b';
        sCtx.fillText('presentation/controller.dart', cw - 50, codeY + 25);

        // Code lines
        sCtx.textAlign = 'left';
        sCtx.font = '500 13px "JetBrains Mono", Consolas, monospace';

        sCtx.fillStyle = '#f43f5e';
        sCtx.fillText('final ', 48, codeY + 62);
        sCtx.fillStyle = '#f8fafc';
        sCtx.fillText('portfolio = ', 96, codeY + 62);
        sCtx.fillStyle = '#38bdf8';
        sCtx.fillText('ref.watch', 184, codeY + 62);
        sCtx.fillStyle = '#94a3b8';
        sCtx.fillText('(stateProvider);', 256, codeY + 62);

        sCtx.fillStyle = '#a855f7';
        sCtx.fillText('return ', 48, codeY + 92);
        sCtx.fillStyle = '#38bdf8';
        sCtx.fillText('ImpellerView', 108, codeY + 92);
        sCtx.fillStyle = '#94a3b8';
        sCtx.fillText('(', 208, codeY + 92);

        sCtx.fillStyle = '#e2e8f0';
        sCtx.fillText('  shader: ', 68, codeY + 120);
        sCtx.fillStyle = '#22c55e';
        sCtx.fillText('CustomFragmentPipeline', 138, codeY + 120);
        sCtx.fillStyle = '#94a3b8';
        sCtx.fillText(');', 330, codeY + 120);

        // Blinking terminal cursor
        if (Math.sin(time * 5) > 0) {
          sCtx.fillStyle = '#38bdf8';
          sCtx.fillRect(348, codeY + 107, 8, 16);
        }

        // 8. Bottom Navigation Dock
        var navY = ch - 110, navH = 72;
        drawRoundedRect(sCtx, 34, navY, cw - 68, navH, 24);
        sCtx.fillStyle = 'rgba(15, 20, 30, 0.94)';
        sCtx.fill();
        sCtx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        sCtx.lineWidth = 1;
        sCtx.stroke();

        var navIcons = ['⚡', '📁', '📊', '👤'];
        var activeTab = 0;
        var tabW = (cw - 68) / navIcons.length;

        navIcons.forEach(function (ico, i) {
          var tCenterX = 34 + tabW * i + tabW / 2;
          if (i === activeTab) {
            drawRoundedRect(sCtx, tCenterX - 24, navY + 12, 48, 48, 16);
            sCtx.fillStyle = 'rgba(56, 189, 248, 0.18)';
            sCtx.fill();
            sCtx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
            sCtx.lineWidth = 1;
            sCtx.stroke();
          }
          sCtx.font = '22px Inter, sans-serif';
          sCtx.textAlign = 'center';
          sCtx.fillText(ico, tCenterX, navY + 44);
        });

        // Home indicator bar at very bottom
        drawRoundedRect(sCtx, (cw - 140) / 2, ch - 16, 140, 5, 3);
        sCtx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        sCtx.fill();

        // 9. Interactive Touch Ripples
        for (var rIdx = touchRipples.length - 1; rIdx >= 0; rIdx--) {
          var rip = touchRipples[rIdx];
          sCtx.beginPath();
          sCtx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
          sCtx.fillStyle = 'rgba(56, 189, 248, ' + (rip.opacity * 0.25) + ')';
          sCtx.fill();
          sCtx.strokeStyle = 'rgba(56, 189, 248, ' + rip.opacity + ')';
          sCtx.lineWidth = 2;
          sCtx.stroke();

          rip.r += 2.5;
          rip.opacity -= 0.035;
          if (rip.opacity <= 0 || rip.r >= rip.maxR) {
            touchRipples.splice(rIdx, 1);
          }
        }

        screenTexture.needsUpdate = true;
      }


      // --- FLOATING 3D PARTICLES ---
      var pGeom = new THREE.BufferGeometry();
      var pCount = 320;
      var pPos = new Float32Array(pCount * 3);
      for (var p = 0; p < pCount; p++) {
        var rad = 2.2 + Math.random() * 2.4;
        var theta = Math.random() * Math.PI * 2;
        var phi = Math.acos(2 * Math.random() - 1);
        pPos[p * 3] = rad * Math.sin(phi) * Math.cos(theta);
        pPos[p * 3 + 1] = rad * Math.sin(phi) * Math.sin(theta);
        pPos[p * 3 + 2] = rad * Math.cos(phi) * 0.8;
      }
      pGeom.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
      var particles = new THREE.Points(pGeom, new THREE.PointsMaterial({
        color: 0x38bdf8,
        size: 0.035,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true
      }));
      worldGroup.add(particles);

      // --- ORBITING GEOMETRIC ACCENT GEMS ---
      var gemGeo = new THREE.OctahedronGeometry(0.12, 0);
      var gemMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        metalness: 0.9,
        roughness: 0.1,
        emissive: 0x0284c7,
        emissiveIntensity: 0.4
      });
      var gem1 = new THREE.Mesh(gemGeo, gemMat);
      worldGroup.add(gem1);

      var gem2 = new THREE.Mesh(gemGeo, gemMat.clone());
      gem2.material.color.setHex(0xa855f7);
      gem2.material.emissive.setHex(0x7e22ce);
      worldGroup.add(gem2);

      // --- INTERACTIVITY: MOUSE / TOUCH / GYRO ---
      var targetRotX = 0, targetRotY = 0;
      var currentRotX = 0, currentRotY = 0;
      var isInteracting = false;

      function onPointerMove(e) {
        var rect = parent.getBoundingClientRect();
        var cx = e.clientX || (e.touches && e.touches[0].clientX) || (rect.left + rect.width / 2);
        var cy = e.clientY || (e.touches && e.touches[0].clientY) || (rect.top + rect.height / 2);

        var normX = ((cx - rect.left) / rect.width - 0.5) * 2;
        var normY = ((cy - rect.top) / rect.height - 0.5) * 2;

        targetRotY = normX * 0.55;
        targetRotX = -normY * 0.45;

        // Position dynamic cursor point light
        cursorLight.position.x = normX * 2.5;
        cursorLight.position.y = -normY * 2.5;

        isInteracting = true;
      }

      function onPointerDown(e) {
        var rect = parent.getBoundingClientRect();
        var cx = e.clientX || (e.touches && e.touches[0].clientX) || (rect.left + rect.width / 2);
        var cy = e.clientY || (e.touches && e.touches[0].clientY) || (rect.top + rect.height / 2);

        var localX = (cx - rect.left) / rect.width;
        var localY = (cy - rect.top) / rect.height;

        // Add ripple effect on phone screen
        addRipple(localX * screenCanvas.width, localY * screenCanvas.height);

        // Soft haptic bounce
        phoneGroup.scale.set(0.97, 0.97, 0.97);
        setTimeout(function () {
          phoneGroup.scale.set(1, 1, 1);
        }, 120);
      }

      parent.addEventListener('mousemove', onPointerMove, { passive: true });
      parent.addEventListener('touchmove', onPointerMove, { passive: true });
      parent.addEventListener('pointerdown', onPointerDown, { passive: true });

      parent.addEventListener('mouseleave', function () {
        targetRotX = 0;
        targetRotY = 0;
        isInteracting = false;
      });

      // --- ANIMATION LOOP ---
      var clock = new THREE.Clock();

      function animate() {
        requestAnimationFrame(animate);

        var elapsedTime = clock.getElapsedTime();

        // Screen UI updates
        updateScreen(elapsedTime);

        // Smooth rotation damping with lerp
        currentRotX += (targetRotX - currentRotX) * 0.06;
        currentRotY += (targetRotY - currentRotY) * 0.06;

        // Natural levitation & idle sway
        var idleBob = Math.sin(elapsedTime * 1.5) * 0.09;
        var idleTilt = Math.sin(elapsedTime * 0.9) * 0.05;

        phoneGroup.position.y = idleBob;
        phoneGroup.rotation.y = currentRotY + idleTilt;
        phoneGroup.rotation.x = currentRotX;
        phoneGroup.rotation.z = -currentRotY * 0.15;


        // Orbiting gems
        gem1.position.x = Math.cos(elapsedTime * 1.2) * 1.8;
        gem1.position.y = Math.sin(elapsedTime * 1.2) * 1.8;
        gem1.position.z = Math.sin(elapsedTime * 1.5) * 0.8;
        gem1.rotation.x += 0.02;
        gem1.rotation.y += 0.03;

        gem2.position.x = Math.cos(elapsedTime * 0.9 + Math.PI) * 1.6;
        gem2.position.y = Math.sin(elapsedTime * 0.9 + Math.PI) * 1.6;
        gem2.position.z = Math.cos(elapsedTime * 1.3) * 0.7;
        gem2.rotation.x -= 0.02;
        gem2.rotation.y -= 0.025;

        // Gentle ambient particle drift
        particles.rotation.y = elapsedTime * 0.025;

        renderer.render(scene, camera);
      }
      updateScreen(0);
      animate();
    } catch (err) {
      console.warn('Hero 3D init skipped', err);
      if (parent) parent.classList.add('webgl-fallback');
    }
  })();

  /* ==========================================================================
     5. MOBILE MENU
     ========================================================================== */
  (function initMobileMenu() {
    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('mobileMenu');
    if (!toggle || !menu) return;

    function toggleMenu() {
      var active = menu.classList.toggle('active');
      toggle.classList.toggle('active', active);
      toggle.setAttribute('aria-expanded', active);
      document.body.style.overflow = active ? 'hidden' : '';
    }

    toggle.addEventListener('click', toggleMenu);

    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('active');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  })();

  /* ==========================================================================
     6. RESUME MODAL CONTROLLER
     ========================================================================== */
  (function initResumeModal() {
    var triggers = document.querySelectorAll('.resume-trigger');
    var modal = document.getElementById('resumeModal');
    var closeBtn = document.getElementById('resumeBackInline');
    var downloadBtn = document.getElementById('resumeDownloadInline');

    if (!modal) return;

    function openModal(e) {
      if (e) e.preventDefault();
      modal.classList.add('active');
      modal.removeAttribute('hidden');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('showing-resume');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('showing-resume');
      document.body.style.overflow = '';
      setTimeout(function () {
        modal.setAttribute('hidden', '');
      }, 400);
    }

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', openModal);
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });

    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });

    if (downloadBtn) {
      downloadBtn.addEventListener('click', function () {
        window.open('resume.html', '_blank');
      });
    }
  })();

  /* ==========================================================================
     7. EMAIL COPY TO CLIPBOARD
     ========================================================================== */
  (function initCopyEmail() {
    var copyBtn = document.getElementById('copyEmailBtn');
    if (!copyBtn) return;

    copyBtn.addEventListener('click', function () {
      var email = 'miansheraz8448@gmail.com';
      navigator.clipboard.writeText(email).then(function () {
        copyBtn.classList.add('copied');
        var originalTitle = copyBtn.getAttribute('title');
        copyBtn.setAttribute('title', 'Copied!');
        setTimeout(function () {
          copyBtn.classList.remove('copied');
          if (originalTitle) copyBtn.setAttribute('title', originalTitle);
        }, 2200);
      }).catch(function () {
        window.location.href = 'mailto:' + email;
      });
    });
  })();
})();
