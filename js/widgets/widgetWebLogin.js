class WidgetWebLogin{
  constructor(prop){
    // C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe
    // C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe
    window.execCmd("taskkill  /IM chrome.exe /F");
    this.kioskChrome = setTimeout(function(){
      window.execApp(chromePath, ["--kiosk", "-incognito", "--autoplay-policy=no-user-gesture-required", prop.src]);
    }, 5000);
  }

  removeFx(){
    window.execCmd("taskkill  /IM chrome.exe /F");
    clearTimeout(this.kioskChrome);
    this.kioskChrome = null;
    this.kioskChrome = undefined;
  }
}
