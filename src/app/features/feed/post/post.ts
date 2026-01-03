import { Component, inject, input, output } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { LucideAngularModule, X, Pen} from 'lucide-angular';
// import { PostService } from '../../../core/post-service';
import { PostType } from '../../../shared/post.model';

@Component({
  selector: 'app-post',
  imports: [HlmCardImports,LucideAngularModule],
  templateUrl: './post.html',
  styleUrl: './post.css',
})
export class Post {
  // private readonly postservice= inject(PostService);
  
     cross= X;
     editIcon= Pen;
     
     post = input<PostType>();
     edit = output<PostType>();
     delete = output<number>();
     comments = output<PostType>();
}
