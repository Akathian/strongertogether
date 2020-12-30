import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  lifeCoachForm;
  fnameErr = false;
  messageErr = false;
  emailErr = false;
  showLoading = false;
  sent = false
  error = false
  constructor(private formBuilder: FormBuilder) {
    this.lifeCoachForm = this.formBuilder.group({
      fname: '',
      message: '',
      email: '',
      type: 'contact'
    });
  }

  ngOnInit() {
  }

  async onSubmit(formValue) {
    this.showLoading = true
    document.getElementById('lifeSubmit').classList.add('disabled')
    if (!this.sent) {
      this.fnameErr = formValue.fname === '' ? true : false
      this.messageErr = formValue.message === '' ? true : false
      this.emailErr = formValue.email === '' ? true : false
      if (this.fnameErr || this.messageErr || this.emailErr) {
        this.showLoading = false
        document.getElementById('lifeSubmit').classList.remove('disabled')
      } else {
        // send and show loading/confirm modal
        const sendEmail = firebase.functions().httpsCallable('sendEmail')
        const data = {
          to: 's.strongertogether@gmail.com',
          subject: `Contact: ${formValue.fname} sent you a message!`,
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

