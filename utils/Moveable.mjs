const yacceleration=9.8
const xacceleration=0

class Moveable{
    velocity=0;
    position=0;
    async jump(object){
        this.velocity+=200;
        let oldpos=this.position;
        console.log('alo')
        while(pos-oldpos<this.velocity)
        {
            pos+=(pos-oldpos)/Math.abs(pos-oldpos);
            object.style.bottom=pos;
            await new Promise(()=>setTimeout(()=>{},5));
        }
        while(this.position>0){
            this.velocity-=yacceleration;
            this.position+=this.velocity;
            object.style.bottom=pos;
        }
    }
}

export default Moveable;