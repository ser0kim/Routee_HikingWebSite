/* Nature sound defaults on. Respect browser autoplay restrictions and explicit mute. */
window.RouteeTrailAudio = (() => {
  const button = document.getElementById('soundToggle');
  let context, ambientGain, stepGain, loop, buffers, loading;
  let enabled = true, busy = false, running = true, lastDistance = null;
  let variation = 0, previousVariant = -1, surface = 'trail';
  const activeSteps = new Set();

  function paint(message) {
    button.setAttribute('aria-pressed', String(enabled));
    button.setAttribute('aria-busy', String(busy));
    button.setAttribute('aria-label', enabled ? '풀벌레와 발자국 소리 끄기' : '풀벌레와 발자국 소리 켜기');
    button.title = message || (enabled ? '풀벌레와 발자국 소리 끄기' : '풀벌레와 발자국 소리 켜기');
    const waiting = enabled && context?.state === 'suspended' && !document.hidden;
    button.querySelector('span').textContent = busy ? '소리 준비 중' : waiting ? '자연 소리 대기' : enabled ? '자연 소리 ON' : '자연 소리 OFF';
    if (waiting && !busy) button.title = '화면을 클릭하거나 터치하면 소리가 시작돼요. 눌러 끄기';
  }

  function fade(gain, value, seconds = .5) {
    if (!context) return;
    const now = context.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setTargetAtTime(value, now, seconds / 4);
  }

  function silenceSteps() {
    for (const source of activeSteps) { try { source.stop(); } catch {} }
    activeSteps.clear();
  }

  async function prepare() {
    if (!context) {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) throw Error('unsupported');
      context = new Audio();
      context.addEventListener?.('statechange', () => { mix(); paint(); });
      ambientGain = context.createGain(); ambientGain.gain.value = 0;
      stepGain = context.createGain(); stepGain.gain.value = 0;
      ambientGain.connect(context.destination); stepGain.connect(context.destination);
    }
    // A blocked autoplay resume may stay pending until a gesture; never block loading or mute.
    context.resume().then(() => { mix(); paint(); }).catch(()=>{});
    if (!loading) {
      loading = Promise.all(['crickets.m4a', ...Array.from({length:6}, (_, i) => `step-${i+1}.wav`)].map(async name => {
        const response = await fetch(`assets/audio/${name}`);
        if (!response.ok) throw Error('audio download failed');
        return context.decodeAudioData(await response.arrayBuffer());
      })).then(result => buffers = result).catch(error => { loading = null; throw error; });
    }
    await loading;
    if (!loop) {
      loop = context.createBufferSource(); loop.buffer = buffers[0]; loop.loop = true;
      loop.connect(ambientGain); loop.start();
    }
  }

  function mix() {
    if (!context) return;
    fade(ambientGain, enabled && !document.hidden ? (running ? .24 : .10) : 0, .8);
    fade(stepGain, enabled && running && !document.hidden ? .22 : 0, .12);
  }

  async function start() {
    if (busy) { context?.resume().then(() => { mix(); paint(); }).catch(()=>{}); return; }
    busy = true; document.getElementById('soundStatus').textContent = ''; paint();
    try {
      await prepare();
      if (document.hidden) await context.suspend();
      lastDistance = null; mix();
    } catch (error) {
      console.warn('Nature audio could not start:', error);
      enabled = false;
      document.getElementById('soundStatus').textContent = '소리를 불러오지 못했어요. 소리 버튼을 눌러 다시 시도해주세요.';
    } finally { busy = false; paint(); }
  }

  button.addEventListener('click', () => {
    if (enabled) { enabled = false; silenceSteps(); mix(); paint(); return; }
    enabled = true; return start();
  });
  function unlock(event) {
    if (!enabled || document.hidden || event.target?.closest?.('#soundToggle')) return;
    context?.resume().then(() => { mix(); paint(); }).catch(()=>{});
  }
  document.addEventListener('pointerdown', unlock, {passive:true});
  document.addEventListener('keydown', unlock);

  function update(distance, isRunning, terrain, stepDistance = 1.55) {
    if (running !== isRunning) { running = isRunning; if (!running) silenceSteps(); mix(); }
    surface = terrain;
    if (!enabled || !buffers || context.state !== 'running' || document.hidden || !running) { lastDistance = null; return; }
    if (lastDistance === null || distance < lastDistance) { lastDistance = distance; return; }
    // Distance per footfall follows the selected pace. No catch-up burst.
    if (distance - lastDistance < stepDistance) return;
    lastDistance = distance;
    let index = Math.floor(Math.random()*6);
    if (index === previousVariant) index = (index+1)%6;
    previousVariant = index;
    const source = context.createBufferSource(), gain = context.createGain();
    source.buffer = buffers[index+1];
    source.playbackRate.value = (surface === 'grass' ? .95 : 1.04) + (Math.random()-.5)*.1;
    gain.gain.value = .85 + Math.random()*.15;
    const panner = context.createStereoPanner?.();
    source.connect(gain);
    if (panner) { panner.pan.value = ++variation%2 ? -.12 : .12; gain.connect(panner); panner.connect(stepGain); }
    else gain.connect(stepGain);
    activeSteps.add(source);
    source.onended = () => { activeSteps.delete(source); source.disconnect(); gain.disconnect(); panner?.disconnect(); };
    source.start();
  }

  document.addEventListener('visibilitychange', () => {
    lastDistance = null;
    if (!context) return;
    if (document.hidden) { silenceSteps(); context.suspend().catch(()=>{}); }
    else if (enabled) context.resume().then(mix).catch(()=>{ enabled=false; paint(); });
  });
  window.addEventListener('pagehide', () => { silenceSteps(); context?.suspend().catch(()=>{}); });
  window.addEventListener('pageshow', () => { if (enabled && !document.hidden) context?.resume().then(mix).catch(()=>{}); });
  paint();
  start();
  return { update, placeControl(result) { const parent = result ? document.getElementById('modal') : document.querySelector('.view-controls'); if (result) parent.prepend(button); else parent.append(button); } };
})();
