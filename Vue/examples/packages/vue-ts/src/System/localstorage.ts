import * as moment from 'moment'

export class StorageService {
  constructor() {
    //throw new Error("Cannot new this class");
  }
  public C_ENV_KEY = 'ENV_KEY'
  private C_time = 'setuptime'
  public validHours: number = 12; // Reset when storage is more than Xhours
  //now =  //no new date, got problems
  //setupTime = localStorage.getItem(C_time);//cannot dateparse here diferent browsers problem
  private setupTime(): string {
    var r = localStorage.getItem(this.C_time);
    if (r === null || typeof r === "undefined" || r === "undefined") {
      return null;
    }
    return r;
  }

  private now(): string {
    return moment.utc().format();
  }

   private checkStoreValid(): void {
    var setup: string = this.setupTime();
    if (setup == undefined || setup == null) {
      console.log('setting now ' + this.now())
      localStorage.setItem(this.C_time, this.now())
    }
    else {
     // console.log('got locstorage with setupTime' + Date.parse(setup) );
    //  console.log(Date.parse(this.now()) - Date.parse(setup))
      if (Date.parse(this.now()) - Date.parse(setup) > this.validHours * 60 * 60 * 1000) {//hours*60*60*1000   //2min  2*60*1000
        localStorage.clear();
        localStorage.setItem(this.C_time, this.now());
      }
    }
  }
  // initialiye value in storage, will not override existing value
  public setItemInit(key: string, data: string | any): void {
    this.checkStoreValid();
    var text: string;
    if (data && typeof data === "string")
    { text = data; }
    else {
      text = JSON.stringify(data);
    }
    // var text: string = JSON.stringify(jsonData);
    if (localStorage.getItem(key) == undefined) {//dont overide value
      { //console.log('initdata>>'+ data);
        localStorage.setItem(key, text);
      }
    }
  }

  public setItem(key: string, data: string | any): void {
    var text: string;
    if (data && typeof data === "string")
    { text = data; }
    else {
      text = JSON.stringify(data);
    }
    //  else {
    //  text = JSON.stringify(data);
    //  } 
    localStorage.setItem(key, text);
  }

  public getItem(key: string): string {
    var r = localStorage.getItem(key);
    if (r === null || typeof r === "undefined" || r === "undefined") {
      return null;
    }
    // if(val)
    return r;
    // return null;
  }

}

module ft {
    "use strict";

    export class LocalStorageService {
        // TODO: Need to handle QUOTA_EXCEEDED_ERR
        read(path: string): any {
            // if not in local storage, the string "undefined" is returned (why???)
            var text: string = localStorage.getItem(path);
            if (text === null || typeof text === "undefined" || text === "undefined") {
                //this.$log.debug("LocalStorageService::read(" + path + ") - path not found, returned null");
                return null;
            }
            else {
               // this.$log.debug("LocalStorageService::read(" + path + ")");
                return text;
            }
        }

        readObject<T>(path): T {
            var text: any = this.read(path);
            var data: T|null;
            try {
                data = <T>JSON.parse(text);
            } catch (error) {
               // this.$log.error("LocalStorageService::readObject: can't convert string from local storage to object using JSON.parse(). Error: " + error);
                data = null;
            }

            return data;
        }

        write(path: string, text: string): void {
           // this.$log.debug("LocalStorageService::write(" + path + ")");
            localStorage.setItem(path, text);
        }

        writeObject(path: string, data: any): void {
            var text: string = JSON.stringify(data);
            this.write(path, text);
        }

        remove(path: string): void {
         //   this.$log.debug("LocalStorageService::remove(" + path + ")");
            localStorage.removeItem(path);
        }

        clear(): void {
          //  this.$log.debug("LocalStorageService::clear - all items removed from local storage");
            localStorage.clear();
        }
    }
}