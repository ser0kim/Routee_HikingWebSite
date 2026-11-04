const fs=require('fs'),vm=require('vm'),assert=require('assert');
const scope={};vm.createContext(scope);vm.runInContext(fs.readFileSync(require('path').join(__dirname,'../dist/trail-geometry.js'),'utf8'),scope);
const clip=scope.RouteeGeometry.clipNear;
const point=(viewX,viewY,depth)=>({viewX,viewY,depth,x:viewX/depth,y:viewY/depth});
const front=[point(-20,-10,100),point(20,-10,100),point(0,10,100)];
assert.strictEqual(clip(front,point),front);
assert.equal(clip([point(-10,10,5),point(10,10,20),point(0,-10,40)],point).length,0);
// A terrain triangle crossing the camera must remain visible as a clipped quad.
const crossed=clip([point(-20,-10,100),point(20,-10,100),point(0,20,10)],point);
assert.equal(crossed.length,4);assert(crossed.every(p=>p.depth>=45&&Number.isFinite(p.x)&&Number.isFinite(p.y)));
assert.equal(crossed.filter(p=>p.depth===45).length,2);
// Two vertices behind the camera still leave the front tip visible.
assert.equal(clip([point(0,-10,100),point(-20,20,-100),point(20,20,-100)],point).length,3);
const screen=[{x:0,y:0},{x:20,y:0},{x:10,y:20}];assert.strictEqual(clip(screen,point),screen);
console.log('근거리 지형 교차·전체 후방 제외·2D 도형 유지 검증 완료');
