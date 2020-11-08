import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import firebase from 'firebase/app'
import 'firebase/database'
import { SortService } from '../../../services/sort.service'
import { DateService } from '../../../services/date.service'
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  constructor(private route: ActivatedRoute, private sortService: SortService, private dateService: DateService) { }
  id;
  time;
  title;
  post;
  editLink;
  parsedTime
  ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      this.id = params.get('id');
      this.time = +params.get('time')
      this.title = params.get('title')
      this.editLink = `/blog/post/${this.id}/${this.time}/edit`
      this.getPost()
      this.parsedTime = this.dateService.parser(this.post.time)
      
    });
  }
  getPost() {
    let self = this
    firebase.database().ref(`/blog/${this.id}`).on('value', (postData) => {
      self.post = postData.val()
      console.log(self.post)
    })
  }

  sort(event) {
    let i = event.target.options.selectedIndex
    let option = event.target.options[i].value
    this.sortService.sort(option, this.post.comments)
  }
}
