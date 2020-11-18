import { Component, Input, OnInit, ViewChild } from '@angular/core';
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import { ModalDirective } from 'angular-bootstrap-md';

@Component({
  selector: 'app-gear',
  templateUrl: './gear.component.html',
  styleUrls: ['./gear.component.scss']
})
export class GearComponent implements OnInit {
  @Input() data;
  @ViewChild('confirmModal', { static: false }) confirmModal: ModalDirective;
  dbLink; // id of elem
  editLink;
  type; // blog, comment, reply
  canEdit = false;
  id
  editors = []
  constructor() { }

  ngOnInit() {
    this.id = this.data.id + 'dropdown'
    this.dbLink = this.data.dbLink
    this.editLink = this.data.editLink
    this.type = this.data.type
    this.editors = this.data.editors
    let self = this
    let idWin = this.id

    window.addEventListener("click", function (event) {
      if (!(<HTMLElement>event.target).classList.contains('gearBtn')) {
        document.getElementById(idWin).classList.remove("show");
      }
    });

    firebase.auth().onAuthStateChanged(function (user) {
      firebase.database().ref('admins/').on('value', function (adminList) {
        self.editors = self.data.editors
        self.editors = self.editors.concat(Object.keys(adminList.val()))
        if (self.editors.indexOf(user.uid) >= 0) {
          self.canEdit = true
        }
      })
    })

  }

  myFunction() {
    document.getElementById(this.id).classList.toggle("show");
  }

  async del() {
    await firebase.database().ref('blog/events/' + this.data.id).set(null)
    await firebase.database().ref('blog/podcasts/' + this.data.id).set(null)
    await firebase.database().ref(this.dbLink).remove()
  }
}
