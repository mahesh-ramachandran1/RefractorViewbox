import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LogDetailsService {

  constructor() {
    this.initializeLogDetails();
  }

  private initializeLogDetails() {
    const object: any[] = [];
    const width = window.innerWidth;
    const height = window.innerHeight;
    const jsState = true; // JavaScript is always active in a browser

    const osName = this.getOSName();
    const cookieState = this.areCookiesEnabled();
    const flashState = this.detectFlashVersion();
    const javaState = this.detectJavaVersion();
    const browserName = this.detectBrowserName();

    const monitorHeight = screen.height;
    const monitorWidth = screen.width;
    const userIp = ''; // IP detection is not straightforward in a browser

    object.push({
      BrowserName: browserName,
      BrowserSize: `${width} x ${height}`,
      MonitorResolution: `${monitorWidth} x ${monitorHeight}`,
      JavaScriptActive: jsState,
      OS: osName,
      IP: userIp,
      CookieEnable: cookieState,
      FlashVersion: flashState,
      JavaVersion: javaState,
    });

    sessionStorage.setItem("SessionName", JSON.stringify(object));
  }

  private getOSName(): string {
    const userAgent = navigator.userAgent;
    const clientStrings = [
      { s: 'Windows 10', r: /(Windows 10.0|Windows NT 10.0)/ },
      { s: 'Windows 8.1', r: /(Windows 8.1|Windows NT 6.3)/ },
      // Add more OS mappings here
    ];

    for (const clientString of clientStrings) {
      if (clientString.r.test(userAgent)) {
        return clientString.s;
      }
    }

    return "Unknown OS";
  }

  private areCookiesEnabled(): boolean {
    const cookiesEnabled = navigator.cookieEnabled;

    if (typeof navigator.cookieEnabled === 'undefined') {
      document.cookie = "mytestcookie";
      return document.cookie.indexOf("mytestcookie") !== -1;
    }

    return cookiesEnabled;
  }

  private detectFlashVersion(): string {
    let flashVersion = 'Not Installed';

    if (typeof navigator.plugins !== 'undefined') {
      const shockwaveFlash = (navigator.plugins as any)['Shockwave Flash'];
      if (shockwaveFlash && typeof shockwaveFlash.description === 'string') {
        flashVersion = shockwaveFlash.description;
      }
    }

    if (flashVersion === 'Not Installed' && typeof navigator.mimeTypes !== 'undefined') {
      flashVersion = 'Not Installed';
    }

    return flashVersion;
  }

  private detectJavaVersion(): string {
    let javaVersion = "Not Installed";

    // You may add Java version detection logic here using third-party libraries or plugins.

    return javaVersion;
  }

  private detectBrowserName(): string {
    const userAgent = navigator.userAgent;

    if (userAgent.indexOf("Chrome") !== -1) {
      return "Google Chrome";
    } else if (userAgent.indexOf("MSIE") !== -1 || userAgent.indexOf("Trident/") !== -1) {
      return "Microsoft Internet Explorer";
    } else if (userAgent.indexOf("Firefox") !== -1) {
      return "Mozilla Firefox";
    } else if (userAgent.indexOf("Safari") !== -1) {
      return "Safari";
    } else if (userAgent.indexOf("Edge") !== -1) {
      return "Microsoft Edge";
    } else {
      return "Unknown Browser";
    }
  }
}