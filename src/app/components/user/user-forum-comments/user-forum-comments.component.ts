import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import { ModalDirective } from 'angular-bootstrap-md';
import { UserService } from 'src/app/services/user.service';
const PUB_OFFSET = 5
const PRIV_OFFSET = 5
@Component({
  selector: 'app-user-forum-comments',
  templateUrl: './user-forum-comments.component.html',
  styleUrls: ['./user-forum-comments.component.scss']
})
export class UserForumCommentsComponent implements OnInit {
  @ViewChild('confirmModal', { static: false }) confirmModal: ModalDirective;

  privateComments;
  publicComments;
  privDataVals;
  privData = [];
  pubDataVals;
  pubData = [];
  showLoading = false
  lenOfPub = 0
  lenOfPriv = 0
  currCom = { content: '', time: '', title: '', ref: '' };
  pubPUB_OFFSET = 1
  user
  pubNextKey;
  privNextKey;
  paramUid
  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.authAndGetComments()
    this.route.paramMap.subscribe(async params => {
      this.paramUid = params.get('uid')
    })
  }

  authAndGetComments() {
    let self = this
    if (this.user) {
      this.getPubComments(this.user, self)
      this.getPrivComments(this.user, self)
    } else {
      firebase.auth().onAuthStateChanged(async function (user) {
        self.user = user.uid === self.paramUid ? user : await self.userService.getUserByUid(self.paramUid)
        if (self.user === '') {
          self.user = user
        }
        self.getPubComments(self.user, self)
        self.getPrivComments(self.user, self)
      })
    }
  }
  getPubComments(user, self) {
    let ref
    if (self.pubNextKey) {
      ref = firebase.database().ref('users/' + user.uid + '/community-comments/public').orderByKey().endAt(self.pubNextKey).limitToLast(PUB_OFFSET + 1)
    } else {
      ref = firebase.database().ref('users/' + user.uid + '/community-comments/public').orderByKey().limitToLast(PUB_OFFSET + 1)
    }
    ref.on('value', async function (commentsData) {

      if (commentsData.val()) {
        self.publicComments = commentsData.val()
        let pubRefs = []
        let admins = Object.keys(await (await firebase.database().ref('admins/').once('value')).val())

        pubRefs = Object.values(self.publicComments)
        if (pubRefs.length > PUB_OFFSET) {
          self.pubNextKey = (<string>pubRefs.shift()).split('/').pop()
        }
        self.lenOfPub = pubRefs.length
        await self.getFullCommentData(pubRefs, self.pubData, self, user, admins)
        self.pubData = self.pubData.reverse()
        self.pubDataVals = Object.keys(self.pubData).sort().reverse()

      }
      self.showLoading = false
    })
  }

  getPrivComments(user, self) {
    let ref
    if (self.privNextKey) {
      ref = firebase.database().ref('users/' + user.uid + '/community-comments/private').orderByKey().endAt(self.privNextKey).limitToLast(PRIV_OFFSET + 1)
    } else {
      ref = firebase.database().ref('users/' + user.uid + '/community-comments/private').orderByKey().limitToLast(PRIV_OFFSET + 1)
    }
    ref.on('value', async function (commentsData) {
      if (commentsData.val()) {
        self.privateComments = commentsData.val()
        let privRefs = []
        let admins = Object.keys(await (await firebase.database().ref('admins/').once('value')).val())

        privRefs = Object.values(self.privateComments)
        if (privRefs.length > PRIV_OFFSET) {
          self.privNextKey = (<string>privRefs.shift()).split('/').pop()
        }
        self.lenOfPriv = privRefs.length
        await self.getFullCommentData(privRefs, self.privData, self, user, admins)
        self.privDataVals = Object.keys(self.privData).sort().reverse()
      }
      self.showLoading = false
    })
  }

  async getFullCommentData(commentRefs, data, self, user, admins) {
    for (let commentRef of commentRefs) {
      let fullComment = await firebase.database().ref(commentRef).once('value')
      if (fullComment.val()) {
        data[fullComment.val().id] = fullComment.val()
        data[fullComment.val().id].gearData = {
          id: fullComment.val().id,
          editLink: '',
          dbLink: commentRef,
          type: 'post',
          editors: [fullComment.val().uid, fullComment.val().parentUid].concat(admins)
        }
        if (data[fullComment.val().id].gearData.editors.indexOf(user.uid) >= 0) {
          data[fullComment.val().id].showTrash = true
        }
        commentRef = commentRef.replace('blog/', '')

        let postId = data[fullComment.val().id].parentId.split('/')[0] || data[fullComment.val().id].parentId
        data[fullComment.val().id].postId = postId
        let title = await (await firebase.database().ref('community/' + postId + '/title').once('value')).val()
        data[fullComment.val().id].title = title


      } else {
        await firebase.database().ref(commentRef).remove()
        let comSplit = commentRef.split('/')
        let comRef = comSplit[4]
        let repRef = comSplit[6]

        if (comRef && !repRef) {
          await firebase.database().ref('users/' + user.uid + '/community-comments/public/' + comRef).remove()
          await firebase.database().ref('users/' + user.uid + '/community-comments/private/' + comRef).remove()
        }
        if (repRef) {
          await firebase.database().ref('users/' + user.uid + '/community-comments/public/' + repRef).remove()
          await firebase.database().ref('users/' + user.uid + '/community-comments/private/' + repRef).remove()
        }
      }
    }
  }

  confirmDel(ref, comment) {
    this.currCom = comment
    this.currCom.ref = ref
    this.confirmModal.show()
  }

  del(ref, comment) {
    firebase.database().ref('users/' + comment.uid + '/community-comments/public/' + comment.id).remove()
    firebase.database().ref('users/' + comment.uid + '/community-comments/private/' + comment.id).remove()
    firebase.database().ref(ref).remove()
    this.confirmModal.hide()
    window.location.href = '/user/' + comment.uid + '/user-community-comments'
  }

  loadMore(type) {
    type === 'pub' ? this.getPubComments(this.user, this) : this.getPrivComments(this.user, this)
  }
}
