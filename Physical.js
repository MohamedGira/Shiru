export class Physical{
    constructor(px=0,py=0,vx=0,vy=0,ax=0,ay=0){
        this.px = px;
        this.py = py;
        this.vx = vx;
        this.vy = vy;
        this.ax = ax;
        this.ay = ay;

        setInterval(()=>{
            this.px += this.vx;
            this.py += this.vy;
            this.vx += this.ax;
            this.vy += this.ay;
        },1000/60)
    }    
}