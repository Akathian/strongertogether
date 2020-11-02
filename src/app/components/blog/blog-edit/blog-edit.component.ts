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
export class BlogEditComponent implements  AfterViewInit {
  @ViewChild('editor', {static : false}) editorComponent: CKEditorComponent;
  public Editor = ClassicEditor;
  autoSaveReady = true
  autoSaveStarted = false
  lastSaved = 'Never'
  lastModified = 'Never'
  saveStatus = `<small>No Changes<small>`
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
  public postContent = '';
  constructor(private messenger: MessengerService, private route: ActivatedRoute , private router: Router) { }

  ngAfterViewInit() {
    this.route.paramMap.subscribe(async params => {
      this.id = +params.get('id');
      this.create = params.get('create')
      this.time = +params.get('time')
      this.title = params.get('title')
      let self = this
      console.log(this.create)
      if(!this.create) {
        firebase.database().ref('/blog/' + this.id).on('value', (blogData) => {
          firebase.auth().onAuthStateChanged(function(user) {
            if(user.uid !== blogData.val().uid)
            {
              self.router.navigate([`/blog/${self.id}/${self.time}/${self.title}`], { relativeTo: self.route })
            } else {
              self.postContent = blogData.val().content
              self.editorComponent.editorInstance.setData(self.postContent) 
              console.log(self.postContent)
            }
          })
            }
          )
        }
      })

  }

  public onChange( { editor }: ChangeEvent ) {
    const data = editor.getData();
    this.data = data
    if(this.create) {
      clearTimeout(this.saveTimer)
      this.saveTimer = setTimeout(() => {
        let d =  new Date()
        this.lastSaved = (d).toTimeString().split(' ')[0] + ' on ' + (d).toDateString()
        this.saveStatus = `<small>Saved as Draft<small>`
        document.getElementById('saveBtn').classList.add('disabled')
        this.save()
      }, 10000)
      if(!this.create) {
        this.saveStatus = `<small>Publish<small>`
      } else {
        this.saveStatus = `<small>Save as Draft<small>`
      }
      document.getElementById('saveBtn').classList.remove('disabled')
    }
  }

  save() {
    // let updates = {}
    // updates['/blog/' + this.id + '/content'] = this.data
    // firebase.database().ref().update(updates)
    if(!this.create) {
      this.saveStatus = `<small>All Changes Published<small>`
    } else {
      this.saveStatus = `<small>Saved as Draft<small>`

    }
    document.getElementById('saveBtn').classList.add('disabled')
    clearTimeout(this.saveTimer)
  }
}
