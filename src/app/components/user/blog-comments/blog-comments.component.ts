import { Component, OnInit, ViewChild } from '@angular/core';
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import { ModalDirective } from 'angular-bootstrap-md';

@Component({
  selector: 'app-blog-comments',
  templateUrl: './blog-comments.component.html',
  styleUrls: ['./blog-comments.component.scss']
})
export class BlogCommentsComponent implements OnInit {
  @ViewChild('confirmModal', { static: false }) confirmModal: ModalDirective;

  privateComments;
  publicComments;
  privData;
  pubData;
  showLoading = true
  lenOfPub = 0
  lenOfPriv = 0
  currCom = { content: '', time: '', title: '', ref: '' };
  constructor() { }

  ngOnInit() {
    this.getComments()
  }
  getComments() {
    let self = this
    firebase.auth().onAuthStateChanged(function (user) {
      firebase.database().ref('users/' + user.uid + '/blog-comments').on('value', async function (commentsData) {
        if (commentsData.val()) {
          self.privateComments = commentsData.val().private
          self.publicComments = commentsData.val().public
          let privRefs, pubRefs = []
          self.privData, self.pubData = []
          let admins = Object.keys(await (await firebase.database().ref('admins/').once('value')).val())
          if (self.privateComments) {
            privRefs = Object.values(self.privateComments)
            self.lenOfPriv = privRefs.length
            await self.getFullCommentData(privRefs, self.privData, self, user, admins)
            self.privData = Object.values(self.privData).reverse()

          }
          if (self.publicComments) {
            pubRefs = Object.values(self.publicComments)
            self.lenOfPub = pubRefs.length
            await self.getFullCommentData(pubRefs, self.pubData, self, user, admins)
            self.pubData = Object.values(self.pubData).reverse()
          }
        }
        self.showLoading = false
      })
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

        data[fullComment.val().id].time = self.dateService.parser(+(data[fullComment.val().id].time))
        let postId = data[fullComment.val().id].parentId.split('/')[0] || data[fullComment.val().id].parentId
        data[fullComment.val().id].postId = postId
        let title = await (await firebase.database().ref('blog/' + postId + '/title').once('value')).val()
        data[fullComment.val().id].title = title
      } else {
        // await firebase.database().ref(commentRef).remove()
        let comRef = commentRef.split('/')[3]
        let repRef = commentRef.split('/')[5]
        if (comRef && !repRef) {
          let pub = await firebase.database().ref('users/' + user.uid + '/blog-comments/public/' + comRef)
          let priv = await firebase.database().ref('users/' + user.uid + '/blog-comments/private/' + comRef)
          if (pub) {
            await pub.remove()
            console.log(self.lenOfPub)
          } else if (priv) {
            await priv.remove()
          }
        }
        if (repRef) {
          let pub = await firebase.database().ref('users/' + user.uid + '/blog-comments/public/' + repRef)
          let priv = await firebase.database().ref('users/' + user.uid + '/blog-comments/private/' + repRef)
          if (pub) {
            await pub.remove()
          } else if (priv) {
            await priv.remove()
          }
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
    console.log(comment)
    firebase.database().ref('users/' + comment.uid + '/blog-comments/public/' + comment.id).remove()
    firebase.database().ref('users/' + comment.uid + '/blog-comments/private/' + comment.id).remove()
    firebase.database().ref(ref).remove()
    this.confirmModal.hide()
    window.location.href = '/login/blog-comments'
  }
}
