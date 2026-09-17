const {readFileSync} = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');

function harness(protocol = 'http:') {
  const nodes = new Map(), timers = new Map(), frames = new Map(), events = {};
  const contexts = []; let serial = 0, config, player;
  function element() {
    const classes = new Set();
    return {style:{}, textContent:'', innerHTML:'', classList:{
      add:x=>classes.add(x), remove:x=>classes.delete(x), contains:x=>classes.has(x),
      toggle(x,on){if(on ?? !classes.has(x)) classes.add(x);else classes.delete(x)}},
      setAttribute(k,v){this[k]=v}, addEventListener(k,f){this[k]=f},
      appendChild(){},contains(){return false}, getBoundingClientRect:()=>({width:390,height:844})};
  }
  const param = () => ({value:0,setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}});
  class Audio {
    constructor(){this.state='running';this.currentTime=0;this.sampleRate=100;this.destination={};this.sources=[];this.gains=[];contexts.push(this)}
    resume(){this.state='running';return Promise.resolve()}
    createGain(){const n={gain:param(),connect(){},disconnect(){}};this.gains.push(n);return n}
    source(){const n={frequency:param(),connect(){},disconnect(){},start(){this.started=true},stop(){this.stopped=true}};this.sources.push(n);return n}
    createOscillator(){return this.source()}
    createBufferSource(){return this.source()}
    createBuffer(){return {getChannelData:()=>new Float32Array(200)}}
    createBiquadFilter(){return {frequency:param(),Q:param(),connect(){},disconnect(){}}}
  }
  const get = id => {if(!nodes.has(id))nodes.set(id,element());return nodes.get(id)};
  get('sparkler-canvas').getContext=()=>new Proxy({}, {get:()=>()=>{}});
  const window = {AudioContext:Audio,devicePixelRatio:1,matchMedia:()=>({matches:false}),
    addEventListener:(k,f)=>events[k]=f,
    YT:{Player: function(id,opts){config=opts;player=this;this.playCalls=0;this.playVideo=()=>this.playCalls++;this.pauseVideo=()=>{};this.setVolume=()=>{};this.mute=()=>{};this.unMute=()=>{};this.seekTo=()=>{};}}};
  const sandbox = {window,location:{protocol,origin:'http://localhost'},console,
    navigator:{userAgent:'iPhone'},innerWidth:390,innerHeight:844,performance:{now:()=>1000},
    document:{hidden:false,getElementById:get,querySelectorAll:()=>[],createElement:element,addEventListener:(k,f)=>events[k]=f},
    setTimeout:(fn,ms)=>{timers.set(++serial,{fn,ms});return serial},clearTimeout:id=>timers.delete(id),
    setInterval:(fn,ms)=>{timers.set(++serial,{fn,ms});return serial},clearInterval:id=>timers.delete(id),
    requestAnimationFrame:fn=>{frames.set(++serial,fn);return serial},cancelAnimationFrame:id=>frames.delete(id)};
  vm.createContext(sandbox);
  vm.runInContext(readFileSync('js/music.js','utf8')+'\nthis.music=Music;',sandbox);
  sandbox.music.init();
  return {sandbox,music:sandbox.music,nodes,get,timers,frames,contexts,events,player,config};
}

(async()=>{
  const h=harness();
  assert.equal(h.config.videoId,'0EHz1LXR-Qc');
  assert.equal(h.config.height,'200');assert.equal(h.config.width,'100%');
  assert.equal(h.config.playerVars.controls,1);
  assert.equal(h.config.playerVars.playlist,'0EHz1LXR-Qc');
  h.music.startPlaying();
  h.config.events.onReady({target:h.player});assert.equal(h.player.playCalls,1);
  assert(h.get('music-playlist-drawer').classList.contains('is-open'));
  assert(!h.get('music-play-btn').innerHTML.includes('⏸'),'wait for playback confirmation');
  h.config.events.onStateChange({data:1});
  assert(h.get('music-play-btn').innerHTML.includes('⏸'));
  h.music.pause();h.config.events.onError({data:153});
  assert.equal(h.contexts.length,0,'no synthesized replacement');
  h.music.play();h.config.events.onAutoplayBlocked();
  assert(!h.get('music-play-btn').innerHTML.includes('⏸'));
  h.music.play();assert.equal(h.player.playCalls,3,'widget retries original embed');
  h.music.toggleMute();assert.equal(h.get('music-mute-btn')['aria-pressed'],'true');
  h.music.toggleMute();h.music.pause();
  const file=harness('file:');file.config.events.onReady({target:file.player});file.music.play();
  assert.equal(file.player.playCalls,0);
  assert(file.get('music-status').textContent.includes('http://localhost:8080'));
  assert.equal(file.contexts.length,0);
  file.music.pause();
  const pending=harness();
  pending.music.play(); pending.music.pause();
  pending.config.events.onReady({target:pending.player});
  assert.equal(pending.player.playCalls,0,'cancel before ready');
  pending.music.play();
  [...pending.timers.values()].find(t=>t.ms===12000).fn();
  assert(pending.get('music-status').textContent.includes('Musik belum mulai'));
  const html=readFileSync('index.html','utf8');
  assert(html.includes('id="youtube-player"'));
  assert(!html.includes('top:-9999px'));
  assert(html.includes('id="music-status"'));
  vm.runInContext(readFileSync('js/effects.js','utf8')+'\nEffects.MagicSparkler.init();',h.sandbox);
  const btn=h.get('sparkler-toggle-btn');btn.click();
  const fx=h.contexts[0];assert(fx.sources.some(s=>s.started));
  for(let i=1;i<100;i++){const q=[...h.frames.values()];h.frames.clear();q.forEach(fn=>fn(i*16.67));assert(h.frames.size<=1)}
  assert(fx.sources.length>2);
  h.get('fireworks-sound-btn').click();assert.equal(fx.gains[0].gain.value,0);
  assert.equal(h.get('fireworks-sound-btn').textContent,'🔇');
  assert(fx.sources.every(s=>s.stopped));
  btn.click();assert.equal(h.frames.size,0);
  console.log('PASS: native player, confirmed playback state, late API startup, retry/mute, file URL guidance, fireworks audio.');
})().catch(error=>{console.error(error);process.exitCode=1});
