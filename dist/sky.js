/* Local device time; interpolate through dawn, daylight, sunset and night. */
function skyAtHour(hour){const stops=[
 {h:0,name:'밤',top:'#081322',horizon:'#233c52',base:'#18292b',ridges:['#243743','#29424a','#2a433e'],light:'#d4e8ed',night:1},
 {h:5,name:'새벽',top:'#243551',horizon:'#a47e8d',base:'#34483e',ridges:['#50516a','#555a65','#3c514b'],light:'#e6c6ab',night:.6},
 {h:7,name:'아침',top:'#6194ac',horizon:'#dfd5ab',base:'#39523d',ridges:['#758f89','#607f74','#405d4b'],light:'#fff1c5',night:0},
 {h:12,name:'낮',top:'#4e95c2',horizon:'#c5e3df',base:'#344f3c',ridges:['#749c99','#5f8c7b','#416b50'],light:'#fff5c2',night:0},
 {h:16,name:'오후',top:'#6ba1b7',horizon:'#dfd3a4',base:'#3e5140',ridges:['#8c9b88','#6f8971','#4a6650'],light:'#ffe8a7',night:0},
 {h:18,name:'노을',top:'#655883',horizon:'#eea274',base:'#434337',ridges:['#8d777d','#776d70','#515a4b'],light:'#ffd08d',night:0},
 {h:20,name:'저녁',top:'#18233e',horizon:'#63556e',base:'#24362e',ridges:['#444a60','#3c4855','#2f423d'],light:'#e7dcda',night:.8},
 {h:24,name:'밤',top:'#081322',horizon:'#233c52',base:'#18292b',ridges:['#243743','#29424a','#2a433e'],light:'#d4e8ed',night:1}];
 const h=((hour%24)+24)%24;let a=stops[0],b=stops[1];for(let i=0;i<stops.length-1;i++)if(h>=stops[i].h&&h<stops[i+1].h){a=stops[i];b=stops[i+1];break}let t=(h-a.h)/(b.h-a.h);t=t*t*(3-2*t);const mix=(x,y)=>'#'+[1,3,5].map(i=>Math.round(parseInt(x.slice(i,i+2),16)*(1-t)+parseInt(y.slice(i,i+2),16)*t).toString(16).padStart(2,'0')).join('');return{name:a.name,top:mix(a.top,b.top),horizon:mix(a.horizon,b.horizon),base:mix(a.base,b.base),ridges:a.ridges.map((x,i)=>mix(x,b.ridges[i])),light:mix(a.light,b.light),night:a.night*(1-t)+b.night*t,hour:h}}
