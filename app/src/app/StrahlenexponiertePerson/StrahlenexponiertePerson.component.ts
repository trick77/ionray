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
import { StrahlenexponiertePersonService } from './StrahlenexponiertePerson.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-strahlenexponierteperson',
  templateUrl: './StrahlenexponiertePerson.component.html',
  styleUrls: ['./StrahlenexponiertePerson.component.css'],
  providers: [StrahlenexponiertePersonService]
})
export class StrahlenexponiertePersonComponent implements OnInit {

  myForm: FormGroup;

  private allParticipants;
  private participant;
  private currentId;
  private errorMessage;

  ahvn13 = new FormControl('', Validators.required);
  vorname = new FormControl('', Validators.required);
  nachname = new FormControl('', Validators.required);
  geburtsjahr = new FormControl('', Validators.required);
  lebensDosis = new FormControl('', Validators.required);
  jahresDosis = new FormControl('', Validators.required);
  aktuellerArbeitgeber = new FormControl('', Validators.required);


  constructor(public serviceStrahlenexponiertePerson: StrahlenexponiertePersonService, fb: FormBuilder) {
    this.myForm = fb.group({
      ahvn13: this.ahvn13,
      vorname: this.vorname,
      nachname: this.nachname,
      geburtsjahr: this.geburtsjahr,
      lebensDosis: this.lebensDosis,
      jahresDosis: this.jahresDosis,
      aktuellerArbeitgeber: this.aktuellerArbeitgeber
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceStrahlenexponiertePerson.getAll()
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
      $class: 'ch.hslu.casblc2018.ionray.StrahlenexponiertePerson',
      'ahvn13': this.ahvn13.value,
      'vorname': this.vorname.value,
      'nachname': this.nachname.value,
      'geburtsjahr': this.geburtsjahr.value,
      'lebensDosis': this.lebensDosis.value,
      'jahresDosis': this.jahresDosis.value,
      'aktuellerArbeitgeber': this.aktuellerArbeitgeber.value
    };

    this.myForm.setValue({
      'ahvn13': null,
      'vorname': null,
      'nachname': null,
      'geburtsjahr': null,
      'lebensDosis': null,
      'jahresDosis': null,
      'aktuellerArbeitgeber': null
    });

    return this.serviceStrahlenexponiertePerson.addParticipant(this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'ahvn13': null,
        'vorname': null,
        'nachname': null,
        'geburtsjahr': null,
        'lebensDosis': null,
        'jahresDosis': null,
        'aktuellerArbeitgeber': null
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
      $class: 'ch.hslu.casblc2018.ionray.StrahlenexponiertePerson',
      'vorname': this.vorname.value,
      'nachname': this.nachname.value,
      'geburtsjahr': this.geburtsjahr.value,
      'lebensDosis': this.lebensDosis.value,
      'jahresDosis': this.jahresDosis.value,
      'aktuellerArbeitgeber': this.aktuellerArbeitgeber.value
    };

    return this.serviceStrahlenexponiertePerson.updateParticipant(form.get('ahvn13').value, this.participant)
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

    return this.serviceStrahlenexponiertePerson.deleteParticipant(this.currentId)
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

    return this.serviceStrahlenexponiertePerson.getparticipant(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'ahvn13': null,
        'vorname': null,
        'nachname': null,
        'geburtsjahr': null,
        'lebensDosis': null,
        'jahresDosis': null,
        'aktuellerArbeitgeber': null
      };

      if (result.ahvn13) {
        formObject.ahvn13 = result.ahvn13;
      } else {
        formObject.ahvn13 = null;
      }

      if (result.vorname) {
        formObject.vorname = result.vorname;
      } else {
        formObject.vorname = null;
      }

      if (result.nachname) {
        formObject.nachname = result.nachname;
      } else {
        formObject.nachname = null;
      }

      if (result.geburtsjahr) {
        formObject.geburtsjahr = result.geburtsjahr;
      } else {
        formObject.geburtsjahr = null;
      }

      if (result.lebensDosis) {
        formObject.lebensDosis = result.lebensDosis;
      } else {
        formObject.lebensDosis = null;
      }

      if (result.jahresDosis) {
        formObject.jahresDosis = result.jahresDosis;
      } else {
        formObject.jahresDosis = null;
      }

      if (result.aktuellerArbeitgeber) {
        formObject.aktuellerArbeitgeber = result.aktuellerArbeitgeber;
      } else {
        formObject.aktuellerArbeitgeber = null;
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
      'ahvn13': null,
      'vorname': null,
      'nachname': null,
      'geburtsjahr': null,
      'lebensDosis': null,
      'jahresDosis': null,
      'aktuellerArbeitgeber': null
    });
  }
}
