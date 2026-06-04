import * as THREE from 'three';
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
  import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
  import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
  import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
  import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

  const wrap = document.getElementById('viewer3dWrap');
  const canvas = document.getElementById('canvas3d');
  const loadEl = document.getElementById('viewer3dLoading');
  if (!wrap || !canvas) { console.warn('3D viewer elements not found'); }
  else {

  // ========== RENDERER ==========
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(wrap.clientWidth, wrap.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  // ========== SCENE ==========
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x050510);
  scene.fog = new THREE.FogExp2(0x050510, 0.013);

  // ========== CAMERA ==========
  const camera = new THREE.PerspectiveCamera(35, wrap.clientWidth / wrap.clientHeight, 0.1, 200);
  camera.position.set(28, 16, 28);

  // ========== POST-PROCESSING ==========
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(wrap.clientWidth, wrap.clientHeight),
    0.45, 0.6, 0.78
  );
  composer.addPass(bloomPass);
  composer.addPass(new OutputPass());

  // ========== ORBIT CONTROLS ==========
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.04;
  controls.minDistance = 8;
  controls.maxDistance = 42;
  controls.minPolarAngle = 0.2;
  controls.maxPolarAngle = Math.PI / 2 - 0.05;
  controls.target.set(0, 5, 0);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.3;
  controls.enablePan = true;
  controls.panSpeed = 0.5;
  controls.zoomSpeed = 0.8;

  // ========== ENHANCED SKY & ENVIRONMENT MAP ==========
  const pmremGen = new THREE.PMREMGenerator(renderer);
  pmremGen.compileEquirectangularShader();
  const envScene = new THREE.Scene();
  const skyC = document.createElement('canvas');skyC.width=512;skyC.height=512;
  const skyX = skyC.getContext('2d');
  const g1=skyX.createLinearGradient(0,0,0,512);
  g1.addColorStop(0,'#060618');g1.addColorStop(0.25,'#0a1535');g1.addColorStop(0.5,'#0f1a3a');
  g1.addColorStop(0.75,'#161232');g1.addColorStop(1,'#0a0814');
  skyX.fillStyle=g1;skyX.fillRect(0,0,512,512);
  for(let i=0;i<300;i++){skyX.fillStyle=`rgba(255,255,255,${Math.random()*0.35+0.05})`;
  skyX.beginPath();skyX.arc(Math.random()*512,Math.random()*256,Math.random()*1.2,0,Math.PI*2);skyX.fill();}
  envScene.background=new THREE.CanvasTexture(skyC);
  const eL1=new THREE.DirectionalLight(0xffeedd,0.7);eL1.position.set(5,10,3);envScene.add(eL1);
  const eL2=new THREE.DirectionalLight(0x5577bb,0.5);eL2.position.set(-5,8,-6);envScene.add(eL2);
  const eL3=new THREE.DirectionalLight(0xc9a84c,0.25);eL3.position.set(0,-3,5);envScene.add(eL3);
  const eL4=new THREE.HemisphereLight(0x1a2a5a,0x0a0a14,0.4);envScene.add(eL4);
  const envMap=pmremGen.fromScene(envScene,0.04).texture;
  scene.environment=envMap;pmremGen.dispose();

  // ========== PROCEDURAL TEXTURES ==========
  function makeCanvasTex(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');fn(x,w,h);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;}
  const concreteTex = makeCanvasTex(256,256,(ctx,w,h)=>{
    ctx.fillStyle='#3a3a4e';ctx.fillRect(0,0,w,h);
    for(let i=0;i<12000;i++){const v=40+Math.random()*30;ctx.fillStyle=`rgba(${v},${v},${v+8},0.25)`;
    ctx.fillRect(Math.random()*w,Math.random()*h,1+Math.random()*2,1+Math.random()*2);}
  });
  concreteTex.repeat.set(2,4);

  // ========== MATERIALS ==========
  const concreteMat = new THREE.MeshStandardMaterial({ map:concreteTex, roughness:0.72, metalness:0.05 });
  const concreteDarkMat = new THREE.MeshStandardMaterial({ color:0x222235, roughness:0.82, metalness:0.05 });
  const stoneMat = new THREE.MeshStandardMaterial({ color:0x353548, roughness:0.6, metalness:0.08 });
  const podiumMat = new THREE.MeshStandardMaterial({ color:0x454560, roughness:0.45, metalness:0.12 });
  const glassMat = new THREE.MeshPhysicalMaterial({
    color:0x5599bb, roughness:0.02, metalness:0.1, transmission:0.5, thickness:0.3,
    envMapIntensity:2.0, clearcoat:1.0, clearcoatRoughness:0.02, ior:1.52
  });
  const lobbyGlassMat = new THREE.MeshPhysicalMaterial({
    color:0x88bbdd, roughness:0.0, metalness:0.05, transmission:0.75, thickness:0.2, envMapIntensity:1.5
  });
  const goldMat = new THREE.MeshStandardMaterial({
    color:0xc9a84c, roughness:0.15, metalness:0.95, emissive:0xc9a84c, emissiveIntensity:0.12
  });
  const goldBrightMat = new THREE.MeshStandardMaterial({
    color:0xd4af37, roughness:0.1, metalness:0.98, emissive:0xd4af37, emissiveIntensity:0.2
  });
  const windowMat = new THREE.MeshStandardMaterial({
    color:0xffaa44, emissive:0xffaa44, emissiveIntensity:2.2, roughness:0.2, transparent:true, opacity:0.9
  });
  const windowCoolMat = new THREE.MeshStandardMaterial({
    color:0x99ccff, emissive:0x88bbff, emissiveIntensity:1.4, roughness:0.2, transparent:true, opacity:0.75
  });
  const windowDimMat = new THREE.MeshStandardMaterial({
    color:0x223344, emissive:0x112233, emissiveIntensity:0.15, roughness:0.5, transparent:true, opacity:0.5
  });
  const waterMat = new THREE.MeshPhysicalMaterial({
    color:0x1a7090, roughness:0.0, metalness:0.05, transmission:0.8, thickness:2.0, ior:1.33
  });
  const grassMat = new THREE.MeshStandardMaterial({ color:0x143a14, roughness:0.92 });
  const foliageMat = new THREE.MeshStandardMaterial({ color:0x1a5a1a, roughness:0.8 });
  const foliageDarkMat = new THREE.MeshStandardMaterial({ color:0x0e380e, roughness:0.85 });
  const trunkMat = new THREE.MeshStandardMaterial({ color:0x5a4025, roughness:0.92 });
  const pathMat = new THREE.MeshStandardMaterial({ color:0x6a6a7a, roughness:0.55, metalness:0.05 });
  const groundMat = new THREE.MeshStandardMaterial({ color:0x0e0e1e, roughness:0.25, metalness:0.55 });
  const marbleGroundMat = new THREE.MeshStandardMaterial({ color:0x1a1a28, roughness:0.18, metalness:0.4 });

  // ========== BUILDING CONSTRUCTION ==========
  const building = new THREE.Group();
  const FH = 0.19;
  let winSeed = 42;
  function sRand(){winSeed=(winSeed*16807)%2147483647;return(winSeed-1)/2147483646;}

  // Stepped tower tiers (luxury setback design)
  const tiers = [
    { floors:18, w:3.6, d:3.0 },  // lower: wide base
    { floors:20, w:3.2, d:2.6 },  // middle
    { floors:17, w:2.8, d:2.2 }   // upper crown
  ];
  const tierStartY = [0, 0, 0];
  let cum = 0;
  tiers.forEach((t,i) => { tierStartY[i] = cum; cum += t.floors; });
  const TOTAL = cum; // 55 floors
  const TOWER_BASE_Y = 1.8;

  // --- Base Platform (multi-layer) ---
  const base1 = new THREE.Mesh(new THREE.CylinderGeometry(9, 9.5, 0.12, 64), marbleGroundMat);
  base1.position.y = -0.06; base1.receiveShadow = true; building.add(base1);
  const base2 = new THREE.Mesh(new THREE.CylinderGeometry(7.5, 8, 0.08, 64), groundMat);
  base2.position.y = 0.04; base2.receiveShadow = true; building.add(base2);
  // Gold ring on base
  const baseRing = new THREE.Mesh(new THREE.TorusGeometry(8.5, 0.02, 8, 64), goldMat);
  baseRing.rotation.x = -Math.PI/2; baseRing.position.y = 0.01; building.add(baseRing);

  // --- Podium (3-story glass & stone base) ---
  const PH = 1.6;
  const podiumBody = new THREE.Mesh(new THREE.BoxGeometry(7.5, PH, 6.5), podiumMat);
  podiumBody.position.y = PH/2 + 0.1; podiumBody.castShadow = true; podiumBody.receiveShadow = true;
  building.add(podiumBody);
  // Podium glass curtain (4 faces)
  [[0,3.26,7.5,PH,0.06],[0,-3.26,7.5,PH,0.06]].forEach(([x,z,w,h,d])=>{
    const g=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),lobbyGlassMat);
    g.position.set(x,PH/2+0.1,z);building.add(g);
  });
  [[-3.76,0,0.06,PH,6.5],[3.76,0,0.06,PH,6.5]].forEach(([x,z,w,h,d])=>{
    const g=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),lobbyGlassMat);
    g.position.set(x,PH/2+0.1,z);building.add(g);
  });
  // Podium horizontal louvers
  for(let i=0;i<5;i++){
    const ly=0.3+i*0.3;
    const lf=new THREE.Mesh(new THREE.BoxGeometry(7.52,0.02,0.06),stoneMat);
    lf.position.set(0,ly+0.1,3.27);building.add(lf);
    const lb=new THREE.Mesh(new THREE.BoxGeometry(7.52,0.02,0.06),stoneMat);
    lb.position.set(0,ly+0.1,-3.27);building.add(lb);
  }
  // Podium gold cap
  const podCap=new THREE.Mesh(new THREE.BoxGeometry(7.8,0.07,6.8),goldMat);
  podCap.position.y=PH+0.14;building.add(podCap);

  // --- Entrance Canopy (Porte-Cochère) ---
  const canopySlab=new THREE.Mesh(new THREE.BoxGeometry(4.5,0.08,2.8),podiumMat);
  canopySlab.position.set(0,PH*0.65+0.1,4.65);canopySlab.castShadow=true;building.add(canopySlab);
  const canopyGold=new THREE.Mesh(new THREE.BoxGeometry(4.6,0.025,2.9),goldMat);
  canopyGold.position.set(0,PH*0.65+0.15,4.65);building.add(canopyGold);
  [-1.9,1.9].forEach(x=>{
    const col=new THREE.Mesh(new THREE.CylinderGeometry(0.06,0.06,PH*0.65,12),podiumMat);
    col.position.set(x,PH*0.325+0.1,5.9);col.castShadow=true;building.add(col);
  });
  // Entrance glass wall
  const entranceGlass=new THREE.Mesh(new THREE.BoxGeometry(3.8,PH*0.55,0.04),lobbyGlassMat);
  entranceGlass.position.set(0,PH*0.35+0.1,3.27);building.add(entranceGlass);

  // --- Tower Tiers ---
  const allCorners = [];
  tiers.forEach((tier,ti) => {
    const startF = tierStartY[ti];
    const tw = tier.w, td = tier.d;
    // Glass curtain walls
    const tierH = tier.floors * FH;
    const gf=new THREE.Mesh(new THREE.BoxGeometry(tw-0.06,tierH,0.04),glassMat);
    gf.position.set(0,TOWER_BASE_Y+startF*FH+tierH/2,td/2);building.add(gf);
    const gb=new THREE.Mesh(new THREE.BoxGeometry(tw-0.06,tierH,0.04),glassMat);
    gb.position.set(0,TOWER_BASE_Y+startF*FH+tierH/2,-td/2);building.add(gb);
    const gl=new THREE.Mesh(new THREE.BoxGeometry(0.04,tierH,td-0.06),glassMat);
    gl.position.set(-tw/2,TOWER_BASE_Y+startF*FH+tierH/2,0);building.add(gl);
    const gr=new THREE.Mesh(new THREE.BoxGeometry(0.04,tierH,td-0.06),glassMat);
    gr.position.set(tw/2,TOWER_BASE_Y+startF*FH+tierH/2,0);building.add(gr);
    // Floor slabs
    for(let f=0;f<=tier.floors;f++){
      const slab=new THREE.Mesh(new THREE.BoxGeometry(tw,0.03,td),concreteMat);
      slab.position.y=TOWER_BASE_Y+(startF+f)*FH;slab.castShadow=true;slab.receiveShadow=true;building.add(slab);
    }
    // Corner columns
    [[-tw/2,td/2],[tw/2,td/2],[-tw/2,-td/2],[tw/2,-td/2]].forEach(([cx,cz])=>{
      const col=new THREE.Mesh(new THREE.BoxGeometry(0.12,tierH,0.12),concreteMat);
      col.position.set(cx,TOWER_BASE_Y+startF*FH+tierH/2,cz);col.castShadow=true;building.add(col);
    });
    // Mid-face mullions
    [[-tw/2,0],[tw/2,0],[0,td/2],[0,-td/2]].forEach(([mx,mz],idx)=>{
      const isX=idx<2;
      const m=new THREE.Mesh(new THREE.BoxGeometry(isX?0.05:0.06,tierH,isX?0.06:0.05),concreteMat);
      m.position.set(mx,TOWER_BASE_Y+startF*FH+tierH/2,mz);building.add(m);
    });
    // Tier transition gold band
    if(ti > 0){
      const prevT = tiers[ti-1];
      const by = TOWER_BASE_Y + startF * FH;
      [[0,prevT.d/2+0.03,prevT.w+0.15,0.06,0.08],[0,-prevT.d/2-0.03,prevT.w+0.15,0.06,0.08]].forEach(([x,z,w,h,d])=>{
        const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),goldBrightMat);
        b.position.set(x,by,z);building.add(b);
      });
      [[-prevT.w/2-0.03,0,0.08,0.06,prevT.d+0.15],[prevT.w/2+0.03,0,0.08,0.06,prevT.d+0.15]].forEach(([x,z,w,h,d])=>{
        const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),goldBrightMat);
        b.position.set(x,by,z);building.add(b);
      });
    }
    if(ti===tiers.length-1) tiers.forEach((_,i)=>{ if(i===ti) allCorners.push({w:tw,d:td,startF}); });
  });

  // --- Emissive Windows (merged, with variety) ---
  const wVerts={fW:[],fC:[],fD:[],bW:[],bC:[],bD:[],lW:[],lC:[],lD:[],rW:[],rC:[],rD:[]};
  function addQ(a,x1,y1,z1,x2,y2,z2,x3,y3,z3,x4,y4,z4){a.push(x1,y1,z1,x2,y2,z2,x3,y3,z3,x1,y1,z1,x3,y3,z3,x4,y4,z4);}
  tiers.forEach((tier,ti)=>{
    const sf=tierStartF=>tierStartF, tw=tier.w, td=tier.d;
    for(let f=0;f<tier.floors;f++){
      const fy=TOWER_BASE_Y+(tierStartY[ti]+f)*FH+FH*0.28;
      const wh=FH*0.52;
      const wCols=Math.max(3,Math.floor(tw/0.5));
      const dCols=Math.max(2,Math.floor(td/0.5));
      const wSp=(tw-0.3)/wCols, dSp=(td-0.3)/dCols;
      for(let w=0;w<wCols;w++){
        const r=sRand();
        const wx=-tw/2+0.15+wSp*w+wSp*0.12, ww=wSp*0.76;
        if(r>0.3){
          const k=r>0.55?'W':(r>0.35?'C':'D');
          addQ(wVerts['f'+k],wx,fy,td/2+0.025,wx+ww,fy,td/2+0.025,wx+ww,fy+wh,td/2+0.025,wx,fy+wh,td/2+0.025);
          addQ(wVerts['b'+k],wx+ww,fy,-td/2-0.025,wx,fy,-td/2-0.025,wx,fy+wh,-td/2-0.025,wx+ww,fy+wh,-td/2-0.025);
        }
      }
      for(let w=0;w<dCols;w++){
        const rL=sRand(),rR=sRand();
        const wz=-td/2+0.15+dSp*w+dSp*0.12,wd=dSp*0.76;
        if(rL>0.35){const k=rL>0.6?'W':'C';addQ(wVerts['l'+k],-tw/2-0.025,fy,wz,-tw/2-0.025,fy,wz+wd,-tw/2-0.025,fy+wh,wz+wd,-tw/2-0.025,fy+wh,wz);}
        if(rR>0.35){const k=rR>0.6?'W':'C';addQ(wVerts['r'+k],tw/2+0.025,fy,wz+wd,tw/2+0.025,fy,wz,tw/2+0.025,fy+wh,wz,tw/2+0.025,fy+wh,wz+wd);}
      }
    }
  });
  function mkGeo(v){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.computeVertexNormals();return g;}
  [['fW',windowMat],['fC',windowCoolMat],['fD',windowDimMat],['bW',windowMat],['bC',windowCoolMat],['bD',windowDimMat],['lW',windowMat],['lC',windowCoolMat],['lD',windowDimMat],['rW',windowCoolMat],['rC',windowMat],['rD',windowDimMat]].forEach(([k,mat])=>{
    if(wVerts[k].length){const m=new THREE.Mesh(mkGeo(wVerts[k]),mat);building.add(m);}
  });

  // --- Balconies with glass railings ---
  for(let i=6;i<TOTAL;i+=8){
    let tw,tiers_f=0;
    tiers.forEach((t,ti)=>{if(i>=tierStartY[ti]&&i<tierStartY[ti]+t.floors){tw=t.w;tiers_f=t.d;}});
    if(!tw)continue;
    const y=TOWER_BASE_Y+i*FH;
    [[1,tiers_f/2+0.4],[-1,-tiers_f/2-0.4]].forEach(([dir,zOff])=>{
      const b=new THREE.Mesh(new THREE.BoxGeometry(tw*0.55,0.035,0.65),concreteMat);
      b.position.set(0,y,zOff);b.castShadow=true;building.add(b);
      const r=new THREE.Mesh(new THREE.BoxGeometry(tw*0.55,0.13,0.015),glassMat);
      r.position.set(0,y+0.08,zOff+dir*0.32);building.add(r);
      // Balcony side walls
      [-tw*0.275,tw*0.275].forEach(sx=>{
        const sw=new THREE.Mesh(new THREE.BoxGeometry(0.02,0.13,0.65),glassMat);
        sw.position.set(sx,y+0.08,zOff);building.add(sw);
      });
    });
  }

  // --- Rooftop (Crown Level) ---
  const rtY = TOWER_BASE_Y + TOTAL * FH;
  const topW = tiers[2].w, topD = tiers[2].d;
  const roofSlab = new THREE.Mesh(new THREE.BoxGeometry(topW+1.0,0.12,topD+1.0),concreteMat);
  roofSlab.position.y=rtY+0.06;roofSlab.castShadow=true;building.add(roofSlab);
  const crown=new THREE.Mesh(new THREE.BoxGeometry(topW+1.4,0.07,topD+1.4),goldBrightMat);
  crown.position.y=rtY+0.16;building.add(crown);
  // Crown pillars with lights
  [[-topW/2,topD/2],[topW/2,topD/2],[-topW/2,-topD/2],[topW/2,-topD/2]].forEach(([cx,cz])=>{
    const p=new THREE.Mesh(new THREE.BoxGeometry(0.07,0.7,0.07),goldMat);
    p.position.set(cx,rtY+0.52,cz);building.add(p);
    const lt=new THREE.PointLight(0xc9a84c,0.15,4);lt.position.set(cx,rtY+0.9,cz);building.add(lt);
  });
  // Crown center spire
  const spire=new THREE.Mesh(new THREE.CylinderGeometry(0.02,0.06,1.2,8),goldBrightMat);
  spire.position.set(0,rtY+0.8,0);building.add(spire);
  const spireLight=new THREE.PointLight(0xffdd88,0.3,6);spireLight.position.set(0,rtY+1.5,0);building.add(spireLight);

  // --- Infinity Pool ---
  const poolBasin=new THREE.Mesh(new THREE.BoxGeometry(2.4,0.16,1.2),concreteDarkMat);
  poolBasin.position.set(0.3,rtY+0.2,0.5);building.add(poolBasin);
  const poolWater=new THREE.Mesh(new THREE.BoxGeometry(2.1,0.06,0.9),waterMat);
  poolWater.position.set(0.3,rtY+0.3,0.5);building.add(poolWater);
  [[-0.75,0.5],[1.35,0.5]].forEach(([x,z])=>{
    const t=new THREE.Mesh(new THREE.BoxGeometry(0.03,0.025,1.3),goldMat);
    t.position.set(x,rtY+0.34,z);building.add(t);
  });
  [[0.3,1.1],[0.3,-0.1]].forEach(([x,z])=>{
    const t=new THREE.Mesh(new THREE.BoxGeometry(2.5,0.025,0.03),goldMat);
    t.position.set(x,rtY+0.34,z);building.add(t);
  });

  // --- Mechanical Room ---
  const mech=new THREE.Mesh(new THREE.BoxGeometry(1.0,0.6,0.8),concreteMat);
  mech.position.set(-0.2,rtY+0.42,-0.7);mech.castShadow=true;building.add(mech);
  const mechG=new THREE.Mesh(new THREE.BoxGeometry(1.0,0.35,0.03),glassMat);
  mechG.position.set(-0.2,rtY+0.48,-0.31);building.add(mechG);

  // --- Helipad ---
  const heliMat=new THREE.MeshStandardMaterial({color:0xc9a84c,roughness:0.5,metalness:0.5,side:THREE.DoubleSide});
  const helipad=new THREE.Mesh(new THREE.RingGeometry(0.35,0.4,32),heliMat);
  helipad.rotation.x=-Math.PI/2;helipad.position.set(-1.5,rtY+0.18,-0.4);building.add(helipad);
  const hB1=new THREE.Mesh(new THREE.BoxGeometry(0.03,0.01,0.25),heliMat);
  hB1.position.set(-1.6,rtY+0.19,-0.4);building.add(hB1);
  const hB2=new THREE.Mesh(new THREE.BoxGeometry(0.03,0.01,0.25),heliMat);
  hB2.position.set(-1.4,rtY+0.19,-0.4);building.add(hB2);
  const hB3=new THREE.Mesh(new THREE.BoxGeometry(0.22,0.01,0.03),heliMat);
  hB3.position.set(-1.5,rtY+0.19,-0.4);building.add(hB3);

  // --- Sky Lounge Bar ---
  const loungeSlab=new THREE.Mesh(new THREE.BoxGeometry(1.4,0.04,1.1),podiumMat);
  loungeSlab.position.set(1.0,rtY+0.14,-0.6);building.add(loungeSlab);
  const barCounter=new THREE.Mesh(new THREE.BoxGeometry(1.2,0.12,0.15),goldMat);
  barCounter.position.set(1.0,rtY+0.22,-0.1);building.add(barCounter);

  // --- LED Facade Accent Bands (Landmark 81 inspired) ---
  const ledLevels=[5,12,18,25,32,38,45,50];
  const ledMeshes=[];
  ledLevels.forEach(f=>{
    if(f>=TOTAL)return;
    let tw=3.2,td=2.6;
    tiers.forEach((tier,ti)=>{if(f>=tierStartY[ti]&&f<tierStartY[ti]+tier.floors){tw=tier.w;td=tier.d;}});
    const y=TOWER_BASE_Y+f*FH;
    const ledMat=new THREE.MeshStandardMaterial({color:0x3388ff,emissive:0x2266dd,emissiveIntensity:1.5,transparent:true,opacity:0.7});
    ledMeshes.push(ledMat);
    [[0,td/2+0.03,tw+0.1,0.025,0.03],[0,-td/2-0.03,tw+0.1,0.025,0.03]].forEach(([x,z,w,h,d])=>{
      const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),ledMat);b.position.set(x,y,z);building.add(b);
    });
    [[-tw/2-0.03,0,0.03,0.025,td+0.1],[tw/2+0.03,0,0.03,0.025,td+0.1]].forEach(([x,z,w,h,d])=>{
      const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),ledMat);b.position.set(x,y,z);building.add(b);
    });
  });

  // --- Crown LED ring + beacon ---
  const crownLedMat=new THREE.MeshStandardMaterial({color:0xc9a84c,emissive:0xc9a84c,emissiveIntensity:2.0,transparent:true,opacity:0.85});
  const crownRing=new THREE.Mesh(new THREE.TorusGeometry(topW/2+0.3,0.02,8,48),crownLedMat);
  crownRing.rotation.x=-Math.PI/2;crownRing.position.y=rtY+0.18;building.add(crownRing);
  const beaconMat=new THREE.MeshStandardMaterial({color:0xff4444,emissive:0xff2222,emissiveIntensity:3.0});
  const beacon=new THREE.Mesh(new THREE.SphereGeometry(0.06,12,8),beaconMat);
  beacon.position.set(0,rtY+1.4,0);building.add(beacon);

  // ========== ENHANCED ENVIRONMENT ==========

  // --- Sky Dome with gradient (night atmosphere) ---
  const skyGeo = new THREE.SphereGeometry(80, 32, 16);
  const skyCan = document.createElement('canvas'); skyCan.width = 256; skyCan.height = 512;
  const skyCtx = skyCan.getContext('2d');
  const skyGr = skyCtx.createLinearGradient(0, 0, 0, 512);
  skyGr.addColorStop(0, '#030310'); skyGr.addColorStop(0.2, '#060820');
  skyGr.addColorStop(0.45, '#0c1535'); skyGr.addColorStop(0.65, '#121830');
  skyGr.addColorStop(0.85, '#0a0a1a'); skyGr.addColorStop(1, '#050510');
  skyCtx.fillStyle = skyGr; skyCtx.fillRect(0, 0, 256, 512);
  for (let i = 0; i < 500; i++) {
    skyCtx.fillStyle = `rgba(255,255,255,${Math.random() * 0.5 + 0.05})`;
    skyCtx.beginPath(); skyCtx.arc(Math.random() * 256, Math.random() * 300, Math.random() * 0.8, 0, Math.PI * 2); skyCtx.fill();
  }
  const skyTex = new THREE.CanvasTexture(skyCan);
  const skyDome = new THREE.Mesh(skyGeo, new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide }));
  scene.add(skyDome);

  // --- Starfield Particles ---
  const starCount = 400;
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const theta = Math.random() * Math.PI * 2, phi = Math.random() * Math.PI * 0.45;
    const r = 60 + Math.random() * 15;
    starPos[i*3] = r * Math.sin(phi) * Math.cos(theta);
    starPos[i*3+1] = r * Math.cos(phi) + 5;
    starPos[i*3+2] = r * Math.sin(phi) * Math.sin(theta);
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.15, transparent: true, opacity: 0.7, sizeAttenuation: true });
  scene.add(new THREE.Points(starGeo, starMat));

  // --- Ground Plane (highly reflective) ---
  const reflGroundMat = new THREE.MeshStandardMaterial({ color: 0x0a0a16, roughness: 0.12, metalness: 0.75 });
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), reflGroundMat);
  ground.rotation.x = -Math.PI / 2; ground.position.y = -0.12; ground.receiveShadow = true; scene.add(ground);
  const grid = new THREE.GridHelper(30, 30, 0x0e0e1e, 0x0e0e1e);
  grid.position.y = -0.11; grid.material.opacity = 0.05; grid.material.transparent = true; scene.add(grid);

  // --- Background Skyline Buildings (Dubai reference) ---
  const silhouetteMat = new THREE.MeshStandardMaterial({ color: 0x0c0c1a, roughness: 0.6, metalness: 0.3 });
  const glowWinMat = new THREE.MeshStandardMaterial({ color: 0xffcc88, emissive: 0xffaa55, emissiveIntensity: 0.8, transparent: true, opacity: 0.6 });
  const skylineData = [
    [-20, -16, 2.2, 14, 2.2], [-15, -20, 1.6, 9, 1.6], [-22, -10, 2.8, 18, 2.0], [-11, -22, 1.8, 7, 1.8],
    [20, -16, 2.0, 16, 2.0], [16, -21, 1.4, 8, 1.4], [23, -12, 2.4, 12, 2.4], [13, -24, 1.5, 6, 1.5],
    [-19, 16, 1.9, 10, 1.9], [-13, 21, 1.5, 7, 1.5], [19, 15, 2.2, 12, 2.2], [15, 20, 1.7, 9, 1.7],
    [-26, 1, 1.3, 15, 1.3], [26, -4, 1.8, 11, 1.8], [0, -26, 2.0, 10, 2.0], [0, 24, 1.6, 8, 1.6],
    [-17, -24, 1.2, 5, 1.2], [18, -26, 1.3, 6, 1.3], [-24, 8, 1.4, 7, 1.4], [25, 6, 1.6, 9, 1.6]
  ];
  const skyBldgGroup = new THREE.Group();
  skylineData.forEach(([sx, sz, sw, sh, sd]) => {
    const bMat = silhouetteMat.clone();
    const hazeFactor = Math.max(0, 1 - Math.sqrt(sx*sx + sz*sz) / 35);
    bMat.color.setRGB(0.047 + (1-hazeFactor)*0.04, 0.047 + (1-hazeFactor)*0.03, 0.1 + (1-hazeFactor)*0.06);
    const b = new THREE.Mesh(new THREE.BoxGeometry(sw, sh, sd), bMat);
    b.position.set(sx, sh / 2 - 0.12, sz); skyBldgGroup.add(b);
    // Lit window strips on skyline buildings
    for (let fy = 0.5; fy < sh - 0.5; fy += 0.6) {
      if (Math.random() > 0.45) {
        const ws = new THREE.Mesh(new THREE.BoxGeometry(sw * 0.75, 0.12, sd + 0.02), glowWinMat);
        ws.position.set(sx, fy - 0.12, sz); skyBldgGroup.add(ws);
      }
    }
  });
  scene.add(skyBldgGroup);

  // --- Construction Crane (Dubai realism) ---
  const craneMat = new THREE.MeshStandardMaterial({ color: 0x8a7530, roughness: 0.6, metalness: 0.4 });
  const craneGroup = new THREE.Group();
  const craneMast = new THREE.Mesh(new THREE.BoxGeometry(0.15, 12, 0.15), craneMat);
  craneMast.position.y = 6; craneGroup.add(craneMast);
  const craneArm = new THREE.Mesh(new THREE.BoxGeometry(8, 0.1, 0.1), craneMat);
  craneArm.position.set(2.5, 11.8, 0); craneGroup.add(craneArm);
  const craneCounter = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.1, 0.1), craneMat);
  craneCounter.position.set(-2.75, 11.8, 0); craneGroup.add(craneCounter);
  const craneCable = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 4, 4), new THREE.MeshStandardMaterial({ color: 0x333333 }));
  craneCable.position.set(5.5, 9.8, 0); craneGroup.add(craneCable);
  const craneHook = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.02, 6, 8, Math.PI), craneMat);
  craneHook.position.set(5.5, 7.7, 0); craneHook.rotation.z = Math.PI; craneGroup.add(craneHook);
  const craneLight = new THREE.PointLight(0xff3333, 0.3, 8);
  craneLight.position.set(0, 12.2, 0); craneGroup.add(craneLight);
  const craneLightMesh = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), new THREE.MeshStandardMaterial({ emissive: 0xff3333, emissiveIntensity: 3 }));
  craneLightMesh.position.copy(craneLight.position); craneGroup.add(craneLightMesh);
  craneGroup.position.set(14, -0.12, -8); craneGroup.rotation.y = -0.4;
  scene.add(craneGroup);

  // Second smaller crane
  const crane2 = craneGroup.clone();
  crane2.scale.set(0.6, 0.7, 0.6); crane2.position.set(-12, -0.12, 12); crane2.rotation.y = 1.2;
  scene.add(crane2);

  // --- Grass areas (richer) ---
  const grassPositions = [[-5.5,0,5.5,7],[5.5,0,5.5,7],[-5.5,0,-5.5,7],[5.5,0,-5.5,7],[-8,0,0,3,12],[8,0,0,3,12],[0,0,-8,12,3]];
  grassPositions.forEach(([x,_,z,w,d]) => {
    const g = new THREE.Mesh(new THREE.PlaneGeometry(w, d), grassMat);
    g.rotation.x = -Math.PI / 2; g.position.set(x, -0.09, z); g.receiveShadow = true; scene.add(g);
  });

  // --- Formal hedges in gold planters ---
  const hedgePositions = [[-4.5,4.5],[4.5,4.5],[-4.5,-4.5],[4.5,-4.5],[-6.5,0],[6.5,0],[0,-5.5],[0,8],[-3,6.5],[3,6.5],[-3,-6],[3,-6]];
  hedgePositions.forEach(([hx,hz]) => {
    const planter = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.25, 0.7), stoneMat);
    planter.position.set(hx, 0.02, hz); planter.castShadow = true; scene.add(planter);
    const pTrim = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.02, 0.74), goldMat);
    pTrim.position.set(hx, 0.16, hz); scene.add(pTrim);
    const hedge = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.4, 0.55), foliageMat);
    hedge.position.set(hx, 0.37, hz); hedge.castShadow = true; scene.add(hedge);
  });

  // --- Reflecting Pool (enhanced) ---
  const rpBasin = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.14, 5.5), stoneMat);
  rpBasin.position.set(0, -0.02, 7); scene.add(rpBasin);
  const rpWater = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.04, 5.1), waterMat);
  rpWater.position.set(0, 0.06, 7); scene.add(rpWater);
  [[-0.8,7],[0.8,7]].forEach(([x,z]) => {
    const t = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.03, 5.6), goldMat);
    t.position.set(x, 0.07, z); scene.add(t);
  });

  // --- Stone pathways (expanded network) ---
  [[0,0.01,3.5,1.0,9],[0,0.01,-4,0.8,3.5],[-3.5,0.01,0,7,0.7],[3.5,0.01,0,7,0.7],
   [-2,0.01,7.5,0.5,3],[2,0.01,7.5,0.5,3],[0,0.01,-6.5,0.6,2]].forEach(([x,y,z,w,d]) => {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(w, d), pathMat);
    p.rotation.x = -Math.PI / 2; p.position.set(x, y, z); p.receiveShadow = true; scene.add(p);
  });

  // --- Enhanced Palm Trees (Dubai-style, taller) ---
  const palmPositions = [[-5.5,5.5],[5.5,5.5],[-5.5,-5.5],[5.5,-5.5],[-7.5,2],[7.5,-2],[-2,8.5],[2,-8.5],[-8,6],[8,-6],[-6,8],[6,-8]];
  palmPositions.forEach(([px, pz]) => {
    const h = 2.5 + Math.random() * 1.5;
    const curve = Math.random() * 0.3 - 0.15;
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.08, h, 8), trunkMat);
    trunk.position.set(px + curve, h / 2 - 0.12, pz); trunk.rotation.z = curve * 0.2; trunk.castShadow = true; scene.add(trunk);
    // Trunk rings (realistic bark texture)
    for (let r = 0; r < Math.floor(h / 0.3); r++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.008, 4, 8), trunkMat);
      ring.position.set(px + curve * (r / (h / 0.3)), r * 0.3 - 0.12, pz);
      ring.rotation.x = Math.PI / 2; scene.add(ring);
    }
    for (let f = 0; f < 10; f++) {
      const angle = (f / 10) * Math.PI * 2;
      const frondMat = f % 2 === 0 ? foliageMat : foliageDarkMat;
      const frond = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.015, 0.85), frondMat);
      frond.position.set(px + curve, h - 0.2 + Math.sin(angle) * 0.06, pz);
      frond.rotation.y = angle; frond.rotation.x = 0.55 + Math.random() * 0.15;
      frond.castShadow = true; scene.add(frond);
    }
  });

  // --- Enhanced Deciduous Trees (foreground, Dubai reference) ---
  const treePositions = [[-6,3.5],[6,-3],[-4.5,-6],[4.5,6.5],[-7.5,-3],[7.5,4.5],[-3,4],[3,-4],[-8,-1],[8,1]];
  treePositions.forEach(([tx, tz]) => {
    const h = 1.8 + Math.random() * 1.0;
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.07, h * 0.45, 6), trunkMat);
    trunk.position.set(tx, h * 0.22 - 0.12, tz); trunk.castShadow = true; scene.add(trunk);
    const c1 = new THREE.Mesh(new THREE.SphereGeometry(h * 0.32, 10, 8), foliageMat);
    c1.position.set(tx, h * 0.6 - 0.12, tz); c1.castShadow = true; scene.add(c1);
    const c2 = new THREE.Mesh(new THREE.SphereGeometry(h * 0.24, 8, 6), foliageDarkMat);
    c2.position.set(tx + 0.1, h * 0.75 - 0.12, tz + 0.08); c2.castShadow = true; scene.add(c2);
    const c3 = new THREE.Mesh(new THREE.SphereGeometry(h * 0.18, 8, 6), foliageMat);
    c3.position.set(tx - 0.08, h * 0.82 - 0.12, tz - 0.06); c3.castShadow = true; scene.add(c3);
  });

  // --- Ground-level Uplights (brighter, more positions) ---
  const uplightPos = [[-4,3.5],[4,3.5],[-4,-3.5],[4,-3.5],[0,5.5],[0,-5.5],[-6.5,0],[6.5,0],[-2,5],[2,5],[-2,-5],[2,-5]];
  uplightPos.forEach(([lx, lz]) => {
    const pl = new THREE.PointLight(0xc9a84c, 0.25, 6); pl.position.set(lx, 0.1, lz); scene.add(pl);
    const marker = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 6), goldBrightMat);
    marker.position.set(lx, 0.05, lz); scene.add(marker);
  });

  // --- Atmospheric haze layers (Dubai atmospheric perspective) ---
  const hazeMat = new THREE.MeshBasicMaterial({ color: 0x0c1530, transparent: true, opacity: 0.025, side: THREE.DoubleSide });
  for (let i = 0; i < 5; i++) {
    const haze = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), hazeMat.clone());
    haze.rotation.x = -Math.PI / 2; haze.position.y = -0.05 + i * 0.08; haze.rotation.z = i * 0.3;
    haze.material.opacity = 0.015 + i * 0.008; scene.add(haze);
  }

  // --- Add Building to Scene ---
  building.traverse(c => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } });
  scene.add(building);

  // ========== ENHANCED LIGHTING ==========
  const hemiLight = new THREE.HemisphereLight(0x2a3a6e, 0x0a0a14, 0.5);
  scene.add(hemiLight);

  const keyLight = new THREE.DirectionalLight(0xffeedd, 2.0);
  keyLight.position.set(14, 26, 12); keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.camera.near = 1; keyLight.shadow.camera.far = 60;
  keyLight.shadow.camera.left = -22; keyLight.shadow.camera.right = 22;
  keyLight.shadow.camera.top = 28; keyLight.shadow.camera.bottom = -8;
  keyLight.shadow.bias = -0.0006; keyLight.shadow.normalBias = 0.025;
  keyLight.shadow.radius = 2;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x5577aa, 0.6);
  fillLight.position.set(-14, 16, -12); scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xc9a84c, 0.4);
  rimLight.position.set(-8, 12, 16); scene.add(rimLight);

  const backLight = new THREE.DirectionalLight(0x334488, 0.3);
  backLight.position.set(0, 10, -20); scene.add(backLight);

  const warmPt = new THREE.PointLight(0xffaa44, 0.8, 30); warmPt.position.set(5, 9, 7); scene.add(warmPt);
  const coolPt = new THREE.PointLight(0x4488ff, 0.4, 30); coolPt.position.set(-7, 15, -6); scene.add(coolPt);
  const lobbyLight = new THREE.PointLight(0xffcc88, 1.0, 15); lobbyLight.position.set(0, 1.2, 4.5); scene.add(lobbyLight);
  const lobbyLight2 = new THREE.PointLight(0xffeedd, 0.5, 10); lobbyLight2.position.set(0, 0.8, 5.5); scene.add(lobbyLight2);

  // LED facade glow lights (blue accent, Landmark 81 inspired)
  const ledPt1 = new THREE.PointLight(0x2266ff, 0.5, 20); ledPt1.position.set(3, 6, 4); scene.add(ledPt1);
  const ledPt2 = new THREE.PointLight(0x2266ff, 0.4, 20); ledPt2.position.set(-3, 8, -4); scene.add(ledPt2);
  const ledPt3 = new THREE.PointLight(0x3388ff, 0.3, 18); ledPt3.position.set(0, 4, 3.5); scene.add(ledPt3);

  const topSpot = new THREE.SpotLight(0xeeeeff, 0.6, 45, Math.PI / 5, 0.5);
  topSpot.position.set(0, 35, 0); topSpot.target.position.set(0, 5, 0);
  topSpot.castShadow = true; topSpot.shadow.mapSize.set(512, 512);
  scene.add(topSpot); scene.add(topSpot.target);

  // Ground uplighting spots
  const upSpot1 = new THREE.SpotLight(0xc9a84c, 0.6, 25, Math.PI / 8, 0.7);
  upSpot1.position.set(4, 0.2, 4); upSpot1.target.position.set(0, 8, 0);
  scene.add(upSpot1); scene.add(upSpot1.target);
  const upSpot2 = new THREE.SpotLight(0xc9a84c, 0.6, 25, Math.PI / 8, 0.7);
  upSpot2.position.set(-4, 0.2, -4); upSpot2.target.position.set(0, 8, 0);
  scene.add(upSpot2); scene.add(upSpot2.target);

  // ========== FIREFLY PARTICLES ==========
  const pCount=120;
  const pGeo=new THREE.BufferGeometry();
  const pPos=new Float32Array(pCount*3);
  const pData=[];
  for(let i=0;i<pCount;i++){
    pPos[i*3]=(Math.random()-0.5)*22;
    pPos[i*3+1]=Math.random()*3+0.2;
    pPos[i*3+2]=(Math.random()-0.5)*22;
    pData.push({vy:0.003+Math.random()*0.008,phase:Math.random()*Math.PI*2,speed:0.5+Math.random()*1.5});
  }
  pGeo.setAttribute('position',new THREE.BufferAttribute(pPos,3));
  const pMaterial=new THREE.PointsMaterial({color:0xc9a84c,size:0.06,transparent:true,opacity:0.5,sizeAttenuation:true});
  const particles=new THREE.Points(pGeo,pMaterial);
  scene.add(particles);

  // ========== ENHANCED ANIMATION ==========
  let animId, isRunning = false, elapsed = 0;
  const clock = new THREE.Clock();
  function animate() {
    animId = requestAnimationFrame(animate);
    const dt = clock.getDelta(); elapsed += dt;

    // Window emissive pulsing (varied materials)
    windowMat.emissiveIntensity = 2.0 + Math.sin(elapsed * 0.4) * 0.5;
    windowCoolMat.emissiveIntensity = 1.2 + Math.sin(elapsed * 0.6 + 1) * 0.3;
    windowDimMat.emissiveIntensity = 0.1 + Math.sin(elapsed * 0.3) * 0.06;

    // LED facade bands color cycle (Landmark 81 effect)
    const ledHue = (elapsed * 0.08) % 1;
    const ledColor = new THREE.Color().setHSL(0.55 + Math.sin(elapsed * 0.15) * 0.1, 0.8, 0.5);
    ledMeshes.forEach((mat, i) => {
      const phase = i * 0.4;
      mat.emissiveIntensity = 1.0 + Math.sin(elapsed * 0.8 + phase) * 0.8;
      mat.emissive.copy(ledColor);
      mat.color.copy(ledColor);
    });

    // Crown LED golden pulse
    crownLedMat.emissiveIntensity = 1.5 + Math.sin(elapsed * 1.2) * 0.6;
    // Beacon blink
    beaconMat.emissiveIntensity = 2.0 + Math.sin(elapsed * 3) * 1.5;

    // Water animation
    waterMat.transmission = 0.75 + Math.sin(elapsed * 1.5) * 0.08;
    poolWater.position.y = rtY + 0.3 + Math.sin(elapsed * 0.8) * 0.004;

    // Crane arm slow rotation
    craneGroup.children[1].rotation.y = Math.sin(elapsed * 0.05) * 0.15;
    // Crane warning light blink
    craneLight.intensity = 0.2 + Math.sin(elapsed * 2.5) * 0.2;

    // Starfield twinkle
    starMat.opacity = 0.55 + Math.sin(elapsed * 0.25) * 0.15;

    // Firefly particles
    const positions = particles.geometry.attributes.position.array;
    for (let i = 0; i < pCount; i++) {
      const d = pData[i];
      positions[i*3] += Math.sin(elapsed * d.speed + d.phase) * 0.005;
      positions[i*3+1] += d.vy;
      positions[i*3+2] += Math.cos(elapsed * d.speed * 0.7 + d.phase) * 0.005;
      if (positions[i*3+1] > 6) {
        positions[i*3+1] = 0.2;
        positions[i*3] = (Math.random() - 0.5) * 24;
        positions[i*3+2] = (Math.random() - 0.5) * 24;
      }
    }
    particles.geometry.attributes.position.needsUpdate = true;
    pMaterial.opacity = 0.3 + Math.sin(elapsed * 0.6) * 0.2;

    // Dynamic light animation
    warmPt.intensity = 0.7 + Math.sin(elapsed * 0.3) * 0.15;
    coolPt.intensity = 0.35 + Math.sin(elapsed * 0.5 + 2) * 0.1;
    lobbyLight.intensity = 0.85 + Math.sin(elapsed * 0.4) * 0.2;
    lobbyLight2.intensity = 0.4 + Math.sin(elapsed * 0.6 + 1) * 0.15;
    ledPt1.intensity = 0.4 + Math.sin(elapsed * 0.7) * 0.2;
    ledPt2.intensity = 0.35 + Math.sin(elapsed * 0.9 + 1.5) * 0.15;
    ledPt3.intensity = 0.25 + Math.sin(elapsed * 0.5 + 0.8) * 0.12;

    controls.update(); composer.render();
  }

  // ========== START / VISIBILITY ==========
  function start(){if(isRunning)return;isRunning=true;clock.start();animate();}
  function stop(){isRunning=false;if(animId){cancelAnimationFrame(animId);animId=null;}}
  const visObs=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{if(e.isIntersecting)start();else stop();});
  },{threshold:0.05});
  visObs.observe(wrap);

  // ========== REVEAL ANIMATION ==========
  building.scale.set(1,0.01,1);building.position.y=-3;
  const camStart=new THREE.Vector3(28,16,28);
  const camEnd=new THREE.Vector3(14,7.5,16);
  camera.position.copy(camStart);let revealed=false;
  const revealObs=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting&&!revealed){
        revealed=true;start();
        if(loadEl)setTimeout(()=>loadEl.classList.add('hidden'),400);
        const dur=3000,startT=performance.now();
        function revealStep(now){
          const p=Math.min((now-startT)/dur,1);
          const ease=1-Math.pow(1-p,4);
          building.scale.y=0.01+ease*0.99;
          building.position.y=-3*(1-ease);
          building.rotation.y=(1-ease)*0.6;
          camera.position.lerpVectors(camStart,camEnd,ease*ease);
          if(p<1)requestAnimationFrame(revealStep);
        }
        requestAnimationFrame(revealStep);revealObs.disconnect();
      }
    });
  },{threshold:0.15});
  revealObs.observe(wrap);

  // ========== RESIZE ==========
  function onResize(){
    const w=wrap.clientWidth,h=wrap.clientHeight;
    camera.aspect=w/h;camera.updateProjectionMatrix();
    renderer.setSize(w,h);composer.setSize(w,h);bloomPass.resolution.set(w,h);
  }
  window.addEventListener('resize',onResize);

  // ========== CURSOR HINTS ==========
  canvas.addEventListener('pointerdown',()=>{canvas.parentElement.style.cursor='grabbing';});
  canvas.addEventListener('pointerup',()=>{canvas.parentElement.style.cursor='grab';});

  // ========== CLEANUP ==========
  window.addEventListener('beforeunload',()=>{
    stop();controls.dispose();renderer.dispose();
    scene.traverse(c=>{
      if(c.geometry)c.geometry.dispose();
      if(c.material){if(Array.isArray(c.material))c.material.forEach(m=>m.dispose());else c.material.dispose();}
    });
  });

  } // end else block