import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import { DateService } from 'src/app/services/date.service';
@Component({
  selector: 'app-drafts',
  templateUrl: './drafts.component.html',
  styleUrls: ['./drafts.component.scss']
})
export class DraftsComponent implements OnInit {
  drafts;
  href;
  lenOfData
  showLoading = true
  constructor(private dateService: DateService) { }

  ngOnInit() {
    this.getDrafts()
  }

  getDrafts() {
    let self = this
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        firebase.database().ref('/users/' + user.uid + '/drafts').on('value', function (draftData) {
          if (draftData) {
            self.drafts = draftData.val()
            self.lenOfData = Object.values(self.drafts)
            self.href = '/blog/drafts/'
          }
        })
        self.showLoading = false
      }
    })
  }
}
