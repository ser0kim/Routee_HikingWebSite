/* Repeating connected mountain legs. World coordinates never reset between summits. */
var RouteeWorld = (() => {
  const summit = 9000, forks = [700, 3300, 5900], branchLength = 2000;
  const clamp = t => Math.max(0, Math.min(1, t));
  const smooth = t => { t=clamp(t); return t*t*(3-2*t); };
  const center = z => Math.sin(z*.0017)*70+Math.sin(z*.0041)*22;
  const rawHeight = z => z*.34+30*Math.sin(z*.0027)+6*Math.sin(z*.015);
  const rawSlope = z => .34+.081*Math.cos(z*.0027)+.09*Math.cos(z*.015);
  const plateauStart = summit-850;
  const local = z => ((z%summit)+summit)%summit;
  const lap = z => Math.max(0,Math.floor(z/summit));
  function localHeight(z) {
    if (z <= plateauStart) return rawHeight(z);
    const t=clamp((z-plateauStart)/850);
    return rawHeight(plateauStart)+850*rawSlope(plateauStart)*(t-t*t/2);
  }
  const rise=localHeight(summit);
  function height(z) {
    if(z<0)return rawHeight(z);
    const n=lap(z),p=local(z);
    return n*rise+localHeight(p)*(n>0?smooth(p/600):1);
  }
  function slope(z) { if(z>=summit&&local(z)===0)return 0;if(z>=summit)return Math.max(0,(height(z+.1)-height(z-.1))/.2);return z<plateauStart ? rawSlope(z) : rawSlope(plateauStart)*(1-clamp((z-plateauStart)/850)); }
  function forkStart(i) { return Math.floor(i/3)*summit+forks[i%3]; }
  function forkIndex(z) { const n=lap(z),p=local(z);let index=0;for(let i=0;i<forks.length;i++)if(p>=forks[i])index=i;return n*3+index; }
  function nearForks(z) { const n=lap(z);return Array.from({length:6},(_,i)=>n*3+i); }
  function branchOffset(z,i) {
    const t=(z-forkStart(i))/branchLength;
    return t>0&&t<1 ? Math.sin(Math.PI*t)*300 : 0;
  }
  function roads(z) {
    const offset=branchOffset(z,forkIndex(z)),mid=center(z);
    return offset>.1 ? [mid-offset,mid+offset] : [mid];
  }
  function biome(x,z) {
    const p=local(z),alpine=smooth((p-7600)/1200);
    let forest=.78-.35*smooth(p/7800);
    // Ease out of the summit clearing before the next forest begins.
    if(z>=summit)forest*=smooth(p/550);
    const i=forkIndex(z),t=z-forkStart(i);
    if(t>0&&t<branchLength){
      const strength=smooth(t/260)*smooth((branchLength-t)/260);
      const side=smooth((center(z)+55-x)/110);
      forest=forest*(1-strength)+side*strength;
    }
    forest*=1-alpine;
    return {forest,ridge:(1-forest)*(1-alpine),alpine,name:alpine>.65?'정상 접근':forest>.58?'고요한 숲길':'탁 트인 능선'};
  }
  function terrainSide(x,z) {
    const b=biome(x,z),edge=Math.max(0,Math.abs(x-center(z))-130);
    const rolling=Math.sin(z*.004+x*.006)*(4+b.ridge*13);
    const p=local(z),clearing=(1-smooth((p-8000)/1000))*(z>=summit?smooth(p/550):1);
    return (edge*(.035+b.ridge*.045)+rolling)*clearing;
  }
  const colors = Array.from({length:21},(_,i)=>[0,1].map(v=>{
    const t=i/20,a=v?[42,70,46]:[39,66,43],b=v?[109,113,94]:[101,107,88];
    return `rgb(${a.map((n,j)=>Math.round(n+(b[j]-n)*t)).join(',')})`;
  }));
  function groundColor(x,z,variant) { const b=biome(x,z);return colors[Math.round((1-b.forest)*20)][variant?1:0]; }
  function nextFork(z,choices,target=summit) { return nearForks(z).find(i=>forkStart(i)<target&&forkStart(i)+120>z&&!choices.has(i))??-1; }
  function progress(z,target=summit) { return clamp((z-(target-summit))/summit); }
  function remaining(z,target=summit) { return Math.max(0,Math.ceil((target-z)*.04)); }
  return {summit,forks,branchLength,center,height,slope,forkStart,forkIndex,nearForks,branchOffset,roads,biome,terrainSide,groundColor,nextFork,progress,remaining,local,lap};
})();
