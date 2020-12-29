import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

@Component({
  selector: 'app-life',
  templateUrl: './life.component.html',
  styleUrls: ['./life.component.scss']
})
export class LifeComponent implements OnInit {
  lifeCoachForm;
  fnameErr = false;
  lnameErr = false;
  emailErr = false;
  showLoading = false;
  sent = false
  error = false
  constructor(private formBuilder: FormBuilder) {
    this.lifeCoachForm = this.formBuilder.group({
      fname: '',
      lname: '',
      email: '',
      phone: '', // not req
    });
  }

  ngOnInit() {
  }

  async onSubmit(formValue) {
    this.showLoading = true
    document.getElementById('lifeSubmit').classList.add('disabled')
    if (!this.sent) {
      this.fnameErr = formValue.fname === '' ? true : false
      this.lnameErr = formValue.lname === '' ? true : false
      this.emailErr = formValue.email === '' ? true : false
      if (this.fnameErr || this.lnameErr || this.emailErr) {
        this.showLoading = false
        document.getElementById('lifeSubmit').classList.remove('disabled')
      } else {
        // send and show loading/confirm modal
        const sendEmail = firebase.functions().httpsCallable('sendEmail')
        const data = {
          to: 's.strongertogether@gmail.com',
          subject: `Life Coaching: ${formValue.fname} has signed up!`,
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

