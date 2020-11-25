import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
// import * as ClassicEditor from 'ckeditor5-build-classic-all-plugin';
import * as Editor from '../../../../assets/ckeditor5/build/ckeditor.js'
import { CKEditorComponent } from '@ckeditor/ckeditor5-angular'
import { CKEditorConfig } from 'ckeditor5-build-classic-all-plugin'
import { ActivatedRoute, Router } from '@angular/router';
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import { MessengerService } from '../../../services/messenger.service'
import { ModalDirective } from 'angular-bootstrap-md';

import * as $ from 'jquery'
@Component({
  selector: 'app-blog-edit',
  templateUrl: './blog-edit.component.html',
  styleUrls: ['./blog-edit.component.scss']
})
export class BlogEditComponent implements AfterViewInit {
  @ViewChild('editor', { static: false }) editorComponent: CKEditorComponent;
  @ViewChild('delModal', { static: false }) delModal: ModalDirective;
  @ViewChild('pubModal', { static: false }) pubModal: ModalDirective;
  @ViewChild('editModal', { static: false }) editModal: ModalDirective;



  public Editor = Editor;
  config: CKEditorConfig = {
    placeholder: "Write your answer here.",
    // BUG: Current CKEditor5's generated build does not 
    // show the default toolbar as defined in the online builder
    toolbar: [
      'Heading', '|', 'FontFamily', 'FontSize', 'Bold', 'Italic', 'Underline', 'Strikethrough', 'Subscript', 'Superscript', 'FontColor', 'FontBackgroundColor', 'Highlight', '|', 'Alignment', 'BulletedList', 'NumberedList', 'Indent', 'Outdent', 'InsertTable', '|', 'ImageUpload', 'MediaEmbed', 'HtmlEmbed', '|', 'BlockQuote', 'RemoveFormat', 'HorizontalLine', 'SpecialCharacters', 'Undo', 'Redo'
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

            if (blogData.val()) {
              if ((user.uid !== blogData.val().uid)) {
                self.router.navigate([`/blog`], { relativeTo: self.route })
              } else {
                self.postContent = blogData.val().content
                self.category = blogData.val().category
                $('#catChoose').val(self.category)
                self.title = blogData.val().title
                self.editorComponent.editorInstance.setData(self.postContent)
              }
            } else {
              self.router.navigate([`/blog`], { relativeTo: self.route })
            }

          })
        })
      } else if (this.type === 'post') {
        firebase.database().ref(`/blog/general/` + self.id).once('value', (blogData) => {
          firebase.auth().onAuthStateChanged(function (user) {
            if (blogData.val()) {
              if ((user.uid !== blogData.val().uid)) {
                self.router.navigate([`/blog`], { relativeTo: self.route })
              } else {
                self.postContent = blogData.val().content
                self.title = blogData.val().title
                self.category = blogData.val().category
                $('#catChoose').val(self.category)
                self.editorComponent.editorInstance.setData(self.postContent)
              }
            } else {
              self.router.navigate([`/blog`], { relativeTo: self.route })
            }
          })
        })
      }
    })
  }
  saveEdit() {
    this.coverImg = this.getCover(this.data)
    if (this.coverImg) {
      this.coverImg = this.coverImg.replace('src=', "width='100%' src=")
    } else {
      this.coverImg = `<img width='100%' src='../../../assets/STNEWCOVER2.png'>`
    }
    this.iframe = this.data.match(/&lt;iframe(?:.*?)&lt;\/iframe&gt;/g)
    if (this.iframe) {
      this.iframe = this.iframe[0].replace('&lt;', "<").replace('&lt;', "<").replace('&gt;', '>').replace('&gt;', '>')
    }
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
      ref = '/blog/general/' + this.id + '/'
    } else {
      clearTimeout(this.saveTimer)
      ref = `/${this.ref}/` + this.id + '/'
      this.saveStatus = `<small>Saved as Draft</small>`
      updates[ref + 'time'] = (new Date()).getTime()
    }
    document.getElementById('saveBtn').classList.add('disabled')
    if (ref) {
      let coverImg = this.getCover(this.data)
      if (coverImg) {
        coverImg = coverImg.replace('src=', "width='100%' src=")
        updates[ref + 'cover'] = coverImg
      }
      updates[ref + 'content'] = this.data
      updates[ref + 'title'] = this.title
      updates[ref + 'readTime'] = this.data.split(' ').length / 200
      updates[ref + 'category'] = this.category

      if (this.catDirty && this.type === 'post') {
        firebase.database().ref('blog/events/' + this.id).remove()
        firebase.database().ref('blog/podcasts/' + this.id).remove()
        if (this.category !== 'general') {
          firebase.database().ref('blog/' + this.category + '/' + this.id).set('blog/general/' + this.id)
        }
      }
      firebase.database().ref().update(updates)
      if (this.type === 'post') {
        window.location.href = `/blog/${this.id}`;
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
      if (draft.val()) {
        if (self.category !== 'general') {
          await firebase.database().ref('blog/' + self.category + '/' + self.id).set('blog/general/' + self.id)
        }
        await firebase.database().ref('blog/general/' + self.id).set(draft.val())
        await firebase.database().ref('users/' + user.uid + '/drafts/' + self.id).set(null)
        await firebase.database().ref('users/' + user.uid + '/blog-posts/' + self.id).set('blog/general/' + self.id)
        // await firebase.database().ref('users/' + user.uid + '/num-blog-posts/').transaction(function (count) {
        //   return count + 1
        // })
        window.location.href = `/blog/${self.id}`;
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

  publishDraft() {
    this.coverImg = this.getCover(this.data)
    if (this.coverImg) {
      this.coverImg = this.coverImg.replace('src=', "width='100%' src=")
    } else {
      this.coverImg = `<img width='100%' src='../../../assets/STNEWCOVER2.png'>`
    }
    this.iframe = this.data.match(/&lt;iframe(?:.*?)&lt;\/iframe&gt;/g)
    if (this.iframe) {
      this.iframe = this.iframe[0].replace('&lt;', "<").replace('&lt;', "<").replace('&gt;', '>').replace('&gt;', '>')
    }
    this.pubModal.show()
  }

  del() {
    let self = this
    firebase.auth().onAuthStateChanged(async function (user) {
      await firebase.database().ref('users/' + user.uid + '/drafts/' + self.id).remove()
      self.delModal.hide()
      window.location.href = '/user/' + user.uid + '/drafts'
    })
  }
}
