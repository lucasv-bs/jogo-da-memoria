let ctx;
let firstpick = true;
let firstcard;
let secondcard;
let frontbgcolor = "rgb(251,215,73)";
let polycolor = "rgb(254,11,0)";
let backcolor = "rgb(128,0,128)";
let tablecolor = "rgb(255,255,255)";
let cardrad = 30;
let deck = [];
let firstsx = 30;
let firstsy = 50;
let margin = 30;
let cardwidth = 4*cardrad;
let cardheight = 4*cardrad;
let matched;
let starttime;

function Card(sx, sy, swidth, sheight, info) {
    this.sx = sx;
    this.sy = sy;
    this.swidth = swidth;
    this.sheight = sheight;
    this.info = info;
    this.draw = drawback;
}

function makedeck() {
    let i;
    let acard;
    let bcard;
    let cx = firstsx;
    let cy = firstsy;

    for(i = 3; i < 9; i++) {
        acard = new Card(cx, cy, cardwidth, cardheight, i);
        deck.push(acard);
        bcard = new Card(cx, cy+cardheight+margin, cardwidth, cardheight, i);
        deck.push(bcard);
        
        cx = cx + cardwidth + margin;
        acard.draw();
        bcard.draw();
    }
    shuffle();
}

function shuffle() {
    let i;
    let k;
    let holder;
    let dl = deck.length;

    let nt;
    for(nt = 0; nt < 3*dl; nt++) {
        i = Math.floor(Math.random() * dl);
        k = Math.floor(Math.random() * dl);
        holder = deck[i].info;
        deck[i].info = deck[k].info;
        deck[k].info = holder;
    }
}

function Polycard(sx, sy, rad, n) {
    this.sx = sx;
    this.sy = sy;
    this.rad = rad;
    this.n = n;
    this.angle = (2*Math.PI)/n;
    this.draw = drawpoly;
}

function drawpoly() {
    ctx.fillStyle = frontbgcolor;
    ctx.fillRect(this.sx - 2 * this.rad, this.sy - 2 * this.rad, 4*this.rad, 4*this.rad);
    ctx.beginPath();
    ctx.fillStyle = polycolor;
    
    let i;
    let rad = this.rad;
    ctx.moveTo(this.sx + rad * Math.cos(-0.5*this.angle), this.sy + rad * Math.sin(-0.5*this.angle));
    for(i = 1; i < this.n; i++) {
        ctx.lineTo(this.sx + rad * Math.cos((i - 0.5) * this.angle), this.sy + rad * Math.sin((i - 0.5) * this.angle));
    }
    ctx.fill();
}

function drawback() {
    ctx.fillStyle = backcolor;
    ctx.fillRect(this.sx, this.sy, this.swidth, this.sheight);
}

function choose(ev) {
    let mx;
    let my;
    let pick1;
    let pick2;

    if(ev.layerX || ev.layerX == 0) {
        mx = ev.layerX;
        my = ev.layerY;
    }
    else if(ev.offsetX || ev.offsetX == 0) {
        mx = ev.offsetX;
        my = ev.offsetY;
    }
    
    let i;
    for(i = 0; i < deck.length; i++) {
        let card = deck[i];
        if(card.sx >= 0) {
            if((mx > card.sx) && (mx < card.sx+card.swidth) && (my > card.sy) && (my < card.sy + card.sheight)) {
                if((firstpack) || (i != firstcard)) {
                    break;
                }
            }
        }
    }
    if(i < deck.length) {
        if(firstpick) {
            firstcard = i;
            firstpick = false;
            pick1 = new Polycard(card.sx + cardwidth * 0.5, card.sy + cardheight * 0.5, cardrad, card.info);
            pick1.draw();
        }
        else {
            secondcard = i;
            pick2 = new Polycard(card.sx + cardwidth * 0.5, card.sy + cardheight * 0.5, cardrad, card.info);
            pick2.draw();
            if(deck[i].info == deck[firstcard].info) {
                matched = true;
                let nm = 1 + Number(document.f.count.value);
                document.f.count.value = String(nm);
                if(nm >= 0.5*deck.length) {
                    let now = new Date();
                    let nt = Number(now.getTime());
                    let seconds = Math.floor(0.5 + (nt - starttime) / 1000);
                    document.f.elapsed.value = String(seconds);
                }
            }
            else {
                matched = false;
            }
            firstpick = true;
            setTimeout(flipback, 1000);
        }
    }
}

function flipback() {
    if(!matched) {
        deck[firstcard].draw();
        deck[secondcard].draw();
    }
    else {
        ctx.fillStyle = tablecolor;
        ctx.fillRect(deck[secondcard].sx, deck[secondcard].sy, deck[secondcard].swidth, deck[secondcard].sheight);
        ctx.fillRect(deck[firstcard].sx, deck[firstcard].sy, deck[firstcard].swidth, deck[firstcard].sheight);
        deck[secondcard].sx = -1;
        deck[firstcard].sx = -1;
    }
}

function init() {
    //console.log("start init function");

    ctx = document.getElementById('canvas').getContext('2d');
    //console.log(ctx);

    canvas1 = document.getElementById('canvas');
    canvas1.addEventListener('click', choose, false);
    makedeck();
    document.f.count.value = 0;
    document.f.elapsed.value = "";
    starttime = new Date();
    starttime = Number(starttime.getTime());
    shuffle();
}