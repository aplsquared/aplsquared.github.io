class WidgetWebLogin{
    constructor(prop){
        this.settings = JSON.parse(prop.settings);
        this.prop = prop;

        console.warn('INITIAL', prop);
        console.warn('INITIAL', this.settings);
        setTimeout(()=>{this.init()}, 200);
    }

    init(){
        $("#" + this.prop.fid).html('<webview id="myframe" src="http://www.google.com" partition="persist:webviewsession" style="width:' + this.prop.w + 'px;height:'+ this.prop.h + 'px; border:none;overflow:hidden;"></webview>');
        // $("#" + this.settings.uId).text(this.settings.uVal);
        const webview = document.querySelector('webview');
        console.warn(webview);
        var data = document.evaluate('//*[@id="email"]', document, null, XPathResult.ANY_TYPE, null);
        console.warn(data);
        // var result = [];
        // var nodesSnapshot = document.evaluate('//*[@id="facebook"]/body', document, null, XPathResult.STRING_TYPE, null );
        // for ( var i=0 ; i < nodesSnapshot.snapshotLength; i++ ){
        //     result.push( nodesSnapshot.snapshotItem(i) );
        // }
        // console.warn(result);
        const webviewElement = document.querySelector("webview");
        console.warn(webviewElement);
        function updateVisibilityState() {
            webviewElement.executeJavaScript("(function() { return document.visibilityState })()", true, function(result) {
              console.warn('Result', result);
            })
        }
        webviewElement.addEventListener("dom-ready", updateVisibilityState)


        var webdriver = require('selenium-webdriver');
        var chrome = require('selenium-webdriver/chrome');
        var path = require('chromedriver').path;
        console.warn(app.getPath ('exe'));

        // var service = new chrome.ServiceBuilder(path).build();
        // chrome.setDefaultService(service);

        var driver = new webdriver.Builder()
        .usingServer('http://localhost:9990')
        .withCapabilities({
          chromeOptions: {
            // Here is the path to your Electron binary.
            binary: app.getPath('exe')
          }
        })
        .forBrowser('electron')
        .build()

        driver.switchTo().frame('myframe')
        // driver.get('http://www.google.com');
        var inputField = driver.findElement(webdriver.By.name('q'));
        var longstring = "test";
        inputField.sendKeys(longstring);
        inputField.value = longstring;
        // inputField.setAttributes("value", longstring);

        // const driver = new webdriver.Builder()
        // .usingServer('http://localhost:4444/wd/hub')
        // .withCapabilities({
        //     chromeOptions: {
        //         binary: ''
        //     }
        // })
        // .forBrowser('electron')
        // .build();
        console.warn(driver);





        // var f = webdriver.findElement(By.xpath("//input[@name='email']"));
        // console.warn('fName', f);
        // const driver = new RemoteWebDriver("http://localhost:9515", DesiredCapabilities.chrome());
        // driver.get("http://www.google.com");

        // const driver = require('ChromeDriver');
        // var ele = driver.findElement(xpath("//input[@name='email']"));
        // console.warn(ele);



        // webdriver.get('http://www.google.com')
        // console.warn(webdriver);


        webview.addEventListener("dom-ready", function(){
            webview.openDevTools();
        });

        // webview.addEventListener("ipc-message", function(){
        //     console.warn();
        //     webview.openDevTools();
        // });
    }
}
