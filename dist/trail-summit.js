/* A short arrival: walk to the landmark, turn, pose, then take a photo. */
var RouteeSummit = (() => {
  const duration=5.4,walkDuration=2.5,shutterAt=3.9;
  const clamp=t=>Math.max(0,Math.min(1,t));
  const smooth=t=>{t=clamp(t);return t*t*(3-2*t)};
  function sample(seconds,reduced=false){
    const t=Math.max(0,seconds);
    return {walk:reduced?1:smooth(t/walkDuration),pose:reduced?1:smooth((t-2.5)/.8),
      framing:reduced?1:smooth(t/1.3),walking:!reduced&&t<walkDuration,
      shutter:!reduced&&t>=shutterAt,done:t>=(reduced?.4:duration)};
  }
  return {duration,walkDuration,shutterAt,sample};
})();
