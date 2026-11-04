const fs=require('fs'),vm=require('vm'),assert=require('assert');const scope={};vm.createContext(scope);vm.runInContext(fs.readFileSync(require('path').join(__dirname,'../dist/trail-summit.js'),'utf8'),scope);const s=scope.RouteeSummit;
assert.equal(s.sample(0).walk,0);assert.equal(s.sample(0).walking,true);assert.equal(s.sample(0).pose,0);
let previous=0;for(let t=0;t<6;t+=.1){const f=s.sample(t);assert(f.walk>=previous);assert(f.walk<=1);assert(f.pose>=0&&f.pose<=1);previous=f.walk;if(f.pose>0)assert(!f.walking)}
assert.equal(s.sample(s.shutterAt-.01).shutter,false);assert.equal(s.sample(s.shutterAt).shutter,true);assert.equal(s.sample(s.duration).done,true);assert.equal(s.sample(s.duration-.01).done,false);
const reduced=s.sample(.4,true);assert(reduced.done);assert.equal(reduced.walk,1);assert.equal(reduced.pose,1);assert.equal(reduced.shutter,false);assert.equal(reduced.walking,false);
console.log('정상 도착 걷기→포즈→셔터→완료 및 줄인 모션 검증 완료');
