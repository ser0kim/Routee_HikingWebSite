const fs=require('fs'),vm=require('vm'),assert=require('assert');const scope={};vm.createContext(scope);vm.runInContext(fs.readFileSync(require('path').join(__dirname,'../dist/trail-pace.js'),'utf8'),scope);const p=scope.RouteePace;
const walk=p.profile(p.walk),run=p.profile(p.run);assert(walk.speed<115);assert(run.speed>115);assert.equal(walk.mode,'걷기');assert.equal(run.mode,'뛰기');assert(walk.cadence<run.cadence);assert(walk.motion<run.motion);assert.equal(p.profile(-100).speed,p.min);assert.equal(p.profile(1000).speed,p.max);assert.equal(p.profile(NaN).speed,p.walk);
for(let value=p.min;value<=p.max;value+=5){const a=p.profile(value);assert(Math.abs(a.cadence*a.stepDistance-a.speed*.04)<.00001)}
for(const [seconds,text] of [[0,'0h 0m'],[59,'0h 0m'],[60,'0h 1m'],[3599,'0h 59m'],[3600,'1h 0m'],[12000,'3h 20m']])assert.equal(p.time(seconds),text);
console.log('걷기/뛰기 범위·보폭/발소리 동기화·카메라 동작·h/m 시간 표기 검증 완료');
