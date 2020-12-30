import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import * as Editor from '../../../../assets/ckeditor5/build/ckeditor.js'
import { CKEditorComponent } from '@ckeditor/ckeditor5-angular'
import { CKEditorConfig } from 'ckeditor5-build-classic-all-plugin'
import { ActivatedRoute, Router } from '@angular/router';
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import { MessengerService } from '../../../services/messenger.service'
import { ModalDirective } from 'angular-bootstrap-md';

@Component({
  selector: 'app-forum-edit',
  templateUrl: './forum-edit.component.html',
  styleUrls: ['./forum-edit.component.scss']
})
export class ForumEditComponent implements AfterViewInit {

  @ViewChild('editor', { static: false }) editorComponent: CKEditorComponent;
  @ViewChild('delModal', { static: false }) delModal: ModalDirective;
  @ViewChild('pubModal', { static: false }) pubModal: ModalDirective;
  @ViewChild('editModal', { static: false }) editModal: ModalDirective;

  public Editor = Editor;
  config: CKEditorConfig = {
    placeholder: "Type here",
    // BUG: Current CKEditor5's generated build does not 
    // show the default toolbar as defined in the online builder
    toolbar: [
      'Heading', '|', 'FontFamily', 'FontSize', 'Bold', 'Italic', 'Underline', 'Strikethrough', 'Subscript', 'Superscript', 'FontColor', 'FontBackgroundColor', 'Highlight', '|', 'Alignment', 'BulletedList', 'NumberedList', 'Indent', 'Outdent', 'InsertTable', '|', 'ImageUpload', '|', 'BlockQuote', 'RemoveFormat', 'HorizontalLine', 'SpecialCharacters', 'Undo', 'Redo'
    ],
  };
  autoSaveReady = true
  autoSaveStarted = false
  lastSaved = 'Never'
  lastModified = 'Never'
  saveStatus = `<small>No Changes</small>`
  data
  queuedForSave = false
  saveTimer
  id;
  time;
  title;
  post;
  dbURL;
  uid;
  create;
  type
  coverImg;
  iframe;
  ref;
  category;
  catDirty = false;
  vis;
  public postContent = '';
  constructor(private messenger: MessengerService, private route: ActivatedRoute, private router: Router) { }

  ngAfterViewInit() {

    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.type = params.get('type')
      let self = this

      if (this.type === 'drafts') {
        firebase.auth().onAuthStateChanged(function (user) {
          self.ref = 'users/' + user.uid + '/community-drafts'
          self.create = params.get('create') === 'create'
          self.time = +params.get('time')
          firebase.database().ref(`/${self.ref}/` + self.id).once('value', (commData) => {
            console.log(commData.val())
            if (commData.val()) {
              if ((user.uid !== commData.val().uid)) {
                self.router.navigate([`/community`], { relativeTo: self.route })
              } else {
                self.postContent = commData.val().content
                self.title = commData.val().title
                self.editorComponent.editorInstance.setData(self.postContent)
              }
            } else {
              self.router.navigate([`/community`], { relativeTo: self.route })
            }
          })
        })
      } else if (this.type === 'post') {
        firebase.database().ref(`/community/` + self.id).once('value', (commData) => {
          firebase.auth().onAuthStateChanged(function (user) {

            if (commData.val()) {
              if ((user.uid !== commData.val().uid)) {
                self.router.navigate([`/community`], { relativeTo: self.route })
              } else {
                self.postContent = commData.val().content
                self.title = commData.val().title
                self.editorComponent.editorInstance.setData(self.postContent)
              }
            } else {
              self.router.navigate([`/community`], { relativeTo: self.route })
            }

          })
        })
      }
    })
  }

  saveEdit() {
    this.editModal.show()
  }

  public onChange({ editor }: ChangeEvent) {
    const data = editor.getData();
    this.data = data
    if (this.type === 'drafts') {
      clearTimeout(this.saveTimer)
      this.saveTimer = setTimeout(() => {
        let d = new Date()
        this.lastSaved = (d).toTimeString().split(' ')[0] + ' on ' + (d).toDateString()
        this.saveStatus = `<small>Autosaved as Draft</small>`
        document.getElementById('saveBtn').classList.add('disabled')
        this.save()
      }, 10000)
    }
    if (this.type === 'post') {
      this.saveStatus = `<small>Publish</small>`
    } else {
      this.saveStatus = `<small>Save as Draft</small>`
    }
    document.getElementById('saveBtn').classList.remove('disabled')
  }

  save() {
    let updates = {}
    let ref = ''
    if (this.type === 'post') {
      this.saveStatus = `<small>All Changes Published</small>`
      ref = '/community/' + this.id + '/'
    } else {
      clearTimeout(this.saveTimer)
      ref = `/${this.ref}/` + this.id + '/'
      this.saveStatus = `<small>Saved as Draft</small>`
      updates[ref + 'time'] = (new Date()).getTime()
    }
    document.getElementById('saveBtn').classList.add('disabled')
    if (ref) {
      updates[ref + 'content'] = this.data
      updates[ref + 'title'] = this.title
      updates[ref + 'readTime'] = this.data.split(' ').length / 200
      firebase.database().ref().update(updates)
      if (this.type === 'post') {
        window.location.href = `/community/${this.id}`;
      }
    }
  }

  titleChange(event) {
    this.title = event
    if (this.type === 'drafts') {
      clearTimeout(this.saveTimer)
      this.saveTimer = setTimeout(() => {
        let d = new Date()
        this.lastSaved = (d).toTimeString().split(' ')[0] + ' on ' + (d).toDateString()
        this.saveStatus = `<small>Autosaved as Draft</small>`
        document.getElementById('saveBtn').classList.add('disabled')
        this.save()
      }, 10000)
    }
    if (this.type === 'post') {
      this.saveStatus = `<small>Publish</small>`
    } else {
      this.saveStatus = `<small>Save as Draft</small>`
    }
    document.getElementById('saveBtn').classList.remove('disabled')
  }

  pub() {
    let self = this
    this.save()
    firebase.auth().onAuthStateChanged(async function (user) {
      let draft = await firebase.database().ref('users/' + user.uid + '/community-drafts/' + self.id).once('value')
      if (draft.val()) {
        let newPost = draft.val()
        if (self.vis === 'priv') {
          newPost.authorName = 'Anonymous'
          newPost.authorImg = 'assets/anon.png'
        }
        await firebase.database().ref('community/' + self.id).set(newPost)
        await firebase.database().ref('users/' + user.uid + '/community-drafts/' + self.id).set(null)
        await firebase.database().ref('users/' + user.uid + '/community-posts/' + self.id).set('community/' + self.id)
        window.location.href = `/community/${self.id}`;
      }
    })
  }

  catChange(event) {
    let i = event.target.options.selectedIndex
    let option = event.target.options[i].value
    this.category = option
    this.catDirty = true
    if (this.type === 'post') {
      this.saveStatus = `<small>Publish</small>`
    } else {
      this.saveStatus = `<small>Save as Draft</small>`
    }
    document.getElementById('saveBtn').classList.remove('disabled')
  }

  deleteDraft() {
    this.delModal.show()
  }

  publishDraft(vis) {
    this.vis = vis
    this.pubModal.show()
  }

  del() {
    let self = this
    firebase.auth().onAuthStateChanged(async function (user) {
      await firebase.database().ref('users/' + user.uid + '/community-drafts/' + self.id).remove()
      self.delModal.hide()
      window.location.href = '/user/' + user.uid + '/community-drafts'
    })
  }
}