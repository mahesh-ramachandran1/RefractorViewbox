import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-passaword-text-box',
  templateUrl: './passaword-text-box.component.html',
  styleUrls: ['./passaword-text-box.component.css']
})
export class PasswordTextboxComponent implements OnInit 
{
    passwordCheck : boolean =false;
    passaword! :any ;
  @Input() label: string | undefined;
  @Input()
  type!: string;
  @Input() name: string | undefined;
  @Input() id: string | undefined;
  @Input() tabIndex: string | undefined;
  @Input() placeholder: string | undefined;
  @Input() bind: any;
  @Input() showmeter: boolean | undefined;
  @Input()
  totalstrength!: number;
  @Input()
  strengthmetercount!: number;
  @Input()
  displaymeter!: boolean;
  @Input()
  validationerror!: string;
  @Input()
  requirfielderror!: string;
  @Input()
  showtooltip!: boolean;
  @Input()
  validate!: boolean;
  @Input()
  allowDictionaryCharacters!: boolean;
  @Input()
  inovketooltip!: boolean;
  @Input()
  star!: boolean;
  // Add more inputs as needed

  oktaLogin!: boolean;
  dynamicPopover = {
    content: '',
    templateUrl: 'myPopoverTemplate.html',
    title: ''
  };
  strength = false;
  number = false;
  uppercase = false;
  lowercase = false;
  special = false;
  trivial = false;
  
  character = 0;
  inovkeTooltip = false;
  
  passwordSettings: any = {};
  activateTooltip: any;
  color: { "background-color": string; width: string; } | undefined;
  strengthText: string | undefined;
  keypressEvent: any;
  pass: any;

  constructor(
   
    private router: Router
  ) {}

  ngOnInit(): void {
    this.passwordCheck =false;
    
    this.strength = false;
  this.number = false;
  this.uppercase = false;
  this.lowercase = false;
  this.special = false;
  this.trivial = false;
  this.totalstrength = 0;
  this.strengthmetercount = 0;
  this.character = 0;
  this.passwordCheck = false;
  this.inovkeTooltip = false;
  this.displaymeter = false;
  }

  // Add other functions from the original code


  ngDoCheck() {
    if (this.inovkeTooltip) {
    
      this.inovkeTooltip = false;
    }
  }

  hideShowPassword(){
    this.passwordCheck =!this.passwordCheck
      }

  calculateFullStrength(passwordsettings: { IsNumber: any; IsLowercase: any; IsUppercase: any; IsRequiredLength: any; IsSpecialCharacter: any; IsAllowTrivialPassword: any; }) 
  {
    if (passwordsettings.IsNumber) {
      this.totalstrength++;
    }

    if (passwordsettings.IsLowercase) {
      this.totalstrength++;
    }

    if (passwordsettings.IsUppercase) {
      this.totalstrength++;
    }

    if (passwordsettings.IsRequiredLength) {
      this.totalstrength++;
    }

    if (passwordsettings.IsSpecialCharacter) {
      this.totalstrength++;
    }

    if (passwordsettings.IsAllowTrivialPassword) {
      this.totalstrength++;
    }
  }

  

 

