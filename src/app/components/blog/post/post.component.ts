import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import firebase from 'firebase/app'
import 'firebase/database'
import { SortService } from '../../../services/sort.service'
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  constructor(private route: ActivatedRoute, private sortService: SortService) { }
  id;
  time;
  title;
  post;
  ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      this.id = +params.get('id');
      this.time = +params.get('time')
      this.title = params.get('title')
      this.getPost()
    });
  }
  getPost() {
    let self = this
    firebase.database().ref(`/blog/${this.id}`).on('value', (postData) => {
      self.post = postData.val()
    })
  }

  sort(event){
    let i = event.target.options.selectedIndex
    let option = event.target.options[i].value
    this.sortService.sort(option, this.post.comments)
  }
}
