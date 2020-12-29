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
  nameErr = false;
  identifyErr = false;
  contactMethodErr = false;
  contactInfoErr = false;
  showLoading = false;
  sent = false
  error = false

  constructor(private formBuilder: FormBuilder) {
    this.peerBuddyForm = this.formBuilder.group({
      name: '', // req
      identify: '',  // req
      age: '',
      pref: '',
      contactMethod: '', // req  
      contactInfo: '', // req
    });
  }

  ngOnInit() {
  }


  async onSubmit(formValue) {
    this.showLoading = true
    document.getElementById('peerSubmit').classList.add('disabled')
    if (!this.sent) {
      this.nameErr = formValue.name === '' ? true : false
      this.identifyErr = formValue.identify === '' ? true : false
      this.contactMethodErr = formValue.contactMethod === '' ? true : false
      this.contactInfoErr = formValue.contactInfo === '' ? true : false
      if (this.nameErr || this.identifyErr || this.contactMethodErr || this.contactInfoErr) {
        this.showLoading = false
        document.getElementById('peerSubmit').classList.remove('disabled')
      } else {
        // send and show loading/confirm modal
        const sendEmail = firebase.functions().httpsCallable('sendEmail')
        const data = {
          to: 's.strongertogether@gmail.com',
          subject: `Peer Buddy Support: ${formValue.name} has signed up!`,
          formValue
        }
        try {
          await sendEmail(data)
          this.sent = true
          this.showLoading = false
        } catch (e) {
          this.error = true
          this.showLoading = false
        }
      }
    } else {
      this.showLoading = false
    }
  }
}
