import { AngularFireAuth } from '@angular/fire/auth';
import { GoogleSigninDirective } from './google-signin.directive';

describe('GoogleSigninDirective', () => {
  it('should create an instance', () => {
    const directive = new GoogleSigninDirective({} as AngularFireAuth);
    expect(directive).toBeTruthy();
  });
});
