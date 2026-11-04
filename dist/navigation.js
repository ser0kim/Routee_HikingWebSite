/* Heading is relative to the last direction; positive turns right. */
const MAX_HEADING=1.05;
function relativeHeading(previous,turn){return Math.max(-MAX_HEADING,Math.min(MAX_HEADING,previous+turn))}
function pointerTurn(x,anchor,width){return Math.max(-.7,Math.min(.7,(x-anchor)/Math.max(180,width*.47)*.7))}
function arrowRotation(relativeTurn){return relativeTurn*180/Math.PI-135}
function mountainElevation(z){return z*.34+30*Math.sin(z*.0027)+6*Math.sin(z*.015)}
function mountainSlope(z){return .34+.081*Math.cos(z*.0027)+.09*Math.cos(z*.015)}
