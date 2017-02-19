import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { About } from '../pages/about/about';
import { AllContacts} from '../pages/all-contacts/all-contacts';
import { UpdateContacts } from '../pages/contact/update';
import { FTAC } from '../pages/ftac/ftac';

@NgModule({
  declarations: [
    MyApp,
    Page1,
    Page2,
    AllContacts,
    UpdateContacts,
    About,
    FTAC
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    Page2,
    AllContacts,
    UpdateContacts,
    About,
    FTAC
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
