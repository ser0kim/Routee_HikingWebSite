var RouteePace = (() => {
  const min=60, max=185, walk=75, run=175;
  function profile(value) {
    const parsed=Number(value),speed=Math.max(min,Math.min(max,Number.isFinite(parsed)?parsed:walk));
    const t=(speed-min)/(max-min),cadence=1.55+t*2.2;
    return {speed,mode:speed<=115?'걷기':'뛰기',cadence,stepDistance:speed*.04/cadence,motion:.55+t*.6};
  }
  function time(seconds) { const minutes=Math.floor(Math.max(0,seconds)/60);return Math.floor(minutes/60)+'h '+minutes%60+'m'; }
  function recordingTime(seconds) { const minutes=Math.floor(Math.max(0,seconds)/60);return String(Math.floor(minutes/60)).padStart(2,'0')+':'+String(minutes%60).padStart(2,'0'); }
  return {min,max,walk,run,profile,time,recordingTime};
})();