  countStrength(pass: string ) 
  {
    const url = window.location.href;
    if (url.includes('user') || url.includes('password')) {
      this.keypressEvent({ password: pass });
    } else if (url.includes('passwordReset') || url.includes('updateOldPassword') || url.includes('passwordUpdate')) {
      this.keypressEvent({ password: pass });
    }
    this.validate = false;

    if (this.showtooltip) {
      this.showmeter = true;
    }

    if (this.pass.length !== 0) {
      this.displaymeter = true;
    } else {
      this.displaymeter = false;
    }

    const sprecialsTest = [/[^\w\s]/gi];
    const numberTest = [/[0-9]/g];
    const uppercaseTest = [/[A-Z]/g];
    const lowercaseTest = [/[a-z]/g];
    const trivial = [/abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|qwe|wer|ert|rty|tyu|yui|uio|iop|opa|asd|sdf|dfg|fgh|ghj|hjk|klz|zxc|xcv|cvb|vbn|bnm|123|234|345|456|567|678|789|890|098|987|876|765|654|543|432|321|mnb|nbv|bvc|vcx|cxz|zlk|kjh|jhg|hgf|gfd|fds|dsa|apo|poi|oiu|iuy|uyt|ytr|tre|rew|ewq|zyx|yxw|xwv|wvu|vut|uts|tsr|srq|rqp|qpo|pon|onm|nml|mlk|lkj|kji|jih|ihg|hgf|gfe|fed|edc|dcb|cba/];
  
    let isNumTest = false;
    let isUppercaseTest = false;
    let isLowercaseTest = false;
    let isSpecialcaseTest = false;
    let isLength = false;
    let isTrivial = false;

    this.number = false;
    this.uppercase = false;
    this.lowercase = false;
    this.special = false;
    this.strength = false;
    this.trivial = false;

    this.strengthmetercount = 0;

    if (this.passwordSettings.IsAllowTrivialPassword && pass.length > 2) 
    {
      if (trivial[0].test(pass.toLowerCase())) {
        if (isTrivial) {
          isTrivial = false;
          this.strengthmetercount--;
          this.trivial = false;
        }
      } else 
      {
        isTrivial = true;
        this.strengthmetercount++;
        if (pass.length >= 3) {
          this.trivial = true;
        }
      }
      if (this.passwordSettings.IsNumber) {
        if (numberTest[0].test(pass)) {
          isNumTest = true;
          this.strengthmetercount++;
          this.number = true;
        } else {
          if (isNumTest) {
            isNumTest = false;
            this.strengthmetercount--;
            this.number = false;
          }
        }
      }
  
      if (this.passwordSettings.IsUppercase) {
        if (uppercaseTest[0].test(pass)) {
          isUppercaseTest = true;
          this.strengthmetercount++;
          this.uppercase = true;
        } else {
          if (isUppercaseTest) {
            isUppercaseTest = false;
            this.strengthmetercount--;
            this.uppercase = false;
          }
        }
      }
  
      if (this.passwordSettings.IsLowercase) {
        if (lowercaseTest[0].test(pass)) {
          isLowercaseTest = true;
          this.strengthmetercount++;
          this.lowercase = true;
        } else {
          if (isLowercaseTest) {
            isLowercaseTest = false;
            this.strengthmetercount--;
            this.lowercase = false;
          }
        }
      }
  
      if (this.passwordSettings.IsSpecialCharacter) {
        if (sprecialsTest[0].test(pass)) {
          isSpecialcaseTest = true;
          this.strengthmetercount++;
          this.special = true;
        } else {
          if (isSpecialcaseTest) {
            isSpecialcaseTest = false;
            this.strengthmetercount--;
            this.special = false;
          }
        }
      }
  
      if (this.passwordSettings.IsRequiredLength) {
        if (pass !== "" || pass !== undefined) {
          if (parseInt(pass.length.toString()) >= this.character) {
            isLength = true;
            this.strengthmetercount++;
            this.strength = true;
          } else {
            if (isLength) {
              isLength = false;
              this.strengthmetercount--;
              this.strength = false;
            }
          }
        } else {
          if (isLength) {
            isLength = false;
            this.strengthmetercount--;
            this.strength = false;
          }
        }
      }
  
      if (this.totalstrength === 6) {
        switch (this.strengthmetercount) {
          case 1:
            this.color = { "background-color": "rgb(255, 0, 0)", "width": "25%" };
            this.strengthText = "Weak";
            break;
          case 2:
            this.color = { "background-color": "rgb(255, 0, 0)", "width": "25%" };
            this.strengthText = "Weak";
            break;
          case 3:
            this.color = { "background-color": "#9cafc2", "width": "50%" };
            this.strengthText = "Medium";
            break;
          case 4:
            this.color = { "background-color": "#9cafc2", "width": "50%" };
            this.strengthText = "Medium";
            break;
          case 5:
            this.color = { "background-color": "#9cafc2", "width": "75%" };
            this.strengthText = "Medium";
            break;
          case 6:
            this.color = { "background-color": "#4796e6", "width": "100%" };
            this.strengthText = "Strong";
            break;
          default:
            this.color = { "background-color": "rgb(255, 0, 0)", "width": "10%" };
            this.strengthText = "Weak";
            break;
        }
        return this.strengthmetercount;
      } else if (this.totalstrength === 5) {
        switch (this.strengthmetercount) {
          case 1:
            this.color = { "background-color": "rgb(255, 0, 0)", "width": "25%" };
            this.strengthText = "Weak";
            break;
          case 2:
            this.color = { "background-color": "rgb(255, 0, 0)", "width": "25%" };
            this.strengthText = "Weak";
            break;
          case 3:
            this.color = { "background-color": "#9cafc2", "width": "50%" };
            this.strengthText = "Medium";
            break;
          case 4:
            this.color = { "background-color": "#9cafc2", "width": "75%" };
            this.strengthText = "Medium";
            break;
          case 5:
            this.color = { "background-color": "#4796e6", "width": "100%" };
            this.strengthText = "Strong";
            break;
          default:
            this.color = { "background-color": "rgb(255, 0, 0)", "width": "10%" };
            this.strengthText = "Weak";
            break;
        }
        return this.strengthmetercount;
      } else if (this.totalstrength === 4) {
        switch (this.strengthmetercount) {
          case 1:
            this.color = { "background-color": "rgb(255, 0, 0)", "width": "25%" };
            this.strengthText = "Weak";
            break;
          case 2:
            this.color = { "background-color": "#9cafc2", "width": "50%" };
            this.strengthText = "Medium";
            break;
          case 3:
            this.color = { "background-color": "#9cafc2", "width": "75%" };
            this.strengthText = "Medium";
            break;
          case 4:
            this.color = { "background-color": "#4796e6", "width": "100%" };
            this.strengthText = "Strong";
            break;
          default:
            this.color = { "background-color": "rgb(255, 0, 0)", "width": "10%" };
            this.strengthText = "Weak";
            break;
        }
      } else if (this.totalstrength === 3) {
        switch (this.strengthmetercount) {
          case 1:
            this.color = { "background-color": "rgb(255, 0, 0)", "width": "30%" };
            this.strengthText = "Weak";
            break;
          case 2:
            this.color = { "background-color": "#9cafc2", "width": "60%" };
            this.strengthText = "Medium";
            break;
          case 3:
            this.color = { "background-color": "#4796e6", "width": "100%" };
            this.strengthText = "Strong";
            break;
          default:
            this.color = { "background-color": "rgb(255, 0, 0)", "width": "10%" };
            this.strengthText = "Weak";
            break;
        }
      } else if (this.totalstrength === 2) {
        switch (this.strengthmetercount) {
          case 1:
            this.color = { "background-color": "#9cafc2", "width": "50%" };
            this.strengthText = "Medium";
            break;
          case 2:
            this.color = { "background-color": "#4796e6", "width": "100%" };
            this.strengthText = "Strong";
            break;
          default:
            this.color = { "background-color": "rgb(255, 0, 0)", "width": "10%" };
            this.strengthText = "Weak";
            break;
        }
      } else if (this.totalstrength === 1) {
        switch (this.strengthmetercount) {
          case 1:
            this.color = { "background-color": "#4796e6", "width": "100%" };
            this.strengthText = "Strong";
            break;
          default:
            this.color = { "background-color": "rgb(255, 0, 0)", "width": "10%" };
            this.strengthText = "Weak";
            break;
        }
      }


      
   }
   return this.strengthmetercount;
  }
}
  
  
  
  

   






