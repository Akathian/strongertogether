import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import * as ClassicEditor from 'ckeditor5-build-classic-all-plugin';
import { CKEditorComponent } from '@ckeditor/ckeditor5-angular'
import { ActivatedRoute, Router } from '@angular/router';
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import { MessengerService } from '../../../services/messenger.service'

@Component({
  selector: 'app-blog-edit',
  templateUrl: './blog-edit.component.html',
  styleUrls: ['./blog-edit.component.scss']
})
export class BlogEditComponent implements AfterViewInit {
  @ViewChild('editor', { static: false }) editorComponent: CKEditorComponent;
  public Editor = ClassicEditor;
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
  ref
  public postContent = '';
  constructor(private messenger: MessengerService, private route: ActivatedRoute, private router: Router) { }

  ngAfterViewInit() {
    this.route.paramMap.subscribe(async params => {
      this.id = params.get('id');
      this.type = params.get('type')
      let self = this

      if (this.type === 'drafts') {
        firebase.auth().onAuthStateChanged(function (user) {
          self.ref = 'users/' + user.uid + '/drafts'
          self.create = params.get('create') === 'create'
          self.time = +params.get('time')
          firebase.database().ref(`/${self.ref}/` + self.id).once('value', (blogData) => {
            firebase.auth().onAuthStateChanged(function (user) {
              if (blogData.val()) {
                if ((user.uid !== blogData.val().uid)) {
                  self.router.navigate([`/blog`], { relativeTo: self.route })
                } else {
                  self.postContent = blogData.val().content
                  self.title = blogData.val().title
                  self.editorComponent.editorInstance.setData(self.postContent)
                }
              } else {
                self.router.navigate([`/blog`], { relativeTo: self.route })
              }
            })
          })
        })
      } else if (this.type === 'post') {
        firebase.database().ref(`/blog/` + self.id).once('value', (blogData) => {
          firebase.auth().onAuthStateChanged(function (user) {
            if (blogData.val()) {
              if ((user.uid !== blogData.val().uid)) {
                self.router.navigate([`/blog`], { relativeTo: self.route })
              } else {
                self.postContent = blogData.val().content
                self.title = blogData.val().title
                self.editorComponent.editorInstance.setData(self.postContent)
                console.log(self.postContent)
              }
            } else {
              self.router.navigate([`/blog`], { relativeTo: self.route })
            }
          })
        })
      }
    })
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
    let ref = ''
    if (this.type === 'post') {
      this.saveStatus = `<small>All Changes Published</small>`
      ref = '/blog/' + this.id + '/'
    } else {
      clearTimeout(this.saveTimer)
      ref = `/${this.ref}/` + this.id + '/'
      this.saveStatus = `<small>Saved as Draft</small>`
    }
    document.getElementById('saveBtn').classList.add('disabled')
    if (ref) {
      let updates = {}
      let coverImg = this.getCover(this.data)
      if (coverImg) {
        coverImg = coverImg.replace('src=', "width='100%' src=")
        updates[ref + 'cover'] = coverImg
      }
      updates[ref + 'content'] = this.data
      updates[ref + 'title'] = this.title
      updates[ref + 'readTime'] = this.data.split(' ').length / 200
      firebase.database().ref().update(updates)
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

  getCover(content) {
    let imgTag = content.match(/<img([\w\W]+?)>/g)
    if (imgTag) {
      imgTag = imgTag[0]
    }
    return imgTag
  }

  pub() {
    let self = this
    this.save()
    firebase.auth().onAuthStateChanged(async function (user) {
      let draft = await firebase.database().ref('users/' + user.uid + '/drafts/' + self.id).once('value')
      console.log(self.post)
      if (draft.val()) {
        await firebase.database().ref('blog/' + self.id).set(draft.val())
        let time = draft.val().time
        await firebase.database().ref('users/' + user.uid + '/drafts/' + self.id).set(null)
        await firebase.database().ref('users/' + user.uid + '/blog-posts/' + self.id).set('blog/' + self.id)
        window.location.href = `/blog/post/${self.id}`;
      }

      // firebase.database().ref('users/' + user.uid + '/drafts/' + self.id).once('value', (draftData) => {
      //   let updates = {}
      //   firebase.database().ref('blog/' + self.id).set(draftData.val())
      //   updates['blog/' + self.id] = draftData.val()
      //   updates['users/' + user.uid + '/blog-posts/' + self.id] = 'blog/' + self.id
      //   firebase.database().ref().update(updates)
      // })
      // firebase.database().ref('users/' + user.uid + '/drafts/' + self.id).remove()
    })

  }
}
