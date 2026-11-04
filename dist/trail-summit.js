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
  function canSavePhoto(count){return Number.isInteger(count)&&count>=0&&count<=5}
  function photoCrop(width,height){const w=Math.min(width,height*.75),h=Math.min(height,width/.75);return {x:Math.max(0,Math.min(width-w,width*.5-w/2)),y:Math.max(0,Math.min(height-h,height*.48-h/2)),width:w,height:h}}
  return {duration,walkDuration,shutterAt,sample,canSavePhoto,photoCrop};
})();
