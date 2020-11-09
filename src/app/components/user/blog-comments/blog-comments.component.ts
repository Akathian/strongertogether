import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import { DateService } from '../../../services/date.service'
@Component({
  selector: 'app-blog-comments',
  templateUrl: './blog-comments.component.html',
  styleUrls: ['./blog-comments.component.scss']
})
export class BlogCommentsComponent implements OnInit {

  privateComments;
  publicComments;
  privData = {};
  pubData = {};
  showLoading = true
  lenOfPub = 0
  lenOfPriv = 0

  constructor(private dateService: DateService) { }

  ngOnInit() {
    this.getComments()
  }
  getComments() {
    let self = this
    firebase.auth().onAuthStateChanged(function (user) {
      firebase.database().ref('users/' + user.uid + '/blog-comments').on('value', async function (commentsData) {
        console.log(commentsData.val().public)
        self.privateComments = commentsData.val().private
        self.publicComments = commentsData.val().public
        let privRefs, pubRefs = []
        self.privData, self.pubData = []
        if (self.privateComments) {
          privRefs = Object.values(self.privateComments)
          self.lenOfPriv = privRefs.length
          await self.getFullCommentData(privRefs, self.privData, self)
        }
        if (self.publicComments) {
          pubRefs = Object.values(self.publicComments)
          self.lenOfPub = pubRefs.length
          await self.getFullCommentData(pubRefs, self.pubData, self)
        }
        self.showLoading = false
      })
    })
  }

  async getFullCommentData(commentRefs, data, self) {
    for (let commentRef of commentRefs) {
      let fullComment = await firebase.database().ref(commentRef).once('value')
      commentRef = commentRef.replace('blog/', '')
      data[commentRef] = fullComment.val()
      data[commentRef].time = self.dateService.parser(+(data[commentRef].time))
      let postId = data[commentRef].parentId.split('/')[0] || data[commentRef].parentId
      data[commentRef].postId = postId
      console.log(postId)
      let title = await (await firebase.database().ref('blog/' + postId + '/title').once('value')).val()
      console.log(title)
      data[commentRef].title = title
    }
  }
}
