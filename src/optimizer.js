export default function optimizer() {
  let score = [0, 0];
  let userPos = [0, 0, 0, 0];
  let ballPos = [0, 0];
  return function(pong) {
    let o = {};
    if (score[0] != pong.s[0] || score[1] != pong.s[1]) {
      score[0] = pong.s[0];
      score[1] = pong.s[1];
      o.s = score;
    }
    if (userPos[0] != pong.u[0]
      || userPos[1] != pong.u[1]
      || userPos[2] != pong.u[2]
      || userPos[3] != pong.u[3]) {
      userPos[0] = pong.u[0];
      userPos[1] = pong.u[1];
      userPos[2] = pong.u[2];
      userPos[3] = pong.u[3];
      o.u = userPos;
    }
    if (ballPos[0] != pong.b[0] || ballPos[1] != pong.b[1]) {
      ballPos[0] = pong.b[0];
      ballPos[1] = pong.b[1];
      o.b = ballPos;
    }
    if (Object.keys(o).length > 0) {
      return o;
    } else {
      return null;
    }
  }
}