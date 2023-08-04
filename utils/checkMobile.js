export function isMobile() {
  console.log(navigator.userAgent);
    if (
    navigator.userAgent.match(/Android/gi) ||
    navigator.userAgent.match(/webOS/gi) ||
    navigator.userAgent.match(/iPhone/gi) ||
    navigator.userAgent.match(/iPad/gi) ||
    navigator.userAgent.match(/iPod/gi) ||
    navigator.userAgent.match(/BlackBerry/gi) ||
    navigator.userAgent.match(/Phone/gi)
  ) 
    return true;
  return false;
}
