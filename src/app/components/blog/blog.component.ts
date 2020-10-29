import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  posts = {
    1: {
      authorImg: 'https://static.wixstatic.com/media/63e843_616a218a868d4fa7b80d1c4c4f71dd71~mv2.png/v1/fill/w_80,h_80,al_c,q_85,usm_0.66_1.00_0.01/STLOGO.webp',
      authorName: 'Stronger Together',
      time: '1603988837769',
      uid: '',
      parsedTime: 'Oct 29, 2020',
      readTime: '60',
      parsedReadTime: '1 min',
      title: 'Finding support and help: how your community can make a difference',
      href: '/blog/1/1603988837769/finding-support-and-help-how-your-community-can-make-a-difference',
      cover: 'https://static.wixstatic.com/media/5cd76cd6f94a4adb993bf4d1ad7dcca2.jpg/v1/fit/w_1554,h_1036,al_c,q_80/file.webp',
      content: 'This is your blog post. Blogs are a great way to connect with your audience and keep them coming back. They can also be a great way to position yourself as an authority in your field. To edit your content, click Manage Blog. From the Dashboard, you can edit posts and also add brand new posts with ease. Want to help visitors explore more content? Create categories.When you write a post, you can add it to up to 3 categories.These categories appear in your blog’s navigation menu, so choose categories that cover the main topics of your blog, e.g., Food, Fashion, Travel, etc. For easy navigation, it’s best to keep your category names short – 1 to 2 word titles.For a clean look on your blog’s navigation menu, we recommend 7 categories max.',
      comments: [
        {
          authorImg: 'https://static.wixstatic.com/media/63e843_616a218a868d4fa7b80d1c4c4f71dd71~mv2.png/v1/fill/w_80,h_80,al_c,q_85,usm_0.66_1.00_0.01/STLOGO.webp',
          authorName: 'Akathian Santhakumar',
          uid: '',
          time: '1603988837769',
          parsedTime: 'Oct 29, 2020',
          content: 'Great article!',
          replies: [
            {
              authorImg: 'https://static.wixstatic.com/media/63e843_616a218a868d4fa7b80d1c4c4f71dd71~mv2.png/v1/fill/w_80,h_80,al_c,q_85,usm_0.66_1.00_0.01/STLOGO.webp',
              uid: '',
              authorName: 'Stronger Together',
              time: '1603988837769',
              parsedTime: 'Oct 29, 2020',
              content: 'Thanks!'
            }
          ]
        }
      ]
    }
  }
  constructor() { }

  ngOnInit() {
  }

}
