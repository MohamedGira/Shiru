export function showMessage(ctx,message,options={
    renderAtX:8,
    renderAtY:48,
    font:"50px Impact",
    color:'white',
    shadowColor:'black',
    shadow:true,
    offset:3
  }){
    ctx.save();
    ctx.font=options.font;
    options.shadow===undefined&&(options.shadow=true);
    options.shadow&&(ctx.fillStyle = options.shadowColor);
    options.shadow&&(ctx.fillText(message, options.renderAtX, options.renderAtY));
    ctx.fillStyle = options.color;
    ctx.fillText(message, options.renderAtX+options.offset, options.renderAtY+options.offset);
    ctx.restore()
  }