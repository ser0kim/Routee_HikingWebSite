const fs=require('fs'),vm=require('vm'),assert=require('assert');
const script=fs.readFileSync(require('path').join(__dirname,'../dist/trail-audio.js'),'utf8');
function fixture(fail=false,blocked=false){
 const handlers={},windowEvents={},attrs={},label={},status={textContent:''},sources=[],contexts=[];let requests=0;
 const button={setAttribute:(k,v)=>attrs[k]=v,querySelector:()=>label,addEventListener:(k,v)=>handlers[k]=v};
 const node=()=>({gain:{value:0,cancelScheduledValues(){},setTargetAtTime(v){this.value=v}},connect(){},disconnect(){}});
 class AudioContext{constructor(){this.state='suspended';this.currentTime=0;this.destination={};this.gains=[];contexts.push(this)}resume(){if(blocked)return new Promise(()=>{});this.state='running';return Promise.resolve()}suspend(){this.state='suspended';return Promise.resolve()}createGain(){const n=node();this.gains.push(n);return n}createStereoPanner(){return {...node(),pan:{value:0}}}decodeAudioData(){return Promise.resolve({})}createBufferSource(){const source={...node(),playbackRate:{value:1},start(){this.started=true},stop(){this.stopped=true;this.onended?.()}};sources.push(source);return source}}
 const document={hidden:false,getElementById:id=>id==='soundToggle'?button:status,addEventListener:(k,v)=>handlers[k]=v};
 const window={AudioContext,addEventListener:(k,v)=>windowEvents[k]=v};
 const scope={window,document,fetch:async()=>{requests++;return {ok:!fail,arrayBuffer:async()=>new ArrayBuffer(0)}}};
 vm.runInNewContext(script,scope);
 return {handlers,attrs,label,status,document,windowEvents,contexts,sources,update:window.RouteeTrailAudio.update,get requests(){return requests},setFail:v=>fail=v,setBlocked:v=>blocked=v};
}
(async()=>{
 const flush=()=>new Promise(setImmediate);const f=fixture();assert.equal(f.attrs['aria-pressed'],'true');await flush();assert.equal(f.requests,7);assert.equal(f.attrs['aria-pressed'],'true');assert.equal(f.contexts[0].gains[1].gain.value,.22);
 f.update(0,true,'grass');f.update(1,true,'grass');assert.equal(f.sources.length,1);f.update(1.6,true,'grass');assert.equal(f.sources.length,2);
 f.update(2.1,true,'grass',2);assert.equal(f.sources.length,2,'longer stride waits for the next step');f.update(100,true,'grass');assert.equal(f.sources.length,3,'returning must not burst footsteps');
 f.update(100,false,'grass');assert(f.sources.slice(1).every(s=>s.stopped));assert.equal(f.contexts[0].gains[0].gain.value,.1);
 f.update(101,false,'grass');assert.equal(f.sources.length,3);
 f.update(0,true,'trail');f.update(1.6,true,'trail');assert.equal(f.sources.length,4);
 f.document.hidden=true;f.handlers.visibilitychange();assert.equal(f.contexts[0].state,'suspended');
 f.document.hidden=false;f.handlers.visibilitychange();await Promise.resolve();assert.equal(f.contexts[0].state,'running');
 await f.handlers.click();assert.equal(f.attrs['aria-pressed'],'false');assert(f.sources.slice(1).every(s=>s.stopped));
 f.update(200,true,'trail');assert.equal(f.sources.length,4);
 await f.handlers.click();assert.equal(f.requests,7,'do not re-download after mute');
 const e=fixture(true);await flush();assert.equal(e.attrs['aria-pressed'],'false');assert(e.status.textContent);e.setFail(false);await e.handlers.click();assert.equal(e.attrs['aria-pressed'],'true');assert.equal(e.status.textContent,'');
 const b=fixture(false,true);await flush();assert.equal(b.label.textContent,'자연 소리 대기');b.setBlocked(false);b.handlers.pointerdown({target:{closest:()=>null}});await flush();assert.equal(b.contexts[0].state,'running');assert.equal(b.label.textContent,'자연 소리 ON');
 const muted=fixture(false,true);await muted.handlers.click();await flush();assert.equal(muted.attrs['aria-pressed'],'false');muted.setBlocked(false);muted.handlers.pointerdown({target:{closest:()=>null}});assert.equal(muted.contexts[0].state,'suspended','a gesture must not unmute explicitly disabled audio');
 console.log('오디오 기본 ON·자동 재생 제한 및 첫 입력 재생·로딩 중 OFF 유지·거리별 발소리·종료·재시작·탭 중지·음소거·실패 재시도 검증 완료');
})().catch(e=>{console.error(e);process.exitCode=1});
