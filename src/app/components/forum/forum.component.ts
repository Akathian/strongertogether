import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit {
  forums = [
    {
      title: 'General Discussion',
      authorName: "Akathian Santhakumar",
      authorImg: 'https://lh3.googleusercontent.com/a-/AOh14Gh_FTUnyS89IGGjW9A6H-yLqQH5Zv6nxtlpfOB88es=s96-c',
      type: 'Discussion',
      numComments: '0',
      numLikes: '0',
      numViews: '0',
      recentActivity: {
        authorImg: 'https://lh3.googleusercontent.com/a-/AOh14Gh_FTUnyS89IGGjW9A6H-yLqQH5Zv6nxtlpfOB88es=s96-c',
        time: 1606359640614
      }
    },
    {
      title: 'Tips & Tricks',
      authorName: "Akathian Santhakumar",
      authorImg: 'https://lh3.googleusercontent.com/a-/AOh14Gh_FTUnyS89IGGjW9A6H-yLqQH5Zv6nxtlpfOB88es=s96-c',
      type: 'Question',
      numComments: '0',
      numLikes: '0',
      numViews: '0',
      recentActivity: {
        authorImg: 'https://lh3.googleusercontent.com/a-/AOh14Gh_FTUnyS89IGGjW9A6H-yLqQH5Zv6nxtlpfOB88es=s96-c',
        time: 1606359640614
      }
    }
  ]
  id = 'createBtn'
  constructor() { }

  ngOnInit() {
    let self = this
    window.addEventListener("click", function (event) {
      if (!(<HTMLElement>event.target).classList.contains('gearBtn')) {
        document.getElementById('createBtn').classList.remove("show");
      }
    });
  }

  myFunction() {
    document.getElementById('createBtn').classList.toggle("show");
  }

}
