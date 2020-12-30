import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
@Component({
  selector: 'app-forum-drafts',
  templateUrl: './forum-drafts.component.html',
  styleUrls: ['./forum-drafts.component.scss']
})
export class ForumDraftsComponent implements OnInit {
  drafts;
  href;
  lenOfData
  showLoading = true
  constructor() { }

  ngOnInit() {
    this.getDrafts()
  }

  getDrafts() {
    let self = this
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        firebase.database().ref('/users/' + user.uid + '/community-drafts').on('value', function (draftData) {
          if (draftData.val()) {
            self.drafts = draftData.val()
            self.lenOfData = Object.values(self.drafts)
            self.href = '/community/drafts/'
          }
        })
        self.showLoading = false
      }
    })
  }
}
