import { AfterViewInit, Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import firebase from 'firebase/app'
import 'firebase/database'
import { ActivatedRoute, Router } from '@angular/router';
import { SortService } from '../../../services/sort.service'
import { IpService } from 'src/app/services/ip.service';
import * as $ from 'jquery'
const ANON = 'anon'
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  constructor(private route: ActivatedRoute, private sortService: SortService, private router: Router, private ipService: IpService) { }
  id;
  time;
  title;
  post;
  editLink;
  comment;
  iframe;
  gearData = { id: '', editLink: '', dbLink: '', type: 'post', editors: [] }
  user = { displayName: 'Sign in to comment', photoURL: '' }
  catUrl;
  currPath;
  tweet
  linkedIn
  fbHref
  fhHrefDiv
  @ViewChild('iframeContent', { static: true }) iframeBox: ElementRef;
  ngOnInit() {
    let self = this
    this.route.paramMap.subscribe(async params => {
      this.id = params.get('id');
      this.time = +params.get('time')
      this.title = params.get('title')
      firebase.database().ref('blog/general/' + this.id).on('value', function (postData) {
        if (postData.val()) {
          self.editLink = `/blog/post/${self.id}/edit`
          self.getPost()
          self.getUser()
          self.updateViews()
        } else {
          window.location.href = '/blog'
        }
      })
    });
  }

  copyUrl() {
    let Url = document.getElementById("url") as HTMLInputElement;
    Url.innerHTML = window.location.href;
    Url.select();
    document.execCommand("copy");
    document.getElementById('copyBtn').innerHTML = 'Copied!'
  }

  getPaths(self) {
    self.currPath = window.location.pathname
    let cat = self.post.category === 'general' ? '' : self.post.category
    self.catUrl = cat ? ('/blog-' + cat) : '/blog'
  }
  updateViews() {
    let self = this
    this.ipService.getIPAddress().subscribe((res: any) => {
      let ip = res.ip
      while (ip.indexOf('.') >= 0) {
        ip = ip.replace('.', '-')
      }
      let updates = {}
      updates['blog/general/' + self.id + '/views/' + ip] = 1
      firebase.database().ref().update(updates)
    })
  }

  getUser() {
    let self = this
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        self.user = user
      }
    })
  }

  getPost() {
    let self = this
    firebase.database().ref(`/blog/general/${this.id}`).on('value', (postData) => {
      self.gearData.id = self.id
      self.gearData.editors.push(postData.val().uid)
      self.gearData.editLink = self.editLink
      self.gearData.dbLink = `/blog/general/${this.id}`
      self.post = postData.val()
      self.tweet = 'Check%20out%20this%20blog%20post%20from%20Stronger%20Together!%20' + window.location.href
      const u1 = window.location.href.replace(window.location.pathname, '').replace("https://", "https%3A%2F%2F").replace("http://", "http%3A%2F%2F").replace(':', '%3A')
      const u2 = window.location.pathname.replace('/', '%2F').replace('/', '%2F')
      const u = u1 + u2
      self.fbHref = "https://www.facebook.com/sharer/sharer.php?u=" + u + "&amp;src=sdkpreparse"
      self.fhHrefDiv = window.location.href

      self.linkedIn = 'http://www.linkedin.com/shareArticle?mini=true&url=' + window.location.href
      if (self.post) {
        if (self.post.comments) {
          self.post.comments = Object.values(self.post.comments).reverse()
        }
        self.iframe = self.post.content.match(/&lt;iframe(?:.*?)&lt;\/iframe&gt;/g)
        if (self.iframe) {
          const parsedIframe = self.iframe[0].replace('&lt;', "<").replace('&lt;', "<").replace('&gt;', '>').replace('&gt;', '>')
          self.post.content = self.post.content.replace(self.iframe, parsedIframe)
        }
        self.getPaths(self)
      }
    })
  }

  sort(event) {
    let i = event.target.options.selectedIndex
    let option = event.target.options[i].value
    this.sortService.sort(option, this.post.comments)
  }

  commentChange(comment) {
    this.comment = comment
  }

  postComment(vis) {
    if (this.comment) {
      let self = this
      let d = new Date()
      firebase.auth().onAuthStateChanged(function (user) {
        let newCommentRef = firebase.database().ref('blog/general/' + self.id + '/comments').push()
        let commentId = newCommentRef.key
        let img = vis === 'anon' ? "assets/anon.png" : user.photoURL
        let name = vis === 'anon' ? 'Anonymous' : user.displayName
        let commentData = {
          authorImg: img,
          authorName: name,
          content: self.comment,
          time: d.getTime(),
          uid: user.uid,
          parentUid: self.post.uid,
          replies: '',
          id: commentId,
          parentId: self.id
        }
        newCommentRef.set(commentData);
        (<HTMLTextAreaElement>document.getElementById('commentFormArea')).value = '';
        let updates = {}
        let loc = vis === 'anon' ? 'private' : 'public'
        updates['users/' + user.uid + '/blog-comments/' + loc + '/' + commentId] = 'blog/general/' + self.id + '/comments/' + commentId
        firebase.database().ref().update(updates)
      })
    }
  }
}
