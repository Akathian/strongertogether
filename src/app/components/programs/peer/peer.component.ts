import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

@Component({
  selector: 'app-peer',
  templateUrl: './peer.component.html',
  styleUrls: ['./peer.component.scss']
})
export class PeerComponent implements OnInit {
  peerBuddyForm;
  constructor(private formBuilder: FormBuilder) {
    this.peerBuddyForm = this.formBuilder.group({
      name: '',
      identify: '',
      age: '',
      pref: '',
      contactMethod: '',
      contactInfo: '',
    });
  }

  ngOnInit() {
  }

  onSubmit(formValue) {
    console.log(formValue)
  }
}
