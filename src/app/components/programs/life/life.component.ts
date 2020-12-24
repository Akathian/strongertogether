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
  constructor(private formBuilder: FormBuilder) {
    this.lifeCoachForm = this.formBuilder.group({
      fname: '',
      lname: '',
      email: '',
      phone: '',
    });
  }

  ngOnInit() {
  }

  onSubmit(formValue) {
    console.log(formValue)
  }
}

