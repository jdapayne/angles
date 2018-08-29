export function randBetween(n,m) {
    // return a random integer between n and m inclusive
    return n+Math.floor(Math.random()*(m-n+1));
}

export function randMultBetween(min,max,n) {
    //return a random multiple of n between n and m (inclusive if possible)
    min = Math.ceil(min/n)*n;
    max = Math.floor(max/n)*n; // could check divisibility first to maximise performace, but I'm sure the hit isn't bad
    
    return randBetween(min/n,max/n)*n
}

export function randWithProbMass(min,max,p,check) {
    // for n with min<n<max, retun n with probability p(n)
    // if check is true, check first that the probability mass function sums to 1
    if (check) {
        let sum = 0;
        for (let i = min; i <= max; i++) {
            sum += p(i);
            debugger;
        }
        if (Math.round(sum*1000000) !== 1000000) return null;
    }
    let cf = 0;
    const diceroll = Math.random();
    for (let i = min; i <= max; i++) {
        cf += p(i);
        if (diceroll <= cf) return i;
        debugger;
    }
    return max;
}

export function randElem(array) {
    let i = randBetween(0,array.length - 1);
    return array[i];
}

export function roundToTen (n) {
    return Math.round(n/10)*10;
}

export function roundDP (x,n) {
    return Math.round(x*10**n)/(10**n);
}

export function degToRad(x) {
    return x*Math.PI/180;
}

export function sinDeg(x) {
    return Math.sin(x*Math.PI/180);
}

export function cosDeg(x) {
    return Math.cos(x*Math.PI/180);
}

export function shuffle(array) {
    // Knuth-Fisher-Yates
    // from https://stackoverflow.com/a/2450976/3737295
    // nb. shuffles in place
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}
