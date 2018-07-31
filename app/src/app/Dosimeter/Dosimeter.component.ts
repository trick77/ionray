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

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DosimeterService } from './Dosimeter.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-dosimeter',
  templateUrl: './Dosimeter.component.html',
  styleUrls: ['./Dosimeter.component.css'],
  providers: [DosimeterService]
})
export class DosimeterComponent implements OnInit {

  myForm: FormGroup;

  private allParticipants;
  private participant;
  private currentId;
  private errorMessage;

  mac_adresse = new FormControl('', Validators.required);
  dosimeterTyp = new FormControl('', Validators.required);
  dosisMessungen = new FormControl('', Validators.required);
  person = new FormControl('', Validators.required);


  constructor(public serviceDosimeter: DosimeterService, fb: FormBuilder) {
    this.myForm = fb.group({
      mac_adresse: this.mac_adresse,
      dosimeterTyp: this.dosimeterTyp,
      dosisMessungen: this.dosisMessungen,
      person: this.person
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceDosimeter.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(participant => {
        tempList.push(participant);
      });
      this.allParticipants = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the participant field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the participant updateDialog.
   * @param {String} name - the name of the participant field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified participant field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'ch.hslu.casblc2018.ionray.Dosimeter',
      'mac_adresse': this.mac_adresse.value,
      'dosimeterTyp': this.dosimeterTyp.value,
      'dosisMessungen': this.dosisMessungen.value,
      'person': this.person.value
    };

    this.myForm.setValue({
      'mac_adresse': null,
      'dosimeterTyp': null,
      'dosisMessungen': null,
      'person': null
    });

    return this.serviceDosimeter.addParticipant(this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'mac_adresse': null,
        'dosimeterTyp': null,
        'dosisMessungen': null,
        'person': null
      });
      this.loadAll(); 
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
        this.errorMessage = error;
      }
    });
  }


   updateParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'ch.hslu.casblc2018.ionray.Dosimeter',
      'dosimeterTyp': this.dosimeterTyp.value,
      'dosisMessungen': this.dosisMessungen.value,
      'person': this.person.value
    };

    return this.serviceDosimeter.updateParticipant(form.get('mac_adresse').value, this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteParticipant(): Promise<any> {

    return this.serviceDosimeter.deleteParticipant(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceDosimeter.getparticipant(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'mac_adresse': null,
        'dosimeterTyp': null,
        'dosisMessungen': null,
        'person': null
      };

      if (result.mac_adresse) {
        formObject.mac_adresse = result.mac_adresse;
      } else {
        formObject.mac_adresse = null;
      }

      if (result.dosimeterTyp) {
        formObject.dosimeterTyp = result.dosimeterTyp;
      } else {
        formObject.dosimeterTyp = null;
      }

      if (result.dosisMessungen) {
        formObject.dosisMessungen = result.dosisMessungen;
      } else {
        formObject.dosisMessungen = null;
      }

      if (result.person) {
        formObject.person = result.person;
      } else {
        formObject.person = null;
      }

      this.myForm.setValue(formObject);
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });

  }

  resetForm(): void {
    this.myForm.setValue({
      'mac_adresse': null,
      'dosimeterTyp': null,
      'dosisMessungen': null,
      'person': null
    });
  }
}
