/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { AngularTestPage } from './app.po';
import { ExpectedConditions, browser, element, by } from 'protractor';
import {} from 'jasmine';


describe('Starting tests for app', function() {
  let page: AngularTestPage;

  beforeEach(() => {
    page = new AngularTestPage();
  });

  it('website title should be app', () => {
    page.navigateTo('/');
    return browser.getTitle().then((result)=>{
      expect(result).toBe('app');
    })
  });

  it('network-name should be ionray-network@1.0.2',() => {
    element(by.css('.network-name')).getWebElement()
    .then((webElement) => {
      return webElement.getText();
    })
    .then((txt) => {
      expect(txt).toBe('ionray-network@1.0.2.bna');
    });
  });

  it('navbar-brand should be app',() => {
    element(by.css('.navbar-brand')).getWebElement()
    .then((webElement) => {
      return webElement.getText();
    })
    .then((txt) => {
      expect(txt).toBe('app');
    });
  });

  

  
    it('StrahlenexponiertePerson component should be loadable',() => {
      page.navigateTo('/StrahlenexponiertePerson');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('StrahlenexponiertePerson');
      });
    });

    it('StrahlenexponiertePerson table should have 8 columns',() => {
      page.navigateTo('/StrahlenexponiertePerson');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(8); // Addition of 1 for 'Action' column
      });
    });
  
    it('Unternehmen component should be loadable',() => {
      page.navigateTo('/Unternehmen');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Unternehmen');
      });
    });

    it('Unternehmen table should have 4 columns',() => {
      page.navigateTo('/Unternehmen');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(4); // Addition of 1 for 'Action' column
      });
    });
  
    it('DosimetrieStelle component should be loadable',() => {
      page.navigateTo('/DosimetrieStelle');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('DosimetrieStelle');
      });
    });

    it('DosimetrieStelle table should have 3 columns',() => {
      page.navigateTo('/DosimetrieStelle');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(3); // Addition of 1 for 'Action' column
      });
    });
  
    it('Bundesorgan component should be loadable',() => {
      page.navigateTo('/Bundesorgan');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Bundesorgan');
      });
    });

    it('Bundesorgan table should have 3 columns',() => {
      page.navigateTo('/Bundesorgan');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(3); // Addition of 1 for 'Action' column
      });
    });
  
    it('Dosimeter component should be loadable',() => {
      page.navigateTo('/Dosimeter');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Dosimeter');
      });
    });

    it('Dosimeter table should have 5 columns',() => {
      page.navigateTo('/Dosimeter');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(5); // Addition of 1 for 'Action' column
      });
    });
  

  
    it('DosisMessung component should be loadable',() => {
      page.navigateTo('/DosisMessung');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('DosisMessung');
      });
    });
  
    it('SetupDemo component should be loadable',() => {
      page.navigateTo('/SetupDemo');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('SetupDemo');
      });
    });
  

});