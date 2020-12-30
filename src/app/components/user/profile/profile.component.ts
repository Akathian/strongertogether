import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import firebase from 'firebase/app'
import 'firebase/database'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  isSelf = false;
  editMode = false;
  profileUid
  bio = 'No Bio Yet!'
  newBio;
  isAdmin
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    let self = this
    this.route.paramMap.subscribe(async params => {
      this.profileUid = params.get('uid')
      firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
          if (self.profileUid === user.uid) {
            self.isSelf = true
          }
        }
      })
    })
    this.checkAdmin()
    this.getBio()
  }

  checkAdmin() {
    let self = this
    firebase.auth().onAuthStateChanged(async function (user) {
      if (user) {
        const admin = await (await firebase.database().ref('admins/' + user.uid).once('value')).val()
        self.isAdmin = admin ? true : false
      }
    })
  }


  getBio() {
    let self = this
    firebase.database().ref(`users/${this.profileUid}/bio`).once('value', function (bioData) {
      if (bioData.val()) {
        self.bio = bioData.val()
      } else {
        self.bio = 'No Bio Yet!'
      }
    })
  }

  editBio() {
    this.editMode = true
  }

  bioChange(text) {
    this.newBio = text
  }

  saveBio() {
    this.bio = this.newBio
    this.editMode = false
    let self = this
    firebase.auth().onAuthStateChanged(function (user) {
      firebase.database().ref(`users/${user.uid}/bio`).set(self.bio)
    })
  }
}
